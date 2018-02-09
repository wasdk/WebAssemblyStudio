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

import "monaco-editor";
import { assert } from "./index";
import "minimatch";
import { Minimatch } from "minimatch";
import { Service } from "./service";

declare var window: any;

export function shallowCompare(a: any[], b: any[]) {
  if (a === b) { return true; }
  if (a.length !== b.length) { return false; }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) { return false; }
  }
  return true;
}

export enum FileType {
  JavaScript = "javascript",
  TypeScript = "typescript",
  HTML = "html",
  CSS = "css",
  C = "c",
  Cpp = "cpp",
  Rust = "rust",
  Wast = "wast",
  Wasm = "wasm",
  Directory = "directory",
  Log = "log",
  x86 = "x86",
  Markdown = "markdown",
  Cretonne = "cretonne",
  Unknown = "unknown"
}

export function isBinaryFileType(type: FileType) {
  switch (type) {
    case FileType.Wasm:
      return true;
    default:
      return false;
  }
}

export function languageForFileType(type: FileType): string {
  if (type === FileType.HTML) {
    return "html";
  } else if (type === FileType.CSS) {
    return "css";
  } else if (type === FileType.JavaScript) {
    return "javascript";
  } else if (type === FileType.TypeScript) {
    return "typescript";
  } else if (type === FileType.C || type === FileType.Cpp) {
    return "cpp";
  } else if (type === FileType.Wast || type === FileType.Wasm) {
    return "wast";
  } else if (type === FileType.Log) {
    return "log";
  } else if (type === FileType.x86) {
    return "x86";
  } else if (type === FileType.Markdown) {
    return "markdown";
  } else if (type === FileType.Cretonne) {
    return "cton";
  }
  return "";
}

export function nameForFileType(type: FileType): string {
  if (type === FileType.HTML) {
    return "HTML";
  } else if (type === FileType.CSS) {
    return "CSS";
  } else if (type === FileType.JavaScript) {
    return "JavaScript";
  } else if (type === FileType.TypeScript) {
    return "TypeScript";
  } else if (type === FileType.C) {
    return "C";
  } else if (type === FileType.Cpp) {
    return "C++";
  } else if (type === FileType.Wast) {
    return "Wast";
  } else if (type === FileType.Wasm) {
    return "Wasm";
  } else if (type === FileType.Markdown) {
    return "Markdown";
  } else if (type === FileType.Rust) {
    return "Rust";
  } else if (type === FileType.Cretonne) {
    return "Cretonne";
  }
  return "";
}

export function extensionForFileType(type: FileType): string {
  if (type === FileType.HTML) {
    return "html";
  } else if (type === FileType.CSS) {
    return "css";
  } else if (type === FileType.JavaScript) {
    return "js";
  } else if (type === FileType.TypeScript) {
    return "ts";
  } else if (type === FileType.C) {
    return "c";
  } else if (type === FileType.Cpp) {
    return "cpp";
  } else if (type === FileType.Wast) {
    return "wast";
  } else if (type === FileType.Wasm) {
    return "wasm";
  } else if (type === FileType.Markdown) {
    return "md";
  } else if (type === FileType.Rust) {
    return "rs";
  } else if (type === FileType.Cretonne) {
    return "cton";
  }
  return "";
}

export function filetypeForExtension(extension: string): FileType {
  if (extension === "html") {
    return FileType.HTML;
  } else if (extension === "css") {
    return FileType.CSS;
  } else if (extension === "js") {
    return FileType.JavaScript;
  } else if (extension === "ts") {
    return FileType.TypeScript;
  } else if (extension === "c") {
    return FileType.C;
  } else if (extension === "cpp") {
    return FileType.Cpp;
  } else if (extension === "wast") {
    return FileType.Wast;
  } else if (extension === "wasm") {
     return FileType.Wasm;
  } else if (extension === "md") {
    return FileType.Markdown;
  } else if (extension === "rs") {
    return FileType.Rust;
  } else if (extension === "cton") {
    return FileType.Cretonne;
  }
  return null;
}

export function mimeTypeForFileType(type: FileType): string {
  if (type === FileType.HTML) {
    return "text/html";
  } else if (type === FileType.JavaScript) {
    return "application/javascript";
  } else if (type === FileType.Wasm) {
    return "application/wasm";
  }
  return "";
}

export function getIconForFileType(fileType: FileType): string {
  if (fileType === FileType.JavaScript) {
    return "file_type_js";
  } else if (fileType === FileType.TypeScript) {
    return "file_type_typescript";
  } else if (fileType === FileType.C) {
    return "file_type_c";
  } else if (fileType === FileType.Cpp) {
    return "file_type_cpp";
  } else if (fileType === FileType.Directory) {
    return "default_folder";
  }
  return "default_file";
}

export class EventDispatcher {
  readonly name: string;
  private callbacks: Function[] = [];
  constructor(name: string) {
    this.name = name;
  }
  register(callback: Function) {
    if (this.callbacks.indexOf(callback) >= 0) {
      return;
    }
    this.callbacks.push(callback);
  }
  unregister(callback: Function) {
    const i = this.callbacks.indexOf(callback);
    if (i < 0) {
      throw new Error("Unknown callback.");
    }
    this.callbacks.splice(i, 1);
  }
  dispatch(target?: any) {
    // console.log("Dispatching " + this.name);
    this.callbacks.forEach(callback => {
      callback(target);
    });
  }
}

function monacoSeverityToString(severity: monaco.Severity) {
  switch (severity) {
    case monaco.Severity.Info: return "info";
    case monaco.Severity.Warning: return "warning";
    case monaco.Severity.Error: return "error";
    case monaco.Severity.Ignore: return "ignore";
  }
}

let nextKey = 0;
function getNextKey() {
  return nextKey++;
}
export class Problem {
  readonly key = String(getNextKey());
  constructor(
    public file: File,
    public description: string,
    public severity: "error" | "warning" | "info" | "ignore",
    public marker?: monaco.editor.IMarkerData) {
  }

  static fromMarker(file: File, marker: monaco.editor.IMarkerData) {
    return new Problem(
      file,
      `${marker.message} (${marker.startLineNumber}, ${marker.startColumn})`,
      monacoSeverityToString(marker.severity),
      marker);
  }
}

export class File {
  name: string;
  type: FileType;
  data: string | ArrayBuffer;
  parent: Directory;
  /**
   * True if the buffer is out of sync with the data.
   */
  isDirty: boolean = false;
  isBufferReadOnly: boolean = false;
  readonly onDidChangeData = new EventDispatcher("File Data Change");
  readonly onDidChangeBuffer = new EventDispatcher("File Buffer Change");
  readonly onDidChangeProblems = new EventDispatcher("File Problems Change");
  readonly key = String(getNextKey());
  readonly buffer?: monaco.editor.IModel;
  /**
   * File type of the buffer. This may be different than this file's type, true for
   * non-text files.
   */
  bufferType: FileType;
  description: string;
  problems: Problem[] = [];
  constructor(name: string, type: FileType) {
    this.name = name;
    this.type = type;
    this.data = null;
    if (isBinaryFileType(type)) {
      this.bufferType = FileType.Unknown;
      this.buffer = monaco.editor.createModel("");
    } else {
      this.bufferType = type;
      this.buffer = monaco.editor.createModel(this.data as any, languageForFileType(type));
    }
    this.buffer.updateOptions({ tabSize: 2, insertSpaces: true });
    this.buffer.onDidChangeContent((e) => {
      // isFlush is only true for buffer.setValue() calls and the isDirty logic is handled at those
      // call sites, here we only care for user edits.
      if (e.isFlush) {
        return;
      }
      const dispatch = !this.isDirty;
      this.isDirty = true;
      if (dispatch) {
        this.notifyDidChangeBuffer();
      }
      monaco.editor.setModelMarkers(this.buffer, "compiler", []);
    });
    this.parent = null;
  }
  notifyDidChangeBuffer() {
    let file: File = this;
    while (file) {
      file.onDidChangeBuffer.dispatch();
      file = file.parent;
    }
  }
  notifyDidChangeData() {
    let file: File = this;
    while (file) {
      file.onDidChangeData.dispatch();
      file = file.parent;
    }
  }
  async ensureBufferIsLoaded() {
    if (this.bufferType !== FileType.Unknown) {
      return;
    }
    this.updateBuffer();
  }
  private async updateBuffer() {
    if (this.type === FileType.Wasm) {
      const result = await Service.disassembleWasm(this.data as ArrayBuffer);
      this.buffer.setValue(result);
      this.isDirty = false;
      this.bufferType = FileType.Wast;
      this.notifyDidChangeBuffer();
      monaco.editor.setModelLanguage(this.buffer, languageForFileType(FileType.Wast));
      this.description = "This .wasm file is editable as a .wast file, and is automatically reassembled to .wasm when saved.";
      return;
    } else {
      this.buffer.setValue(this.data as string);
      this.isDirty = false;
      this.notifyDidChangeBuffer();
    }
  }
  setProblems(problems: Problem []) {
    this.problems = problems;
    let file: File = this;
    while (file) {
      file.onDidChangeProblems.dispatch();
      file = file.parent;
    }
  }
  async getEmitOutput(): Promise<any> {
    const model = this.buffer;
    if (this.type !== FileType.TypeScript) {
      return Promise.resolve("");
    }
    const worker = await monaco.languages.typescript.getTypeScriptWorker();
    const client = await worker(model.uri);
    return client.getEmitOutput(model.uri.toString());
  }
  setData(data: string | ArrayBuffer) {
    this.data = data;
    this.notifyDidChangeData();
    this.updateBuffer();
  }
  getData(): string | ArrayBuffer {
    if (this.isDirty && !this.isBufferReadOnly) {
      const project = this.getProject();
      if (project) {
        project.onDirtyFileUsed.dispatch(this);
      }
    }
    return this.data;
  }
  getProject(): Project {
    let parent = this.parent;
    if (parent) {
      while (parent.parent) {
        parent = parent.parent;
      }
      if (parent instanceof Project) {
        return parent;
      }
    }
    return null;
  }
  getDepth(): number {
    let depth = 0;
    let parent = this.parent;
    while (parent) {
      parent = parent.parent;
      depth++;
    }
    return depth;
  }
  getPath(): string {
    const path = [];
    let parent = this.parent;
    if (!parent) {
      return "";
    }
    while (parent.parent) {
      path.unshift(parent.name);
      parent = parent.parent;
    }
    path.push(this.name);
    return path.join("/");
  }
  async save() {
    if (!this.isDirty) {
      return;
    }
    if (this.bufferType !== this.type) {
      if (this.bufferType === FileType.Wast && this.type === FileType.Wasm) {
        try {
          const data = await Service.assembleWast(this.buffer.getValue());
          this.isDirty = false;
          this.data = data;
        } catch (e) {
          alert(e);
        }
      }
    } else {
      this.data = this.buffer.getValue();
      this.isDirty = false;
    }
    this.notifyDidChangeData();
  }
  toString() {
    return "File [" + this.name + "]";
  }
}

export class Directory extends File {
  name: string;
  children: File[] = [];
  isOpen: boolean = true;
  readonly onDidChangeChildren = new EventDispatcher("Directory Changed ");
  constructor(name: string) {
    super(name, FileType.Directory);
  }
  private notifyDidChangeChildren() {
    let directory: Directory = this;
    while (directory) {
      directory.onDidChangeChildren.dispatch();
      directory = directory.parent;
    }
  }
  forEachFile(fn: (file: File) => void, recurse = false) {
    if (recurse) {
      this.children.forEach((file: File) => {
        if (file instanceof Directory) {
          file.forEachFile(fn, recurse);
        }
        fn(file);
      });
    } else {
      this.children.forEach(fn);
    }
  }
  mapEachFile<T>(fn: (file: File) => T): T[] {
    return this.children.map(fn);
  }
  addFile(file: File) {
    assert(file.parent === null);
    this.children.push(file);
    file.parent = this;
    this.notifyDidChangeChildren();
  }
  removeFile(file: File) {
    assert(file.parent === this);
    const i = this.children.indexOf(file);
    assert(i >= 0);
    this.children.splice(i, 1);
    this.notifyDidChangeChildren();
  }
  newDirectory(path: string | string[]): Directory {
    if (typeof path === "string") {
      path = path.split("/");
    }
    let directory: Directory = this;
    while (path.length) {
      const name = path.shift();
      let file = directory.getImmediateChild(name);
      if (file) {
        directory = file as Directory;
      } else {
        file = new Directory(name);
        directory.addFile(file);
        directory = file as Directory;
      }
    }
    assert(directory instanceof Directory);
    return directory;
  }
  newFile(path: string | string[], type: FileType): File {
    if (typeof path === "string") {
      path = path.split("/");
    }
    let directory: Directory = this;
    if (path.length > 1) {
      directory = this.newDirectory(path.slice(0, path.length - 1));
    }
    const name = path[path.length - 1];
    let file = directory.getFile(name);
    if (file) {
      assert(file.type === type);
    } else {
      file = new File(path[path.length - 1], type);
      directory.addFile(file);
    }
    return file;
  }
  getImmediateChild(name: string): File {
    return this.children.find((file: File) => {
      return file.name === name;
    });
  }
  getFile(path: string | string[]): File {
    if (typeof path === "string") {
      path = path.split("/");
    }
    const file = this.getImmediateChild(path[0]);
    if (path.length > 1) {
      if (file && file.type === FileType.Directory) {
        return (file as Directory).getFile(path.slice(1));
      } else {
        return null;
      }
    }
    return file;
  }
  list(): string[] {
    const list: string[] = [];
    function recurse(prefix: string, x: Directory) {
      if (prefix) {
        prefix += "/";
      }
      x.forEachFile(file => {
        const path = prefix + file.name;
        if (file instanceof Directory) {
          recurse(path, file);
        } else {
          list.push(path);
        }
      });
    }
    recurse("", this);
    return list;
  }
  glob(pattern: string): string[] {
    const mm = new Minimatch(pattern);
    return this.list().filter(path => mm.match(path));
  }
  globFiles(pattern: string): File[] {
    return this.glob(pattern).map(path => this.getFile(path));
  }
}

export class Project extends Directory {
  onDidChangeStatus = new EventDispatcher("Status Change");
  onChange = new EventDispatcher("Project Change");
  onDirtyFileUsed = new EventDispatcher("Dirty File Used");

  constructor() {
    super("Project");
  }

  status: string = "";
  setStatus(status: string) {
    this.status = status;
    this.onDidChangeStatus.dispatch();
  }
  clearStatus() {
    this.setStatus("");
  }

  static onRun = new EventDispatcher("Project Run");
  static run() {
    Project.onRun.dispatch();
  }

  static onBuild = new EventDispatcher("Project Build");
  static build() {
    Project.onBuild.dispatch();
  }
}

export interface ILogger {
  logLn(message: string, kind?: string): void;
}
