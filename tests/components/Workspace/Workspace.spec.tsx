/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { Project, FileType } from "../../../src/models";
import { Workspace } from "../../../src/components/Workspace";
import { Header } from "../../../src/components/Header";
import { Split, SplitOrientation } from "../../../src/components/Split";
import { DirectoryTree } from "../../../src/components/DirectoryTree";
import appStore from "../../../src/stores/AppStore";

function createProject() {
  const project = new Project();
  const src = project.newDirectory("src");
  const fileA = src.newFile("fileA", FileType.JavaScript);
  const fileB = src.newFile("fileB", FileType.JavaScript);
  return { project, fileA, fileB };
}

describe("Tests for Workspace", () => {
  const setup = (props?) => {
    const { project, fileA, fileB } = createProject();
    const wrapper = shallow(<Workspace file={fileA} project={project} {...props} />);
    return { wrapper, project, fileA, fileB };
  };
  it("should render correctly", () => {
    const onNewFile = jest.fn();
    const onNewDirectory = jest.fn();
    const onEditFile = jest.fn();
    const onDeleteFile = jest.fn();
    const onUploadFile = jest.fn();
    const onMoveFile = jest.fn();
    const onClickFile = jest.fn();
    const onDoubleClickFile = jest.fn();
    const onCreateGist = jest.fn();
    const { wrapper, project, fileA } = setup({
      onNewFile,
      onNewDirectory,
      onEditFile,
      onDeleteFile,
      onUploadFile,
      onMoveFile,
      onClickFile,
      onDoubleClickFile,
      onCreateGist
    });
    const header = wrapper.find(Header);
    const split = wrapper.find(Split);
    const directoryTree = wrapper.find(DirectoryTree);
    expect(header).toExist();
    expect(split).toHaveProp("orientation", SplitOrientation.Horizontal);
    expect(split).toHaveProp("splits", []);
    expect(split.parent()).toHaveStyle({ height: "calc(100% - 41px)" });
    expect(directoryTree).toHaveProp("directory", project);
    expect(directoryTree).toHaveProp("value", fileA);
    expect(directoryTree).toHaveProp("onNewFile", onNewFile);
    expect(directoryTree).toHaveProp("onNewDirectory", onNewDirectory);
    expect(directoryTree).toHaveProp("onEditFile", onEditFile);
    expect(directoryTree).toHaveProp("onDeleteFile", onDeleteFile);
    expect(directoryTree).toHaveProp("onUploadFile", onUploadFile);
    expect(directoryTree).toHaveProp("onMoveFile", onMoveFile);
    expect(directoryTree).toHaveProp("onClickFile", onClickFile);
    expect(directoryTree).toHaveProp("onDoubleClickFile", onDoubleClickFile);
    expect(directoryTree).toHaveProp("onCreateGist", onCreateGist);
  });
  it("should update state when split changes", () => {
    const { wrapper } = setup();
    const split = wrapper.find(Split);
    const onChange = split.prop("onChange");
    const splits = [1, 2, 3];
    onChange(splits);
    expect(wrapper).toHaveState({ splits });
  });
  it("should register event listeners on mount", () => {
    const registerOnDidChangeDirty = jest.spyOn(appStore.onDidChangeDirty, "register");
    const registerOnDidChangeChildren = jest.spyOn(appStore.onDidChangeChildren, "register");
    const { wrapper } = setup();
    expect(registerOnDidChangeDirty).toHaveBeenCalled();
    expect(registerOnDidChangeChildren).toHaveBeenCalled();
  });
  it("should unregister event listeners on mount", () => {
    const unregisterOnDidChangeDirty = jest.spyOn(appStore.onDidChangeDirty, "unregister");
    const unregisterOnDidChangeChildren = jest.spyOn(appStore.onDidChangeChildren, "unregister");
    const { wrapper } = setup();
    wrapper.unmount();
    expect(unregisterOnDidChangeDirty).toHaveBeenCalled();
    expect(unregisterOnDidChangeChildren).toHaveBeenCalled();
  });
});
