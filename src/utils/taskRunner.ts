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

import { Project, fileTypeForExtension, mimeTypeForFileType } from "../models";
import { Gulpy } from "../gulpy";
import { Service } from "../service";
import { Arc } from "../arc";

export enum RunTaskExternals {
  Default,
  Arc,
  Setup,
}

function unsafeEval(code: string, params: any) {
  const paramKeys = Object.keys(params);
  const paramValues = Object.values(params);
  const fn = Function.apply(null, [...paramKeys, code]);
  return fn.apply(window, paramValues);
}

function contextify(
  src: string,
  sandboxGlobal: any = window,
  thisArg: any = window,
  context: { [key: string]: any } = {},
  modules: { [key: string]: any } = {}
): () => any {
  // Build a require wrapper that looks for provided modules first and falls
  // back to calling the environment's require otherwise, which supports both
  // synchronous (CommonJS-style) and asynchronous (AMD-style) arguments.
  function require(name: string | string[], factory?: any): any {
    if (typeof name === "string") {
      if (modules.hasOwnProperty(name)) {
        return modules[name];
      }
      return (window as any).require(name);
    }
    return (window as any).require(name, factory);
  }
  Object.defineProperty(require, "config", {
    value: (window as any).require.config
  });

  // Use provided contextual keys as parameters and wrap the source in an IIFE
  // so redefining variables using parameter names is allowed...
  const contextParameters = Object.keys(context)
    .concat("require", "exports", "return ()=>{" + src + "}");
  // ...and use provided contextual values as arguments.
  const contextArguments = Object.values(context)
    .concat(require, {});

  const global = sandboxGlobal || window;
  // Call the function constructor with our variable parameters and arguments.
  return global.Function.apply(null, contextParameters)
    .apply(thisArg, contextArguments);
}

async function createSandboxIFrame(): Promise<Window> {
  const src = `<!DOCTYPE html>
<html><body>
<script>window.parent.postMessage({type: "taskRunner-sandbox-ready"}, "*");</script>
</body></html>`;
  const iframe = document.createElement("iframe") as HTMLIFrameElement;
  // Chrome needs width and height attributes set for iframe.
  iframe.setAttribute("width", "1");
  iframe.setAttribute("height", "1");
  iframe.setAttribute("src", URL.createObjectURL(new Blob([src], { type: "text/html" })));
  const container = document.getElementById("task-runner-content");
  container.textContent = "";
  container.appendChild(iframe);
  return new Promise((resolve: (thisArg: Window) => void) => {
    iframeReady.set(iframe, resolve);
  });
}

const iframeReady: WeakMap<HTMLIFrameElement, (thisArg: Window) => void> = new WeakMap();

window.addEventListener("message", (e) => {
  if (typeof e.data !== "object" || !e.data || e.data.type !== "taskRunner-sandbox-ready") {
    return;
  }
  const contentWindow = e.source;
  const iframe = contentWindow.frameElement as HTMLIFrameElement;
  iframeReady.get(iframe)(contentWindow);

  const originalFetch = window.fetch;
  contentWindow.fetch = (input: string, init?: RequestInit) => {
    let file = null;
    if (currentRunnerInfo && currentRunnerInfo.global === contentWindow) {
      const url = new URL(input, "https://example.org/src/main.html");
      file = currentRunnerInfo.project.getFile(url.pathname.substr(1));
    }
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
    return originalFetch(input, init);
  };
});

export interface RunnerInfo {
  global: any;
  project: Project;
}

let currentRunnerInfo: RunnerInfo = null;

function clearCurrentRunnerInfoAndIframe() {
  currentRunnerInfo = null;
  const container = document.getElementById("task-runner-content");
  container.textContent = "";
}

export function getCurrentRunnerInfo(): RunnerInfo {
  return currentRunnerInfo;
}

export async function runTask(
  src: string,
  name: string,
  optional: boolean,
  project: Project,
  logLn: (...args: any[]) => void,
  externals: RunTaskExternals
) {
  const currentRunnerGlobal = await createSandboxIFrame();
  currentRunnerInfo = {
    global: currentRunnerGlobal,
    project,
  };
  // Runs the provided source in our fantasy gulp context
  const gulp = new Gulpy();
  contextify(src,
    currentRunnerGlobal,
    // thisArg
    gulp,
  {
    // context for backwards compatibility
    gulp,
    Service,
    project,
    logLn,
    fileTypeForExtension,
    monaco: externals === RunTaskExternals.Setup ? monaco : undefined,
  }, {
    // modules
    "gulp": gulp,
    "@wasm/studio-utils": {
      Service,
      project,
      logLn,
      fileTypeForExtension,
      Arc: externals === RunTaskExternals.Arc ? Arc : undefined,
      eval: externals === RunTaskExternals.Setup ? unsafeEval : undefined,
    }
  })();
  if (gulp.hasTask(name)) {
    try {
      await gulp.run(name);
    } catch (e) {
      logLn(e.message, "error");
    }
  } else if (!optional) {
    logLn(`Task ${name} is not optional.` , "error");
  }
  clearCurrentRunnerInfoAndIframe();
}
