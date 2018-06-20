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

import { File, Project, Directory } from "../models";
import * as JSZip from "jszip";

export async function downloadProject(project: Project, uri?: string) {
  const zipFile: JSZip = new JSZip();
  let zipName: string = "wasm-project.zip";
  if (uri !== undefined) {
    zipName = `wasm-project-${uri}.zip`;
  }
  const queue: Array<{filePrefix: string; file: File}> = [];
  project.mapEachFile((f: File) => queue.push({filePrefix: "", file: f}));
  while (queue.length > 0) {
    const {filePrefix, file} = queue.shift();
    const fileName = filePrefix + file.name;
    if (file instanceof Directory) {
      file.mapEachFile(f => queue.push({filePrefix: fileName + "/", file: f}));
      zipFile.folder(fileName);
      continue;
    }
    zipFile.file(fileName, file.data);
  }
  await zipFile.generateAsync({type: "blob", mimeType: "application/zip"}).then((blob: Blob) => {
    // Creating <a> to programmatically click for downloading zip via blob's URL
    const link = document.createElement("a");
    link.download = zipName;
    link.href = URL.createObjectURL(blob);
    // A fix for making link clickable in Firefox
    // Explicity adding link to DOM for Firefox
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
