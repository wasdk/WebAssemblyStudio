/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import {mount} from "enzyme";

const buildMock = jest.fn(() => Promise.resolve("build"));
const runMock = jest.fn(() => Promise.resolve("run"));
jest.mock("../../../src/actions/AppActions", () => {
  return {
    build: buildMock,
    run: runMock,
    pushStatus: jest.fn(),
    popStatus: jest.fn(),
    logLn: jest.fn()
  };
});

import {Monaco} from "../../../src/components/editor/Editor";
import {View} from "../../../src/components/editor";
import {File, FileType} from "../../../src/models";

describe("Tests for Editor.tsx/Monaco", () => {
  const setup = (options?) => {
    const file = new File("fileA", FileType.JavaScript);
    const view = new View(file);
    const editor = mount(<Monaco options={options} view={view}/>);
    return {
      wrapper: editor,
      simulateDirtyFile() {
        editor.props().view.file.isDirty = true;
      },
      simulateReadOnlyFile() {
        editor.props().view.file.isBufferReadOnly = true;
      },
      simulateViewChange() {
        editor.setProps({ view: new View(file) });
      },
      simulateViewUpdate() {
        editor.setProps({ view: editor.props().view });
      },
      getFile() {
        return editor.props().view.file;
      },
      getView() {
        return editor.props().view;
      }
    };
  };
  beforeAll(() => {
    // tslint:disable-next-line
    jest.spyOn(console, "info").mockImplementation(() => {});
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.unmock("../../../src/actions/AppActions");
  });
  it("should create a new Monaco editor", () => {
    const createEditorSpy = jest.spyOn(monaco.editor, "create");
    const {wrapper} = setup();
    const instance = wrapper.instance() as Monaco;
    expect(createEditorSpy).toHaveBeenCalledWith(instance.container, {
      value: "",
      theme: "fiddle-theme",
      minimap: { enabled: false },
      fontWeight: "bold",
      renderLineHighlight: "none",
    });
    createEditorSpy.mockRestore();
    wrapper.unmount();
  });
  it("should use custom options (passed as prop) when creating a new Monaco editor", () => {
    const createEditorSpy = jest.spyOn(monaco.editor, "create");
    const {wrapper} = setup({value: "1"});
    const {value} = createEditorSpy.mock.calls[0][1];
    expect(value).toEqual("1");
    createEditorSpy.mockRestore();
    wrapper.unmount();
  });
  it("should NOT create a new Monaco editor if one is already created", () => {
    const {wrapper, simulateViewChange} = setup();
    const createEditorSpy = jest.spyOn(monaco.editor, "create");
    simulateViewChange();
    expect(createEditorSpy).not.toHaveBeenCalled();
    createEditorSpy.mockRestore();
    wrapper.unmount();
  });
  it("should add a save action", () => {
    const addActionSpy = jest.spyOn(monaco.editor, "addAction");
    const {wrapper} = setup();
    const action = addActionSpy.mock.calls[0][0];
    expect(action.id).toEqual("save");
    expect(action.label).toEqual("Save");
    expect(action.keybindings).toEqual([83]);
    expect(action.precondition).toBeNull();
    expect(action.keybindingContext).toBeNull();
    addActionSpy.mockRestore();
    wrapper.unmount();
  });
  it("should save the open file when running the save action", () => {
    const addActionSpy = jest.spyOn(monaco.editor, "addAction");
    const {wrapper, simulateDirtyFile, getFile} = setup();
    const action = addActionSpy.mock.calls[0][0];
    simulateDirtyFile();
    expect(action.run()).toBeNull();
    expect(getFile().isDirty).toEqual(false);
    addActionSpy.mockRestore();
    wrapper.unmount();
  });
  it("should not try to save the open file if file buffer is readonly (when running the save action)", () => {
    const addActionSpy = jest.spyOn(monaco.editor, "addAction");
    const {wrapper, simulateDirtyFile, simulateReadOnlyFile, getFile} = setup();
    const action = addActionSpy.mock.calls[0][0];
    simulateDirtyFile();
    simulateReadOnlyFile();
    expect(action.run()).toBeNull();
    expect(getFile().isDirty).toEqual(true);
    addActionSpy.mockRestore();
    wrapper.unmount();
  });
  it("should add a build command", async () => {
    const addCommandSpy = jest.spyOn(monaco.editor, "addCommand");
    const {wrapper} = setup();
    const [keybinding, handler, context] = addCommandSpy.mock.calls[0];
    await handler();
    expect(keybinding).toEqual(66);
    expect(buildMock).toHaveBeenCalledTimes(1);
    expect(context).toBeNull();
    addCommandSpy.mockRestore();
    buildMock.mockClear();
    wrapper.unmount();
  });
  it("should add a run command", async () => {
    const addCommandSpy = jest.spyOn(monaco.editor, "addCommand");
    const {wrapper} = setup();
    const [keybinding, handler, context] = [...addCommandSpy.mock.calls[1]];
    await handler();
    expect(keybinding).toEqual(13);
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(context).toBeNull();
    runMock.mockClear();
    addCommandSpy.mockRestore();
    wrapper.unmount();
  });
  it("should add a build & run command", async () => {
    const addCommandSpy = jest.spyOn(monaco.editor, "addCommand");
    const {wrapper} = setup();
    const [keybinding, handler, context] = addCommandSpy.mock.calls[2];
    await handler();
    expect(keybinding).toEqual(15);
    expect(buildMock).toHaveBeenCalledTimes(1);
    expect(runMock).toHaveBeenCalledTimes(1);
    expect(context).toBeNull();
    buildMock.mockClear();
    runMock.mockClear();
    addCommandSpy.mockRestore();
    wrapper.unmount();
  });
  it("should listen to layout events", () => {
    const addEventListenerSpy = jest.spyOn(document, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");
    const {wrapper} = setup();
    const instance = wrapper.instance() as Monaco;
    wrapper.unmount();
    expect(addEventListenerSpy).toHaveBeenCalledWith("layout", instance.onLayout);
    expect(removeEventListenerSpy).toHaveBeenCalledWith("layout", instance.onLayout);
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
  it("should update the editor on layout events", () => {
    const {wrapper} = setup();
    const layoutSpy = jest.spyOn(monaco.editor, "layout");
    document.dispatchEvent(new CustomEvent("layout"));
    expect(layoutSpy).toHaveBeenCalled();
    layoutSpy.mockRestore();
    wrapper.unmount();
  });
  it("should save the view state on unmount", () => {
    const {wrapper} = setup();
    const saveViewStateSpy = jest.spyOn(monaco.editor, "saveViewState");
    wrapper.unmount();
    expect(saveViewStateSpy).toHaveBeenCalledTimes(1);
    saveViewStateSpy.mockRestore();
  });
  it("should update the editor when switching to a new view (switching files)", () => {
    const {wrapper, simulateViewChange, getFile, getView} = setup();
    const saveViewStateSpy = jest.spyOn(monaco.editor, "saveViewState");
    const setModelSpy = jest.spyOn(monaco.editor, "setModel");
    const restoreViewStateSpy = jest.spyOn(monaco.editor, "restoreViewState");
    const updateOptionsSpy = jest.spyOn(monaco.editor, "updateOptions");
    simulateViewChange();
    expect(setModelSpy).toHaveBeenLastCalledWith(getFile().buffer);
    expect(restoreViewStateSpy).toHaveBeenLastCalledWith(getView().state);
    expect(updateOptionsSpy).toHaveBeenCalledWith({ readOnly: getFile().isBufferReadOnly });
    expect(saveViewStateSpy).toHaveBeenCalledTimes(1);
    saveViewStateSpy.mockRestore();
    setModelSpy.mockRestore();
    restoreViewStateSpy.mockRestore();
    updateOptionsSpy.mockRestore();
    wrapper.unmount();
  });
  it("should NOT update the editor if view is still the same (shouldComponentUpdate)", () => {
    const {wrapper, simulateViewUpdate} = setup();
    const saveViewStateSpy = jest.spyOn(monaco.editor, "saveViewState");
    const setModelSpy = jest.spyOn(monaco.editor, "setModel");
    const restoreViewStateSpy = jest.spyOn(monaco.editor, "restoreViewState");
    const updateOptionsSpy = jest.spyOn(monaco.editor, "updateOptions");
    simulateViewUpdate();
    expect(setModelSpy).not.toHaveBeenCalled();
    expect(restoreViewStateSpy).not.toHaveBeenCalled();
    expect(updateOptionsSpy).not.toHaveBeenCalled();
    expect(saveViewStateSpy).not.toHaveBeenCalled();
    saveViewStateSpy.mockRestore();
    setModelSpy.mockRestore();
    restoreViewStateSpy.mockRestore();
    updateOptionsSpy.mockRestore();
    wrapper.unmount();
  });
  it("should disable editor scroll and resolve menu position when the context menu is shown", () => {
    const updateOptionsSpy = jest.spyOn(monaco.editor, "updateOptions");
    const onContextMenuSpy = jest.spyOn(monaco.editor, "onContextMenu");
    const container: HTMLDivElement = document.createElement("div");
    const element: HTMLDivElement = document.createElement("div");
    container.appendChild(element);
    element.style.top = "200px";
    element.style.left = "200px";
    const querySelectorSpy = jest.spyOn(container, "querySelector");
    querySelectorSpy.mockImplementation(() => element);
    const {wrapper} = setup();
    const registeredListenerFn = onContextMenuSpy.mock.calls[0][0];
    const instance = wrapper.instance() as Monaco;
    instance.container = container;
    registeredListenerFn({ event: { editorPos: { x: 200, y: 200 }}});
    expect(onContextMenuSpy).toHaveBeenCalled();
    expect(querySelectorSpy).toHaveBeenCalledWith(".monaco-editor > .monaco-menu-container");
    expect(updateOptionsSpy).toHaveBeenCalledWith({ scrollbar: { handleMouseWheel: false }});
    expect(element.style.top).toEqual("397px");
    expect(element.style.left).toEqual("390px");
    expect(element.style.maxHeight).toEqual("361px");
    updateOptionsSpy.mockRestore();
    onContextMenuSpy.mockRestore();
    querySelectorSpy.mockRestore();
    wrapper.unmount();
  });
  it("should re-enable editor scroll when the editor receives focus again", () => {
    const onDidFocusEditorSpy = jest.spyOn(monaco.editor, "onDidFocusEditor");
    const onDidFocusEditorTextSpy = jest.spyOn(monaco.editor, "onDidFocusEditorText");
    const {wrapper} = setup();
    const updateOptionsSpy = jest.spyOn(monaco.editor, "updateOptions");
    const onDidFocusEditorListenerFn = onDidFocusEditorSpy.mock.calls[0][0];
    const onDidFocusEditorTextListenerFn = onDidFocusEditorTextSpy.mock.calls[0][0];
    onDidFocusEditorListenerFn();
    onDidFocusEditorTextListenerFn();
    expect(onDidFocusEditorSpy).toHaveBeenCalled();
    expect(onDidFocusEditorTextSpy).toHaveBeenCalled();
    expect(updateOptionsSpy).toHaveBeenCalledTimes(2);
    expect(updateOptionsSpy.mock.calls[0][0]).toEqual({ scrollbar: { handleMouseWheel: true }});
    expect(updateOptionsSpy.mock.calls[1][0]).toEqual({ scrollbar: { handleMouseWheel: true }});
    updateOptionsSpy.mockRestore();
    onDidFocusEditorSpy.mockRestore();
    onDidFocusEditorTextSpy.mockRestore();
    wrapper.unmount();
  });
});
