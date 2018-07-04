/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import { mount } from "enzyme";
import { Directory, ModelRef, File, FileType, Project } from "../../../src/models";
import * as appActions from "../../../src/actions/AppActions";

const layout = jest.fn();
const setInput = jest.fn();
const onDidSelect = jest.fn();
const refresh = jest.fn();
const expandAll = jest.fn();
const treeConstructor = jest.fn();

const Service = {
  assembleWatWithWabt: jest.fn(),
  assembleWatWithBinaryen: jest.fn(),
  clangFormat: jest.fn(),
  convertWasmToAsmWithBinaryen: jest.fn(),
  disassembleWasmWithWabt: jest.fn(),
  disassembleWasmWithBinaryen: jest.fn(),
  disassembleX86: jest.fn(),
  download: jest.fn(),
  getWasmCallGraphWithBinaryen: jest.fn(),
  optimizeWasmWithBinaryen: jest.fn(),
  openBinaryExplorer: jest.fn(),
  twiggyWasm: jest.fn(),
  validateWasmWithBinaryen: jest.fn()
};

const Actions = {
  Assemble: { id: "x", label: "Assemble", cssClass: "octicon-file-binary ruler", enabled: true },
  AssembleWBinyaren: { id: "x", label: "Assemble w/ Binaryen", cssClass: "octicon-file-binary", enabled: true },
  ClangFormat: { id: "x", label: "Clang-Format", cssClass: "octicon-quote ruler", enabled: true },
  Validate: { id: "x", label: "Validate", cssClass: "octicon-check ruler", enabled: true },
  Optimize: { id: "x", label: "Optimize", cssClass: "octicon-gear", enabled: true },
  Dissassemble: { id: "x", label: "Disassemble", cssClass: "octicon-file-code", enabled: true },
  DisassembleWBinaryen: { id: "x", label: "Disassemble w/ Binaryen", cssClass: "octicon-file-code", enabled: true },
  ASM: { id: "x", label: "To asm.js", cssClass: "octicon-file-code", enabled: true },
  CallGraph: { id: "x", label: "Generate Call Graph", cssClass: "octicon-gear", enabled: true },
  X86: { id: "x", label: "To Firefox x86", cssClass: "octicon-file-binary", enabled: true },
  X86Baseline: { id: "x", label: "To Firefox x86 Baseline", cssClass: "octicon-file-binary", enabled: true },
  BinaryExplorer: { id: "x", label: "Binary Explorer", cssClass: "octicon-file-binary", enabled: true },
  ViewAsBinary: { id: "x", label: "View as Binary", cssClass: "octicon-file-binary", enabled: true },
  Twiggy: { id: "x", label: "Twiggy", cssClass: "octicon-file-binary", enabled: true },
  Download: { id: "x", label: "Download", cssClass: "octicon-cloud-download", enabled: true },
  Gist: { id: "x", label: "Create Gist", cssClass: "octicon-gist", enabled: true },
  Delete: { id: "x", label: "Delete", cssClass: "octicon-x", enabled: true },
  Edit: { id: "x", label: "Edit", cssClass: "octicon-pencil", enabled: true },
  NewFile: { id: "x", label: "New File", cssClass: "octicon-file-add", enabled: true },
  NewDirectory: { id: "x", label: "New Directory", cssClass: "octicon-file-add", enabled: true },
  Upload: { id: "x", label: "Upload Files", cssClass: "octicon-cloud-upload", enabled: true }
};

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
      expandAll,
      layout
    })),
    Action: jest.fn().mockImplementation((id, label, cssClass, enabled, actionCallback) => ({
      id, label, cssClass, enabled, actionCallback
    }))
  }
}));

jest.mock("../../../src/service.ts", () => ({
  Service
}));

import { DirectoryTree } from "../../../src/components/DirectoryTree";
import { DragAndDrop } from "../../../src/monaco-dnd";
import { FileTemplate } from "../../../src/utils/Template";
import { ViewType } from "../../../src/components/editor/View";

describe("Tests for DirectoryTree", () => {
  const setup = (props?) => {
    const directory = new Directory("src");
    const wrapper = mount(<DirectoryTree directory={ModelRef.getRef(directory)} {...props} />);
    const instance = wrapper.instance() as DirectoryTree;
    const getActions = (file) => instance.getActions(file, {} as any);
    return { directory, wrapper, instance, getActions };
  };
  beforeAll(() => {
    appActions.initStore();
  });
  afterAll(() => {
    jest.unmock("../../../src/monaco-utils.ts");
    jest.unmock("../../../src/service.ts");
    jest.restoreAllMocks();
  });
  describe("onLayout", () => {
    it("should add a layout event listener on mount", () => {
      const addEventListener = jest.spyOn(document, "addEventListener");
      const { wrapper } = setup();
      expect(addEventListener).toHaveBeenCalled();
      expect(addEventListener.mock.calls[0][0]).toEqual("layout");
      addEventListener.mockRestore();
      wrapper.unmount();
    });
    it("should remove the layout event listener on unmount", () => {
      const removeEventListener = jest.spyOn(document, "removeEventListener");
      const { wrapper } = setup();
      wrapper.unmount();
      expect(removeEventListener).toHaveBeenCalled();
      expect(removeEventListener.mock.calls[0][0]).toEqual("layout");
      removeEventListener.mockRestore();
    });
    it("should call tree.layout when receiving layout events", () => {
      const { wrapper } = setup();
      layout.mockClear();
      document.dispatchEvent(new Event("layout"));
      expect(layout).toHaveBeenCalled();
      wrapper.unmount();
    });
  });
  describe("onClickFile", () => {
    it("should handle clicks on files", () => {
      onDidSelect.mockClear();
      const onClickFile = jest.fn();
      const { wrapper } = setup({ onClickFile });
      const onSelectFn = onDidSelect.mock.calls[0][0];
      const file = new File("file", FileType.JavaScript);
      onSelectFn({ selection: [file] });
      expect(onClickFile).toHaveBeenCalledWith(file);
      expect((wrapper.instance() as DirectoryTree).lastClickedFile).toBe(file);
      wrapper.unmount();
    });
    it("should handle clicks on directories", () => {
      onDidSelect.mockClear();
      const onClickFile = jest.fn();
      const { wrapper } = setup({ onClickFile });
      const onSelectFn = onDidSelect.mock.calls[0][0];
      const directory = new Directory("src");
      onSelectFn({ selection: [directory] });
      expect(onClickFile).not.toHaveBeenCalled();
      expect((wrapper.instance() as DirectoryTree).lastClickedFile).toBeNull();
      wrapper.unmount();
    });
    it("should handle double clicks on files", () => {
      onDidSelect.mockClear();
      const onDoubleClickFile = jest.fn();
      const { wrapper } = setup({ onDoubleClickFile });
      const onSelectFn = onDidSelect.mock.calls[0][0];
      const file = new File("file", FileType.JavaScript);
      onSelectFn({ selection: [file] });
      onSelectFn({ selection: [file] });
      expect(onDoubleClickFile).toHaveBeenCalledWith(file);
      expect((wrapper.instance() as DirectoryTree).lastClickedFile).toBe(file);
      wrapper.unmount();
    });
    it("should ignore clicks that's not on a file/directory", () => {
      onDidSelect.mockClear();
      const { wrapper } = setup();
      const onSelectFn = onDidSelect.mock.calls[0][0];
      const onClickFile = jest.spyOn((wrapper.instance() as any), "onClickFile");
      onSelectFn({ selection: [] });
      expect(onClickFile).not.toHaveBeenCalled();
      wrapper.unmount();
    });
  });
  describe("Tree", () => {
    beforeEach(() => {
      treeConstructor.mockClear();
    });
    it("should create a Tree when the DirectoryTree component mounts", () => {
      const { wrapper } = setup();
      expect(treeConstructor).toHaveBeenCalled();
      wrapper.unmount();
    });
    it("should set the tree input to the provided directory on mount", () => {
      setInput.mockClear();
      const { wrapper, directory } = setup();
      expect(setInput).toHaveBeenCalledWith(directory);
      wrapper.unmount();
    });
    it("should update the tree input on new props (new directory)", () => {
      setInput.mockClear();
      const { wrapper } = setup();
      const newDirectory = new Directory("newDirectory");
      wrapper.setProps({ directory: ModelRef.getRef(newDirectory) });
      expect(wrapper).toHaveState({ directory: ModelRef.getRef(newDirectory) });
      expect(setInput).toHaveBeenCalledWith(newDirectory);
      wrapper.unmount();
    });
    it("should refresh and expand the tree on new props (same directory)", () => {
      const { wrapper } = setup();
      refresh.mockClear();
      expandAll.mockClear();
      wrapper.setProps({});
      expect(refresh).toHaveBeenCalledTimes(1);
      expect(expandAll).toHaveBeenCalledTimes(1);
      wrapper.unmount();
    });
    it("should pass a HTMLDivElement to the Tree constructor", () => {
      const { wrapper } = setup();
      const container = treeConstructor.mock.calls[0][0];
      expect(container).toBeInstanceOf(HTMLDivElement);
      wrapper.unmount();
    });
    it("should pass a dataSource object to the Tree constructor", async () => {
      const { wrapper } = setup();
      const dataSource = treeConstructor.mock.calls[0][1].dataSource;
      const directory = new Directory("directory");
      const file = directory.newFile("file", FileType.JavaScript);
      expect(dataSource.getId(null, { key: 1 })).toEqual(1);
      expect(dataSource.hasChildren(null, file)).toEqual(false);
      expect(dataSource.hasChildren(null, directory)).toEqual(true);
      await expect(dataSource.getChildren(null, file)).resolves.toBeUndefined();
      await expect(dataSource.getChildren(null, directory)).resolves.toEqual([file]);
      await expect(dataSource.getParent(null, file)).resolves.toEqual(directory);
      await expect(dataSource.getParent(null, directory)).resolves.toBeNull();
      wrapper.unmount();
    });
    it("should pass a renderer object to the Tree constructor", () => {
      const { wrapper } = setup();
      const renderer = treeConstructor.mock.calls[0][1].renderer;
      // tslint:disable-next-line
      const setSpy = jest.spyOn(FileTemplate.prototype, "set").mockImplementation(() => {});
      // tslint:disable-next-line
      const disposeSpy = jest.spyOn(FileTemplate.prototype, "dispose").mockImplementation(() => {});
      const file = new File("file", FileType.JavaScript);
      const element = document.createElement("div");
      const template = renderer.renderTemplate(null, "file", element);
      expect(renderer.getHeight()).toEqual(24);
      expect(renderer.renderTemplate(null, "file", element)).toBeInstanceOf(FileTemplate);
      renderer.renderElement(null, element, "file", template);
      renderer.disposeTemplate(null, "file", template);
      expect(setSpy).toHaveBeenCalledWith(element);
      expect(disposeSpy).toHaveBeenCalled();
      wrapper.unmount();
    });
    it("should pass a controller to the Tree constructor", () => {
      const { wrapper } = setup();
      const controller = treeConstructor.mock.calls[0][1].controller;
      expect(controller).toBeDefined();
      wrapper.unmount();
    });
    it("should pass a DragAndDrop instance to the Tree constructor", () => {
      const { wrapper } = setup();
      const dnd = treeConstructor.mock.calls[0][1].dnd;
      expect(dnd).toBeInstanceOf(DragAndDrop);
      wrapper.unmount();
    });
  });
  describe("getActions", () => {
    describe("Upload actions", () => {
      it("should add the correct actions if passing the onlyUploadActions prop", () => {
        const onEditFile = jest.fn();
        const onDeleteFile = jest.fn();
        const { wrapper, getActions } = setup({ onEditFile, onDeleteFile, onlyUploadActions: true });
        const parent = new Directory("parent");
        const file = parent.newFile("file", FileType.JavaScript);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions).toHaveLength(2);
        expect(actions[0]).toMatchObject({ id: "x", label: "Delete", cssClass: "octicon-x", enabled: true });
        expect(actions[1]).toMatchObject({ id: "x", label: "Edit", cssClass: "octicon-pencil", enabled: true });
        expect(onEditFile).toHaveBeenCalledWith(file);
        expect(onDeleteFile).toHaveBeenCalledWith(file);
        wrapper.unmount();
      });
      it("should return an empty actions array if the file/directory does not have a parent", () => {
        const onEditFile = jest.fn();
        const onDeleteFile = jest.fn();
        const { wrapper, getActions } = setup({ onEditFile, onDeleteFile, onlyUploadActions: true });
        const file = new File("file", FileType.JavaScript);
        const actions = getActions(file);
        expect(actions).toHaveLength(0);
        wrapper.unmount();
      });
      it("should return an empty actions array by default", () => {
        const { wrapper, getActions } = setup({ onlyUploadActions: true });
        const file = new File("file", FileType.JavaScript);
        const actions = getActions(file);
        expect(actions).toHaveLength(0);
        wrapper.unmount();
      });
    });
    describe("Directory actions", () => {
      it("should add the correct actions for directories", () => {
        Service.download.mockClear();
        const onNewFile = jest.fn();
        const onNewDirectory = jest.fn();
        const onUploadFile = jest.fn();
        const onEditFile = jest.fn();
        const onDeleteFile = jest.fn();
        const { wrapper, getActions } = setup({ onNewFile, onNewDirectory, onUploadFile, onEditFile, onDeleteFile });
        const directory = new Directory("directory");
        const actions = getActions(directory);
        actions.forEach(action => action.actionCallback());
        expect(actions).toHaveLength(6);
        expect(actions[0]).toMatchObject(Actions.NewFile);
        expect(actions[1]).toMatchObject(Actions.NewDirectory);
        expect(actions[2]).toMatchObject(Actions.Upload);
        expect(actions[3]).toMatchObject(Actions.Edit);
        expect(actions[4]).toMatchObject(Actions.Delete);
        expect(actions[5]).toMatchObject(Actions.Download);
        expect(Service.download).toHaveBeenCalledWith(directory);
        expect(onNewFile).toHaveBeenCalledWith(directory);
        expect(onNewDirectory).toHaveBeenCalledWith(directory);
        expect(onUploadFile).toHaveBeenCalledWith(directory);
        expect(onEditFile).toHaveBeenCalledWith(directory);
        expect(onDeleteFile).toHaveBeenCalledWith(directory);
        wrapper.unmount();
      });
      it("should add the correct actions for projects", () => {
        const onNewFile = jest.fn();
        const onNewDirectory = jest.fn();
        const onUploadFile = jest.fn();
        const { wrapper, getActions } = setup({ onNewFile, onNewDirectory, onUploadFile });
        const project = new Project();
        const actions = getActions(project);
        actions.forEach(action => action.actionCallback());
        expect(actions).toHaveLength(3);
        expect(actions[0]).toMatchObject(Actions.NewFile);
        expect(actions[1]).toMatchObject(Actions.NewDirectory);
        expect(actions[2]).toMatchObject(Actions.Upload);
        expect(onNewFile).toHaveBeenCalledWith(project);
        expect(onNewDirectory).toHaveBeenCalledWith(project);
        expect(onUploadFile).toHaveBeenCalledWith(project);
        wrapper.unmount();
      });
      it("should only add a download action by default (directory)", () => {
        const { wrapper, getActions } = setup();
        const directory = new Directory("directory");
        const actions = getActions(directory);
        expect(actions).toHaveLength(1);
        expect(actions[0]).toMatchObject(Actions.Download);
        wrapper.unmount();
      });
      it("should only add a download action by default (project)", () => {
        const { wrapper, getActions } = setup();
        const project = new Project();
        const actions = getActions(project);
        expect(actions).toHaveLength(0);
        wrapper.unmount();
      });
    });
    describe("Common file actions", () => {
      it("should add the correct actions for files", () => {
        Service.download.mockClear();
        const onNewFile = jest.fn();
        const onNewDirectory = jest.fn();
        const onUploadFile = jest.fn();
        const onEditFile = jest.fn();
        const onDeleteFile = jest.fn();
        const { wrapper, getActions } = setup({ onNewFile, onNewDirectory, onUploadFile, onEditFile, onDeleteFile });
        const file = new File("file", FileType.JavaScript);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions).toHaveLength(3);
        expect(actions[0]).toMatchObject(Actions.Edit);
        expect(actions[1]).toMatchObject(Actions.Delete);
        expect(actions[2]).toMatchObject(Actions.Download);
        expect(Service.download).toHaveBeenCalledWith(file);
        expect(onEditFile).toHaveBeenCalledWith(file);
        expect(onDeleteFile).toHaveBeenCalledWith(file);
        wrapper.unmount();
      });
      it("should only add the download action by default", () => {
        const { wrapper, getActions } = setup();
        const file = new File("file", FileType.JavaScript);
        const actions = getActions(file);
        expect(actions).toHaveLength(1);
        expect(actions[0]).toMatchObject(Actions.Download);
        wrapper.unmount();
      });
    });
    describe("Gist", () => {
      it("should add the gist action if passing the onCreateGist prop", () => {
        const onCreateGist = jest.fn();
        const { wrapper, getActions } = setup({ onCreateGist });
        const file = new File("file", FileType.JavaScript);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions).toHaveLength(2);
        expect(actions[0]).toMatchObject(Actions.Download);
        expect(actions[1]).toMatchObject(Actions.Gist);
        expect(onCreateGist).toHaveBeenCalledWith(file);
        wrapper.unmount();
      });
      it("should never add the gist action for binary file types", () => {
        const onCreateGist = jest.fn();
        const { wrapper, getActions } = setup({ onCreateGist });
        const file = new File("file", FileType.Wasm);
        const actions = getActions(file);
        const gistActions = actions.filter(action => action.label === "Create Gist");
        expect(gistActions).toHaveLength(0);
        wrapper.unmount();
      });
    });
    describe("Wasm actions", () => {
      const alert = jest.spyOn(window, "alert");
      const openFile = jest.spyOn(appActions, "openFile");
      beforeEach(() => {
        Service.validateWasmWithBinaryen.mockClear();
        Service.optimizeWasmWithBinaryen.mockClear();
        Service.disassembleWasmWithWabt.mockClear();
        Service.convertWasmToAsmWithBinaryen.mockClear();
        Service.getWasmCallGraphWithBinaryen.mockClear();
        Service.disassembleX86.mockClear();
        Service.openBinaryExplorer.mockClear();
        Service.twiggyWasm.mockClear();
        // tslint:disable-next-line
        alert.mockImplementation(() => {});
        // tslint:disable-next-line
        openFile.mockImplementation(() => {});
      });
      afterAll(() => {
        alert.mockRestore();
        openFile.mockRestore();
      });
      it("should add the correct number of actions (12)", () => {
        const { wrapper, getActions } = setup();
        const file = new File("file", FileType.Wasm);
        const actions = getActions(file);
        expect(actions).toHaveLength(12);
        wrapper.unmount();
      });
      it("should add action: Validate", async () => {
        alert.mockClear();
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Wasm);
        const actions = getActions(file);
        await actions.forEach(async action => await action.actionCallback());
        expect(actions[1]).toMatchObject(Actions.Validate);
        expect(Service.validateWasmWithBinaryen).toHaveBeenCalledWith(file, instance.status);
        expect(alert).toHaveBeenCalledWith("Module is not valid");
        wrapper.unmount();
      });
      it("should add action: Optimize", () => {
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Wasm);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions[2]).toMatchObject(Actions.Optimize);
        expect(Service.optimizeWasmWithBinaryen).toHaveBeenCalledWith(file, instance.status);
        wrapper.unmount();
      });
      it("should add action: Disassemble", () => {
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Wasm);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions[3]).toMatchObject(Actions.Dissassemble);
        expect(Service.disassembleWasmWithWabt).toHaveBeenCalledWith(file, instance.status);
        wrapper.unmount();
      });
      it("should add action: Disassemble w/ Binaryen", () => {
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Wasm);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions[4]).toMatchObject(Actions.DisassembleWBinaryen);
        expect(Service.disassembleWasmWithBinaryen).toHaveBeenCalledWith(file, instance.status);
        wrapper.unmount();
      });
      it("should add action: To asm.js", () => {
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Wasm);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions[5]).toMatchObject(Actions.ASM);
        expect(Service.convertWasmToAsmWithBinaryen).toHaveBeenCalledWith(file, instance.status);
        wrapper.unmount();
      });
      it("should add action: Generate Call Graph", () => {
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Wasm);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions[6]).toMatchObject(Actions.CallGraph);
        expect(Service.getWasmCallGraphWithBinaryen).toHaveBeenLastCalledWith(file, instance.status);
        wrapper.unmount();
      });
      it("should add action: To Firefox x86", () => {
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Wasm);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions[7]).toMatchObject(Actions.X86);
        expect(Service.disassembleX86).toHaveBeenCalledWith(file, instance.status);
        wrapper.unmount();
      });
      it("should add action: To Firefox x86 Baseline", () => {
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Wasm);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions[8]).toMatchObject(Actions.X86Baseline);
        expect(Service.disassembleX86).toHaveBeenCalledWith(file, instance.status, "--wasm-always-baseline");
        wrapper.unmount();
      });
      it("should add action: Binary Explorer", () => {
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Wasm);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions[9]).toMatchObject(Actions.BinaryExplorer);
        expect(Service.openBinaryExplorer).toHaveBeenCalledWith(file);
        wrapper.unmount();
      });
      it("should add action: View as Binary", () => {
        openFile.mockClear();
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Wasm);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions[10]).toMatchObject(Actions.ViewAsBinary);
        expect(openFile).toHaveBeenCalledWith(file, ViewType.Binary, false);
        wrapper.unmount();
      });
      it("should add action: Twiggy", () => {
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Wasm);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions[11]).toMatchObject(Actions.Twiggy);
        expect(Service.twiggyWasm).toHaveBeenCalledWith(file, instance.status);
        wrapper.unmount();
      });
    });
    describe("C/C++ actions", () => {
      beforeEach(() => {
        Service.clangFormat.mockClear();
      });
      it("should add the correct number of actions (2)", () => {
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Cpp);
        const actions = getActions(file);
        expect(actions).toHaveLength(2);
        wrapper.unmount();
      });
      it("should add action: Clang-Format (C files)", () => {
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.C);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions[1]).toMatchObject(Actions.ClangFormat);
        expect(Service.clangFormat).toHaveBeenCalledWith(file, instance.status);
        wrapper.unmount();
      });
      it("should add action: Clang-Format (C++ files)", () => {
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Cpp);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions[1]).toMatchObject(Actions.ClangFormat);
        expect(Service.clangFormat).toHaveBeenCalledWith(file, instance.status);
        wrapper.unmount();
      });
    });
    describe("Wat actions", () => {
      beforeEach(() => {
        Service.assembleWatWithWabt.mockClear();
        Service.assembleWatWithBinaryen.mockClear();
      });
      it("should the correct number of actions (3)", () => {
        const { wrapper, getActions } = setup();
        const file = new File("file", FileType.Wat);
        const actions = getActions(file);
        expect(actions).toHaveLength(3);
        wrapper.unmount();
      });
      it("should add action: Assemble", () => {
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Wat);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions[1]).toMatchObject(Actions.Assemble);
        expect(Service.assembleWatWithWabt).toHaveBeenCalledWith(file, instance.status);
        wrapper.unmount();
      });
      it("should add action: Assemble w/ Binaryen", () => {
        const { wrapper, instance, getActions } = setup();
        const file = new File("file", FileType.Wat);
        const actions = getActions(file);
        actions.forEach(action => action.actionCallback());
        expect(actions[2]).toMatchObject(Actions.AssembleWBinyaren);
        expect(Service.assembleWatWithBinaryen).toHaveBeenCalledWith(file, instance.status);
        wrapper.unmount();
      });
    });
  });
});
