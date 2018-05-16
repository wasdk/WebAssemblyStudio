/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import {mount} from "enzyme";

const registerMock = jest.fn();
const unregisterMock = jest.fn();
jest.mock("../../../src/stores/AppStore", () => {
  return {
    default: {
      onDidChangeDirty: {
        register: registerMock,
        unregister: unregisterMock
      }
    }
  };
});

import {File, FileType} from "../../../src/model";
import {View, ViewType} from "../../../src/components/editor/View";
import {Tabs, Tab} from "../../../src/components/editor/Tabs";
import {EditorView} from "../../../src/components/editor/Editor";
import {ViewTabs} from "../../../src/components/editor/ViewTabs";
import {Button} from "../../../src/components/shared/Button";
import {GoBook, GoClippy, GoCode, GoEye} from "../../../src/components/shared/Icons";
import {MarkdownView} from "../../../src/components/Markdown";
import {VizView} from "../../../src/components/Viz";
import {BinaryView} from "../../../src/components/Binary";

function generateViews(props) {
  const {
    fileType = FileType.Unknown,
    viewType = ViewType.Editor,
    simulateDirtyFile,
    simulateNoFile,
    simulateNoView
  } = props;
  const fileA = simulateNoFile ? null : new File("fileA", fileType);
  const fileB = simulateNoFile ? null : new File("fileB", fileType);
  const viewA = simulateNoView ? null : new View(fileA, viewType);
  const viewB = simulateNoView ? null : new View(fileB, viewType);
  if (simulateDirtyFile) {
    fileA.isDirty = true;
  }
  return {
    view: viewA,
    views: [viewA, viewB]
  };
}

describe("Tests for ViewTabs", () => {
  const setup = (props) => {
    const {view, views} = generateViews(props);
    const wrapper = mount(
      <ViewTabs
        {...props}
        view={view}
        views={views}
        preview={props.preview ? view : null}
      />
    );
    return {
      wrapper,
      simulateDirtyFile() {
        view.file.isDirty = true;
      },
      getFile() {
        return view.file;
      },
      getView() {
        return view;
      }
    };
  };
  beforeAll(() => {
    jest.spyOn(console, "info").mockImplementation(() => {});
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.unmock("../../../src/stores/AppStore");
  });
  it("should render correctly", () => {
    const {wrapper} = setup({});
    const splitButtonIndex = 0;
    const saveButtonIndex = 1;
    const buttons = wrapper.find(Button);
    const tabs = wrapper.find(Tab);
    expect(wrapper.find(".editor-pane-container").exists()).toEqual(true);
    expect(wrapper.find(".blurred").exists()).toEqual(true);
    expect(wrapper.find(Tabs).length).toEqual(1);
    expect(wrapper.find(EditorView).length).toEqual(1);
    expect(buttons.at(splitButtonIndex).key()).toEqual("split");
    expect(buttons.at(splitButtonIndex).prop("title")).toEqual("Split Editor");
    expect(buttons.at(splitButtonIndex).find(GoBook).exists()).toEqual(true);
    expect(buttons.at(saveButtonIndex).key()).toEqual("save");
    expect(buttons.at(saveButtonIndex).prop("title")).toEqual("Save: CtrlCmd + S");
    expect(buttons.at(saveButtonIndex).prop("label")).toEqual("Save");
    expect(buttons.at(saveButtonIndex).prop("isDisabled")).toEqual(true);
    expect(buttons.at(saveButtonIndex).find(GoClippy).exists()).toEqual(true);
    expect(tabs.at(0).prop("isActive")).toEqual(true);
    expect(tabs.at(0).prop("label")).toEqual("fileA");
    expect(tabs.at(1).prop("isActive")).toEqual(false);
    expect(tabs.at(1).prop("label")).toEqual("fileB");
    wrapper.unmount();
  });
  it("should render correctly when active view does not contain a file", () => {
    const {wrapper} = setup({ simulateNoFile: true });
    expect(wrapper.find(".editor-pane-container").hasClass("empty")).toEqual(true);
    wrapper.unmount();
  });
  it("should render empty div when active view is null", () => {
    const {wrapper} = setup({ simulateNoView: true });
    expect(wrapper.html()).toEqual("<div></div>");
    wrapper.unmount();
  });
  it("should render correctly when previewing markdown files", () => {
    const {wrapper} = setup({ fileType: FileType.Markdown, viewType: ViewType.Markdown });
    const toggleButtonIndex = 0;
    const splitButtonIndex = 1;
    const saveButtonIndex = 2;
    const buttons = wrapper.find(Button);
    expect(wrapper.find(MarkdownView).length).toEqual(1);
    expect(buttons.at(toggleButtonIndex).key()).toEqual("toggle");
    expect(buttons.at(toggleButtonIndex).prop("title")).toEqual("Edit Markdown");
    expect(buttons.at(toggleButtonIndex).find(GoCode).exists()).toEqual(true);
    expect(buttons.at(splitButtonIndex).key()).toEqual("split");
    expect(buttons.at(saveButtonIndex).key()).toEqual("save");
    expect(wrapper.find(Tab).at(0).prop("label")).toEqual("Preview fileA");
    wrapper.unmount();
  });
  it("should render correctly when editing markdown files", () => {
    const {wrapper} = setup({ fileType: FileType.Markdown, viewType: ViewType.Editor });
    expect(wrapper.find(EditorView).length).toEqual(1);
    expect(wrapper.find(Button).at(0).prop("title")).toEqual("Preview Markdown");
    expect(wrapper.find(Button).at(0).find(GoEye).exists()).toEqual(true);
    expect(wrapper.find(Tab).at(0).prop("label")).toEqual("fileA");
    wrapper.unmount();
  });
  it("should invoke onChangeViewType with new ViewType when clicking the toggle button (Markdown)", () => {
    const onChangeViewType = jest.fn();
    const markdownView = setup({ fileType: FileType.Markdown, viewType: ViewType.Markdown, onChangeViewType });
    const editorView = setup({ fileType: FileType.Markdown, viewType: ViewType.Editor, onChangeViewType });
    markdownView.wrapper.find(Button).at(0).simulate("click");
    editorView.wrapper.find(Button).at(0).simulate("click");
    expect(onChangeViewType).toHaveBeenCalledWith(markdownView.getView(), ViewType.Editor);
    expect(onChangeViewType).toHaveBeenCalledWith(editorView.getView(), ViewType.Markdown);
    markdownView.wrapper.unmount();
    editorView.wrapper.unmount();
  });
  it("should render correctly when previewing dot files", () => {
    const {wrapper} = setup({ fileType: FileType.DOT, viewType: ViewType.Viz });
    const toggleButtonIndex = 0;
    const splitButtonIndex = 1;
    const saveButtonIndex = 2;
    const buttons = wrapper.find(Button);
    expect(wrapper.find(VizView).length).toEqual(1);
    expect(buttons.at(toggleButtonIndex).key()).toEqual("toggle");
    expect(buttons.at(toggleButtonIndex).prop("title")).toEqual("Edit GraphViz DOT File");
    expect(buttons.at(toggleButtonIndex).find(GoCode).exists()).toEqual(true);
    expect(buttons.at(splitButtonIndex).key()).toEqual("split");
    expect(buttons.at(saveButtonIndex).key()).toEqual("save");
    expect(wrapper.find(Tab).at(0).prop("label")).toEqual("Preview fileA");
    wrapper.unmount();
  });
  it("should render correctly when editing dot files", () => {
    const {wrapper} = setup({ fileType: FileType.DOT, viewType: ViewType.Editor });
    expect(wrapper.find(EditorView).length).toEqual(1);
    expect(wrapper.find(Button).at(0).prop("title")).toEqual("Preview GraphViz DOT File");
    expect(wrapper.find(Button).at(0).find(GoEye).exists()).toEqual(true);
    expect(wrapper.find(Tab).at(0).prop("label")).toEqual("fileA");
    wrapper.unmount();
  });
  it("should invoke onChangeViewType with new ViewType when clicking the toggle button (DOT)", () => {
    const onChangeViewType = jest.fn();
    const vizView = setup({ fileType: FileType.DOT, viewType: ViewType.Viz, onChangeViewType });
    const editorView = setup({ fileType: FileType.DOT, viewType: ViewType.Editor, onChangeViewType });
    vizView.wrapper.find(Button).at(0).simulate("click");
    editorView.wrapper.find(Button).at(0).simulate("click");
    expect(onChangeViewType).toHaveBeenCalledWith(vizView.getView(), ViewType.Editor);
    expect(onChangeViewType).toHaveBeenCalledWith(editorView.getView(), ViewType.Viz);
    vizView.wrapper.unmount();
    editorView.wrapper.unmount();
  });
  it("should render correctly for binary files", () => {
    const {wrapper} = setup({ fileType: FileType.x86, viewType: ViewType.Binary });
    const splitButtonIndex = 0;
    const saveButtonIndex = 1;
    const buttons = wrapper.find(Button);
    expect(wrapper.find(BinaryView).length).toEqual(1);
    expect(buttons.at(splitButtonIndex).key()).toEqual("split");
    expect(buttons.at(saveButtonIndex).key()).toEqual("save");
    expect(wrapper.find(Tab).at(0).prop("label")).toEqual("Binary fileA");
    wrapper.unmount();
  });
  it("should render correctly when a tab is marked as a preview tab", () => {
    const {wrapper} = setup({ preview: true });
    expect(wrapper.find(Tab).at(0).prop("isItalic")).toEqual(true);
    wrapper.unmount();
  });
  it("should NOT apply blurred classname if passing hasFocus prop", () => {
    const {wrapper} = setup({ hasFocus: true });
    expect(wrapper.find(".blurred").exists()).toEqual(false);
    wrapper.unmount();
  });
  it("should invoke onSplitViews when clicking the split button", () => {
    const onSplitViews = jest.fn();
    const splitButtonIndex = 0;
    const {wrapper} = setup({ onSplitViews });
    wrapper.find(Button).at(splitButtonIndex).simulate("click");
    expect(onSplitViews).toHaveBeenCalled();
    wrapper.unmount();
  });
  it("should save the open file when clicking the save button", () => {
    const {wrapper, getFile} = setup({ simulateDirtyFile: true });
    expect(getFile().isDirty).toEqual(true);
    expect(wrapper.find(Button).at(1).prop("isDisabled")).toEqual(false);
    wrapper.find(Button).at(1).simulate("click");
    expect(getFile().isDirty).toEqual(false);
    wrapper.unmount();
  });
  it("should invoke onClickView when clicking a tab", () => {
    const onClickView = jest.fn();
    const {wrapper} = setup({ onClickView });
    wrapper.find(Tab).at(0).simulate("click");
    expect(onClickView).toHaveBeenCalled();
    wrapper.unmount();
  });
  it("should invoke onDoubleClickView when double clicking a tab", () => {
    const onDoubleClickView = jest.fn();
    const {wrapper} = setup({ onDoubleClickView });
    wrapper.find(Tab).at(0).simulate("doubleClick");
    expect(onDoubleClickView).toHaveBeenCalled();
    wrapper.unmount();
  });
  it("should invoke onNewFile when double clicking the tabs compontent", () => {
    const onNewFile = jest.fn();
    const {wrapper} = setup({ onNewFile });
    wrapper.find(".tabs-tab-container").at(0).simulate("doubleClick");
    expect(onNewFile).toHaveBeenCalled();
    wrapper.unmount();
  });
  it("should invoke onClose when closing a tab", () => {
    const onClose = jest.fn();
    const {wrapper} = setup({ onClose });
    wrapper.find(Tab).at(0).find(".close").simulate("click");
    expect(onClose).toHaveBeenCalled();
    wrapper.unmount();
  });
  it("should invoke onFocus when clicking the editor-pane-container", () => {
    const onFocus = jest.fn();
    const {wrapper} = setup({ onFocus });
    wrapper.find(".editor-pane-container").simulate("click");
    expect(onFocus).toHaveBeenCalled();
    wrapper.unmount();
  });
  it("should register a listener for appStore.onDidChangeDirty on mount", () => {
    registerMock.mockClear();
    const {wrapper} = setup({});
    expect(registerMock).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
  it("should unregister the listener for appStore.onDidChangeDirty on unmount", () => {
    unregisterMock.mockClear();
    const {wrapper} = setup({});
    wrapper.unmount();
    expect(unregisterMock).toHaveBeenCalledTimes(1);
  });
});
