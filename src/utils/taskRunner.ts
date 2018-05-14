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

import { Project, fileTypeForExtension } from "../model";
import { Gulpy } from "../gulpy";
import { Service } from "../service";
import { Arc } from "../arc";

export enum RunTaskExternals {
  Default,
  Arc
}

function contextify(
  src: string,
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

  // Call the function constructor with our variable parameters and arguments.
  return Function.apply(null, contextParameters)
    .apply(thisArg, contextArguments);
}

export async function runTask(
  src: string,
  name: string,
  optional: boolean,
  project: Project,
  logLn: (...args: any[]) => void,
  externals: RunTaskExternals
) {
  // Runs the provided source in our fantasy gulp context
  const gulp = new Gulpy();
  contextify(src,
    // thisArg
    gulp,
  {
    // context for backwards compatibility
    gulp,
    Service,
    project,
    logLn,
    fileTypeForExtension
  }, {
    // modules
    "gulp": gulp,
    "@wasm/studio-utils": {
      Service,
      project,
      logLn,
      fileTypeForExtension,
      Arc: externals === RunTaskExternals.Arc ? Arc : undefined,
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
}
