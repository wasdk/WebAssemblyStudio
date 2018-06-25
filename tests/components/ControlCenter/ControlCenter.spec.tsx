/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { ControlCenter } from "../../../src/components/ControlCenter";
import { initStore } from "../../../src/actions/AppActions";
import { Button } from "../../../src/components/shared/Button";
import { Tabs, EditorView, Tab } from "../../../src/components/editor";
import { Problems } from "../../../src/components/Problems";
import { GoThreeBars } from "../../../src/components/shared/Icons";
import { Sandbox } from "../../../src/components/Sandbox";
import { Split, SplitOrientation } from "../../../src/components/Split";
import appStore from "../../../src/stores/AppStore";
import { Problem, FileType } from "../../../src/models";

enum TabIndex {
  Output,
  Problems
}

declare var monaco: {
  editor
};

function wait(duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

describe("Tests for ControlCenter component", () => {
  const setup = (props?) => {
    return shallow(<ControlCenter {...props} />);
  };
  beforeAll(() => {
    initStore();
  });
  it("should render correctly", () => {
    const getLineCount = jest.spyOn(monaco.editor, "getLineCount");
    getLineCount.mockImplementation(() => 1);
    const wrapper = setup();
    const toggleButton = wrapper.find(Button);
    const tabs = wrapper.find(Tabs);
    expect(toggleButton).toHaveProp("icon", <GoThreeBars />);
    expect(toggleButton).toHaveProp("title", "View Console");
    expect(tabs.childAt(TabIndex.Output)).toHaveProp("label", "Output (1)");
    expect(tabs.childAt(TabIndex.Output)).toHaveProp("isActive", true);
    expect(tabs.childAt(TabIndex.Problems)).toHaveProp("label", "Problems (0)");
    expect(tabs.childAt(TabIndex.Problems)).toHaveProp("isActive", false);
    expect(wrapper.find(EditorView)).toExist();
    expect(wrapper.find(EditorView)).toHaveProp("view", (wrapper.instance() as any).outputView);
    expect(wrapper.find(EditorView)).toHaveProp("options", {renderIndentGuides: false});
    expect(wrapper.find(Problems)).not.toExist();
    expect(wrapper.find(Sandbox)).not.toExist();
    getLineCount.mockRestore();
  });
  it("should render correctly after clicking the tabs", () => {
    const wrapper = setup();
    wrapper.find(Tab).at(TabIndex.Problems).simulate("click");
    expect(wrapper.find(EditorView)).not.toExist();
    expect(wrapper.find(Problems)).toExist();
    expect(wrapper.find(Tab).at(TabIndex.Output)).toHaveProp("isActive", false);
    expect(wrapper.find(Tab).at(TabIndex.Problems)).toHaveProp("isActive", true);
    wrapper.find(Tab).at(TabIndex.Output).simulate("click");
    expect(wrapper.find(EditorView)).toExist();
    expect(wrapper.find(Problems)).not.toExist();
    expect(wrapper.find(Tab).at(TabIndex.Output)).toHaveProp("isActive", true);
    expect(wrapper.find(Tab).at(TabIndex.Problems)).toHaveProp("isActive", false);
  });
  it("should render correctly if passing the showSandbox prop", () => {
    const wrapper = setup({ showSandbox: true });
    const split = wrapper.find(Split);
    expect(split).toHaveProp("name", "editor/sandbox");
    expect(split).toHaveProp("orientation", SplitOrientation.Vertical);
    expect(split).toHaveProp("defaultSplit", { min: 256 });
    expect(split).toHaveProp("splits", [
      { min: 128, value: 512 },
      { min: 128, value: 256 }
    ]);
    expect(wrapper.find(Sandbox)).toExist();
  });
  it("should invoke onToggle when clicking the 'View Console' button", () => {
    const onToggle = jest.fn();
    const wrapper = setup({ onToggle });
    wrapper.find(Button).simulate("click");
    expect(onToggle).toHaveBeenCalled();
  });
  it("should register callbacks on mount", () => {
    const register = jest.spyOn(appStore.onOutputChanged, "register");
    const wrapper = setup();
    expect(register).toHaveBeenCalled();
    register.mockRestore();
  });
  it("should unregister callbacks on unmount", () => {
    const unregister = jest.spyOn(appStore.onOutputChanged, "unregister");
    const wrapper = setup();
    wrapper.unmount();
    expect(unregister).toHaveBeenCalled();
    unregister.mockRestore();
  });
  it("should update on onOutputChanged events from the AppStore", () => {
    const wrapper = setup();
    const updateOutputView = jest.spyOn((wrapper.instance() as any), "updateOutputView");
    appStore.onOutputChanged.dispatch();
    expect(updateOutputView).toHaveBeenCalled();
    updateOutputView.mockRestore();
  });
  it("should update on onDidChangeProblems events from the AppStore", async () => {
    const wrapper = setup();
    const project = appStore.getProject().getModel();
    const directory = project.newDirectory("dir");
    const file = directory.newFile("file", FileType.JavaScript);
    const problem = new Problem(file, "description", "error");
    file.isTransient = true;
    file.setProblems([problem]);
    await wait(10);
    expect(wrapper).toHaveState("problemCount", 1);
  });
});
