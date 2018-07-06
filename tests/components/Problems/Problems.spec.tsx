/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import { mount, render } from "enzyme";
import { File, FileType, Problem, Directory, Project } from "../../../src/models";
import { ViewType } from "../../../src/components/editor/View";
import * as appActions from "../../../src/actions/AppActions";
import appStore from "../../../src/stores/AppStore";

declare var monaco: { MarkerSeverity };

const setInput = jest.fn();
const onDidSelect = jest.fn();
const refresh = jest.fn();
const expandAll = jest.fn();
const treeConstructor = jest.fn();

jest.mock("../../../src/monaco-utils.ts", () => ({
  MonacoUtils: {
    ContextViewService: jest.fn(),
    ContextMenuService: jest.fn(),
    TreeDefaults: {
      DefaultController: jest.fn()
    },
    Tree: treeConstructor.mockImplementation(() => ({
      model: { setInput, onDidSelect },
      refresh,
      expandAll
    }))
  }
}));

import { FileTemplate, ProblemTemplate } from "../../../src/utils/Template";
import { Problems } from "../../../src/components/Problems";

describe("Tests for Problems component", () => {
  const setup = () => {
    return mount(<Problems />);
  };
  beforeAll(() => {
    appActions.initStore();
  });
  afterAll(() => {
    jest.unmock("../../../src/monaco-utils.ts");
  });
  it("should register a listener for onDidChangeProblems events on mount", () => {
    const registerOnDidChangeProblems = jest.spyOn(appStore.onDidChangeProblems, "register");
    const wrapper = setup();
    const onChangeFn = registerOnDidChangeProblems.mock.calls[0][0];
    refresh.mockClear();
    expandAll.mockClear();
    onChangeFn();
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(expandAll).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
  it("should register a listener for onLoadProject events on mount", () => {
    const registerOnLoadProject = jest.spyOn(appStore.onLoadProject, "register");
    const wrapper = setup();
    const onLoadFn = registerOnLoadProject.mock.calls[0][0];
    setInput.mockClear();
    onLoadFn();
    expect(setInput).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
  it("should handle selections (Problem)", () => {
    onDidSelect.mockClear();
    const wrapper = setup();
    const openFile = jest.spyOn(appActions, "openFile");
    const onSelectFn = onDidSelect.mock.calls[0][0];
    const file = new File("file", FileType.JavaScript);
    const problem = new Problem(file, "", "info");
    onSelectFn({ selection: [problem] });
    expect(openFile).toHaveBeenCalledWith(file, ViewType.Editor, true);
    openFile.mockRestore();
    wrapper.unmount();
  });
  it("should handle selections (File)", () => {
    onDidSelect.mockClear();
    const wrapper = setup();
    const openFile = jest.spyOn(appActions, "openFile");
    const onSelectFn = onDidSelect.mock.calls[0][0];
    const file = new File("file", FileType.JavaScript);
    onSelectFn({ selection: [file] });
    expect(openFile).not.toHaveBeenCalled();
    openFile.mockRestore();
    wrapper.unmount();
  });
  it("should ignore empty selections", () => {
    onDidSelect.mockClear();
    const wrapper = setup();
    const onSelectFn = onDidSelect.mock.calls[0][0];
    const onSelectProblem = jest.spyOn((wrapper.instance() as any), "onSelectProblem");
    onSelectFn({ selection: [] });
    expect(onSelectProblem).not.toHaveBeenCalled();
    wrapper.unmount();
  });
  describe("Tree", () => {
    beforeEach(() => {
      treeConstructor.mockClear();
    });
    it("should create a Tree when the Problems component mounts", () => {
      const wrapper = setup();
      expect(treeConstructor).toHaveBeenCalled();
      wrapper.unmount();
    });
    it("should refresh and expand the tree on new props", () => {
      const wrapper = setup();
      refresh.mockClear();
      expandAll.mockClear();
      wrapper.setProps({});
      expect(refresh).toHaveBeenCalledTimes(1);
      expect(expandAll).toHaveBeenCalledTimes(1);
      wrapper.unmount();
    });
    it("should set the tree input to the current project on mount", () => {
      setInput.mockClear();
      const wrapper = setup();
      expect(setInput).toHaveBeenCalledWith(appStore.getProject().getModel());
      wrapper.unmount();
    });
    it("should pass a HTMLDivElement to the Tree constructor", () => {
      const wrapper = setup();
      const container = treeConstructor.mock.calls[0][0];
      expect(container).toBeInstanceOf(HTMLDivElement);
      wrapper.unmount();
    });
    it("should pass a dataSource object to the Tree constructor", async () => {
      const wrapper = setup();
      const dataSource = treeConstructor.mock.calls[0][1].dataSource;
      const project = new Project();
      const directoryA = project.newDirectory("dirA");
      const directoryB = project.newDirectory("dirB");
      const fileA = directoryB.newFile("fileA", FileType.JavaScript);
      const fileB = directoryB.newFile("fileB", FileType.JavaScript);
      const problem = new Problem(fileB, "", "info");
      fileB.setProblems([problem]);
      expect(dataSource.getId(null, { key: 1 })).toEqual(1);
      expect(dataSource.hasChildren(null, null)).toEqual(false);
      expect(dataSource.hasChildren(null, fileA)).toEqual(false);
      expect(dataSource.hasChildren(null, directoryA)).toEqual(false);
      expect(dataSource.hasChildren(null, fileB)).toEqual(true);
      expect(dataSource.hasChildren(null, directoryB)).toEqual(true);
      expect(dataSource.getChildren(null, null)).toEqual(null);
      await expect(dataSource.getChildren(null, fileA)).resolves.toEqual([]);
      await expect(dataSource.getChildren(null, fileB)).resolves.toEqual([problem]);
      await expect(dataSource.getChildren(null, directoryB)).resolves.toEqual([fileB]);
      await expect(dataSource.getParent(null, fileB)).resolves.toEqual(project);
      await expect(dataSource.getParent(null, problem)).resolves.toEqual(fileB);
      wrapper.unmount();
    });
    it("should pass a renderer object to the Tree constructor", () => {
      const wrapper = setup();
      const renderer = treeConstructor.mock.calls[0][1].renderer;
      // tslint:disable-next-line
      const setSpy = jest.spyOn(ProblemTemplate.prototype, "set").mockImplementation(() => {});
      // tslint:disable-next-line
      const disposeSpy = jest.spyOn(ProblemTemplate.prototype, "dispose").mockImplementation(() => {});
      const file = new File("file", FileType.JavaScript);
      const problem = new Problem(file, "", "info");
      const element = document.createElement("div");
      const template = renderer.renderTemplate(null, "problem", element);
      expect(renderer.getHeight()).toEqual(24);
      expect(renderer.getTemplateId(null, file)).toEqual("file");
      expect(renderer.getTemplateId(null, problem)).toEqual("problem");
      expect(renderer.renderTemplate(null, "file", element)).toBeInstanceOf(FileTemplate);
      expect(renderer.renderTemplate(null, "problem", element)).toBeInstanceOf(ProblemTemplate);
      renderer.renderElement(null, element, "problem", template);
      renderer.disposeTemplate(null, "problem", template);
      expect(setSpy).toHaveBeenCalledWith(element);
      expect(disposeSpy).toHaveBeenCalled();
      wrapper.unmount();
    });
    it("should pass a controller to the Tree constructor", () => {
      const wrapper = setup();
      const controller = treeConstructor.mock.calls[0][1].controller;
      expect(controller).toBeDefined();
      wrapper.unmount();
    });
  });
});
