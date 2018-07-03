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
import { CompilerService, ServiceInput, ServiceOutput, Language } from "./types";
import { sendRequestJSON, ServiceTypes } from "./sendRequest";
import { decodeBinary } from "./utils";

export class ClangService implements CompilerService {
  private lang: Language;

  constructor(lang: Language) {
    this.lang = lang;
  }

  async compile(input: ServiceInput): Promise<ServiceOutput> {
    const files = Object.values(input.files);
    if (files.length !== 1) {
      throw new Error(`Supporting compilation of a single file, but ${files.length} file(s) found`);
    }
    const [ fileRef ] = Object.keys(input.files);
    const src = files[0].content;
    const from = this.lang;
    const project = {
      output: "wasm",
      compress: true,
      files: [
        {
          type: from,
          name: "file." + from,
          options: input.options,
          src
        }
      ]
    };
    const result = await sendRequestJSON(project, ServiceTypes.Clang);
    const items: any = {};
    let content;
    if (result.success) {
      content = await decodeBinary(result.output);
    }
    let console;
    if (result.tasks && result.tasks.length > 0) {
      console = result.tasks[0].console;
    }
    return {
      success: result.success,
      items: {
        "a.wasm": { content, fileRef, console, },
      },
      console: result.message
    };
  }
}
