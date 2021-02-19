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
  Toml = "toml",
  Text = "text"
}

export interface InputFile {
  content: string | ArrayBuffer;
  options?: any;
}

export interface ServiceInput {
  files: { [name: string]: InputFile; };
  options?: any;
}

export interface OutputItem {
  content?: string | ArrayBuffer;
  fileRef?: string;
  console?: string;
}

export interface ServiceOutput {
  success: boolean;
  items: { [name: string]: OutputItem; };
  console?: string;
}

export interface CompilerService {
  compile(input: ServiceInput): Promise<ServiceOutput>;
}
