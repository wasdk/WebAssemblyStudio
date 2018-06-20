/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import appStore from "../../../src/stores/AppStore";
import dispatcher from "../../../src/dispatcher";
import { AppActionType } from "../../../src/actions/AppActions";
import { Project, Directory, File, FileType, ModelRef } from "../../../src/models";
import { View } from "../../../src/components/editor";
import { ViewType } from "../../../src/components/editor/View";

function setupSpies() {
  const onDidChangeStatus = jest.spyOn(appStore.onDidChangeStatus, "dispatch");
  const onDidChangeProblems = jest.spyOn(appStore.onDidChangeProblems, "dispatch");
  const onChange = jest.spyOn(appStore.onChange, "dispatch");
  const onDirtyFileUsed = jest.spyOn(appStore.onDirtyFileUsed, "dispatch");
  const onDidChangeBuffer = jest.spyOn(appStore.onDidChangeBuffer, "dispatch");
  const onDidChangeData = jest.spyOn(appStore.onDidChangeData, "dispatch");
  const onDidChangeDirty = jest.spyOn(appStore.onDidChangeDirty, "dispatch");
  const onDidChangeChildren = jest.spyOn(appStore.onDidChangeChildren, "dispatch");
  return {
    onDidChangeStatus,
    onDidChangeProblems,
    onChange,
    onDirtyFileUsed,
    onDidChangeBuffer,
    onDidChangeData,
    onDidChangeDirty,
    onDidChangeChildren,
    tearDown() {
      onDidChangeStatus.mockRestore();
      onDidChangeProblems.mockRestore();
      onChange.mockRestore();
      onDirtyFileUsed.mockRestore();
      onDidChangeBuffer.mockRestore();
      onDidChangeData.mockRestore();
      onDidChangeDirty.mockRestore();
      onDidChangeChildren.mockRestore();
    }
  };
}

function loadProjectWithFiles() {
  const project = new Project();
  const fileA = project.newFile("fileA", FileType.JavaScript);
  const fileB = project.newFile("fileB", FileType.JavaScript);
  dispatcher.dispatch({ type: AppActionType.LOAD_PROJECT, project });
  return { fileA, fileB };
}

function loadProjectAndOpenFiles() {
  const files = loadProjectWithFiles();
  dispatcher.dispatch({ type: AppActionType.OPEN_FILES, files: [["fileA"], ["fileB"]]});
  return files;
}

describe("AppStore tests", () => {
  beforeEach(() => {
    // Reset the store before running each test
    dispatcher.dispatch({ type: AppActionType.INIT_STORE });
  });
  it("should handle action: INIT_STORE", () => {
    const project = appStore.getProject().getModel();
    const activeTabGroup = appStore.getActiveTabGroup();
    const tabGroups = appStore.getTabGroups();
    const output = appStore.getOutput().getModel();
    expect(project.list()).toEqual([]);
    expect(activeTabGroup.views).toEqual([]);
    expect(activeTabGroup.currentView).toBeNull();
    expect(tabGroups).toEqual([activeTabGroup]);
    expect(output.name).toEqual("output");
    expect(appStore.getIsContentModified()).toEqual(false);
  });
  it("should bind project events to the store on action: INIT_STORE", () => {
    const project = appStore.getProject().getModel();
    const spies = setupSpies();
    project.onDidChangeStatus.dispatch();
    project.onDidChangeProblems.dispatch();
    project.onChange.dispatch();
    project.onDirtyFileUsed.dispatch();
    project.onDidChangeBuffer.dispatch();
    project.onDidChangeData.dispatch();
    project.onDidChangeDirty.dispatch();
    project.onDidChangeChildren.dispatch();
    expect(spies.onDidChangeStatus).toHaveBeenCalled();
    expect(spies.onDidChangeProblems).toHaveBeenCalled();
    expect(spies.onChange).toHaveBeenCalled();
    expect(spies.onDirtyFileUsed).toHaveBeenCalled();
    expect(spies.onDidChangeBuffer).toHaveBeenCalled();
    expect(spies.onDidChangeData).toHaveBeenCalled();
    expect(spies.onDidChangeDirty).toHaveBeenCalled();
    expect(spies.onDidChangeChildren).toHaveBeenCalled();
    spies.tearDown();
  });
  it("should handle action: LOAD_PROJECT", () => {
    const onLoad = jest.fn();
    const newProject = new Project();
    const newFileName = "test-project";
    const newFile = newProject.newFile(newFileName, FileType.JavaScript);
    appStore.onLoadProject.register(onLoad);
    dispatcher.dispatch({ type: AppActionType.LOAD_PROJECT, project: newProject });
    const project = appStore.getProject().getModel();
    expect(project.getFile(newFileName)).toBe(newFile);
    expect(onLoad).toHaveBeenCalled();
    expect(appStore.getIsContentModified()).toEqual(false);
    appStore.onLoadProject.unregister(onLoad);
  });
  it("should bind project events to the store on action: LOAD_PROJECT", () => {
    const newProject = new Project();
    dispatcher.dispatch({ type: AppActionType.LOAD_PROJECT, project: newProject });
    const spies = setupSpies();
    newProject.onDidChangeStatus.dispatch();
    newProject.onDidChangeProblems.dispatch();
    newProject.onChange.dispatch();
    newProject.onDirtyFileUsed.dispatch();
    newProject.onDidChangeBuffer.dispatch();
    newProject.onDidChangeData.dispatch();
    newProject.onDidChangeDirty.dispatch();
    newProject.onDidChangeChildren.dispatch();
    expect(spies.onDidChangeStatus).toHaveBeenCalled();
    expect(spies.onDidChangeProblems).toHaveBeenCalled();
    expect(spies.onChange).toHaveBeenCalled();
    expect(spies.onDirtyFileUsed).toHaveBeenCalled();
    expect(spies.onDidChangeBuffer).toHaveBeenCalled();
    expect(spies.onDidChangeData).toHaveBeenCalled();
    expect(spies.onDidChangeDirty).toHaveBeenCalled();
    expect(spies.onDidChangeChildren).toHaveBeenCalled();
    spies.tearDown();
  });
  it("should set isContentModified to true if onDidChangeData fires on the project", () => {
    const project = appStore.getProject().getModel();
    project.onDidChangeData.dispatch();
    expect(appStore.getIsContentModified()).toEqual(true);
  });
  it("should set isContentModified to true if onDidChangeChildren fires on the project", () => {
    const project = appStore.getProject().getModel();
    project.onDidChangeChildren.dispatch();
    expect(appStore.getIsContentModified()).toEqual(true);
  });
  it("should handle action: CLEAR_PROJECT_MODIFIED (when project is modified)", () => {
    const project = appStore.getProject().getModel();
    const onDidChangeIsContentModified = jest.fn();
    project.onDidChangeData.dispatch();
    appStore.onDidChangeIsContentModified.register(onDidChangeIsContentModified);
    dispatcher.dispatch({ type: AppActionType.CLEAR_PROJECT_MODIFIED });
    expect(appStore.getIsContentModified()).toEqual(false);
    expect(onDidChangeIsContentModified).toHaveBeenCalled();
    appStore.onDidChangeIsContentModified.unregister(onDidChangeIsContentModified);
  });
  it("should handle action: CLEAR_PROJECT_MODIFIED (when project is NOT modified)", () => {
    const onDidChangeIsContentModified = jest.fn();
    appStore.onDidChangeIsContentModified.register(onDidChangeIsContentModified);
    dispatcher.dispatch({ type: AppActionType.CLEAR_PROJECT_MODIFIED });
    expect(appStore.getIsContentModified()).toEqual(false);
    expect(onDidChangeIsContentModified).not.toHaveBeenCalled();
    appStore.onDidChangeIsContentModified.unregister(onDidChangeIsContentModified);
  });
  it("should handle action: ADD_FILE_TO (when file does not have a parent)", () => {
    const parent = new Directory("parent");
    const file = new File("file", FileType.JavaScript);
    dispatcher.dispatch({ type: AppActionType.ADD_FILE_TO, file, parent });
    expect(file.parent).toBe(parent);
  });
  it("should handle action: ADD_FILE_TO (when file has a parent)", () => {
    const parent = new Directory("parent");
    const newParent = new Directory("newParent");
    const file = parent.newFile("file", FileType.JavaScript);
    dispatcher.dispatch({ type: AppActionType.ADD_FILE_TO, file, parent: newParent });
    expect(file.parent).toBe(newParent);
    expect(parent.getFile("file")).toBeUndefined();
  });
  it("should handle action: DELETE_FILE", () => {
    const parent = new Directory("parent");
    const file = parent.newFile("file", FileType.JavaScript);
    dispatcher.dispatch({ type: AppActionType.DELETE_FILE, file });
    expect(parent.getFile("file")).toBeUndefined();
    expect(file.parent).not.toBe(parent);
  });
  it("should handle action: UPDATE_FILE_NAME_AND_DESCRIPTION", () => {
    const parent = new Directory("parent");
    const file = parent.newFile("file", FileType.JavaScript);
    const newFileName = "newFileName";
    const newFileDescription = "newFileDescription";
    dispatcher.dispatch({
      type: AppActionType.UPDATE_FILE_NAME_AND_DESCRIPTION,
      name: newFileName,
      description: newFileDescription,
      file
    });
    expect(file.name).toEqual(newFileName);
    expect(file.description).toEqual(newFileDescription);
  });
  it("should handle action: OPEN_VIEW", () => {
    const onTabsChange = jest.fn();
    const view = new View(new File("file", FileType.JavaScript));
    appStore.onTabsChange.register(onTabsChange);
    dispatcher.dispatch({ type: AppActionType.OPEN_VIEW, view });
    expect(onTabsChange).toHaveBeenCalled();
    expect(appStore.getActiveTabGroup().currentView).toBe(view);
    appStore.onTabsChange.unregister(onTabsChange);
  });
  it("should handle action: OPEN_VIEW (preview)", () => {
    const view = new View(new File("file", FileType.JavaScript));
    dispatcher.dispatch({ type: AppActionType.OPEN_VIEW, view, preview: true });
    expect(appStore.getActiveTabGroup().preview).toBe(view);
  });
  it("should handle action: CLOSE_VIEW", () => {
    const onTabsChange = jest.fn();
    const { fileB } = loadProjectAndOpenFiles();
    appStore.onTabsChange.register(onTabsChange);
    dispatcher.dispatch({ type: AppActionType.CLOSE_VIEW, view: appStore.getActiveTabGroup().currentView });
    expect(onTabsChange).toHaveBeenCalled();
    expect(appStore.getActiveTabGroup().currentView.file).toEqual(fileB);
    expect(appStore.getTabGroups().length).toEqual(1);
    appStore.onTabsChange.unregister(onTabsChange);
  });
  it("should handle action: CLOSE_TABS", () => {
    const onTabsChange = jest.fn();
    const { fileA, fileB } = loadProjectAndOpenFiles();
    appStore.onTabsChange.register(onTabsChange);
    dispatcher.dispatch({ type: AppActionType.CLOSE_TABS, file: fileA });
    expect(onTabsChange).toHaveBeenCalled();
    expect(appStore.getActiveTabGroup().currentView.file).toBe(fileB);
    expect(appStore.getTabGroups().length).toEqual(1);
    appStore.onTabsChange.unregister(onTabsChange);
  });
  it("should handle action: FOCUS_TAB_GROUP", () => {
    const onTabsChange = jest.fn();
    const { fileB } = loadProjectAndOpenFiles();
    appStore.onTabsChange.register(onTabsChange);
    dispatcher.dispatch({ type: AppActionType.FOCUS_TAB_GROUP, group: appStore.getTabGroups()[1]});
    expect(onTabsChange).toHaveBeenCalled();
    expect(appStore.getActiveTabGroup().currentView.file).toBe(fileB);
    appStore.onTabsChange.unregister(onTabsChange);
  });
  it("should handle action: OPEN_FILE", () => {
    const onTabsChange = jest.fn();
    const file = new File("fileA", FileType.JavaScript);
    const viewType = ViewType.Editor;
    appStore.onTabsChange.register(onTabsChange);
    dispatcher.dispatch({ type: AppActionType.OPEN_FILE, file, viewType });
    expect(onTabsChange).toHaveBeenCalled();
    expect(appStore.getActiveTabGroup().currentView.file).toBe(file);
    appStore.onTabsChange.unregister(onTabsChange);
  });
  it("should handle action: OPEN_FILE (preview)", () => {
    const file = new File("fileA", FileType.JavaScript);
    const viewType = ViewType.Editor;
    dispatcher.dispatch({ type: AppActionType.OPEN_FILE, file, viewType, preview: true });
    expect(appStore.getActiveTabGroup().preview.file).toBe(file);
  });
  it("should handle action: OPEN_FILES", () => {
    const onTabsChange = jest.fn();
    const { fileA } = loadProjectWithFiles();
    appStore.onTabsChange.register(onTabsChange);
    dispatcher.dispatch({ type: AppActionType.OPEN_FILES, files: [["fileA"], ["fileB"]]});
    expect(onTabsChange).toHaveBeenCalled();
    expect(appStore.getActiveTabGroup().currentView.file).toBe(fileA);
    appStore.onTabsChange.unregister(onTabsChange);
  });
  it("should handle action: OPEN_FILES (when no files are provided)", () => {
    expect(() => {
      dispatcher.dispatch({ type: AppActionType.OPEN_FILES, files: [[]]});
    }).toThrowError();
  });
  it("should handle action: SPLIT_GROUP (when activeTabGroup contains views)", () => {
    const onTabsChange = jest.fn();
    const fileA = new File("fileA", FileType.JavaScript);
    const fileB = new File("fileB", FileType.JavaScript);
    dispatcher.dispatch({ type: AppActionType.OPEN_FILE, file: fileA });
    dispatcher.dispatch({ type: AppActionType.OPEN_FILE, file: fileB });
    appStore.onTabsChange.register(onTabsChange);
    dispatcher.dispatch({ type: AppActionType.SPLIT_GROUP });
    const [tabGroup1, tabGroup2] = appStore.getTabGroups();
    expect(onTabsChange).toHaveBeenCalled();
    expect(appStore.getActiveTabGroup()).toBe(tabGroup2);
    expect(tabGroup1.currentView.file).toBe(fileB);
    expect(tabGroup1.views).toEqual([tabGroup1.currentView]);
    expect(tabGroup2.currentView.file).toBe(fileB);
    expect(tabGroup2.views).toEqual([tabGroup1.currentView]);
    expect(tabGroup1).not.toBe(tabGroup2);
    appStore.onTabsChange.unregister(onTabsChange);
  });
  it("should handle action: SPLIT_GROUP (when activeTabGroup contains no view)", () => {
    const onTabsChange = jest.fn();
    appStore.onTabsChange.register(onTabsChange);
    dispatcher.dispatch({ type: AppActionType.SPLIT_GROUP });
    expect(onTabsChange).not.toHaveBeenCalled();
    appStore.onTabsChange.unregister(onTabsChange);
  });
  it("should handle action: SET_VIEW_TYPE", () => {
    const onTabsChange = jest.fn();
    const view = new View(new File("file", FileType.Markdown), ViewType.Editor);
    appStore.onTabsChange.register(onTabsChange);
    dispatcher.dispatch({ type: AppActionType.SET_VIEW_TYPE, view, viewType: ViewType.Markdown });
    expect(onTabsChange).toHaveBeenCalled();
    expect(view.type).toEqual(ViewType.Markdown);
    appStore.onTabsChange.unregister(onTabsChange);
  });
  it("should handle action: LOG_LN", () => {
    const onOutputChanged = jest.fn();
    const model = appStore.getOutput().getModel().buffer;
    const applyEdits = jest.spyOn(model, "applyEdits");
    appStore.onOutputChanged.register(onOutputChanged);
    dispatcher.dispatch({ type: AppActionType.LOG_LN, message: "test", kind: "error" });
    expect(applyEdits).toHaveBeenCalled();
    appStore.onOutputChanged.unregister(onOutputChanged);
  });
  it("should handle action: LOG_LN (when no kind is provided)", () => {
    const onOutputChanged = jest.fn();
    const model = appStore.getOutput().getModel().buffer;
    const applyEdits = jest.spyOn(model, "applyEdits");
    appStore.onOutputChanged.register(onOutputChanged);
    dispatcher.dispatch({ type: AppActionType.LOG_LN, message: "test" });
    expect(applyEdits).toHaveBeenCalled();
    appStore.onOutputChanged.unregister(onOutputChanged);
  });
  it("should handle action: PUSH_STATUS", () => {
    dispatcher.dispatch({ type: AppActionType.PUSH_STATUS, status: "test" });
    expect(appStore.getStatus()).toEqual("test");
  });
  it("should handle action: POP_STATUS", () => {
    dispatcher.dispatch({ type: AppActionType.PUSH_STATUS, status: "test1" });
    dispatcher.dispatch({ type: AppActionType.PUSH_STATUS, status: "test2" });
    dispatcher.dispatch({ type: AppActionType.POP_STATUS });
    expect(appStore.getStatus()).toEqual("test1");
  });
  it("should handle action: SANDBOX_RUN", () => {
    const onSandboxRun = jest.fn();
    appStore.onSandboxRun.register(onSandboxRun);
    dispatcher.dispatch({ type: AppActionType.SANDBOX_RUN, src: "test" });
    expect(onSandboxRun).toHaveBeenCalledWith({
      project: appStore.getProject().getModel(),
      src: "test"
    });
    appStore.onSandboxRun.unregister(onSandboxRun);
  });
  it("should return a ModelRef to the file when calling getFileByName", () => {
    const project = new Project();
    const file = project.newFile("file", FileType.JavaScript);
    dispatcher.dispatch({ type: AppActionType.LOAD_PROJECT, project });
    expect(appStore.getFileByName("file").getModel()).toBe(file);
  });
  it("should return null if no file is found when calling getFileByName", () => {
    expect(appStore.getFileByName("file")).toBeNull();
  });
  it("should return files data as string when calling getFileSource", () => {
    const project = new Project();
    const file = project.newFile("file", FileType.JavaScript);
    file.setData("test");
    dispatcher.dispatch({ type: AppActionType.LOAD_PROJECT, project });
    const fileRef = appStore.getFileByName("file");
    expect(appStore.getFileSource(fileRef)).toEqual("test");
  });
  it("should return a ModelRef to the parent when calling getParent", () => {
    const directory = new Directory("dir");
    const file = directory.newFile("file", FileType.JavaScript);
    expect(appStore.getParent(ModelRef.getRef(file)).getModel()).toBe(directory);
  });
  it("should return null if no parent is found when calling getParent", () => {
    const file = new File("file", FileType.JavaScript);
    expect(appStore.getParent(ModelRef.getRef(file))).toBeNull();
  });
  it("should return the path as a string when calling getPath", () => {
    const dirA = new Directory("dirA");
    const dirB = dirA.newDirectory("dirB");
    expect(appStore.getPath(ModelRef.getRef(dirB))).toEqual("dirA/dirB");
  });
});
