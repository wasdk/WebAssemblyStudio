/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

declare var WebAssembly: any;

const ReactDOM = {
  render: jest.fn()
};

const Logger = {
  init: jest.fn(),
  captureException: jest.fn()
};

const MonacoUtils = {
  initialize: jest.fn()
};

const registerLanguages = jest.fn();
const registerTheme = jest.fn();

jest.mock("react-dom", () => ReactDOM);
jest.mock("../../src/utils/Logger", () => ({ Logger }));
jest.mock("../../src/monaco-utils", () => ({ MonacoUtils }));
jest.mock("../../src/utils/registerLanguages", () => ({ default: registerLanguages }));
jest.mock("../../src/utils/registerTheme", () => ({ default: registerTheme }));

import * as React from "react";
import * as index from "../../src/index";
import { EmbeddingType, App } from "../../src/components/App";
import { BrowserNotSupported } from "../../src/components/BrowserNotSupported";
import { ErrorBoundary } from "../../src/components/ErrorBoundary";

describe("Tests for index.tsx", () => {
  describe("forEachUrlParameter", () => {
    it("should loop through each url parameter", () => {
      history.pushState({}, "", "https://webassembly.studio/?embedding=arc_website&f=abc");
      const callback = jest.fn();
      index.forEachUrlParameter(callback);
      expect(callback).toHaveBeenCalledWith("embedding", "arc_website");
      expect(callback).toHaveBeenCalledWith("f", "abc");
    });
    it("should handle single values", () => {
      history.pushState({}, "", "https://webassembly.studio/?embedded&fiddle");
      const callback = jest.fn();
      index.forEachUrlParameter(callback);
      expect(callback).toHaveBeenCalledWith("embedded", true);
      expect(callback).toHaveBeenCalledWith("fiddle", true);
    });
  });
  describe("getUrlParameters", () => {
    it("should return the url parameters", () => {
      history.pushState({}, "", "https://webassembly.studio/?embedding=arc_website");
      expect(index.getUrlParameters()).toEqual({ embedding: "arc_website"});
    });
  });
  describe("unloadPageHandler", () => {
    it("should prompt the user before unload if appWindowContext.promptWhenClosing is true", () => {
      const removeEventListener = jest.spyOn(window, "removeEventListener");
      const e = { returnValue: "" };
      index.appWindowContext.promptWhenClosing = true;
      index.unloadPageHandler(e);
      expect(e.returnValue).toEqual("Project data is not saved.");
      expect(removeEventListener).not.toHaveBeenCalled();
      removeEventListener.mockRestore();
    });
    it("should not prompt the user before unload if appWindowContext.promptWhenClosing is false", () => {
      const removeEventListener = jest.spyOn(window, "removeEventListener");
      const e = { returnValue: "" };
      index.appWindowContext.promptWhenClosing = false;
      index.unloadPageHandler(e);
      expect(e.returnValue).toEqual("");
      expect(removeEventListener).toHaveBeenCalled();
      removeEventListener.mockRestore();
    });
  });
  describe("getEmbeddingParams", () => {
    it("should return the correct empedding params for: ?embedding=default", () => {
      const parameters = { embedding: "default" };
      expect(index.getEmbeddingParams(parameters)).toEqual({
        type: EmbeddingType.Default,
        templatesName: "default"
      });
    });
    it("should return the correct empedding params for: ?embedding=arc_website", () => {
      const parameters = { embedding: "arc_website" };
      expect(index.getEmbeddingParams(parameters)).toEqual({
        type: EmbeddingType.Arc,
        templatesName: "arc"
      });
    });
    it("should return the correct empedding params for: ?embed", () => {
      const parameters = { embed: true };
      expect(index.getEmbeddingParams(parameters)).toEqual({
        type: EmbeddingType.Default,
        templatesName: "default"
      });
    });
    it("should return the correct empedding params for: ?embed=1", () => {
      const parameters = { embed: 1 };
      expect(index.getEmbeddingParams(parameters)).toEqual({
        type: EmbeddingType.Default,
        templatesName: "default"
      });
    });
    it("should return the correct empedding params for: ?", () => {
      const parameters = {};
      expect(index.getEmbeddingParams(parameters)).toEqual({
        type: EmbeddingType.None,
        templatesName: "default"
      });
    });
  });
  describe("init", () => {
    beforeAll(() => {
      const div = document.createElement("div");
      div.setAttribute("id", "app");
      document.body.appendChild(div);
    });
    it("should init the logger", async () => {
      Logger.init.mockClear();
      await index.init("test");
      expect(Logger.init).toHaveBeenCalled();
    });
    it("should add event listeners", async () => {
      const addEventListener = jest.spyOn(window, "addEventListener");
      await index.init("test");
      expect(addEventListener.mock.calls[0][0]).toEqual("resize");
      expect(addEventListener.mock.calls[1][0]).toEqual("beforeunload");
      addEventListener.mockRestore();
    });
    it("should initialize the MonacoUtils", async () => {
      MonacoUtils.initialize.mockClear();
      await index.init("test");
      expect(MonacoUtils.initialize).toHaveBeenCalled();
    });
    it("should render <App /> with the correct params (?f=fiddle-uri)", async () => {
      ReactDOM.render.mockClear();
      history.pushState({}, "", "https://webassembly.studio/?f=fiddle-uri");
      await index.init("test");
      expect(ReactDOM.render).toHaveBeenCalledWith(
        <ErrorBoundary>
          <App
            embeddingParams={{templatesName: "default", type: 0}}
            fiddle="fiddle-uri"
            update={false}
            windowContext={{promptWhenClosing: false}}
          />
        </ErrorBoundary>,
        document.getElementById("app")
      );
    });
    it("should render <App /> with the correct params (?fiddle=fiddle-uri)", async () => {
      ReactDOM.render.mockClear();
      history.pushState({}, "", "https://webassembly.studio/?fiddle=fiddle-uri");
      await index.init("test");
      expect(ReactDOM.render).toHaveBeenCalledWith(
        <ErrorBoundary>
          <App
            embeddingParams={{templatesName: "default", type: 0}}
            fiddle="fiddle-uri"
            update={false}
            windowContext={{promptWhenClosing: false}}
          />
        </ErrorBoundary>,
        document.getElementById("app")
      );
    });
    it("should render <App /> with the correct params (?update)", async () => {
      ReactDOM.render.mockClear();
      history.pushState({}, "", "https://webassembly.studio/?update");
      await index.init("test");
      expect(ReactDOM.render).toHaveBeenCalledWith(
        <ErrorBoundary>
          <App
            embeddingParams={{templatesName: "default", type: 0}}
            fiddle={undefined}
            update={true}
            windowContext={{promptWhenClosing: false}}
          />
        </ErrorBoundary>,
        document.getElementById("app")
      );
    });
    it("should render <App /> with the correct params (?update=1)", async () => {
      ReactDOM.render.mockClear();
      history.pushState({}, "", "https://webassembly.studio/?update=1");
      await index.init("test");
      expect(ReactDOM.render).toHaveBeenCalledWith(
        <ErrorBoundary>
          <App
            embeddingParams={{templatesName: "default", type: 0}}
            fiddle={undefined}
            update={true}
            windowContext={{promptWhenClosing: false}}
          />
        </ErrorBoundary>,
        document.getElementById("app")
      );
    });
    it("should render <BrowserNotSupported/> if the browser does not support WebAssembly", async () => {
      ReactDOM.render.mockClear();
      WebAssembly = false;
      await index.init("test");
      expect(ReactDOM.render).toHaveBeenCalledWith(
        <BrowserNotSupported />,
        document.getElementById("app")
      );
    });
    it("should catch and log any exceptions thrown from the init function", async () => {
      const error = new Error("from MonacoUtils");
      MonacoUtils.initialize.mockImplementation(() => { throw error; });
      await index.init("test");
      expect(Logger.captureException).toHaveBeenCalledWith(error);
    });
  });
});
