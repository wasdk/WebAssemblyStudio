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

import { File, Project, Directory, FileType, Problem } from "./model";
import { isUndefined } from "util";
import "monaco-editor";
import { padLeft, padRight, isBranch, toAddress, decodeRestrictedBase64ToBytes } from "./util";
import { assert } from "./index";
import getConfig from "./config";

declare interface BinaryenModule {
  optimize(): any;
  validate(): any;
  emitBinary(): ArrayBuffer;
  emitText(): string;
}

declare var Binaryen: {
  readBinary(data: ArrayBuffer): BinaryenModule;
  parseText(data: string): BinaryenModule;
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

export enum Language {
  C = "c",
  Cpp = "cpp",
  Wast = "wast",
  Wasm = "wasm",
  Rust = "rust",
  Cretonne = "cton",
  x86 = "x86"
}

interface IFile {
  name: string;
  children: IFile[];
  type?: string;
  data?: string;
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
  Service
}

export class Service {
  static async sendRequestJSON(content: Object, to: ServiceTypes): Promise<IServiceRequest> {
    const config = await getConfig();
    const url = to === ServiceTypes.Rustc ? config.rustc : config.serviceUrl;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(content),
      headers: new Headers({ "Content-Type": "application/json" })
    });

    return response.json();
  }

  static async sendRequest(content: string, to: ServiceTypes): Promise<IServiceRequest> {
    const config = await getConfig();
    const url = to === ServiceTypes.Rustc ? config.rustc : config.serviceUrl;

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
    const buffer = atob(result.output);
    const data = new Uint8Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = buffer.charCodeAt(i);
    }
    return data;
  }

  static async compile(src: string | ArrayBuffer, from: Language, to: Language, options = ""): Promise<IServiceRequest> {
    if (from === Language.C && to === Language.Wasm) {
      const project = {
        output: "wasm",
        files: [
          {
            type: from,
            name: "file." + from,
            options,
            src
          }
        ]
      };
      const input = encodeURIComponent(JSON.stringify(project)).replace("%20", "+");
      return this.sendRequest("input=" + input + "&action=build", ServiceTypes.Service);
    } else if (from === Language.Wasm && to === Language.x86) {
      const input = encodeURIComponent(base64js.fromByteArray(src as ArrayBuffer));
      return this.sendRequest("input=" + input + "&action=wasm2assembly&options=" + encodeURIComponent(options), ServiceTypes.Service);
    } else if (from === Language.Rust && to === Language.Wasm) {
      // TODO: Temporary until we integrate rustc into the service.
      return this.sendRequestJSON({ code: src }, ServiceTypes.Rustc);
    }
  }

  static async disassembleWasm(buffer: ArrayBuffer): Promise<string> {
    if (typeof wabt === "undefined") {
      await Service.lazyLoad("lib/libwabt.js");
    }
    const module = wabt.readWasm(buffer, { readDebugNames: true });
    if (true) {
      module.generateNames();
      module.applyNames();
    }
    return module.toText({ foldExprs: false, inlineExport: true });
  }

  static async disassembleWasmWithWabt(file: File) {
    const result = await Service.disassembleWasm(file.getData() as ArrayBuffer);
    const output = file.parent.newFile(file.name + ".wast", FileType.Wast);
    output.description = "Disassembled from " + file.name + " using Wabt.";
    output.setData(result);
  }

  static async assembleWast(wast: string): Promise<ArrayBuffer> {
    if (typeof wabt === "undefined") {
      await Service.lazyLoad("lib/libwabt.js");
    }
    const module = wabt.parseWat("test.wast", wast);
    module.resolveNames();
    module.validate();
    const binary = module.toBinary({ log: true, write_debug_names: true });
    return binary.buffer;
  }

  static async assembleWastWithWabt(file: File) {
    const result = await Service.assembleWast(file.getData() as string);
    const output = file.parent.newFile(file.name + ".wasm", FileType.Wasm);
    output.description = "Assembled from " + file.name + " using Wabt.";
    output.setData(result);
  }

  static createGist(json: object): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener("load", function() {
        const jsonURI = JSON.parse(this.response).html_url;
        resolve(jsonURI);
      });
      xhr.addEventListener("error", function() {
        reject();
      });
      xhr.open("POST", "https://api.github.com/gists", true);
      xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
      xhr.send(JSON.stringify(json));
    });
  }

  static async loadJSON(uri: string): Promise<{}> {
    const url = "https://api.myjson.com/bins/" + uri;
    const response = await fetch(url, {
      headers: new Headers({ "Content-type": "application/json; charset=utf-8" })
    });
    return JSON.parse(await response.text());
  }

  static saveJSON(json: object, uri: string): Promise<string> {
    const update = !!uri;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener("load", function() {
        if (update) {
          resolve(uri);
        } else {
          let jsonURI = JSON.parse(this.response).uri;
          jsonURI = jsonURI.substring(jsonURI.lastIndexOf("/") + 1);
          resolve(jsonURI);
        }
      });
      xhr.addEventListener("error", function() {
        reject();
      });
      if (update) {
        xhr.open("PUT", "//api.myjson.com/bins/" + uri, true);
      } else {
        xhr.open("POST", "//api.myjson.com/bins", true);
      }
      xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
      xhr.send(JSON.stringify(json));
    });
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

  static async exportProjectToGist(project: Project, uri?: string): Promise<string> {
    const files: any = {};
    function serialize(file: File) {
      if (file instanceof Directory) {
        if (file.name !== "out") {
          file.mapEachFile((file: File) => serialize(file));
        }
      } else {
        files[file.name] = {content: file.data};
      }
    }
    serialize(project);
    const json: any = { description: "source: http://webassembly.studio", public: true, files};
    if (!isUndefined(uri)) {
      json["description"] = json["description"] + `/?f=${uri}`;
    }
    return await this.createGist(json);
  }

  static async saveProject(project: Project, openedFiles: string[][], uri?: string): Promise<string> {
    function serialize(file: File): any {
      if (file instanceof Directory) {
        return {
          name: file.name,
          children: file.mapEachFile((file: File) => serialize(file))
        };
      } else {
        return {
          name: file.name,
          type: file.type,
          data: file.data
        };
      }
    }
    const json = serialize(project);
    json.openedFiles = openedFiles;
    return await this.saveJSON(json, uri);
  }

  static async loadProject(json: any, project: Project): Promise<any> {
    async function deserialize(json: IFile | IFile[], basePath: string): Promise<any> {
      if (Array.isArray(json)) {
        return Promise.all(json.map((x: any) => deserialize(x, basePath)));
      }
      if (json.children) {
        const directory = new Directory(json.name);
        (await deserialize(json.children, basePath + "/" + json.name)).forEach((file: File) => {
          directory.addFile(file);
        });
        return directory;
      }
      const file = new File(json.name, json.type as FileType);
      if (json.data) {
        file.setData(json.data);
      } else {
        const request = await fetch(basePath + "/" + json.name);
        file.setData(await request.text());
      }
      return file;
    }
    project.name = json.name;
    (await deserialize(json.children, "templates/" + json.directory)).forEach((file: File) => {
      project.addFile(file);
    });
    return json;
  }

  static lazyLoad(uri: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const self = this;
      const d = window.document;
      const b = d.body;
      const e = d.createElement("script");
      e.async = true;
      e.src = uri;
      b.appendChild(e);
      e.onload = function() {
        resolve(this);
      };
    });
  }

  static async optimizeWasmWithBinaryen(file: File) {
    if (typeof Binaryen === "undefined") {
      await Service.lazyLoad("lib/binaryen.js");
    }
    let data = file.getData() as ArrayBuffer;
    const module = Binaryen.readBinary(data);
    module.optimize();
    data = module.emitBinary();
    file.setData(data);
    file.buffer.setValue(await Service.disassembleWasm(data));
  }

  static async validateWasmWithBinaryen(file: File) {
    if (typeof Binaryen === "undefined") {
      await Service.lazyLoad("lib/binaryen.js");
    }
    const data = file.getData() as ArrayBuffer;
    const module = Binaryen.readBinary(data);
    alert(module.validate());
  }

  static async validateWastWithBinaryen(file: File) {
    if (typeof Binaryen === "undefined") {
      await Service.lazyLoad("lib/binaryen.js");
    }
    const data = file.getData() as string;
    const module = Binaryen.parseText(data);
    alert(module.validate());
  }

  static async disassembleWasmWithBinaryen(file: File) {
    if (typeof Binaryen === "undefined") {
      await Service.lazyLoad("lib/binaryen.js");
    }
    const data = file.getData() as ArrayBuffer;
    const module = Binaryen.readBinary(data);
    const output = file.parent.newFile(file.name + ".wast", FileType.Wast);
    output.description = "Disassembled from " + file.name + " using Binaryen.";
    output.setData(module.emitText());
  }

  static downloadLink: HTMLAnchorElement = null;
  static download(file: File) {
    if (!Service.downloadLink) {
      Service.downloadLink = document.createElement("a");
      Service.downloadLink.style.display = "none";
      document.body.appendChild(Service.downloadLink);
    }
    assert(file.type === FileType.Wasm);
    const url = URL.createObjectURL(new Blob([file.getData()], { type: "application/wasm" }));
    Service.downloadLink.href = url;
    Service.downloadLink.download = file.name;
    if (Service.downloadLink.href as any !== document.location) {
      Service.downloadLink.click();
    }
  }

  static clangFormatModule: any = null;
  // Kudos to https://github.com/tbfleming/cib
  static async clangFormat(file: File) {
    function format() {
      const result = Service.clangFormatModule.ccall("formatCode", "string", ["string"], [file.buffer.getValue()]);
      file.buffer.setValue(result);
    }

    if (Service.clangFormatModule) {
      format();
    } else {
      await Service.lazyLoad("lib/clang-format.js");
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

  static async disassembleX86(file: File, options = "") {
    if (typeof capstone === "undefined") {
      await Service.lazyLoad("lib/capstone.x86.min.js");
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

  static async compileMarkdownToHtml(src: string): Promise<string> {
    if (typeof showdown === "undefined") {
      await Service.lazyLoad("lib/showdown.min.js");
    }
    const converter = new showdown.Converter({ tables: true });
    showdown.setFlavor("github");
    return converter.makeHtml(src);
  }
}
