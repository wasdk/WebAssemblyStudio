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
import { CompilerService, Language } from "./types";
import { RustService } from "./rustService";
import { ClangService } from "./clangService";
import { X86Service } from "./x86Service";

export {
  ServiceInput,
  ServiceOutput,
  CompilerService,
  InputFile,
  OutputItem,
  Language,
} from "./types";

export async function createCompilerService(from: Language, to: Language): Promise<CompilerService> {
  if (from === Language.Rust && to === Language.Wasm) {
    return new RustService();
  }
  if ((from === Language.C || from === Language.Cpp) && to === Language.Wasm) {
    return new ClangService(from);
  }
  if (from === Language.Wasm && to === Language.x86) {
    return new X86Service();
  }
  throw new Error(`createCompilerService: not supported ${from}->${to}`);
}
