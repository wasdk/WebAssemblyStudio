/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import { shallow } from "enzyme";

declare var monaco: { editor };
const Service = { lazyLoad: jest.fn() };
jest.mock("../../../src/service", () => ({ Service }));

function mockViz(status) {
  const viz = jest.fn();
  if (status === "loading") {
    (global as any).Viz = undefined;
  } else if (status === "loaded") {
    (global as any).Viz = viz;
    viz.mockImplementation(() => "svg");
  } else if (status === "error") {
    (global as any).Viz = viz;
    viz.mockImplementation(() => { throw new Error(); });
  }
  return viz;
}

function wait(duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

import { VizView } from "../../../src/components/Viz";
import { File, FileType } from "../../../src/models";
import { View } from "../../../src/components/editor";
import { ViewType } from "../../../src/components/editor/View";

describe("Tests for Viz", () => {
  const setup = (customFile?: File) => {
    const file = customFile || new File("file", FileType.JSON);
    const view = new View(file, ViewType.Viz);
    return shallow(<VizView view={view} />);
  };
  it("should have the correct initial state", () => {
    const getValue = jest.spyOn(monaco.editor, "getValue");
    getValue.mockImplementation(() => "value");
    mockViz("loading");
    const wrapper = setup();
    expect(wrapper).toHaveState({ content: "value", isVizLoaded: false });
    getValue.mockRestore();
  });
  it("should load Viz when mounting (if it's not already loaded)", async () => {
    Service.lazyLoad.mockClear();
    const wrapper = setup();
    expect(Service.lazyLoad).toHaveBeenCalledWith("lib/viz-lite.js");
  });
  it("should NOT load Viz when mounting if it's already loaded", async () => {
    Service.lazyLoad.mockClear();
    mockViz("loaded");
    const wrapper = setup();
    expect(Service.lazyLoad).not.toHaveBeenCalled();
  });
  it("should register a callback for onDidChangeBuffer events on mount", () => {
    const file = new File("file", FileType.JSON);
    const register = jest.spyOn(file.onDidChangeBuffer, "register");
    const wrapper = setup(file);
    expect(register).toHaveBeenCalled();
    register.mockRestore();
  });
  it("should remove the callback for onDidChangeBuffer events on unmount", () => {
    const file = new File("file", FileType.JSON);
    const unregister = jest.spyOn(file.onDidChangeBuffer, "unregister");
    const wrapper = setup(file);
    wrapper.unmount();
    expect(unregister).toHaveBeenCalled();
    unregister.mockRestore();
  });
  it("should update the onDidChangeBuffer callback on new props (containing a new view)", () => {
    const file = new File("file", FileType.JSON);
    const newFile = new File("newFile", FileType.JSON);
    const unregister = jest.spyOn(file.onDidChangeBuffer, "unregister");
    const register = jest.spyOn(newFile.onDidChangeBuffer, "register");
    const wrapper = setup(file);
    wrapper.setProps({ view: new View(newFile, ViewType.Viz) });
    expect(unregister).toHaveBeenCalled();
    expect(register).toHaveBeenCalled();
    unregister.mockRestore();
    register.mockRestore();
  });
  it("should do nothing when new props does not contain a new view", () => {
    const file = new File("file", FileType.JSON);
    const unregister = jest.spyOn(file.onDidChangeBuffer, "unregister");
    const wrapper = setup(file);
    wrapper.setProps({});
    expect(unregister).not.toHaveBeenCalled();
    unregister.mockRestore();
  });
  it("should update on onDidChangeBuffer events", async () => {
    const file = new File("file", FileType.JSON);
    const wrapper = setup(file);
    (wrapper.instance() as VizView).updateThrottleDuration = 0; // Set to 0 to avoid long wait
    const getValue = jest.spyOn(monaco.editor, "getValue");
    getValue.mockImplementation(() => "updatedValue");
    mockViz("loaded");
    file.onDidChangeBuffer.dispatch();
    await wait(10); // Wait for the updateTimeout to fire
    expect(wrapper).toHaveState({ content: "updatedValue", isVizLoaded: true });
    getValue.mockRestore();
  });
  it("should render correctly when Viz is loading", () => {
    mockViz("loading");
    const wrapper = setup();
    expect(wrapper.text()).toEqual("Loading GraphViz, please wait ...");
  });
  it("should render correctly when Viz is loaded", () => {
    mockViz("loaded");
    const wrapper = setup();
    expect(wrapper).toHaveStyle({width: "100%", height: "100%", overflow: "scroll"});
    expect(wrapper).toHaveProp("dangerouslySetInnerHTML", { __html: "svg" });
  });
  it("should render correctly when Viz has thrown an error", () => {
    mockViz("error");
    const wrapper = setup();
    expect(wrapper.text()).toEqual("GraphViz Error");
  });
});
