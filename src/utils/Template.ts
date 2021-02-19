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

import { File, FileType, Problem, Directory } from "../models";

export class Template {
  readonly label: HTMLAnchorElement;
  readonly description: HTMLSpanElement;
  readonly monacoIconLabel: HTMLDivElement;
  constructor(container: HTMLElement) {
    this.monacoIconLabel = document.createElement("div");
    this.monacoIconLabel.className = "monaco-icon-label";
    this.monacoIconLabel.style.display = "flex";
    container.appendChild(this.monacoIconLabel);

    const labelDescriptionContainer = document.createElement("div");
    labelDescriptionContainer.className = "monaco-icon-label-description-container";
    this.monacoIconLabel.appendChild(labelDescriptionContainer);

    this.label = document.createElement("a");
    this.label.className = "label-name";
    labelDescriptionContainer.appendChild(this.label);

    this.description = document.createElement("span");
    this.description.className = "label-description";
    labelDescriptionContainer.appendChild(this.description);
  }
}

export class ProblemTemplate extends Template {
  constructor(container: HTMLElement) {
    super(container);
  }
  dispose() {
    // TODO
  }
  set(problem: Problem) {
    this.label.classList.toggle(problem.severity + "-dark", true);
    const marker = problem.marker;
    const position = `(${marker.startLineNumber}, ${marker.startColumn})`;
    this.label.innerHTML = marker.message;
    this.description.innerHTML = position;
  }
}

export class FileTemplate extends Template {
  constructor(container: HTMLElement) {
    super(container);
  }
  dispose() {
    // TODO dispose resources?
  }
  set(file: File) {
    let icon = "";
    switch (file.type) {
      case FileType.C: icon = "c-lang-file-icon"; break;
      case FileType.Cpp: icon = "cpp-lang-file-icon"; break;
      case FileType.JavaScript: icon = "javascript-lang-file-icon"; break;
      case FileType.HTML: icon = "html-lang-file-icon"; break;
      case FileType.TypeScript: icon = "typescript-lang-file-icon"; break;
      case FileType.Markdown: icon = "markdown-lang-file-icon"; break;
      case FileType.JSON: icon = "json-lang-file-icon"; break;
      case FileType.Wasm: icon = "wasm-lang-file-icon"; break;
      case FileType.Wat: icon = "wat-lang-file-icon"; break;
    }
    if (file instanceof Directory) {
      this.monacoIconLabel.classList.remove("file-icon");
      this.monacoIconLabel.classList.add("folder-icon");
    } else {
      this.monacoIconLabel.classList.add("file-icon");
    }
    if (icon) {
      this.monacoIconLabel.classList.add(icon);
    }
    this.label.innerHTML = file.name;
    this.monacoIconLabel.classList.toggle("dirty", file.isDirty);
    this.monacoIconLabel.classList.toggle("transient", file.isTransient);
    let title = "";
    if (file.isDirty && file.isTransient) {
      title =  "File has been modified and is transient.";
    } else if (file.isDirty && !file.isTransient) {
      title =  "File has been modified.";
    } else if (!file.isDirty && file.isTransient) {
      title =  "File is transient.";
    }
    this.monacoIconLabel.title = title;
  }
}
