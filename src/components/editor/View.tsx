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

import { File, FileType } from "../../models";

export enum ViewType {
  Editor,
  Markdown,
  Binary,
  Viz
}

export function defaultViewTypeForFileType(type: FileType) {
  switch (type) {
    case FileType.Markdown:
      return ViewType.Markdown;
    case FileType.DOT:
      return ViewType.Viz;
    default:
      return ViewType.Editor;
  }
}

export function isViewFileDirty(view: View) {
  if (!view || !view.file) {
    return false;
  }
  return view.file.isDirty;
}

export class View {
  public file: File;
  public type: ViewType;
  public state: monaco.editor.ICodeEditorViewState;

  constructor(file: File, type = ViewType.Editor) {
    this.file = file;
    this.type = type;
  }
  clone(): View {
    return new View(this.file, this.type);
  }
}
