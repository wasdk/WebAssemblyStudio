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
import { Editor, EditorPane, Tab, Tabs } from "./components/editor";
import { Project } from "./model";
import { Header } from "./components/Header";
import { Split } from "./components/Split";
import { Toolbar } from "./components/Toolbar";

import { App } from "./components/App";
import { Test } from "./components/Test";
import { Service } from "./service";
// import { ITree } from "./monaco-extra";

declare var window: any;

export function layout() {
  const event = new Event("layout");
  document.dispatchEvent(event);
}

export function assert(c: any, message?: string) {
  if (!c) {
    throw new Error(message);
  }
}

let nextObjectId = 0;
export function objectId(o: any): number {
  if (!o) { return o; }
  assert(typeof o === "object");
  if ("__id__" in o) { return o.__id__; }
  return o.__id__ = nextObjectId++;
}

export function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(min, x), max);
}

window.addEventListener("resize", layout, false);
window.addEventListener("resize", () => {
  // Split.onGlobalResize.dispatch();
}, false);

export function forEachUrlParameter(callback: (key: string, value: any) => void) {
  let url = window.location.search.substring(1);
  url = url.replace(/\/$/, ""); // Replace / at the end that gets inserted by browsers.
  const params = {};
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

const parameters = getUrlParameters();
const embed = parameters["embed"] === true ? true : !!parseInt(parameters["embed"], 10);
const fiddle = parameters["fiddle"] || parameters["f"];

(window["require"])(["vs/editor/editor.main", "require"], (_: any, require: any) => {
  window.Tree = require("vs/base/parts/tree/browser/treeImpl").Tree;
  window.ContextMenuService = require("vs/platform/contextview/browser/contextMenuService").ContextMenuService;
  window.ContextViewService = require("vs/platform/contextview/browser/contextViewService").ContextViewService;
  window.TreeDefaults = require("vs/base/parts/tree/browser/treeDefaults");
  window.Action = require("vs/base/common/actions").Action;

  ReactDOM.render(
    parameters["test"] ? <Test/> : <App embed={embed} fiddle={fiddle}/>,
    document.getElementById("app")
  );
});
