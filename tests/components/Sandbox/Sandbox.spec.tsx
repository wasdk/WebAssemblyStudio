/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import { mount } from "enzyme";
import { Sandbox } from "../../../src/components/Sandbox";
import { Split } from "../../../src/components/Split";
import appStore from "../../../src/stores/AppStore";
import { Project, FileType } from "../../../src/models";
import * as appActions from "../../../src/actions/AppActions";

function mockBlob() {
  const blob = jest.spyOn(window, "Blob");
  blob.mockImplementation((data, config) => ({ data, type: config.type}));
  return blob;
}

function mockURL() {
  const url = jest.spyOn(window, "URL");
  url.mockImplementation((input) => ({ pathname: input }));
  (url as any).createObjectURL = jest.fn().mockImplementation(blob => blob);
  return url;
}

function mockResponse() {
  (window as any).Response = jest.fn().mockImplementation((body, config) => ({ body, config }));
  return { restore: () => (window as any).Response = undefined };
}

function mockFetch(returnValue) {
  window.fetch = jest.fn().mockImplementation(() => Promise.resolve(returnValue));
  return { restore: () => window.fetch = undefined };
}

function mockCreateElement(returnElement) {
  const createElement = jest.spyOn(document, "createElement");
  createElement.mockImplementationOnce(() => returnElement);
  return createElement;
}

function mockAppendChild(element) {
  const appendChild = jest.spyOn(element, "appendChild");
  // tslint:disable-next-line
  appendChild.mockImplementationOnce(() => {});
  return appendChild;
}

function createMockIframeContext(wrapper) {
  const log = jest.fn();
  const info = jest.fn();
  const warn = jest.fn();
  const error = jest.fn();
  const iframe: any = { contentWindow: { console: { log, info, warn, error }}};
  const blob = mockBlob();
  const url = mockURL();
  const response = mockResponse();
  const fetch = mockFetch("fetched");
  const createElement = mockCreateElement(iframe);
  const appendChild = mockAppendChild((wrapper.instance() as any).container);
  return {
    iframe,
    appendChild,
    log,
    info,
    warn,
    error,
    restore: () => {
      blob.mockRestore();
      url.mockRestore();
      response.restore();
      fetch.restore();
      createElement.mockRestore();
      appendChild.mockRestore();
    }
  };
}

describe("Tests for Sandbox", () => {
  const setup = () => {
    return mount(<Sandbox />);
  };
  beforeAll(() => {
    appActions.initStore();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  it("should register event listeners on mount", () => {
    const registerOnResizeBegin = jest.spyOn(Split.onResizeBegin, "register");
    const registerOnResizeEnd = jest.spyOn(Split.onResizeEnd, "register");
    const registerOnSandboxRun = jest.spyOn(appStore.onSandboxRun, "register");
    const wrapper = setup();
    expect(registerOnResizeBegin).toHaveBeenCalled();
    expect(registerOnResizeEnd).toHaveBeenCalled();
    expect(registerOnSandboxRun).toHaveBeenCalled();
    registerOnResizeBegin.mockRestore();
    registerOnResizeEnd.mockRestore();
    registerOnSandboxRun.mockRestore();
    wrapper.unmount();
  });
  it("should unregister event listeners on unmount", () => {
    const unregisterOnResizeBegin = jest.spyOn(Split.onResizeBegin, "unregister");
    const unregisterOnResizeEnd = jest.spyOn(Split.onResizeEnd, "unregister");
    const unregisterOnSandboxRun = jest.spyOn(appStore.onSandboxRun, "unregister");
    const wrapper = setup();
    wrapper.unmount();
    expect(unregisterOnResizeBegin).toHaveBeenCalled();
    expect(unregisterOnResizeEnd).toHaveBeenCalled();
    expect(unregisterOnSandboxRun).toHaveBeenCalled();
    unregisterOnResizeBegin.mockRestore();
    unregisterOnResizeEnd.mockRestore();
    unregisterOnSandboxRun.mockRestore();
  });
  it("should handle resize events", () => {
    const wrapper = setup();
    Split.onResizeBegin.dispatch();
    expect((wrapper.instance() as any).container.style.pointerEvents).toEqual("none");
    Split.onResizeEnd.dispatch();
    expect((wrapper.instance() as any).container.style.pointerEvents).toEqual("auto");
    wrapper.unmount();
  });
  it("should handle SandboxRun events", () => {
    const wrapper = setup();
    const run = jest.spyOn(Sandbox.prototype, "run");
    // tslint:disable-next-line
    run.mockImplementation(() => {});
    appStore.onSandboxRun.dispatch({});
    expect(run).toHaveBeenCalled();
    run.mockRestore();
    wrapper.unmount();
  });
  describe("run", () => {
    it("should create an iframe ", () => {
      const wrapper = setup();
      const { iframe, appendChild, restore } = createMockIframeContext(wrapper);
      (wrapper.instance() as Sandbox).run(new Project(), "src");
      expect(appendChild).toHaveBeenCalledWith(iframe);
      expect(iframe.src).toHaveProperty("data", ["src"]);
      expect(iframe.src).toHaveProperty("type", "text/html");
      expect(iframe).toHaveProperty("className", "sandbox");
      restore();
      wrapper.unmount();
    });
    it("should hijack the console", () => {
      const wrapper = setup();
      const logLn = jest.spyOn(appActions, "logLn");
      const { iframe, log, info, warn, error, restore } = createMockIframeContext(wrapper);
      (wrapper.instance() as Sandbox).run(new Project(), "src");
      iframe.contentWindow.console.log("log1", "log2");
      iframe.contentWindow.console.info("info1", "info2");
      iframe.contentWindow.console.warn("warn1", "warn2");
      iframe.contentWindow.console.error("error1", "error2");
      expect(log).toHaveBeenCalledTimes(1);
      expect(info).toHaveBeenCalledTimes(1);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledTimes(1);
      expect(logLn.mock.calls[0][0]).toEqual("log1,log2");
      expect(logLn.mock.calls[1][0]).toEqual("info1,info2");
      expect(logLn.mock.calls[1][1]).toEqual("info");
      expect(logLn.mock.calls[2][0]).toEqual("warn1,warn2");
      expect(logLn.mock.calls[2][1]).toEqual("warn");
      expect(logLn.mock.calls[3][0]).toEqual("error1,error2");
      expect(logLn.mock.calls[3][1]).toEqual("error");
      restore();
      wrapper.unmount();
    });
    it("should hijack fetch", async () => {
      const wrapper = setup();
      const project = new Project();
      const file = project.newFile("fileA", FileType.JavaScript);
      const fileData = "data";
      file.setData(fileData);
      const { iframe, restore } = createMockIframeContext(wrapper);
      (wrapper.instance() as Sandbox).run(project, "src");
      const resultA = await iframe.contentWindow.fetch("/fileA");
      const resultB = await iframe.contentWindow.fetch("/fileB");
      expect(resultA.body).toEqual(fileData);
      expect(resultA.config).toEqual({
        status: 200,
        statusText: "OK",
        headers: { "Content-Type": "application/javascript" }
      });
      expect(resultB).toEqual("fetched");
      restore();
      wrapper.unmount();
    });
    it("should add a getFileURL function", () => {
      const wrapper = setup();
      const logLn = jest.spyOn(appActions, "logLn");
      const project = new Project();
      const file = project.newFile("fileA.js", FileType.JavaScript);
      file.setData("file-data");
      const { iframe, restore } = createMockIframeContext(wrapper);
      (wrapper.instance() as Sandbox).run(project, "src");
      const resultA = iframe.contentWindow.getFileURL("fileA.js");
      const resultB = iframe.contentWindow.getFileURL("fileB.js");
      expect(resultA).toHaveProperty("data", ["file-data"]);
      expect(resultA).toHaveProperty("type", "application/javascript");
      expect(resultB).toBeUndefined();
      expect(logLn).toHaveBeenCalledWith("Cannot find file fileB.js", "error");
      restore();
      wrapper.unmount();
    });
  });

});
