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
import * as ReactDOM from "react-dom";
import { Workspace } from "./components/Workspace";
import { EditorView, ViewTabs, Tab, Tabs } from "./components/editor";
import { Header } from "./components/Header";
import { Split } from "./components/Split";
import { Toolbar } from "./components/Toolbar";

import { App, EmbeddingParams, EmbeddingType } from "./components/App";
import { Service } from "./service";
import { layout } from "./util";
import { MonacoUtils } from "./monaco-utils";
import { BrowserNotSupported } from "./components/BrowserNotSupported";
import registerLanguages from "./utils/registerLanguages";
import registerTheme from "./utils/registerTheme";
import { Logger } from "./utils/Logger";
import { ErrorBoundary } from "./components/ErrorBoundary";

declare var window: any;
declare var WebAssembly: any;

export function forEachUrlParameter(callback: (key: string, value: any) => void) {
  let url = window.location.search.substring(1);
  url = url.replace(/\/$/, ""); // Replace / at the end that gets inserted by browsers.
  url.split("&").forEach(function(s: any) {
    const t = s.split("=");
    if (t.length === 2) {
      callback(t[0], decodeURIComponent(t[1]));
    } else {
      callback(t[0], true);
    }
  });
}

export function getUrlParameters(): any {
  const params: any = {};
  forEachUrlParameter((key, value) => {
    params[key] = value;
  });
  return params;
}

export const appWindowContext = {
  promptWhenClosing: false,
};

export function unloadPageHandler(e: {returnValue: string}): any {
  if (!appWindowContext.promptWhenClosing) {
    window.removeEventListener("beforeunload", unloadPageHandler, false);
    return;
  }
  e.returnValue = "Project data is not saved.";
}

export function getEmbeddingParams(parameters: any): EmbeddingParams {
  const embedding = parameters["embedding"];
  let type;
  switch (embedding) {
    case "default":
      type = EmbeddingType.Default;
      break;
    case "arc_website":
      type = EmbeddingType.Arc;
      break;
    default:
      const embed = parameters["embed"] === true ? true : !!parseInt(parameters["embed"], 10);
      type = embed ? EmbeddingType.Default : EmbeddingType.None;
      break;
  }
  const templatesName = parameters["embedding"] === "arc_website" ? "arc" : "default";
  return {
    type,
    templatesName,
  };
}

export async function init(environment = "production") {
  Logger.init();
  window.addEventListener("resize", layout, false);
  window.addEventListener("beforeunload", unloadPageHandler, false);
  const parameters = getUrlParameters();
  const update = parameters["update"] === true ? true : !!parseInt(parameters["update"], 10);
  const fiddle = parameters["fiddle"] || parameters["f"];
  const embeddingParams = getEmbeddingParams(parameters);
  try {
    await MonacoUtils.initialize();
    await registerTheme();
    if (typeof WebAssembly !== "object") {
      ReactDOM.render(
        <BrowserNotSupported/>,
        document.getElementById("app")
      );
    } else {
      ReactDOM.render(
        <ErrorBoundary>
          <App update={update} fiddle={fiddle} embeddingParams={embeddingParams} windowContext={appWindowContext}/>
        </ErrorBoundary>,
        document.getElementById("app")
      );
    }
    if (environment !== "test") {
      await import(/* webpackChunkName: "monaco-languages" */ "monaco-editor");
    }
    await registerLanguages();
  } catch (e) {
    Logger.captureException(e);
  }
}

init();
