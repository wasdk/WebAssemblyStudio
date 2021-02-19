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

import { Project } from "../models";

export class RewriteSourcesContext {
    project: Project;
    processedFiles: any;
    logLn: (s: string) => void;
    createFile: (content: ArrayBuffer|string, type: string) => string;

    constructor(project: Project) {
        this.project = project;
        this.processedFiles = Object.create(null);
    }
}

function expandURL(path: string, base: string): string {
  return new URL(path, "https://example.org/" + base).pathname.substr(1);
}

export function rewriteJS(context: RewriteSourcesContext, jsFileName: string): string {
  const file = context.project.getFile(jsFileName);
  if (!file) {
    return null;
  }
  const src = file.getData() as string;
  return src.replace(/\bfrom\s+['"](.+?)['"](\s*[;\n])/g, (all: string, path?: string, sep?: string) => {
    const fullPath = expandURL(path, jsFileName);
    const blobUrl = processJSFile(context, fullPath);
    if (!blobUrl) {
      (void 0, context.logLn)(`Cannot find file '${path}' mentioned in ${jsFileName}`);
      return all;
    }
    return `from "${blobUrl}"${sep}`;
  });
}

export function processJSFile(context: RewriteSourcesContext, fullPath: string): string {
  if (context.processedFiles[fullPath]) {
    return context.processedFiles[fullPath];
  }
  const src = rewriteJS(context, fullPath);
  const resultUrl = context.createFile(src, "application/javascript");
  context.processedFiles[fullPath] = resultUrl;
  return resultUrl;
}

export function rewriteHTML(context: RewriteSourcesContext, htmlFileName: string): string {
  const file = context.project.getFile(htmlFileName);
  if (!file) {
    return null;
  }
  const src = file.getData() as string;
  return src.replace(/\bsrc\s*=\s*['"](.+?)['"]/g, (all: string, path?: string) => {
    const fullPath = expandURL(path, htmlFileName);
    const blobUrl = processJSFile(context, fullPath);
    if (!blobUrl) {
      (void 0, context.logLn)(`Cannot find file '${path}' mentioned in ${htmlFileName}`);
      return all;
    }
    return `src="${blobUrl}"`;
  });
}
