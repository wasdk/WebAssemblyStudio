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
import { EventDispatcher } from "./EventDispatcher";
import { Directory } from "./Directory";

export class Project extends Directory {
  onDidChangeStatus = new EventDispatcher("Status Change");
  onChange = new EventDispatcher("Project Change");
  onDirtyFileUsed = new EventDispatcher("Dirty File Used");

  constructor() {
    super("Project");
  }

  private status: string [] = ["Idle"];
  hasStatus() {
    return this.status.length > 1;
  }
  getStatus() {
    if (this.hasStatus()) {
      return this.status[this.status.length - 1];
    }
    return "";
  }
  pushStatus(status: string) {
    this.status.push(status);
    this.onDidChangeStatus.dispatch();
  }
  popStatus() {
    assert(this.status.length);
    this.status.pop();
    this.onDidChangeStatus.dispatch();
  }
}
