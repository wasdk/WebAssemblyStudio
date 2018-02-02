import "monaco-editor";
import { assert } from "./index";
import "minimatch"
import { Minimatch } from "minimatch";
import { Service } from "./service";

declare var window: any;

export function shallowCompare(a: any[], b: any[]) {
  if (a === b) return true;
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
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
  Cretonne = "cretonne"
}

export function languageForFileType(type: FileType): string {
  if (type == FileType.HTML) {
    return "html";
  } else if (type == FileType.CSS) {
    return "css";
  } else if (type == FileType.JavaScript) {
    return "javascript";
  } else if (type == FileType.TypeScript) {
    return "typescript";
  } else if (type == FileType.C || type == FileType.Cpp) {
    return "cpp";
  } else if (type == FileType.Wast || type == FileType.Wasm) {
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
  if (type == FileType.HTML) {
    return "HTML";
  } else if (type == FileType.CSS) {
    return "CSS";
  } else if (type == FileType.JavaScript) {
    return "JavaScript";
  } else if (type == FileType.TypeScript) {
    return "TypeScript";
  } else if (type == FileType.C) {
    return "C";
  } else if (type == FileType.Cpp) {
    return "C++";
  } else if (type == FileType.Wast) {
    return "Wast";
  } else if (type == FileType.Wasm) {
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
  if (type == FileType.HTML) {
    return "html";
  } else if (type == FileType.CSS) {
    return "css";
  } else if (type == FileType.JavaScript) {
    return "js";
  } else if (type == FileType.TypeScript) {
    return "ts";
  } else if (type == FileType.C) {
    return "c";
  } else if (type == FileType.Cpp) {
    return "cpp";
  } else if (type == FileType.Wast) {
    return "wast";
  } else if (type == FileType.Wasm) {
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

export function mimeTypeForFileType(type: FileType): string {
  if (type == FileType.HTML) {
    return "text/html";
  } else if (type == FileType.JavaScript) {
    return "application/javascript";
  } else if (type == FileType.Wasm) {
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
    let i = this.callbacks.indexOf(callback);
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
  isDirty: boolean = false;
  isBufferReadOnly: boolean = false;
  readonly onDidChangeData = new EventDispatcher("File Data Change");
  readonly onDidChangeBuffer = new EventDispatcher("File Buffer Change");
  readonly onDidChangeProblems = new EventDispatcher("File Problems Change");
  readonly key = String(getNextKey());
  readonly buffer?: monaco.editor.IModel;
  description: string;
  problems: Problem[] = [];
  constructor(name: string, type: FileType) {
    this.name = name;
    this.type = type;
    this.data = null; // localStorage.getItem(this.name);
    this.buffer = monaco.editor.createModel(this.data as any, languageForFileType(type));
    this.buffer.updateOptions({ tabSize: 2, insertSpaces: true });
    this.buffer.onDidChangeContent((e) => {
      let dispatch = !this.isDirty;
      this.isDirty = true;
      if (dispatch) {
        let file: File = this;
        while (file) {
          file.onDidChangeBuffer.dispatch();
          file = file.parent;
        }
      }
      monaco.editor.setModelMarkers(this.buffer, "compiler", []);
    });
    this.isBufferReadOnly = type === FileType.Wasm;
    if (this.isBufferReadOnly) {
      this.description = "Read Only";
    }
    this.parent = null;
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
    let model = this.buffer;
    if (this.type !== FileType.TypeScript) {
      return Promise.resolve("");
    }
    const worker = await monaco.languages.typescript.getTypeScriptWorker();
    const client = await worker(model.uri);
    return client.getEmitOutput(model.uri.toString());
  }
  setData(data: string | ArrayBuffer, setBuffer = true) {
    this.data = data;
    let file: File = this;
    if (typeof data === "string") {
      if (setBuffer) {
        this.buffer.setValue(data);
      }
      this.isDirty = false;
    }
    while (file) {
      file.onDidChangeData.dispatch();
      file = file.parent;
    }
  }
  getData(): string | ArrayBuffer {
    if (this.isDirty && !this.isBufferReadOnly) {
      let project = this.getProject();
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
    let path = [];
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
  save() {
    if (!this.isDirty) {
      return;
    }
    this.isDirty = false;
    this.setData(this.buffer.getValue(), false);
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
  //     function go(directory: Directory) {
//       directory.forEachFile((file) => {
//         if (file instanceof Directory) {
//           go(file);
//         } else {
//           // let depth = file.getDepth();
//           if (file.problems.length) {
//             treeViewItems.push(<TreeViewItem depth={0} icon={getIconForFileType(file.type)} label={file.name}></TreeViewItem>);
//             file.problems.forEach((problem) => {
//               treeViewItems.push(<TreeViewProblemItem depth={1} problem={problem} />);
//             });
//           }
//         }
//       });
//     }
//     go(this.props.project);
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
    let i = this.children.indexOf(file);
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
      let name = path.shift();
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
    let name = path[path.length - 1];
    let file = directory.getFile(name);
    if (file) {
      assert(file.type == type);
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
    let file = this.getImmediateChild(path[0]);
    if (path.length > 1) {
      if (file && file.type == FileType.Directory) {
        return (file as Directory).getFile(path.slice(1));
      } else {
        return null;
      }
    }
    return file;
  }
  list(): string[] {
    let list: string[] = [];
    function recurse(prefix: string, x: Directory) {
      if (prefix) {
        prefix += "/";
      }
      x.forEachFile(file => {
        const path = prefix + file.name;
        if (file instanceof Directory) {
          recurse(path, file);
        } else {
          list.push(path)
        }
      });
    }
    recurse("", this);
    return list;
  }
  glob(pattern: string): string[] {
    let mm = new Minimatch(pattern);
    return this.list().filter(path => mm.match(path));
  }
  globFiles(pattern: string): File[] {
    return this.glob(pattern).map(path => this.getFile(path));
  }
}

export class Project extends Directory {
  onChange = new EventDispatcher("Project Change");
  onDirtyFileUsed = new EventDispatcher("Dirty File Used");

  constructor() {
    super("Project");
  }

  static onRun = new EventDispatcher("Project Run");
  static run() {
    Project.onRun.dispatch();
  }

  static onBuild = new EventDispatcher("Project Build");
  static build() {
    Project.onBuild.dispatch();
  }

  // saveProject(openedFiles: string [][], uri: string) {
  //   Service.saveProject(this, openedFiles, uri);
  // }

  // forkProject() {
  //   Service.saveProject(this, []);
  // }
}

export interface ILogger {
  logLn(message: string, kind?: string): void;
}