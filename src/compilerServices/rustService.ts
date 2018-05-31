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

export class RustService implements CompilerService {
  async compile(input: ServiceInput): Promise<ServiceOutput> {
    const files = Object.values(input.files);
    if (files.length !== 1) {
      throw new Error(`Supporting compilation of a single file, but ${files.length} file(s) found`);
    }
    const [ fileRef ] = Object.keys(input.files);
    const code = files[0].content;
    const options = input.options;
    const result = await sendRequestJSON({ code, options, }, ServiceTypes.Rustc);
    const items: any = {};
    let content;
    if (result.success) {
      content = await decodeBinary(result.output);
    }
    let console;
    if (result.tasks && result.tasks.length > 0) {
      console = result.tasks[0].console;
    }
    const extraItems: any = {};
    if (result.wasmBindgenJs) {
      extraItems["wasm_bindgen.js"] = {
        content: result.wasmBindgenJs,
      };
    }
    return {
      success: result.success,
      items: {
        "a.wasm": { content, fileRef, console, },
        ...extraItems
      },
      console: (result as any).message
    };
  }
}
