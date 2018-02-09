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

import { assert } from "../index";
import { File } from "../model";

export default class Group {
  file: File;
  files: File[];
  preview: File;
  constructor(file: File, preview: File, files: File[]) {
    this.file = file;
    this.preview = preview;
    this.files = files;
  }
  open(file: File, shouldPreview: boolean = true) {
    const files = this.files;
    const index = files.indexOf(file);
    if (index >= 0) {
      // Switch to file if it's already open.
      this.file = file;
      if (!shouldPreview) {
        this.preview = null;
      }
      return;
    }
    if (shouldPreview) {
      if (this.preview) {
        // Replace preview file if there is one.
        const previewIndex = files.indexOf(this.preview);
        assert(previewIndex >= 0);
        this.file = this.preview = files[previewIndex] = file;
      } else {
        files.push(file);
        this.file = this.preview = file;
      }
    } else {
      files.push(file);
      this.file = file;
      this.preview = null;
    }
  }
  close(file: File) {
    const i = this.files.indexOf(file);
    assert(i >= 0);
    if (file === this.preview) {
      this.preview = null;
    }
    this.files.splice(i, 1);
    this.file = this.files.length ? this.files[Math.min(this.files.length - 1, i)] : null;
  }
}
