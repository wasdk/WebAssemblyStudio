/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import dispatcher from "../../../src/dispatcher";
import Group from "../../../src/utils/group";
import { FileType, File, Directory, Project } from "../../../src/models";
import { View, ViewType } from "../../../src/components/editor/View";
import { Service } from "../../../src/service";
import { Template } from "../../../src/components/NewProjectDialog";

const runTask = jest.fn();
const getFileByName = jest.fn();
const RewriteSourcesContext = jest.fn();
const rewriteHTML = jest.fn();

jest.mock("../../../src/stores/AppStore", () => ({
  default: {
    getTabGroups: () => [
      { views: [{ file: { getPath: () => "path" }}] }
    ],
    getProject: () => ({
      getModel: () => "model"
    }),
    getFileSource: () => "source",
    getFileByName
  }
}));

jest.mock("../../../src/utils/taskRunner", () => ({
  RunTaskExternals: {
    Default: 0,
    Arc: 1,
    Setup: 2
  },
  runTask
}));

jest.mock("../../../src/utils/rewriteSources", () => ({
  RewriteSourcesContext,
  rewriteHTML
}));

import * as AppActions from "../../../src/actions/AppActions";
import { RunTaskExternals } from "../../../src/utils/taskRunner";
import { AppActionType } from "../../../src/actions/AppActions";

describe("AppActions component", () => {
  afterAll(() => {
    jest.unmock("../../../src/stores/AppStore");
    jest.unmock("../../../src/utils/taskRunner");
    jest.unmock("../../../src/utils/rewriteSources");
    jest.restoreAllMocks();
  });
  it("should dispatch ADD_FILE_TO on action: addFileTo", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const file = new File("file", FileType.JavaScript);
    const parent = new Directory("parent");
    AppActions.addFileTo(file, parent);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.ADD_FILE_TO,
      file,
      parent,
    });
    dispatch.mockRestore();
  });
  it("should dispatch LOAD_PROJECT on action: loadProject", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const project = new Project();
    AppActions.loadProject(project);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.LOAD_PROJECT,
      project
    });
    dispatch.mockRestore();
  });
  it("should dispatch INIT_STORE on action: initStore", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    AppActions.initStore();
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.INIT_STORE,
    });
    dispatch.mockRestore();
  });
  it("should dispatch UPDATE_FILE_NAME_AND_DESCRIPTION on action: updateFileNameAndDescription", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const file = new File("file", FileType.JavaScript);
    const name = "newName";
    const description = "newDescription";
    AppActions.updateFileNameAndDescription(file, name, description);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.UPDATE_FILE_NAME_AND_DESCRIPTION,
      file,
      name,
      description
    });
    dispatch.mockRestore();
  });
  it("should dispatch DELETE_FILE on action: deleteFile", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const parent = new Directory("parent");
    const file = parent.newFile("file", FileType.JavaScript);
    AppActions.deleteFile(file);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.DELETE_FILE,
      file,
    });
    dispatch.mockRestore();
  });
  it("should dispatch LOG_LN on action: logLn", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const message = "test";
    const kind = "error";
    AppActions.logLn(message, kind);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.LOG_LN,
      message,
      kind
    });
    dispatch.mockRestore();
  });
  it("should default kind to empty string when dispatching LOG_LN", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const message = "test";
    AppActions.logLn(message);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.LOG_LN,
      message,
      kind: ""
    });
    dispatch.mockRestore();
  });
  it("should dispatch SPLIT_GROUP on action: splitGroup", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    AppActions.splitGroup();
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.SPLIT_GROUP
    });
    dispatch.mockRestore();
  });
  it("should dispatch OPEN_VIEW on action: openView", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const view = new View(new File("file", FileType.JavaScript));
    const preview = false;
    AppActions.openView(view, preview);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.OPEN_VIEW,
      view,
      preview
    });
    dispatch.mockRestore();
  });
  it("should default preview to true when dispatching OPEN_VIEW", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const view = new View(new File("file", FileType.JavaScript));
    AppActions.openView(view);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.OPEN_VIEW,
      view,
      preview: true
    });
    dispatch.mockRestore();
  });
  it("should dispatch CLOSE_VIEW on action: closeView", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const view = new View(new File("file", FileType.JavaScript));
    AppActions.closeView(view);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.CLOSE_VIEW,
      view
    });
    dispatch.mockRestore();
  });
  it("should dispatch CLOSE_TABS on action: closeTabs", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const file = new File("file", FileType.JavaScript);
    AppActions.closeTabs(file);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.CLOSE_TABS,
      file
    });
    dispatch.mockRestore();
  });
  it("should dispatch OPEN_FILE on action: openFile", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const file = new File("file", FileType.Markdown);
    const viewType = ViewType.Markdown;
    const preview = false;
    AppActions.openFile(file, viewType, preview);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.OPEN_FILE,
      file,
      viewType,
      preview
    });
    dispatch.mockRestore();
  });
  it("should default viewType to Editor and preview to true when dispatching OPEN_FILE", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const file = new File("file", FileType.Markdown);
    AppActions.openFile(file);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.OPEN_FILE,
      file,
      viewType: ViewType.Editor,
      preview: true
    });
    dispatch.mockRestore();
  });
  it("should dispatch OPEN_FILES on action: openFiles", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const files = [["fileA"], ["fileB"]];
    AppActions.openFiles(files);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.OPEN_FILES,
      files
    });
    dispatch.mockRestore();
  });
  it("should load project files from template on action: openProjectFiles", async () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const loadFilesIntoProject = jest.spyOn(Service, "loadFilesIntoProject");
    const template = {
      files: [{ name: "fileA" }],
      baseUrl: new URL("https://webassembly.studio/")
    } as Template;
    loadFilesIntoProject.mockImplementation(jest.fn);
    await AppActions.openProjectFiles(template);
    expect(loadFilesIntoProject.mock.calls[0][0]).toEqual(template.files);
    expect(loadFilesIntoProject.mock.calls[0][2]).toEqual(template.baseUrl);
    expect(dispatch.mock.calls[0][0].type).toEqual(AppActionType.LOAD_PROJECT);
    expect(dispatch).toHaveBeenCalledTimes(1);
    loadFilesIntoProject.mockRestore();
    dispatch.mockRestore();
  });
  it("should open README.md (if project has one) on action: openProjectFiles", async () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const loadFilesIntoProject = jest.spyOn(Service, "loadFilesIntoProject");
    const template = {} as Template;
    loadFilesIntoProject.mockImplementation((files, project, baseUrl) => {
      project.newFile("README.md");
    });
    await AppActions.openProjectFiles(template);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.OPEN_FILES,
      files: [["README.md"]]
    });
    loadFilesIntoProject.mockRestore();
    dispatch.mockRestore();
  });
  it("should save project on action: saveProject", async () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const saveProjectService = jest.spyOn(Service, "saveProject");
    const fiddle = "fiddle";
    saveProjectService.mockImplementation(jest.fn);
    await AppActions.saveProject(fiddle);
    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.LOG_LN,
      message: "Saving Project ...",
      kind: ""
    });
    expect(saveProjectService).toHaveBeenCalledWith("model", [["path"]], fiddle);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.LOG_LN,
      message: "Saved Project OK",
      kind: ""
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.CLEAR_PROJECT_MODIFIED,
    });
    dispatch.mockRestore();
  });
  it("should dispatch FOCUS_TAB_GROUP on action: focusTabGroup", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const group = new Group(null, []);
    AppActions.focusTabGroup(group);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.FOCUS_TAB_GROUP,
      group
    });
    dispatch.mockRestore();
  });
  it("should dispatch PUSH_STATUS on action: pushStatus", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const status = "status";
    AppActions.pushStatus(status);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.PUSH_STATUS,
      status
    });
    dispatch.mockRestore();
  });
  it("should dispatch POP_STATUS on action: popStatus", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    AppActions.popStatus();
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.POP_STATUS
    });
    dispatch.mockRestore();
  });
  it("should handle action: runTask (given a gulpfile.js)", async () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const optional = true;
    const externals = RunTaskExternals.Arc;
    getFileByName.mockImplementation((file) => file === "gulpfile.js");
    await AppActions.runTask("build-gulp", optional, externals);
    expect(runTask).toHaveBeenCalledWith("source", "build-gulp", optional, "model", AppActions.logLn, externals);
    dispatch.mockRestore();
  });
  it("should handle action: runTask (given a build.ts)", async () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    getFileByName.mockImplementation((file) => {
      if (file === "build.ts") {
        return {
          getModel: () => ({
            getEmitOutput: () => ({ outputFiles: [{ text: "outputfile" }]})
          })
        };
      }
    });
    await AppActions.runTask("build-ts");
    expect(runTask).toHaveBeenCalledWith("outputfile", "build-ts", false, "model", AppActions.logLn, 0);
    dispatch.mockRestore();
  });
  it("should handle action: runTask (given a build.js)", async () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    getFileByName.mockImplementation((file) => file === "build.js");
    await AppActions.runTask("build-js");
    expect(runTask).toHaveBeenCalledWith("source", "build-js", false, "model", AppActions.logLn, 0);
    dispatch.mockRestore();
  });
  it("should log error on action: runTask (if build file is missing)", async () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    runTask.mockReset();
    getFileByName.mockImplementation(() => false);
    await AppActions.runTask("build-error");
    expect(runTask).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.LOG_LN,
      message: "Build File (build.ts / build.js) is missing.",
      kind: "error"
    });
    dispatch.mockRestore();
  });
  it("should handle action: run", async () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const src = "src";
    const context = {} as any;
    const createObjectURL = jest.fn();
    window.URL.createObjectURL = createObjectURL;
    RewriteSourcesContext.mockImplementation(() => context);
    rewriteHTML.mockImplementation(() => src);
    await AppActions.run();
    expect(RewriteSourcesContext).toHaveBeenCalledWith("model");
    expect(rewriteHTML).toHaveBeenCalledWith(context, "src/main.html");
    expect(dispatch).toHaveBeenCalledWith({ type: AppActionType.SANDBOX_RUN, src });
    dispatch.mockRestore();
  });
  it("should add a createFile function to the context passed along to rewriteHTML", async () => {
    const context = {} as any;
    const createObjectURL = jest.fn();
    window.URL.createObjectURL = createObjectURL;
    RewriteSourcesContext.mockImplementation(() => context);
    rewriteHTML.mockImplementation(() => true);
    await AppActions.run();
    context.createFile("test", "testType");
    expect(createObjectURL.mock.calls[0][0].size).toEqual(4);
    expect(createObjectURL.mock.calls[0][0].type).toEqual("testtype");
  });
  it("should log error on action: run (if run fails)", async () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const src = false;
    const context = {};
    RewriteSourcesContext.mockReset();
    rewriteHTML.mockReset();
    RewriteSourcesContext.mockImplementation(() => context);
    rewriteHTML.mockImplementation(() => src);
    await AppActions.run();
    expect(dispatch).not.toHaveBeenCalledWith({ type: AppActionType.SANDBOX_RUN, src });
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.LOG_LN,
      message: "Cannot translate and open src/main.html",
      kind: ""
    });
    dispatch.mockRestore();
  });
  it("should handle action: build", async () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    getFileByName.mockImplementation((file) => file === "gulpfile.js");
    await AppActions.build();
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.PUSH_STATUS,
      status: "Building Project"
    });
    expect(runTask).toHaveBeenCalledWith("source", "default", false, "model", AppActions.logLn, 0);
    expect(dispatch).toHaveBeenCalledWith({ type: AppActionType.POP_STATUS });
    dispatch.mockRestore();
  });
  it("should dispatch SET_VIEW_TYPE on action: setViewType", () => {
    const dispatch = jest.spyOn(dispatcher, "dispatch");
    const view = new View(new File("file", FileType.Markdown));
    const viewType = ViewType.Markdown;
    AppActions.setViewType(view, viewType);
    expect(dispatch).toHaveBeenCalledWith({
      type: AppActionType.SET_VIEW_TYPE,
      view,
      viewType
    });
    dispatch.mockRestore();
  });
});
