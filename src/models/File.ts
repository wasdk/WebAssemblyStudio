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

import { assert, getNextKey } from "../util";
import { Service } from "../service";
import { FileType, IStatusProvider, isBinaryFileType, languageForFileType } from "./types";
import { Directory } from "./Directory";
import { EventDispatcher } from "./EventDispatcher";
import { Problem } from "./Problem";
import { Project } from "./Project";

export class File {
  name: string;
  type: FileType;
  data: string | ArrayBuffer;
  parent: Directory;
  onClose?: Function;
  /**
   * True if the buffer is out of sync with the data.
   */
  isDirty: boolean = false;
  isBufferReadOnly: boolean = false;
  /**
   * True if the file is temporary. Transient files are usually not serialized to a
   * backing store.
   */
  isTransient = false;
  readonly onDidChangeData = new EventDispatcher("File Data Change");
  readonly onDidChangeBuffer = new EventDispatcher("File Buffer Change");
  readonly onDidChangeProblems = new EventDispatcher("File Problems Change");
  readonly onDidChangeDirty = new EventDispatcher("File Dirty Flag Change");
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
      if (!this.isDirty) {
        this.isDirty = true;
        this.notifyDidChangeDirty();
      }
      this.notifyDidChangeBuffer();
      monaco.editor.setModelMarkers(this.buffer, "compiler", []);
    });
    this.parent = null;
  }
  setNameAndDescription(name: string, description: string) {
    this.name = name;
    this.description = description;
    if (this.parent) {
      this.parent.notifyDidChangeChildren(this);
    }
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
  notifyDidChangeDirty() {
    let file: File = this;
    while (file) {
      file.onDidChangeDirty.dispatch();
      file = file.parent;
    }
  }
  private resetDirty() {
    if (this.isDirty) {
      this.isDirty = false;
      this.notifyDidChangeDirty();
    }
  }
  private async updateBuffer(status?: IStatusProvider) {
    if (this.type === FileType.Wasm) {
      const result = await Service.disassembleWasm(this.data as ArrayBuffer, status);
      this.buffer.setValue(result);
      this.resetDirty();
      this.bufferType = FileType.Wat;
      this.notifyDidChangeBuffer();
      monaco.editor.setModelLanguage(this.buffer, languageForFileType(FileType.Wat));
      this.description = "This .wasm file is editable as a .wat file, and is automatically reassembled to .wasm when saved.";
      return;
    } else {
      this.buffer.setValue(this.data as string);
      this.resetDirty();
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
  setData(data: string | ArrayBuffer, status?: IStatusProvider) {
    assert(data != null);
    this.data = data;
    this.notifyDidChangeData();
    this.updateBuffer(status);
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
  /**
   * Gets the path up to the base, if specified.
   */
  getPath(base: Directory = null): string {
    const path = [];
    let parent = this.parent;
    while (parent && parent !== base) {
      path.unshift(parent.name);
      parent = parent.parent;
    }
    path.push(this.name);
    return path.join("/");
  }
  async save(status: IStatusProvider) {
    if (!this.isDirty) {
      return;
    }
    if (this.bufferType !== this.type) {
      if (this.bufferType === FileType.Wat && this.type === FileType.Wasm) {
        try {
          const data = await Service.assembleWat(this.buffer.getValue(), status);
          this.resetDirty();
          this.data = data;
        } catch (e) {
          status.logLn(e.message, "error");
        }
      }
    } else {
      this.data = this.buffer.getValue();
      this.resetDirty();
    }
    this.notifyDidChangeData();
  }
  toString() {
    return "File [" + this.name + "]";
  }
  isDescendantOf(element: File): boolean {
    let parent = this.parent;
    while (parent) {
      if (parent === element) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }
}
