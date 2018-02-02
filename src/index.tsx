import * as React from "react";
import * as ReactDOM from "react-dom";
import * as SplitPane from "react-split-pane";
import { Workspace } from "./components/Workspace";
import { Console } from "./components/Console";
import { Editor } from "./components/Editor";
import { Project } from "./model";
import { Header } from "./components/Header";
import { Split } from "./components/Split";
import { Toolbar } from "./components/Toolbar";

import { Tabs, Tab } from "./components/Tabs";
import { EditorPane } from "./components/EditorPane";
import { App } from "./components/App";
import { Test } from "./components/Test";
import { Service } from "./service";
// import { ITree } from "./monaco-extra";

declare var window: any;

export function layout() {
  var event = new Event("layout");
  document.dispatchEvent(event);
}

export function assert(c: any, message?: string) {
  if (!c) {
    throw new Error(message);
  }
}

let nextObjectId = 0;
export function objectId(o: any): number {
  if (!o) return o;
  assert(typeof o === "object");
  if ("__id__" in o) return o.__id__;
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
  let params = {};
  url.split('&').forEach(function (s: any) {
    let t = s.split('=');
    if (t.length == 2) {
      callback(t[0], decodeURIComponent(t[1]));
    } else {
      callback(t[0], true);
    }
  });
}

export function getUrlParameters(): any {
  let params: any = {};
  forEachUrlParameter((key, value) => {
    params[key] = value;
  });
  return params;
};

let parameters = getUrlParameters();
let embed = parameters["embed"] === true ? true : !!parseInt(parameters["embed"]);
let fiddle = parameters["fiddle"] || parameters["f"];

(window['require'])(['vs/editor/editor.main', 'require'], (_: any, require: any) => {
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

