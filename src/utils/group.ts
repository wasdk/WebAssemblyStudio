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

import { assert } from "../util";
import { View, ViewType } from "../components/editor/View";
import { File } from "../models";

export default class Group {
  currentView: View;
  views: View[];
  preview: View;

  constructor(view: View, views: View[] = []) {
    this.currentView = view;
    this.views = views;
  }
  open(view: View, shouldPreview = true) {
    const views = this.views;
    const index = views.indexOf(view);

    if (index >= 0) {
      // Switch to the view if it's already open.
      this.currentView = view;
      if (!shouldPreview && this.preview === view) {
        this.preview = null;
      }
      return;
    }
    if (shouldPreview) {
      if (this.preview) {
        // Replace preview file if there is one.
        const previewIndex = views.indexOf(this.preview);
        assert(previewIndex >= 0);
        this.currentView = this.preview = views[previewIndex] = view;
      } else {
        views.push(view);
        this.currentView = this.preview = view;
      }
    } else {
      views.push(view);
      this.currentView = view;
      this.preview = null;
    }
  }
  openFile(file: File, type: ViewType = ViewType.Editor, preview = true) {
    const index =  this.views.findIndex(view => view.file === file && view.type === type);
    const view = (index >= 0) ? this.views[index] : new View(file, type);
    this.open(view, preview);
  }

  close(view: View) {
    const i = this.views.indexOf(view);
    if (i < 0) {
      return ;
    }

    this.views.splice(i, 1);
    // if (this.currentView.onClose) {
    //   this.currentView.onClose();
    // }

    const numViews = this.views.length;
    this.currentView = numViews ? this.views[Math.min(numViews - 1, i)] : null;

    if (view === this.preview) {
      this.preview = null;
    }
  }
}
