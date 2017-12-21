import * as React from "react";
import * as ReactDOM from "react-dom";
import * as SplitPane from "react-split-pane";
import { Workspace } from "./components/Workspace";
import { Console } from "./components/Console";
import { Editor } from "./components/Editor";
import { Project } from "./Project";
import { Header } from "./components/Header";
import { Toolbar } from "./components/Toolbar";

import { Tabs, Tab } from "./components/Tabs";
import { EditorPane } from "./components/EditorPane";
import { App } from "./components/App";
import { Test } from "./components/Test";

declare var window: any;

export function layout() {
  console.log("Layout");
  var event = new Event("layout");
  document.dispatchEvent(event);
}

export function assert(c: any, message?: string) {
  if (!c) {
    throw new Error(message);
  }
}

export function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(min, x), max);
}

window.addEventListener("resize", layout, false);


export function forEachUrlParameter(callback: (key: string, value: string) => void) {
  let url = window.location.search.substring(1);
  url = url.replace(/\/$/, ""); // Replace / at the end that gets inserted by browsers.
  let params = {};
  url.split('&').forEach(function (s) {
    let t = s.split('=');
    callback(t[0], decodeURIComponent(t[1]));
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


(window['require'])(['vs/editor/editor.main'], () => {
  ReactDOM.render(
    parameters["test"] ? <Test/> : <App/>,
    document.getElementById("app")
  );
});

