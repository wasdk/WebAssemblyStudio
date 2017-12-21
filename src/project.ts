import "monaco-editor";

declare var window: any;
export enum FileType {
  JavaScript,
  C,
  Cpp,
  Rust,
  Wasm,
  Directory
}

function languageForFileType(type: FileType): string {
  if (type == FileType.JavaScript) {
    return "javascript";
  } else if (type == FileType.C || type == FileType.Cpp) {
    return "cpp";
  }
  return "";
}

export function getIconForFileType(fileType: FileType): string {
  if (fileType === FileType.JavaScript) {
    return "file_type_js";
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
  private callbacks: Function [] = [];
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
  dispatch() {
    console.log("Dispatching " + this.name);
    this.callbacks.forEach(callback => {
      callback();
    });
  }
}

export class File {
  name: string;
  type: FileType;
  data: string;
  model: monaco.editor.IModel;
  dirty: boolean = false;
  onChange = new EventDispatcher("File Change");
  key = String(Math.random());
  constructor(name: string, type: FileType) {
    this.name = name;
    this.type = type;
    this.data = localStorage.getItem(this.name);
    this.model = monaco.editor.createModel(this.data, languageForFileType(type));
    this.model.onDidChangeContent((e) => {
      let dispatch = !this.dirty;
      this.dirty = true;
      if (dispatch) this.onChange.dispatch();
    });
  }
  save() {
    if (!this.dirty) {
      return;
    }
    this.dirty = false;
    this.data = this.model.getValue();
    this.onChange.dispatch();
    localStorage.setItem(this.name, this.data);
  }
  toString() {
    return "File [" + this.name + "]";
  }
}

export class Directory extends File {
  name: string;
  children: File[] = [];
  isOpen: boolean = true;
  constructor(name: string) {
    super(name, FileType.Directory);
  }
}

export class Project {
  name: string = "untitled";
  root: Directory = new Directory("root");
  onChange = new EventDispatcher("Project Change");

  constructor() {
    this.root.children.push(new File("main.c", FileType.C));
    this.root.children.push(new File("main.js", FileType.JavaScript));

    let src: Directory = new Directory("src");
    src.children.push(new File("main.js", FileType.JavaScript));
    src.children.push(new File("main.js", FileType.JavaScript));

    this.root.children.push(src);
    this.root.children.push(new File("really-long-name.js", FileType.JavaScript));

    this.root.children[0].onChange.register(() => {
      this.onChange.dispatch();
    });
  }
}