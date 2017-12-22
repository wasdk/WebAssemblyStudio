import { BinaryReader, WasmDisassembler } from "wasmparser";
import { File, Project, Directory, FileType } from "./model";
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
  type: string;
  children: IFile[];
  data: string;
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
  tasks: IServiceRequestTask [];
  output: string;
}

export class Service {
  static sendRequest(command: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener("load", function () {
        resolve(this);
      });
      xhr.addEventListener("error", function () {
        reject(this);
      });
      xhr.open("POST", "//wasmexplorer-service.herokuapp.com/service.php", true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(command);
    });
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
        annotations.push({severity, message,
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
        annotations.push({severity, message,
          startLineNumber: parseInt(m[1]), startColumn: parseInt(m[2]),
          endLineNumber: parseInt(m[3]), endColumn: parseInt(m[4])
        });
      }
    }
    return annotations;
  }

  static compileFile(file: File, from: Language, to: Language, options = ""): Promise<any> {
    return new Promise((resolve, reject) => {
      Service.compile(file.getData(), from, to, options).then((result) => {
        let markers = Service.getMarkers(result.tasks[0].console);
        if (markers.length) {
          monaco.editor.setModelMarkers(file.buffer, "compiler", markers);
        }
        if (!result.success) {
          reject();
          return;
        }
        var buffer = atob(result.output);
        var data = new Uint8Array(buffer.length);
        for (var i = 0; i < buffer.length; i++) {
          data[i] = buffer.charCodeAt(i);
        }
        resolve(data);
      });
    });
  }

  static compile(src: string | ArrayBuffer, from: Language, to: Language, options = ""): Promise<IServiceRequest> {
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
      return new Promise((resolve, reject) => {
        this.sendRequest("input=" + input + "&action=build").then((x) => {
          try {
            resolve(JSON.parse(x.responseText) as IServiceRequest);
          } catch (e) {
            console.error(e);
            reject();
          }
        }).catch(() => {
          reject();
        })
      });
    } else if (from === Language.Wasm && to === Language.x86) {
      let input = encodeURIComponent(base64js.fromByteArray(src as ArrayBuffer));
      return new Promise((resolve, reject) => {
        this.sendRequest("input=" + input + "&action=wasm2assembly&options=" + encodeURIComponent(options)).then((x) => {
          try {
            resolve(JSON.parse(x.responseText) as IServiceRequest);
          } catch (e) {
            console.error(e);
            reject();
          }
        }).catch(() => {
          reject();
        })
      });
    }
    return;
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
      return new Promise((resolve, reject) => {
        this.sendRequest(command.join("&")).then((x) => {
          resolve(x);
        }).catch(() => {
          reject();
        })
      });
    } else if (from === Language.Wast && to === Language.Wasm) {
      let action = "wast2wasm";
      let version = "";
      let command = [
        `input=${src}`,
        `action=${action}`,
        `version=${version}`,
        `options=${encodeURIComponent(options)}`
      ]
      return new Promise((resolve, reject) => {
        this.sendRequest(command.join("&")).then((x) => {
          var buffer = atob(x.responseText.split('\n', 2)[1]);
          var data = new Uint8Array(buffer.length);
          for (var i = 0; i < buffer.length; i++) {
            data[i] = buffer.charCodeAt(i);
          }
          resolve(data);
        }).catch(() => {
          reject();
        })
      });
    } else if (from === Language.Wast && to === Language.x86) {
      let action = "wast2assembly";
      let version = "";
      let command = [
        `input=${src}`,
        `action=${action}`,
        `version=${version}`,
        `options=${encodeURIComponent(options)}`
      ]
      return new Promise((resolve, reject) => {
        this.sendRequest(command.join("&")).then((x) => {
          let data = JSON.parse(x.responseText)
          resolve(data);
        }).catch(() => {
          reject();
        })
      });
    }
    */
  }

  static disassembleWasm(buffer: ArrayBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
      function disassemble() {
        var module = wabt.readWasm(buffer, {readDebugNames: true});
        if (true) {
          module.generateNames();
          module.applyNames();
        }
        return module.toText({foldExprs: false, inlineExport: true});
      }
      if (typeof wabt !== "undefined") {
        resolve(disassemble());
      } else {
        Service.lazyLoad("lib/libwabt.js").then(() => {
          wabt.ready.then(() => {
            resolve(disassemble());
          });
        });
      }
    });
  }

  static disassembleWasmWithWabt(file: File) {
    Service.disassembleWasm(file.getData() as ArrayBuffer).then((result) => {
      let output = file.parent.newFile(file.name + ".wast", FileType.Wast);
      output.description = "Disassembled from " + file.name + " using Wabt.";
      output.setData(result);
    });
  }

  static assembleWast(wast: string): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      function assemble() {
        var module = wabt.parseWat('test.wast', wast);
        module.resolveNames();
        module.validate();
        let binary = module.toBinary({log: true, write_debug_names: true});
        return binary.buffer;
      }
      if (typeof wabt !== "undefined") {
        resolve(assemble());
      } else {
        Service.lazyLoad("lib/libwabt.js").then(() => {
          wabt.ready.then(() => {
            resolve(assemble());
          });
        });
      }
    });
  }

  static assembleWastWithWabt(file: File) {
    Service.assembleWast(file.getData() as string).then((result) => {
      let output = file.parent.newFile(file.name + ".wasm", FileType.Wasm);
      output.description = "Assembled from " + file.name + " using Wabt.";
      output.setData(result);
    });
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

  static loadJSON(uri: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      let self = this;
      xhr.addEventListener("load", function () {
        resolve(JSON.parse(this.response));
      });
      xhr.addEventListener("error", function () {
        reject(this.response);
      });
      let url = "https://api.myjson.com/bins/" + uri;
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
      xhr.send();
    });
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

  static saveProject(project: Project, openedFiles: string [][], uri?: string): Promise<string> {
    return new Promise((resolve, reject) => {
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
      this.saveJSON(json, uri).then((result) => {
        resolve(result);
      });
    })
  }

  static loadProject(uri: string, project: Project): Promise<any> {
    function deserialize(json: IFile | IFile[]): any {
      if (Array.isArray(json)) {
        return json.map((x: any) => deserialize(x));
      } else if (json.children) {
        let directory = new Directory(json.name);
        deserialize(json.children).forEach((file: File) => {
          directory.addFile(file);
        });
        return directory;
      } else {
        let file = new File(json.name, json.type as FileType);
        file.setData(json.data);
        return file;
      }
    }
    return new Promise((resolve, reject) => {
      Service.loadJSON(uri).then((json: any) => {
        project.name = json.name;
        deserialize(json.children).forEach((file: File) => {
          project.addFile(file);
        });
        resolve(json);
      });
    });
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

  static optimizeWasmWithBinaryen(file: File) {
    function optimize() {
      let data = file.getData() as ArrayBuffer;
      let module = Binaryen.readBinary(data);
      module.optimize();
      data = module.emitBinary();
      file.setData(data);
      Service.disassembleWasm(data).then((result) => {
        file.buffer.setValue(result);
      });
    }
    if (typeof Binaryen !== "undefined") {
      optimize();
    } else {
      Service.lazyLoad("lib/binaryen.js").then(() => {
        optimize();
      });
    }
  }

  static validateWasmWithBinaryen(file: File) {
    function validate() {
      let data = file.getData() as ArrayBuffer;
      let module = Binaryen.readBinary(data);
      alert(module.validate());
    }
    if (typeof Binaryen !== "undefined") {
      validate();
    } else {
      Service.lazyLoad("lib/binaryen.js").then(() => {
        validate();
      });
    }
  }

  static validateWastWithBinaryen(file: File) {
    function validate() {
      let data = file.getData() as string;
      let module = Binaryen.parseText(data);
      alert(module.validate());
    }
    if (typeof Binaryen !== "undefined") {
      validate();
    } else {
      Service.lazyLoad("lib/binaryen.js").then(() => {
        validate();
      });
    }
  }

  static disassembleWasmWithBinaryen(file: File) {
    function disassemble() {
      let data = file.getData() as ArrayBuffer;
      let module = Binaryen.readBinary(data);
      let output = file.parent.newFile(file.name + ".wast", FileType.Wast);
      output.description = "Disassembled from " + file.name + " using Binaryen.";
      output.setData(module.emitText());
    }
    if (typeof Binaryen !== "undefined") {
      disassemble();
    } else {
      Service.lazyLoad("lib/binaryen.js").then(() => {
        disassemble();
      });
    }
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
  static clangFormat(file: File) {
    function format() {
      let result = Service.clangFormatModule.ccall('formatCode', 'string', ['string'], [file.buffer.getValue()]);
      file.buffer.setValue(result);
    }
    if (Service.clangFormatModule) {
      format();
    } else {
      Service.lazyLoad("lib/clang-format.js").then(() => {
        let module: any = {
          postRun() {
            format();
          },
        }
        fetch('lib/clang-format.wasm').then(response => response.arrayBuffer()).then(wasmBinary => {
          module.wasmBinary = wasmBinary;
          Service.clangFormatModule = Module(module);
        });
      });
    }
  }

  static disassembleX86(file: File, options = "") {
    let output = file.parent.newFile(file.name + ".x86", FileType.x86);

    function toBytes(a: any) {
      return a.map(function (x: any) { return padLeft(Number(x).toString(16), 2, "0"); }).join(" ");
    }
    function disassemble() {
      let data = file.getData() as string;
      Service.compile(data, Language.Wasm, Language.x86, options).then((json: any) => {
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
      });
    }
    if (typeof capstone !== "undefined") {
      disassemble();
    } else {
      Service.lazyLoad("lib/capstone.x86.min.js").then(() => {
        disassemble();
      });
    }
  }

  static compileMarkdownToHtml(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      function compile() {
        var converter = new showdown.Converter({ tables: true });
        showdown.setFlavor('github');
        resolve(converter.makeHtml(src));
      }
      if (typeof showdown !== "undefined") {
        compile();
      } else {
        Service.lazyLoad("lib/showdown.min.js").then(() => {
          compile();
        });
      }
    });
  }
}