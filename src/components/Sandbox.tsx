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

import * as React from "react";
import { Split } from "./Split";
import { Project, mimeTypeForFileType, ILogger } from "../model";

interface SandboxWindow extends Window {
  /**
   * Creates an object URL to a Blob containing the file's data.
   */
  getFileURL(path: string): string;
}

export class Sandbox extends React.Component<{
  logger: ILogger
}, {}> {
  container: HTMLDivElement;
  private setContainer(container: HTMLDivElement) {
    if (container == null) { return; }
    if (this.container !== container) {
      // ...
    }
    this.container = container;
  }
  onResizeBegin = () => {
    this.container.style.pointerEvents = "none";
  }
  onResizeEnd = () => {
    this.container.style.pointerEvents = "auto";
  }
  componentDidMount() {
    Split.onResizeBegin.register(this.onResizeBegin);
    Split.onResizeEnd.register(this.onResizeEnd);
  }
  componentWillUnmount() {
    Split.onResizeBegin.unregister(this.onResizeBegin);
    Split.onResizeEnd.unregister(this.onResizeEnd);
  }
  run(project: Project, src: string) {
    const iframe = document.createElement("iframe");
    iframe.className = "sandbox";
    iframe.src = URL.createObjectURL(new Blob([src], { type: "text/html" }));
    if (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(iframe);
    const contentWindow = iframe.contentWindow as SandboxWindow;
    const logger = this.props.logger;
    // Hijack Console
    const log = contentWindow.console.log;
    contentWindow.console.log = function(message: any) {
      logger.logLn(message);
      log.apply(contentWindow.console, arguments);
    };
    contentWindow.getFileURL = (path: string) => {
      const file = project.getFile(path);
      if (!file) {
        this.props.logger.logLn(`Cannot find file ${path}`, "error");
        return;
      }
      const blob = new Blob([file.getData()], { type: mimeTypeForFileType(file.type) });
      return window.URL.createObjectURL(blob);
    };
    const ready = new Promise((resolve: (window: Window) => any) => {
      (iframe as any).onready = () => {
        resolve(contentWindow);
      };
    });
  }
  render() {
    return <div
      className="fill"
      ref={(ref) => this.setContainer(ref)}
    />;
  }
}
