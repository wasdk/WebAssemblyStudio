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
import { Project, mimeTypeForFileType, SandboxRun } from "../models";
import { logLn } from "../actions/AppActions";
import appStore from "../stores/AppStore";

interface SandboxWindow extends Window {
  /**
   * Creates an object URL to a Blob containing the file's data.
   */
  getFileURL(path: string): string;
}

export class Sandbox extends React.Component<{}, {}>  {
  container: HTMLDivElement;
  private setContainer(container: HTMLDivElement) {
    if (container == null) { return; }
    this.container = container;
  }
  onResizeBegin = () => {
    this.container.style.pointerEvents = "none";
  }
  onResizeEnd = () => {
    this.container.style.pointerEvents = "auto";
  }
  onSandboxRun = (e: SandboxRun) => {
    this.run(e.project, e.src);
  }
  componentDidMount() {
    Split.onResizeBegin.register(this.onResizeBegin);
    Split.onResizeEnd.register(this.onResizeEnd);
    appStore.onSandboxRun.register(this.onSandboxRun);
  }
  componentWillUnmount() {
    Split.onResizeBegin.unregister(this.onResizeBegin);
    Split.onResizeEnd.unregister(this.onResizeEnd);
    appStore.onSandboxRun.unregister(this.onSandboxRun);
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
    const logger = { logLn, };
    // Hijack Console
    contentWindow.console.log = (log => function() {
      logger.logLn(Array.prototype.join.call(arguments));
      log.apply(contentWindow.console, arguments);
    })(contentWindow.console.log);
    contentWindow.console.info = (info => function() {
      logger.logLn(Array.prototype.join.call(arguments), "info");
      info.apply(contentWindow.console, arguments);
    })(contentWindow.console.info);
    contentWindow.console.warn = (warn => function() {
      logger.logLn(Array.prototype.join.call(arguments), "warn");
      warn.apply(contentWindow.console, arguments);
    })(contentWindow.console.warn);
    contentWindow.console.error = (error => function() {
      logger.logLn(Array.prototype.join.call(arguments), "error");
      error.apply(contentWindow.console, arguments);
    })(contentWindow.console.error);
    // Hijack fetch
    contentWindow.fetch = (input: string, init?: RequestInit) => {
      const url = new URL(input, "http://example.org/src/main.html");
      const file = project.getFile(url.pathname.substr(1));
      if (file) {
        return Promise.resolve(
          new Response(file.getData(), {
            status: 200,
            statusText: "OK",
            headers: {
              "Content-Type": mimeTypeForFileType(file.type)
            }
          })
        );
      }
      return fetch(input, init);
    };
    contentWindow.getFileURL = (path: string) => {
      const file = project.getFile(path);
      if (!file) {
        logger.logLn(`Cannot find file ${path}`, "error");
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
