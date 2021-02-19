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

import { Wat } from "../languages/wat";
import { Log } from "../languages/log";
import { Rust } from "../languages/rust";
import { Cton } from "../languages/cton";
import { X86 } from "../languages/x86";

export default async function registerLanguages() {

  // Wat

  monaco.languages.onLanguage("wat", () => {
    monaco.languages.setMonarchTokensProvider("wat", Wat.MonarchDefinitions as any);
    monaco.languages.setLanguageConfiguration("wat", Wat.LanguageConfiguration);
    monaco.languages.registerCompletionItemProvider("wat", Wat.CompletionItemProvider);
    monaco.languages.registerHoverProvider("wat", Wat.HoverProvider as any);
  });
  monaco.languages.register({
    id: "wat"
  });

  // Log

  monaco.languages.onLanguage("log", () => {
    monaco.languages.setMonarchTokensProvider("log", Log.MonarchTokensProvider as any);
  });
  monaco.languages.register({
    id: "log"
  });

  // Cretonne

  monaco.languages.onLanguage("cton", () => {
    monaco.languages.setMonarchTokensProvider("cton", Cton.MonarchDefinitions as any);
  });
  monaco.languages.register({
    id: "cton"
  });

  // X86

  monaco.languages.onLanguage("x86", () => {
    monaco.languages.setMonarchTokensProvider("x86", X86.MonarchDefinitions as any);
  });
  monaco.languages.register({
    id: "x86"
  });

  // Rust

  monaco.languages.onLanguage("rust", () => {
    monaco.languages.setMonarchTokensProvider("rust", Rust.MonarchDefinitions as any);
  });
  monaco.languages.register({
    id: "rust"
  });

  let response = await fetch("lib/lib.es6.d.ts");
  monaco.languages.typescript.typescriptDefaults.addExtraLib(await response.text());

  response = await fetch("lib/fiddle.d.ts");
  monaco.languages.typescript.typescriptDefaults.addExtraLib(await response.text());

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({ noLib: true, allowNonTsExtensions: true });
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ noLib: true, allowNonTsExtensions: true });

}
