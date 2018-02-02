import { BinaryReader, WasmDisassembler } from "wasmparser";
import { File, Project, Directory, FileType, Problem } from "./model";
import { debuglog } from "util";
import "monaco-editor";
import { padLeft, padRight, isBranch, toAddress, decodeRestrictedBase64ToBytes } from "./util";
import { assert } from "./index";

declare interface BinaryenModule {
  optimize(): any;
  validate(): any;
  emitBinary(): ArrayBuffer;
  emitText(): string;
}

declare var Binaryen: {
  readBinary(data: ArrayBuffer): BinaryenModule;
  parseText(data: string): BinaryenModule;
}

declare var capstone: {
  ARCH_X86: any;
  MODE_64: any;
  Cs: any;
};

declare var base64js: {
  toByteArray(base64: string): ArrayBuffer;
  fromByteArray(base64: ArrayBuffer): string;
}

declare var Module: ({ }) => any;
declare var define: any;
declare var showdown: {
  Converter: any;
  setFlavor: Function;
}

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

export class Service {
  static async sendRequest(command: string): Promise<IServiceRequest> {
    const response = await fetch("//wasmexplorer-service.herokuapp.com/service.php", {
      method: "POST",
      body: command,
      headers: new Headers({ "Content-type": "application/x-www-form-urlencoded" })
    });
    return JSON.parse(await response.text());
  }

  static getMarkers(response: string): monaco.editor.IMarkerData[] {
    // Parse and annotate errors if compilation fails.
    var annotations: monaco.editor.IMarkerData[] = [];
    if (response.indexOf("(module") !== 0) {
      var re1 = /^.*?:(\d+?):(\d+?):\s(.*)$/gm;
      var m: any;
      // Single position.
      while ((m = re1.exec(response)) !== null) {
        if (m.index === re1.lastIndex) {
          re1.lastIndex++;
        }
        var startLineNumber = parseInt(m[1]);
        var startColumn = parseInt(m[2]);
        var message = m[3];
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
      var re2 = /^.*?:\d+?:\d+?:\{(\d+?):(\d+?)-(\d+?):(\d+?)\}:\s(.*)$/gm;
      while ((m = re2.exec(response)) !== null) {
        if (m.index === re2.lastIndex) {
          re2.lastIndex++;
        }
        var message = m[5];
        let severity = monaco.Severity.Info;
        if (message.indexOf("error") >= 0) {
          severity = monaco.Severity.Error;
        } else if (message.indexOf("warning") >= 0) {
          severity = monaco.Severity.Warning;
        }
        annotations.push({
          severity, message,
          startLineNumber: parseInt(m[1]), startColumn: parseInt(m[2]),
          endLineNumber: parseInt(m[3]), endColumn: parseInt(m[4])
        });
      }
    }
    return annotations;
  }

  static async compileFile(file: File, from: Language, to: Language, options = ""): Promise<any> {
    const result = await Service.compile(file.getData(), from, to, options);
    let markers = Service.getMarkers(result.tasks[0].console);
    if (markers.length) {
      monaco.editor.setModelMarkers(file.buffer, "compiler", markers);
      file.setProblems(markers.map(marker => {
        return Problem.fromMarker(file, marker);
      }));
    }
    if (!result.success) {
      throw new Error((result as any).message);
    }
    var buffer = atob(result.output);
    var data = new Uint8Array(buffer.length);
    for (var i = 0; i < buffer.length; i++) {
      data[i] = buffer.charCodeAt(i);
    }
    return data;
  }

  static async compile(src: string | ArrayBuffer, from: Language, to: Language, options = ""): Promise<IServiceRequest> {
    if (from === Language.C && to === Language.Wasm) {
      let project = {
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
      let input = encodeURIComponent(JSON.stringify(project)).replace('%20', '+');
      return this.sendRequest("input=" + input + "&action=build");
    } else if (from === Language.Wasm && to === Language.x86) {
      let input = encodeURIComponent(base64js.fromByteArray(src as ArrayBuffer));
      return this.sendRequest("input=" + input + "&action=wasm2assembly&options=" + encodeURIComponent(options));
    }
    /*
    src = encodeURIComponent(src).replace('%20', '+');
    if (from === Language.C && to === Language.Wast) {
      let action = "c2wast";
      let version = "2";
      options = "-O3 -fdiagnostics-print-source-range-info " + options;
      let command = [
        `input=${src}`,
        `action=${action}`,
        `version=${version}`,
        `options=${encodeURIComponent(options)}`
      ]
      return this.sendRequest(command.join("&"));
    } else if (from === Language.Wast && to === Language.Wasm) {
      let action = "wast2wasm";
      let version = "";
      let command = [
        `input=${src}`,
        `action=${action}`,
        `version=${version}`,
        `options=${encodeURIComponent(options)}`
      ]
      const x = await this.sendRequest(command.join("&"));
      var buffer = atob(x.split('\n', 2)[1]);
      var data = new Uint8Array(buffer.length);
      for (var i = 0; i < buffer.length; i++) {
        data[i] = buffer.charCodeAt(i);
      }
      return data;
    } else if (from === Language.Wast && to === Language.x86) {
      let action = "wast2assembly";
      let version = "";
      let command = [
        `input=${src}`,
        `action=${action}`,
        `version=${version}`,
        `options=${encodeURIComponent(options)}`
      ]
      return this.sendRequest(command.join("&"));
    }
    */
  }

  static async disassembleWasm(buffer: ArrayBuffer): Promise<string> {
    if (typeof wabt === "undefined") {
      await Service.lazyLoad("lib/libwabt.js");
    }
    var module = wabt.readWasm(buffer, { readDebugNames: true });
    if (true) {
      module.generateNames();
      module.applyNames();
    }
    return module.toText({ foldExprs: false, inlineExport: true });
  }

  static async disassembleWasmWithWabt(file: File) {
    const result = await Service.disassembleWasm(file.getData() as ArrayBuffer);
    let output = file.parent.newFile(file.name + ".wast", FileType.Wast);
    output.description = "Disassembled from " + file.name + " using Wabt.";
    output.setData(result);
  }

  static async assembleWast(wast: string): Promise<ArrayBuffer> {
    if (typeof wabt === "undefined") {
      await Service.lazyLoad("lib/libwabt.js");
    }
    var module = wabt.parseWat('test.wast', wast);
    module.resolveNames();
    module.validate();
    let binary = module.toBinary({ log: true, write_debug_names: true });
    return binary.buffer;
  }

  static async assembleWastWithWabt(file: File) {
    const result = await Service.assembleWast(file.getData() as string);
    let output = file.parent.newFile(file.name + ".wasm", FileType.Wasm);
    output.description = "Assembled from " + file.name + " using Wabt.";
    output.setData(result);
  }

  static disassembleWasmWithWasmDisassembler(file: File) {
    let buffer = file.getData() as ArrayBuffer
    let reader = new BinaryReader();
    reader.setData(buffer, 0, buffer.byteLength);
    let dis = new WasmDisassembler();
    dis.addOffsets = true;
    dis.disassembleChunk(reader);
    let result = dis.getResult().lines.join("\n");
    let output = file.parent.newFile(file.name + ".wast", FileType.Wast);
    output.description = "Disassembled from " + file.name + " using WasmDisassembler.";
    output.setData(result);
    return;
  }

  static async loadJSON(uri: string): Promise<{}> {
    let url = "https://api.myjson.com/bins/" + uri;
    const response = await fetch(url, {
      headers: new Headers({ "Content-type": "application/json; charset=utf-8" })
    });
    return JSON.parse(await response.text());
  }

  static saveJSON(json: object, uri: string): Promise<string> {
    let update = !!uri;
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", function () {
        if (update) {
          resolve(uri);
        } else {
          let jsonURI = JSON.parse(this.response).uri;
          jsonURI = jsonURI.substring(jsonURI.lastIndexOf("/") + 1);
          resolve(jsonURI);
        }
      });
      xhr.addEventListener("error", function () {
        reject()
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
      let i = uri.indexOf("/");
      if (i > 0) {
        uri = uri.substring(0, i);
      }
    }
    return uri;
  }

  static async saveProject(project: Project, openedFiles: string[][], uri?: string): Promise<string> {
    function serialize(file: File): any {
      if (file instanceof Directory) {
        return {
          name: file.name,
          children: file.mapEachFile((file: File) => serialize(file))
        }
      } else {
        return {
          name: file.name,
          type: file.type,
          data: file.data
        }
      }
    }
    let json = serialize(project);
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
      var self = this;
      var d = window.document;
      var b = d.body;
      var e = d.createElement("script");
      e.async = true;
      e.src = uri;
      b.appendChild(e);
      e.onload = function () {
        resolve(this);
      }
    });
  }

  static async optimizeWasmWithBinaryen(file: File) {
    if (typeof Binaryen === "undefined") {
      await Service.lazyLoad("lib/binaryen.js");
    }
    let data = file.getData() as ArrayBuffer;
    let module = Binaryen.readBinary(data);
    module.optimize();
    data = module.emitBinary();
    file.setData(data);
    file.buffer.setValue(await Service.disassembleWasm(data));
  }

  static async validateWasmWithBinaryen(file: File) {
    if (typeof Binaryen === "undefined") {
      await Service.lazyLoad("lib/binaryen.js");
    }
    let data = file.getData() as ArrayBuffer;
    let module = Binaryen.readBinary(data);
    alert(module.validate());
  }

  static async validateWastWithBinaryen(file: File) {
    if (typeof Binaryen === "undefined") {
      await Service.lazyLoad("lib/binaryen.js");
    }
    let data = file.getData() as string;
    let module = Binaryen.parseText(data);
    alert(module.validate());
  }

  static async disassembleWasmWithBinaryen(file: File) {
    if (typeof Binaryen === "undefined") {
      await Service.lazyLoad("lib/binaryen.js");
    }
    let data = file.getData() as ArrayBuffer;
    let module = Binaryen.readBinary(data);
    let output = file.parent.newFile(file.name + ".wast", FileType.Wast);
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
    assert(file.type == FileType.Wasm);
    let url = URL.createObjectURL(new Blob([file.getData()], { type: 'application/wasm' }));
    Service.downloadLink.href = url;
    Service.downloadLink.download = file.name;
    if (Service.downloadLink.href as any != document.location) {
      Service.downloadLink.click();
    }
  }

  // static disassembleWasmWithWasmDisassembler(file: File) {
  //   let data = file.getData() as ArrayBuffer;
  //   let output = file.parent.newFile(file.name + ".wast", FileType.Wast);
  //   output.description = "Disassembled from " + file.name + " using WasmDisassembler.";
  //   output.setData(Service.disassembleWasm(data));
  // }

  static clangFormatModule: any = null;
  // Kudos to https://github.com/tbfleming/cib
  static async clangFormat(file: File) {
    function format() {
      let result = Service.clangFormatModule.ccall('formatCode', 'string', ['string'], [file.buffer.getValue()]);
      file.buffer.setValue(result);
    }

    if (Service.clangFormatModule) {
      format();
    } else {
      await Service.lazyLoad("lib/clang-format.js");
      const response = await fetch('lib/clang-format.wasm');
      const wasmBinary = await response.arrayBuffer();
      let module: any = {
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
    let output = file.parent.newFile(file.name + ".x86", FileType.x86);

    function toBytes(a: any) {
      return a.map(function (x: any) { return padLeft(Number(x).toString(16), 2, "0"); }).join(" ");
    }

    let data = file.getData() as string;
    const json: any = await Service.compile(data, Language.Wasm, Language.x86, options);
    let s = "";
    var cs = new capstone.Cs(capstone.ARCH_X86, capstone.MODE_64);
    var annotations: any[] = [];
    var assemblyInstructionsByAddress = Object.create(null);
    for (var i = 0; i < json.regions.length; i++) {
      var region = json.regions[i];
      s += region.name + ":\n";
      var csBuffer = decodeRestrictedBase64ToBytes(region.bytes);
      var instructions = cs.disasm(csBuffer, region.entry);
      var basicBlocks: any = {};
      instructions.forEach(function (instr: any, i: any) {
        assemblyInstructionsByAddress[instr.address] = instr;
        if (isBranch(instr)) {
          var targetAddress = parseInt(instr.op_str);
          if (!basicBlocks[targetAddress]) {
            basicBlocks[targetAddress] = [];
          }
          basicBlocks[targetAddress].push(instr.address);
          if (i + 1 < instructions.length) {
            basicBlocks[instructions[i + 1].address] = [];
          }
        }
      });
      instructions.forEach(function (instr: any) {
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
    var converter = new showdown.Converter({ tables: true });
    showdown.setFlavor('github');
    return converter.makeHtml(src);
  }
}