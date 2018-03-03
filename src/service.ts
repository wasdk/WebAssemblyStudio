/* Copyright 2018 Mozilla Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { File, Project, Directory, FileType, Problem, isBinaryFileType, fileTypeForExtension, fileTypeFromFileName, IStatusProvider } from "./model";
import "monaco-editor";
import { padLeft, padRight, isBranch, toAddress, decodeRestrictedBase64ToBytes, base64EncodeBytes } from "./util";
import { assert } from "./util";
import getConfig from "./config";
import { isZlibData, decompressZlib } from "./utils/zlib";
import { gaEvent } from "./utils/ga";

declare interface BinaryenModule {
  optimize(): any;
  validate(): any;
  emitBinary(): ArrayBuffer;
  emitText(): string;
  emitAsmjs(): string;
  runPasses(passes: string []): any;
}

declare var Binaryen: {
  readBinary(data: ArrayBuffer): BinaryenModule;
  parseText(data: string): BinaryenModule;
  print(s: string): void;
  printErr(s: string): void;
};

declare var capstone: {
  ARCH_X86: any;
  MODE_64: any;
  Cs: any;
};

declare var base64js: {
  toByteArray(base64: string): ArrayBuffer;
  fromByteArray(base64: ArrayBuffer): string;
};

declare var Module: ({ }) => any;
declare var define: any;
declare var showdown: {
  Converter: any;
  setFlavor: Function;
};

declare var wabt: {
  ready: Promise<any>
  readWasm: Function;
  parseWat: Function;
};

export interface IFiddleFile {
  name: string;
  data?: string;
  type?: "binary" | "text";
}

export interface ICreateFiddleRequest {
  files: IFiddleFile [];
}

export interface ILoadFiddleResponse {
  files: IFiddleFile [];
  id: string;
  message: string;
  success: boolean;
}

interface ICreateFiddleResponse {
  id: string;
  success: boolean;
}

export enum Language {
  C = "c",
  Cpp = "cpp",
  Wat = "wat",
  Wasm = "wasm",
  Rust = "rust",
  Cretonne = "cton",
  x86 = "x86",
  Json = "json",
  JavaScript = "javascript",
  TypeScript = "typescript",
  Text = "text"
}

interface IFile {
  name: string;
  children: IFile[];
  type?: string;
  data?: string;
  description?: string;
}

export interface IServiceRequestTask {
  file: string;
  name: string;
  output: string;
  console: string;
  success: boolean;
}

export interface IServiceRequest {
  success: boolean;
  tasks: IServiceRequestTask[];
  output: string;
}

export enum ServiceTypes {
  Rustc,
  Clang,
  Service
}

/**
 * Turn blocking operations into promises.
 */
async function defer(fn: Function): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fn());
    });
  });
}

async function getServiceURL(to: ServiceTypes): Promise<string> {
  const config = await getConfig();
  switch (to) {
    case ServiceTypes.Rustc:
      return config.rustc;
    case ServiceTypes.Clang:
      return config.clang;
    case ServiceTypes.Service:
      return config.serviceUrl;
    default:
      throw new Error(`Invalid ServiceType: ${to}`);
  }
}

export class Service {
  static async sendRequestJSON(content: Object, to: ServiceTypes): Promise<IServiceRequest> {
    const url = await getServiceURL(to);
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(content),
      headers: new Headers({ "Content-Type": "application/json" })
    });

    return response.json();
  }

  static async sendRequest(content: string, to: ServiceTypes): Promise<IServiceRequest> {
    const url = await getServiceURL(to);
    const response = await fetch(url, {
      method: "POST",
      body: content,
      headers: new Headers({ "Content-Type": "application/x-www-form-urlencoded" })
    });
    return response.json();
  }

  static getMarkers(response: string): monaco.editor.IMarkerData[] {
    // Parse and annotate errors if compilation fails.
    const annotations: monaco.editor.IMarkerData[] = [];
    if (response.indexOf("(module") !== 0) {
      const re1 = /^.*?:(\d+?):(\d+?):\s(.*)$/gm;
      let m: any;
      // Single position.
      while ((m = re1.exec(response)) !== null) {
        if (m.index === re1.lastIndex) {
          re1.lastIndex++;
        }
        const startLineNumber = parseInt(m[1], 10);
        const startColumn = parseInt(m[2], 10);
        const message = m[3];
        let severity = monaco.Severity.Info;
        if (message.indexOf("error") >= 0) {
          severity = monaco.Severity.Error;
        } else if (message.indexOf("warning") >= 0) {
          severity = monaco.Severity.Warning;
        }
        annotations.push({
          severity, message,
          startLineNumber: startLineNumber, startColumn: startColumn,
          endLineNumber: startLineNumber, endColumn: startColumn
        });
      }
      // Range. This is generated via the -diagnostics-print-source-range-info
      // clang flag.
      const re2 = /^.*?:\d+?:\d+?:\{(\d+?):(\d+?)-(\d+?):(\d+?)\}:\s(.*)$/gm;
      while ((m = re2.exec(response)) !== null) {
        if (m.index === re2.lastIndex) {
          re2.lastIndex++;
        }
        const message = m[5];
        let severity = monaco.Severity.Info;
        if (message.indexOf("error") >= 0) {
          severity = monaco.Severity.Error;
        } else if (message.indexOf("warning") >= 0) {
          severity = monaco.Severity.Warning;
        }
        annotations.push({
          severity, message,
          startLineNumber: parseInt(m[1], 10), startColumn: parseInt(m[2], 10),
          endLineNumber: parseInt(m[3], 10), endColumn: parseInt(m[4], 10)
        });
      }
    }
    return annotations;
  }

  static async compileFile(file: File, from: Language, to: Language, options = ""): Promise<any> {
    const result = await Service.compile(file.getData(), from, to, options);
    if (result.tasks) {
      const markers = Service.getMarkers(result.tasks[0].console);
      if (markers.length) {
        monaco.editor.setModelMarkers(file.buffer, "compiler", markers);
        file.setProblems(markers.map(marker => {
          return Problem.fromMarker(file, marker);
        }));
      } else {
        file.setProblems([]);
      }
    }
    if (!result.success) {
      throw new Error((result as any).message);
    }
    let data = decodeRestrictedBase64ToBytes(result.output);
    if (isZlibData(data)) {
      data = await decompressZlib(data);
    }
    return data;
  }

  static async compile(src: string | ArrayBuffer, from: Language, to: Language, options = ""): Promise<IServiceRequest> {
    gaEvent("compile", "Service", `${from}->${to}` );
    if ((from === Language.C || from === Language.Cpp) && to === Language.Wasm) {
      const project = {
        output: "wasm",
        compress: true,
        files: [
          {
            type: from,
            name: "file." + from,
            options,
            src
          }
        ]
      };
      return this.sendRequestJSON(project, ServiceTypes.Clang);
    } else if (from === Language.Wasm && to === Language.x86) {
      const input = encodeURIComponent(base64js.fromByteArray(src as ArrayBuffer));
      return this.sendRequest("input=" + input + "&action=wasm2assembly&options=" + encodeURIComponent(options), ServiceTypes.Service);
    } else if (from === Language.Rust && to === Language.Wasm) {
      // TODO: Temporary until we integrate rustc into the service.
      return this.sendRequestJSON({ code: src }, ServiceTypes.Rustc);
    }
  }

  static async disassembleWasm(buffer: ArrayBuffer, status: IStatusProvider): Promise<string> {
    gaEvent("disassemble", "Service", "wabt");
    if (typeof wabt === "undefined") {
      await Service.lazyLoad("lib/libwabt.js", status);
    }
    const module = wabt.readWasm(buffer, { readDebugNames: true });
    if (true) {
      module.generateNames();
      module.applyNames();
    }
    return module.toText({ foldExprs: false, inlineExport: true });
  }

  static async disassembleWasmWithWabt(file: File, status?: IStatusProvider) {
    const result = await Service.disassembleWasm(file.getData() as ArrayBuffer, status);
    const output = file.parent.newFile(file.name + ".wat", FileType.Wat);
    output.description = "Disassembled from " + file.name + " using Wabt.";
    output.setData(result);
  }

  static async assembleWat(wat: string, status?: IStatusProvider): Promise<ArrayBuffer> {
    gaEvent("assemble", "Service", "wabt");
    if (typeof wabt === "undefined") {
      await Service.lazyLoad("lib/libwabt.js", status);
    }
    status && status.push("Assembling Wat");
    const module = wabt.parseWat("test.wat", wat);
    module.resolveNames();
    module.validate();
    const binary = module.toBinary({ log: true, write_debug_names: true });
    status && status.pop();
    return binary.buffer;
  }

  static async assembleWatWithWabt(file: File, status?: IStatusProvider) {
    const result = await Service.assembleWat(file.getData() as string, status);
    const output = file.parent.newFile(file.name + ".wasm", FileType.Wasm);
    output.description = "Assembled from " + file.name + " using Wabt.";
    output.setData(result);
  }

  static async createGist(json: object): Promise<string> {
    const url = "https://api.github.com/gists";
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(json),
      headers: new Headers({ "Content-type": "application/json; charset=utf-8" })
    });
    return JSON.parse(await response.text()).html_url;
  }

  static async loadJSON(uri: string): Promise<ILoadFiddleResponse> {
    const url = "https://webassembly-studio-fiddles.herokuapp.com/fiddle/" + uri;
    const response = await fetch(url, {
      headers: new Headers({ "Content-type": "application/json; charset=utf-8" })
    });
    return await response.json();
  }

  static async saveJSON(json: ICreateFiddleRequest, uri: string): Promise<string> {
    const update = !!uri;
    if (update) {
      throw new Error("NYI");
    } else {
      const response = await fetch("https://webassembly-studio-fiddles.herokuapp.com/set-fiddle", {
        method: "POST",
        headers: new Headers({ "Content-type": "application/json; charset=utf-8" }),
        body: JSON.stringify(json)
      });
      let jsonURI = (await response.json()).id;
      jsonURI = jsonURI.substring(jsonURI.lastIndexOf("/") + 1);
      return jsonURI;
    }
  }

  static parseFiddleURI(): string {
    let uri = window.location.search.substring(1);
    if (uri) {
      const i = uri.indexOf("/");
      if (i > 0) {
        uri = uri.substring(0, i);
      }
    }
    return uri;
  }

  static async exportToGist(content: File, uri?: string): Promise<string> {
    gaEvent("export", "Service", "gist");
    const files: any = {};
    function serialize(file: File) {
      if (file instanceof Directory) {
        file.mapEachFile((file: File) => serialize(file), true);
      } else {
        files[file.name] = {content: file.data};
      }
    }
    serialize(content);
    const json: any = { description: "source: http://webassembly.studio", public: true, files};
    if (uri !== undefined) {
      json["description"] = json["description"] + `/?f=${uri}`;
    }
    return await this.createGist(json);
  }

  static async saveProject(project: Project, openedFiles: string[][], uri?: string): Promise<string> {
    const files: IFiddleFile [] = [];
    project.forEachFile((f: File) => {
      let data: string;
      let type: "binary" | "text";
      if (isBinaryFileType(f.type)) {
        data = base64EncodeBytes(new Uint8Array(f.data as ArrayBuffer));
        type = "binary";
      } else {
        data = f.data as string;
        type = "text";
      }
      const file = {
        name: f.getPath(project),
        data,
        type
      };
      files.push(file);
    }, true, true);
    return await this.saveJSON({
      files
    }, uri);
  }

  static async loadFilesIntoProject(files: IFiddleFile [], project: Project, basePath: string = ""): Promise<any> {
    files.forEach(async f => {
      const type = fileTypeFromFileName(f.name);
      const file = project.newFile(f.name, type, false);
      let data: string | ArrayBuffer;
      if (f.type === "binary") {
        data = decodeRestrictedBase64ToBytes(f.data).buffer as ArrayBuffer;
      } else {
        data = f.data;
      }
      file.setData(data);
    });
  }

  static lazyLoad(uri: string, status?: IStatusProvider): Promise<any> {
    return new Promise((resolve, reject) => {
      status && status.push("Loading " + uri);
      const self = this;
      const d = window.document;
      const b = d.body;
      const e = d.createElement("script");
      e.async = true;
      e.src = uri;
      b.appendChild(e);
      e.onload = function() {
        status && status.pop();
        resolve(this);
      };
      // TODO: What about fail?
    });
  }

  static async loadBinaryen(status?: IStatusProvider) {
    if (typeof Binaryen === "undefined") {
      await Service.lazyLoad("lib/binaryen.js", status);
    }
  }

  static async optimizeWasmWithBinaryen(file: File, status?: IStatusProvider) {
    gaEvent("optimize", "Service", "binaryen");
    await Service.loadBinaryen(status);
    let data = file.getData() as ArrayBuffer;
    const module = Binaryen.readBinary(data);
    module.optimize();
    data = module.emitBinary();
    file.setData(data);
    file.buffer.setValue(await Service.disassembleWasm(data, status));
  }

  static async validateWasmWithBinaryen(file: File, status?: IStatusProvider) {
    gaEvent("validate", "Service", "binaryen");
    await Service.loadBinaryen(status);
    const data = file.getData() as ArrayBuffer;
    const module = Binaryen.readBinary(data);
    alert(module.validate() ? "Module is valid" : "Module is not valid");
  }

  static async getWasmCallGraphWithBinaryen(file: File, status?: IStatusProvider) {
    gaEvent("validate", "Service", "binaryen");
    await Service.loadBinaryen(status);
    const data = file.getData() as ArrayBuffer;
    const module = Binaryen.readBinary(data);
    const old = Binaryen.print;
    let ret = "";
    Binaryen.print = (x: string) => { ret += x + "\n"; };
    const foo = module.runPasses(["print-call-graph"]);
    Binaryen.print = old;
    const output = file.parent.newFile(file.name + ".dot", FileType.DOT);
    output.description = "Call graph created from " + file.name + " using Binaryen's print-call-graph pass.";
    output.setData(ret);
  }

  static async validateWatWithBinaryen(file: File, status?: IStatusProvider) {
    gaEvent("optimize", "Service", "binaryen (wat)");
    await Service.loadBinaryen(status);
    const data = file.getData() as string;
    const module = Binaryen.parseText(data);
    alert(module.validate());
  }

  static async disassembleWasmWithBinaryen(file: File, status?: IStatusProvider) {
    gaEvent("disassemble", "Service", "binaryen");
    Service.loadBinaryen(status);
    const data = file.getData() as ArrayBuffer;
    const module = Binaryen.readBinary(data);
    const output = file.parent.newFile(file.name + ".wat", FileType.Wat);
    output.description = "Disassembled from " + file.name + " using Binaryen.";
    output.setData(module.emitText());
  }

  static async convertWasmToAsmWithBinaryen(file: File, status?: IStatusProvider) {
    gaEvent("disassemble", "Service", "binaryen");
    await Service.loadBinaryen(status);
    const data = file.getData() as ArrayBuffer;
    const module = Binaryen.readBinary(data);
    const result = module.emitAsmjs();
    const output = file.parent.newFile(file.name + ".asm.js", FileType.JavaScript);
    output.description = "Converted from " + file.name + " using Binaryen.";
    output.setData(result);
  }

  static downloadLink: HTMLAnchorElement = null;
  static download(file: File) {
    if (!Service.downloadLink) {
      Service.downloadLink = document.createElement("a");
      Service.downloadLink.style.display = "none";
      document.body.appendChild(Service.downloadLink);
    }
    const url = URL.createObjectURL(new Blob([file.getData()], { type: "application/octet-stream" }));
    Service.downloadLink.href = url;
    Service.downloadLink.download = file.name;
    if (Service.downloadLink.href as any !== document.location) {
      Service.downloadLink.click();
    }
  }

  static clangFormatModule: any = null;
  // Kudos to https://github.com/tbfleming/cib
  static async clangFormat(file: File, status?: IStatusProvider) {
    gaEvent("format", "Service", "clang-format");
    function format() {
      const result = Service.clangFormatModule.ccall("formatCode", "string", ["string"], [file.buffer.getValue()]);
      file.buffer.setValue(result);
    }

    if (Service.clangFormatModule) {
      format();
    } else {
      await Service.lazyLoad("lib/clang-format.js", status);
      const response = await fetch("lib/clang-format.wasm");
      const wasmBinary = await response.arrayBuffer();
      const module: any = {
        postRun() {
          format();
        },
        wasmBinary
      };
      Service.clangFormatModule = Module(module);
    }
  }

  static async disassembleX86(file: File, status?: IStatusProvider, options = "") {
    gaEvent("disassemble", "Service", "capstone.x86");
    if (typeof capstone === "undefined") {
      await Service.lazyLoad("lib/capstone.x86.min.js", status);
    }
    const output = file.parent.newFile(file.name + ".x86", FileType.x86);

    function toBytes(a: any) {
      return a.map(function(x: any) { return padLeft(Number(x).toString(16), 2, "0"); }).join(" ");
    }

    const data = file.getData() as string;
    const json: any = await Service.compile(data, Language.Wasm, Language.x86, options);
    let s = "";
    const cs = new capstone.Cs(capstone.ARCH_X86, capstone.MODE_64);
    const annotations: any[] = [];
    const assemblyInstructionsByAddress = Object.create(null);
    for (let i = 0; i < json.regions.length; i++) {
      const region = json.regions[i];
      s += region.name + ":\n";
      const csBuffer = decodeRestrictedBase64ToBytes(region.bytes);
      const instructions = cs.disasm(csBuffer, region.entry);
      const basicBlocks: any = {};
      instructions.forEach(function(instr: any, i: any) {
        assemblyInstructionsByAddress[instr.address] = instr;
        if (isBranch(instr)) {
          const targetAddress = parseInt(instr.op_str, 10);
          if (!basicBlocks[targetAddress]) {
            basicBlocks[targetAddress] = [];
          }
          basicBlocks[targetAddress].push(instr.address);
          if (i + 1 < instructions.length) {
            basicBlocks[instructions[i + 1].address] = [];
          }
        }
      });
      instructions.forEach(function(instr: any) {
        if (basicBlocks[instr.address]) {
          s += " " + padRight(toAddress(instr.address) + ":", 39, " ");
          if (basicBlocks[instr.address].length > 0) {
            s += "; " + toAddress(instr.address) + " from: [" + basicBlocks[instr.address].map(toAddress).join(", ") + "]";
          }
          s += "\n";
        }
        s += "  " + padRight(instr.mnemonic + " " + instr.op_str, 38, " ");
        s += "; " + toAddress(instr.address) + " " + toBytes(instr.bytes) + "\n";
      });
      s += "\n";
    }
    output.setData(s);
  }

  private static binaryExplorerMessageListener: (e: any) => void;

  static openBinaryExplorer(file: File) {
    window.open(
      "//wasdk.github.io/wasmcodeexplorer/?api=postmessage",
      "",
      "toolbar=no,ocation=no,directories=no,status=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=1024,height=568"
    );
    if (Service.binaryExplorerMessageListener) {
      window.removeEventListener("message", Service.binaryExplorerMessageListener, false);
    }
    Service.binaryExplorerMessageListener = (e: any) => {
      if (e.data.type === "wasmexplorer-ready") {
        window.removeEventListener("message", Service.binaryExplorerMessageListener, false);
        Service.binaryExplorerMessageListener = null;
        const dataToSend = new Uint8Array((file.data as any).slice(0));
        e.source.postMessage({
          type: "wasmexplorer-load",
          data: dataToSend
        }, "*", [dataToSend.buffer]);
      }
    };
    window.addEventListener("message", Service.binaryExplorerMessageListener, false);
  }

  static async compileMarkdownToHtml(src: string): Promise<string> {
    if (typeof showdown === "undefined") {
      await Service.lazyLoad("lib/showdown.min.js");
    }
    const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
    showdown.setFlavor("github");
    return converter.makeHtml(src);
  }
}
