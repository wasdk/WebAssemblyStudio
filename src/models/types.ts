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

import { logKind } from "../actions/AppActions";
import { Project } from "./Project";

export enum FileType {
  JavaScript = "javascript",
  TypeScript = "typescript",
  HTML       = "html",
  CSS        = "css",
  C          = "c",
  Cpp        = "cpp",
  Rust       = "rust",
  Wat        = "wat",
  Wasm       = "wasm",
  Directory  = "directory",
  Log        = "log",
  x86        = "x86",
  Markdown   = "markdown",
  Cretonne   = "cretonne",
  JSON       = "json",
  DOT        = "dot",
  TOML       = "toml",
  Unknown    = "unknown"
}

export interface SandboxRun {
  project: Project;
  src: string;
}

export interface IStatusProvider {
  push(status: string): void;
  pop(): void;
  logLn(message: string, kind?: logKind): void;
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
  } else if (type === FileType.Rust) {
    return "rust";
  } else if (type === FileType.Wat || type === FileType.Wasm) {
    return "wat";
  } else if (type === FileType.Log) {
    return "log";
  } else if (type === FileType.x86) {
    return "x86";
  } else if (type === FileType.Markdown) {
    return "markdown";
  } else if (type === FileType.Cretonne) {
    return "cton";
  } else if (type === FileType.JSON) {
    return "json";
  } else if (type === FileType.DOT) {
    return "dot";
  } else if (type === FileType.TOML) {
    return "toml";
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
  } else if (type === FileType.Wat) {
    return "WebAssembly Text";
  } else if (type === FileType.Wasm) {
    return "WebAssembly";
  } else if (type === FileType.Markdown) {
    return "Markdown";
  } else if (type === FileType.Rust) {
    return "Rust";
  } else if (type === FileType.Cretonne) {
    return "Cretonne";
  } else if (type === FileType.JSON) {
    return "JSON";
  } else if (type === FileType.DOT) {
    return "DOT";
  } else if (type === FileType.TOML) {
    return "TOML";
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
  } else if (type === FileType.Wat) {
    return "wat";
  } else if (type === FileType.Wasm) {
    return "wasm";
  } else if (type === FileType.Markdown) {
    return "md";
  } else if (type === FileType.Rust) {
    return "rs";
  } else if (type === FileType.Cretonne) {
    return "cton";
  } else if (type === FileType.JSON) {
    return "json";
  } else if (type === FileType.DOT) {
    return "dot";
  } else if (type === FileType.TOML) {
    return "toml";
  }
  return "";
}

export function fileTypeFromFileName(name: string): FileType {
  return fileTypeForExtension(name.split(".").pop());
}

export function fileTypeForExtension(extension: string): FileType {
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
  } else if (extension === "wat") {
    return FileType.Wat;
  } else if (extension === "wasm") {
     return FileType.Wasm;
  } else if (extension === "md") {
    return FileType.Markdown;
  } else if (extension === "rs") {
    return FileType.Rust;
  } else if (extension === "cton") {
    return FileType.Cretonne;
  } else if (extension === "json" || extension === "map") {
    return FileType.JSON;
  } else if (extension === "dot") {
    return FileType.DOT;
  } else if (extension === "toml") {
    return FileType.TOML;
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
  } else if (type === FileType.JSON) {
    return "application/json";
  } else if (type === FileType.DOT) {
    return "text/plain";
  } else if (type === FileType.Markdown) {
    return "text/markdown";
  }
  return "";
}

export function fileTypeForMimeType(type: string): FileType {
  if (type === "text/html") {
    return FileType.HTML;
  } else if (type === "application/javascript") {
    return FileType.JavaScript;
  } else if (type === "application/wasm") {
    return FileType.Wasm;
  } else if (type === "text/markdown") {
    return FileType.Markdown;
  } else if (type === "application/json") {
    return FileType.JSON;
  }
  return FileType.Unknown;
}

export function getIconForFileType(fileType: FileType): string {
  if (fileType === FileType.JavaScript) {
    return "javascript-lang-file-icon";
  } else if (fileType === FileType.TypeScript) {
    return "typescript-lang-file-icon";
  } else if (fileType === FileType.C) {
    return "c-lang-file-icon";
  } else if (fileType === FileType.Cpp) {
    return "cpp-lang-file-icon";
  } else if (fileType === FileType.Rust) {
    return "rust-lang-file-icon";
  } else if (fileType === FileType.Markdown) {
    return "markdown-lang-file-icon";
  } else if (fileType === FileType.HTML) {
    return "html-lang-file-icon";
  } else if (fileType === FileType.CSS) {
    return "css-lang-file-icon";
  } else if (fileType === FileType.Directory) {
    return "folder-icon";
  } else if (fileType === FileType.JSON) {
    return "json-lang-file-icon";
  } else if (fileType === FileType.Wasm) {
    return "wasm-lang-file-icon";
  } else if (fileType === FileType.Wat) {
    return "wat-lang-file-icon";
  }
  return "txt-ext-file-icon";
}
