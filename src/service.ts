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
import { WorkerCommand, IWorkerResponse, IWorkerRequest } from "./message";
import { processJSFile, RewriteSourcesContext } from "./utils/rewriteSources";
import { getCurrentRunnerInfo } from "./utils/taskRunner";

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
  wasmBindgenJs: string | undefined;
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

class ServiceWorker {
  worker: Worker;
  workerCallbacks: Array<{fn: Function, ex: Function}> = [];
  nextId = 0;
  private getNextId() {
    return String(this.nextId++);
  }
  constructor() {
    this.worker = new Worker("dist/worker.bundle.js");
    this.worker.addEventListener("message", (e: {data: IWorkerResponse}) => {
      if (!e.data.id) {
        return;
      }
      const cb = this.workerCallbacks[e.data.id];
      if (e.data.success) {
        cb.fn(e);
      } else {
        cb.ex(e);
      }
      this.workerCallbacks[e.data.id] = null;
    });
  }

  setWorkerCallback(id: string, fn: (e: any) => void, ex?: (e: any) => void) {
    assert(!this.workerCallbacks[id as any]);
    this.workerCallbacks[id as any] = {fn, ex};
  }

  async postMessage(command: WorkerCommand, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = this.getNextId();
      this.setWorkerCallback(id, (e: {data: IWorkerResponse}) => {
        resolve(e.data.payload);
      }, (e) => {
        reject(e.data.payload);
      });
      this.worker.postMessage({
        id, command, payload
      }, undefined);
    });
  }

  async optimizeWasmWithBinaryen(data: ArrayBuffer): Promise<ArrayBuffer> {
    return await this.postMessage(WorkerCommand.OptimizeWasmWithBinaryen, data);
  }

  async validateWasmWithBinaryen(data: ArrayBuffer): Promise<number> {
    return await this.postMessage(WorkerCommand.ValidateWasmWithBinaryen, data);
  }

  async createWasmCallGraphWithBinaryen(data: ArrayBuffer): Promise<string> {
    return await this.postMessage(WorkerCommand.CreateWasmCallGraphWithBinaryen, data);
  }

  async convertWasmToAsmWithBinaryen(data: ArrayBuffer): Promise<string> {
    return await this.postMessage(WorkerCommand.ConvertWasmToAsmWithBinaryen, data);
  }

  async disassembleWasmWithBinaryen(data: ArrayBuffer): Promise<string> {
    return await this.postMessage(WorkerCommand.DisassembleWasmWithBinaryen, data);
  }

  async assembleWatWithBinaryen(data: string): Promise<ArrayBuffer> {
    return await this.postMessage(WorkerCommand.AssembleWatWithBinaryen, data);
  }

  async disassembleWasmWithWabt(data: ArrayBuffer): Promise<string> {
    return await this.postMessage(WorkerCommand.DisassembleWasmWithWabt, data);
  }

  async assembleWatWithWabt(data: string): Promise<ArrayBuffer> {
    return await this.postMessage(WorkerCommand.AssembleWatWithWabt, data);
  }

  async twiggyWasm(data: ArrayBuffer): Promise<string> {
    return await this.postMessage(WorkerCommand.TwiggyWasm, data);
  }
}

export class Service {
  private static worker = new ServiceWorker();

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
    const result = await Service.compileFileWithBindings(file, from, to, options);
    return result.wasm;
  }

  static async compileFileWithBindings(file: File, from: Language, to: Language, options = ""): Promise<any> {
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
    let wasm = decodeRestrictedBase64ToBytes(result.output);
    if (isZlibData(wasm)) {
      wasm = await decompressZlib(wasm);
    }
    const ret: any = {wasm};
    if (result.wasmBindgenJs) {
      ret.wasmBindgenJs = result.wasmBindgenJs;
    }
    return ret;
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
      return this.sendRequestJSON({ code: src, options }, ServiceTypes.Rustc);
    }
  }

  static async disassembleWasm(buffer: ArrayBuffer, status: IStatusProvider): Promise<string> {
    gaEvent("disassemble", "Service", "wabt");
    status && status.push("Disassembling with Wabt");
    const result = await this.worker.disassembleWasmWithWabt(buffer);
    status && status.pop();
    return result;
  }

  static async disassembleWasmWithWabt(file: File, status?: IStatusProvider) {
    const result = await Service.disassembleWasm(file.getData() as ArrayBuffer, status);
    const output = file.parent.newFile(file.name + ".wat", FileType.Wat);
    output.description = "Disassembled from " + file.name + " using Wabt.";
    output.setData(result);
  }

  static async assembleWat(wat: string, status?: IStatusProvider): Promise<ArrayBuffer> {
    gaEvent("assemble", "Service", "wabt");
    status && status.push("Assembling Wat with Wabt");
    let result = null;
    try {
      result = await this.worker.assembleWatWithWabt(wat);
    } catch (e) {
      throw e;
    } finally {
      status && status.pop();
    }
    return result;
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
    const json: any = { description: "source: https://webassembly.studio", public: true, files};
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

  static async loadFilesIntoProject(files: IFiddleFile[], project: Project, base: URL = null): Promise<any> {
    for (const f of files) {
      const type = fileTypeFromFileName(f.name);
      const file = project.newFile(f.name, type, false);
      let data: string | ArrayBuffer;
      if (f.data) {
        if (f.type === "binary") {
          data = decodeRestrictedBase64ToBytes(f.data).buffer as ArrayBuffer;
        } else {
          data = f.data;
        }
      } else {
        const request = await fetch(new URL(f.name, base).toString());
        if (f.type === "binary") {
          data = await request.arrayBuffer();
        } else {
          data = await request.text();
        }
      }
      file.setData(data);
    }
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

  static async optimizeWasmWithBinaryen(file: File, status?: IStatusProvider) {
    assert(this.worker);
    gaEvent("optimize", "Service", "binaryen");
    let data = file.getData() as ArrayBuffer;
    status && status.push("Optimizing with Binaryen");
    data = await this.worker.optimizeWasmWithBinaryen(data);
    status && status.pop();
    file.setData(data);
    file.buffer.setValue(await Service.disassembleWasm(data, status));
  }

  static async validateWasmWithBinaryen(file: File, status?: IStatusProvider): Promise<boolean> {
    gaEvent("validate", "Service", "binaryen");
    const data = file.getData() as ArrayBuffer;
    status && status.push("Validating with Binaryen");
    const result = await this.worker.validateWasmWithBinaryen(data);
    status && status.pop();
    return !!result;
  }

  static async getWasmCallGraphWithBinaryen(file: File, status?: IStatusProvider) {
    gaEvent("call-graph", "Service", "binaryen");
    const data = file.getData() as ArrayBuffer;
    status && status.push("Creating Call Graph with Binaryen");
    const result = await this.worker.createWasmCallGraphWithBinaryen(data);
    status && status.pop();
    const output = file.parent.newFile(file.name + ".dot", FileType.DOT);
    output.description = "Call graph created from " + file.name + " using Binaryen's print-call-graph pass.";
    output.setData(result);
  }

  static async disassembleWasmWithBinaryen(file: File, status?: IStatusProvider) {
    gaEvent("disassemble", "Service", "binaryen");
    const data = file.getData() as ArrayBuffer;
    status && status.push("Disassembling with Binaryen");
    const result = await this.worker.disassembleWasmWithBinaryen(data);
    status && status.pop();
    const output = file.parent.newFile(file.name + ".wat", FileType.Wat);
    output.description = "Disassembled from " + file.name + " using Binaryen.";
    output.setData(result);
  }

  static async convertWasmToAsmWithBinaryen(file: File, status?: IStatusProvider) {
    gaEvent("asm.js", "Service", "binaryen");
    const data = file.getData() as ArrayBuffer;
    status && status.push("Creating Call Graph with Binaryen");
    const result = await this.worker.convertWasmToAsmWithBinaryen(data);
    status && status.pop();
    const output = file.parent.newFile(file.name + ".asm.js", FileType.JavaScript);
    output.description = "Converted from " + file.name + " using Binaryen.";
    output.setData(result);
  }

  static async assembleWatWithBinaryen(file: File, status?: IStatusProvider) {
    gaEvent("assemble", "Service", "binaryen");
    const data = file.getData() as string;
    status && status.push("Assembling with Binaryen");
    const result = await this.worker.assembleWatWithBinaryen(data);
    status && status.pop();
    const output = file.parent.newFile(file.name + ".wasm", FileType.Wasm);
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

  static async import(path: string): Promise<any> {
    const { project, global } = getCurrentRunnerInfo();
    const context = new RewriteSourcesContext(project);
    context.logLn = console.log;
    context.createFile = (src: ArrayBuffer|string, type: string) => {
      const blob = new global.Blob([src], { type, });
      return global.URL.createObjectURL(blob);
    };

    const url = processJSFile(context, path);
    // Create script tag to load ES module.
    const script = global.document.createElement("script");
    script.setAttribute("type", "module");
    script.setAttribute("async", "async");
    const id = `__import__${Math.random().toString(36).substr(2)}`;
    const scriptReady = new Promise((resolve, reject) => {
      global[id] = resolve;
    });
    script.textContent = `import * as i from '${url}'; ${id}(i);`;
    global.document.head.appendChild(script);
    const module = await scriptReady;
    // Module loaded -- cleaning up
    script.remove();
    delete global[id];
    return module;
  }

  static async compileMarkdownToHtml(src: string): Promise<string> {
    if (typeof showdown === "undefined") {
      await Service.lazyLoad("lib/showdown.min.js");
    }
    const converter = new showdown.Converter({ tables: true, ghCodeBlocks: true });
    showdown.setFlavor("github");
    return converter.makeHtml(src);
  }

  static async twiggyWasm(file: File, status: IStatusProvider): Promise<string> {
    const buffer = file.getData() as ArrayBuffer;
    gaEvent("disassemble", "Service", "twiggy");
    status && status.push("Analyze with Twiggy");
    const result = await this.worker.twiggyWasm(buffer);
    const output = file.parent.newFile(file.name + ".md", FileType.Markdown);
    output.description = "Analyzed " + file.name + " using Twiggy.";
    output.setData(result);
    status && status.pop();
    return result;
  }
}
