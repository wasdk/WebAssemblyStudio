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

import { Minimatch } from "minimatch";
import { assert } from "../util";
import { EventDispatcher } from "./EventDispatcher";
import { File } from "./File";
import { FileType } from "./types";

export class Directory extends File {
  name: string;
  children: File[] = [];
  isOpen: boolean = true;
  readonly onDidChangeChildren = new EventDispatcher("Directory Changed ");
  constructor(name: string) {
    super(name, FileType.Directory);
  }

  public static resolve(dir: Directory, path?: string) {
    let name = dir.name;
    let parent = dir.parent;
    while (parent) {
      name = `${parent.name}/${name}`;
      parent = parent.parent;
    }
    return path ? `${name}/${path}` : name;
  }

  notifyDidChangeChildren(file: File) {
    let directory: Directory = this;
    while (directory) {
      directory.onDidChangeChildren.dispatch();
      directory = directory.parent;
    }
  }
  forEachFile(fn: (file: File) => void, excludeTransientFiles = false, recurse = false) {
    if (recurse) {
      this.children.forEach((file: File) => {
        if (excludeTransientFiles && file.isTransient) {
          return false;
        }
        if (file instanceof Directory) {
          file.forEachFile(fn, excludeTransientFiles, recurse);
        } else {
          fn(file);
        }
      });
    } else {
      this.children.forEach(fn);
    }
  }
  mapEachFile<T>(fn: (file: File) => T, excludeTransientFiles = false): T[] {
    return this.children
      .filter((file: File) => {
        if (excludeTransientFiles && file.isTransient) {
          return false;
        }
        return true;
      })
      .map(fn);
  }
  handleNameCollision(name: string, isDirectory?: boolean) {
    for (let i = 1; i <= this.children.length; i++) {
      const nameParts = name.split(".");
      const extension = nameParts.pop();
      let newName;
      if (isDirectory) {
        newName = `${name}${i + 1}`;
      } else {
        newName = `${nameParts.join(".")}.${i + 1}.${extension}`;
      }
      if (!this.getImmediateChild(newName)) {
        return newName;
      }
    }
    throw new Error("Name collision not handled");
  }
  addFile(file: File) {
    assert(file.parent === null);
    if (this.getImmediateChild(file.name)) {
      file.name = this.handleNameCollision(file.name, file instanceof Directory);
    }
    this.children.push(file);
    file.parent = this;
    this.notifyDidChangeChildren(file);
  }
  removeFile(file: File) {
    assert(file.parent === this);
    const i = this.children.indexOf(file);
    assert(i >= 0);
    this.children.splice(i, 1);
    file.parent = null;
    this.notifyDidChangeChildren(file);
  }
  newDirectory(path: string | string[]): Directory {
    let parts: string[];
    if (typeof path === "string") {
      parts = path.split("/");
    } else {
      parts = path;
    }
    let directory: Directory = this;
    let abspath = directory.abspath;
    while (parts.length) {
      const name = parts.shift();
      abspath = `${abspath}/${name}`;
      let file = directory.getImmediateChild(name);
      if (file) {
        directory = file as Directory;
      } else {
        file = new Directory(abspath);
        directory.addFile(file);
        directory = file as Directory;
      }
    }
    assert(directory instanceof Directory);
    return directory;
  }
  newFile(path: string | string[], type: FileType, isTransient = false, handleNameCollision = false): File {
    if (typeof path === "string") {
      path = path.split("/");
    }
    let directory: Directory = this;
    if (path.length > 1) {
      directory = this.newDirectory(path.slice(0, path.length - 1));
    }
    const name = path[path.length - 1];
    let file = directory.getFile(name);
    if (file && !handleNameCollision) {
      assert(file.type === type);
    } else {
      const filename = Directory.resolve(directory, path[path.length - 1]);
      file = new File(filename, type);
      directory.addFile(file);
    }
    file.isTransient = isTransient;
    return file;
  }
  getImmediateChild(name: string): File {
    return this.children.find((file: File) => {
      return file.name === name;
    });
  }
  pathRelateiveParts(path: string | string[]): string[] {
    let parts: string[];
    // normalize the string into an array
    if (typeof path === "string") {
      parts = path.split("/");
    } else {
      parts = path;
    }
    path = [...parts]; // copy list to avoid mutation

    // path was provided with leading slash
    if (parts.length > 1 && parts[0] === "") {
      parts = parts.slice(1); // remove leading slash
      // check if path starts in this directory
      if (path.join("/").startsWith(this.abspath)) {
        // remove the absolute path
        parts = parts.slice(this.abspath.split("/").length - 1);
        if (parts.length === 0) {
          return ["."];
        }
      }
    }
    return parts;
  }
  getFile(path: string | string[]): File {
    path = this.pathRelateiveParts(path);
    const file = this.getImmediateChild(path[0]);
    if (path.length > 1) {
      if (file && file.type === FileType.Directory) {
        return (file as Directory).getFile(path.slice(1));
      } else {
        return null;
      }
    }
    // couldn't find the file because we were searching for ourselves in ourself
    if (!file && path.length === 1 && path[0] === ".") {
      return this;
    }
    return file;
  }
  list(): string[] {
    const list: string[] = [];
    function recurse(prefix: string, x: Directory) {
      if (prefix) {
        prefix += "/";
      }
      x.forEachFile((file) => {
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
    return this.list().filter((path) => mm.match(path));
  }
  globFiles(pattern: string): File[] {
    return this.glob(pattern).map((path) => this.getFile(path));
  }
  hasChildren() {
    return this.children.length > 0;
  }
}
