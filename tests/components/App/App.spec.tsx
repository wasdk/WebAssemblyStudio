/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

/* tslint:disable: no-empty */

import "jest-enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import * as appActions from "../../../src/actions/AppActions";
import * as arcActions from "../../../src/actions/ArcActions";
import * as utils from "../../../src/util";
import appStore from "../../../src/stores/AppStore";
import { Project, ModelRef, File, FileType, Directory } from "../../../src/models";
import { RunTaskExternals } from "../../../src/utils/taskRunner";
import { Toolbar } from "../../../src/components/Toolbar";
import { Button } from "../../../src/components/shared/Button";
import { ShareDialog } from "../../../src/components/ShareDialog";
import { NewProjectDialog } from "../../../src/components/NewProjectDialog";
import { Template } from "../../../src/utils/Template";
import { NewFileDialog } from "../../../src/components/NewFileDialog";
import { EditFileDialog } from "../../../src/components/EditFileDialog";
import { UploadFileDialog } from "../../../src/components/UploadFileDialog";
import { NewDirectoryDialog } from "../../../src/components/NewDirectoryDialog";
import { Split } from "../../../src/components/Split";
import { Workspace } from "../../../src/components/Workspace";
import { ViewType, View } from "../../../src/components/editor/View";
import { ControlCenter } from "../../../src/components/ControlCenter";
import { ViewTabs } from "../../../src/components/editor";

function wait(duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

function mockFetch(returnValue) {
  (global as any).fetch = jest.fn().mockImplementation(() => Promise.resolve(returnValue));
  return { restore: () => (global as any).fetch = undefined };
}

function createActionSpies() {
  const spies = {
    initStore: jest.spyOn(appActions, "initStore"),
    runTask: jest.spyOn(appActions, "runTask"),
    logLn: jest.spyOn(appActions, "logLn"),
    pushStatus: jest.spyOn(appActions, "pushStatus"),
    popStatus: jest.spyOn(appActions, "popStatus"),
    loadProject: jest.spyOn(appActions, "loadProject"),
    openFiles: jest.spyOn(appActions, "openFiles"),
    build: jest.spyOn(appActions, "build"),
    run: jest.spyOn(appActions, "run"),
    publishArc: jest.spyOn(arcActions, "publishArc"),
    saveProject: jest.spyOn(appActions, "saveProject"),
    notifyArcAboutFork: jest.spyOn(arcActions, "notifyArcAboutFork"),
    openProjectFiles: jest.spyOn(appActions, "openProjectFiles"),
    addFileTo: jest.spyOn(appActions, "addFileTo"),
    updateFileNameAndDescription: jest.spyOn(appActions, "updateFileNameAndDescription"),
    deleteFile: jest.spyOn(appActions, "deleteFile"),
    closeTabs: jest.spyOn(appActions, "closeTabs"),
    openFile: jest.spyOn(appActions, "openFile"),
    splitGroup: jest.spyOn(appActions, "splitGroup"),
    focusTabGroup: jest.spyOn(appActions, "focusTabGroup"),
    setViewType: jest.spyOn(appActions, "setViewType"),
    openView: jest.spyOn(appActions, "openView"),
    closeView: jest.spyOn(appActions, "closeView")
  };
  spies.logLn.mockImplementation(() => {});
  spies.runTask.mockImplementation(() => {});
  spies.loadProject.mockImplementation(() => {});
  spies.openFiles.mockImplementation(() => {});
  spies.build.mockImplementation(() => Promise.resolve());
  spies.run.mockImplementation(() => Promise.resolve());
  spies.publishArc.mockImplementation(() => Promise.resolve());
  spies.saveProject.mockImplementation(() => {});
  spies.notifyArcAboutFork.mockImplementation(() => {});
  spies.openProjectFiles.mockImplementation(() => {});
  spies.addFileTo.mockImplementation(() => {});
  spies.updateFileNameAndDescription.mockImplementation(() => {});
  spies.deleteFile.mockImplementation(() => {});
  spies.closeTabs.mockImplementation(() => {});
  spies.openFile.mockImplementation(() => {});
  spies.splitGroup.mockImplementation(() => {});
  spies.focusTabGroup.mockImplementation(() => {});
  spies.setViewType.mockImplementation(() => {});
  spies.openView.mockImplementation(() => {});
  spies.closeView.mockImplementation(() => {});
  const restore = () => (Object as any).entries(spies).forEach(([_, value]) => value.mockRestore());
  return { ...spies, restore };
}

function createMockService() {
  const loadJSON = jest.fn();
  const loadFilesIntoProject = jest.fn();
  const saveProject = jest.fn();
  const exportToGist = jest.fn();
  return {
    loadJSON,
    loadFilesIntoProject,
    saveProject,
    exportToGist,
    clear: () => {
      loadJSON.mockClear();
      loadFilesIntoProject.mockClear();
      saveProject.mockClear();
      exportToGist.mockClear();
    }
  };
}

function createMockDownloadService() {
  const downloadProject = jest.fn();
  return {
    downloadProject,
    clear: () => {
      downloadProject.mockClear();
    }
  };
}

const Service = createMockService();
jest.mock("../../../src/service", () => ({ Service }));

const downloadService = createMockDownloadService();
jest.mock("../../../src/utils/download", () => ({ ...downloadService }));

import { App, EmbeddingParams, AppWindowContext, EmbeddingType } from "../../../src/components/App";

describe("Tests for App", () => {
  const setup = (props: any = {}) => {
    return shallow(
    <App
      update={props.update || false}
      fiddle={props.fiddle || null}
      embeddingParams={props.embeddingParams || {} as EmbeddingParams}
      windowContext={props.windowContext || {} as AppWindowContext}
    />);
  };
  beforeAll(() => {
    // Silence output from console.log & console.error
    const error = jest.spyOn(console, "error");
    const log = jest.spyOn(console, "log");
    error.mockImplementation(() => {});
    log.mockImplementation(() => {});
  });
  afterAll(() => {
    jest.unmock("../../../src/service");
    jest.unmock("../../../src/utils/download");
    jest.restoreAllMocks();
  });
  describe("constructor", () => {
    it("should have the correct initial state", () => {
      (global as any).innerWidth = 1024;
      (global as any).innerHeight = 768;
      (global as any).devicePixelRatio = 1;
      const wrapper = setup();
      expect(wrapper).toHaveState("fiddle", null);
      expect(wrapper).toHaveState("file", null);
      expect(wrapper).toHaveState("newFileDialogDirectory", null);
      expect(wrapper).toHaveState("editFileDialogFile", null);
      expect(wrapper).toHaveState("newProjectDialog", true);
      expect(wrapper).toHaveState("shareDialog", false);
      expect(wrapper).toHaveState("editorSplits", []);
      expect(wrapper).toHaveState("showProblems", true);
      expect(wrapper).toHaveState("showSandbox", true);
      expect(wrapper).toHaveState("uploadFileDialogDirectory", null);
      expect(wrapper).toHaveState("newDirectoryDialog", null);
      expect(wrapper).toHaveState("windowDimensions", "1024x768@1");
      expect(wrapper).toHaveState("hasStatus", false);
      expect(wrapper).toHaveState("isContentModified", false);
      expect(wrapper).toHaveState("workspaceSplits", [
        { min: 200, max: 400, value: 200 },
        { min: 256 }
      ]);
      expect(wrapper).toHaveState("controlCenterSplits", [
        { min: 100 },
        { min: 40, value: 256 }
      ]);
    });
  });
  describe("componentWillMount", () => {
    describe("initStore", () => {
      it("should initialize the appStore", () => {
        const { initStore, restore } = createActionSpies();
        const wrapper = setup();
        expect(initStore).toHaveBeenCalled();
        restore();
      });
    });
    describe("setState", () => {
      it("should set the state based on appStore data", () => {
        const wrapper = setup();
        expect(wrapper).toHaveState("project", appStore.getProject());
        expect(wrapper).toHaveState("tabGroups", appStore.getTabGroups());
        expect(wrapper).toHaveState("activeTabGroup", appStore.getActiveTabGroup());
        expect(wrapper).toHaveState("hasStatus", appStore.hasStatus());
      });
    });
    describe("bindAppStoreEvents", () => {
      it("should bind onLoadProject events", () => {
        const { runTask, loadProject, restore } = createActionSpies();
        const wrapper = setup();
        const project = new Project();
        loadProject.mockRestore();
        appActions.loadProject(project);
        expect(wrapper).toHaveState("project", ModelRef.getRef(project));
        expect(runTask).toHaveBeenCalledWith("project:load", true, RunTaskExternals.Setup);
        restore();
      });
      it("should bind onDirtyFileUsed events", () => {
        const { logLn, restore } = createActionSpies();
        const wrapper = setup();
        const file = new File("fileA.js", FileType.JavaScript);
        appStore.onDirtyFileUsed.dispatch(file);
        expect(logLn).toHaveBeenCalledWith("Changes in fileA.js were ignored, save your changes.", "warn");
        restore();
      });
      it("should bind onTabsChange events", () => {
        const wrapper = setup();
        const layout = jest.spyOn(utils, "layout");
        const file = new File("file", FileType.JavaScript);
        appActions.openFile(file);
        expect(wrapper.state().activeTabGroup.currentView.file).toBe(file);
        expect(layout).toHaveBeenCalled();
        layout.mockRestore();
      });
      it("should bind onDidChangeStatus events", () => {
        const wrapper = setup();
        expect(wrapper).toHaveState("hasStatus", false);
        appActions.pushStatus("test");
        expect(wrapper).toHaveState("hasStatus", true);
      });
      it("should bind onDidChangeIsContentModified events", () => {
        const windowContext = { promptWhenClosing: false };
        const wrapper = setup({ windowContext });
        const project = appStore.getProject().getModel();
        const file = project.newFile("file", FileType.JavaScript);
        expect(windowContext.promptWhenClosing).toEqual(true);
        expect(wrapper).toHaveState("isContentModified", true);
      });
    });
    describe("loadProjectFromFiddle", () => {
      it("should load the project from a fiddle", async () => {
        const { pushStatus, popStatus, loadProject, restore } = createActionSpies();
        const fiddle = { success: true, files: ["fileA.js"] };
        Service.loadJSON.mockImplementation(() => fiddle);
        const wrapper = await setup({ fiddle: "fiddle-url" });
        expect(pushStatus).toHaveBeenCalledWith("Downloading Project");
        expect(Service.loadJSON).toHaveBeenCalledWith("fiddle-url");
        expect(popStatus).toHaveBeenCalled();
        expect(Service.loadFilesIntoProject).toHaveBeenCalled();
        await wait(10); // Wait for loadProject to be called
        expect(loadProject).toHaveBeenCalled();
        Service.clear();
        restore();
      });
      it("should handle errors while loading a fiddle", async () => {
        const showToast = jest.fn();
        const fiddle = { success: false, files: ["fileA.js"] };
        Service.loadJSON.mockImplementation(() => fiddle);
        App.prototype.toastContainer = { showToast } as any;
        const wrapper = await setup({ fiddle: "fiddle-url" });
        expect(shallow(showToast.mock.calls[0][0])).toHaveText("Project fiddle-url was not found.");
        expect(showToast.mock.calls[0][1]).toEqual("error");
        App.prototype.toastContainer = undefined;
        Service.clear();
      });
      it("should open the README.md after loading the project (if it exists)", async () => {
        const { openFiles, restore } = createActionSpies();
        const fiddle = { success: true, files: ["fileA.js"] };
        Service.loadJSON.mockImplementation(() => fiddle);
        Service.loadFilesIntoProject.mockImplementation((files, project) => {
          project.newFile("README.md", FileType.Markdown);
        });
        const wrapper = await setup({ fiddle: "fiddle-url" });
        await wait(10); // Wait for openFiles to be called
        expect(openFiles).toHaveBeenCalledWith([["README.md"]]);
        Service.clear();
        restore();
      });
    });
  });
  describe("componentDidMount", () => {
    describe("layout", () => {
      it("should call layout", () => {
        const layout = jest.spyOn(utils, "layout");
        const wrapper = setup();
        expect(layout).toHaveBeenCalled();
        layout.mockRestore();
      });
    });
    describe("registerShortcuts", () => {
      it("should register a build shortcut", () => {
        const bind = jest.spyOn(Mousetrap, "bind");
        const { build, restore } = createActionSpies();
        const wrapper = setup();
        const [shortcut, callback] = bind.mock.calls[0];
        callback();
        expect(shortcut).toEqual("command+b");
        expect(build).toHaveBeenCalled();
        bind.mockRestore();
        restore();
      });
      it("should register a run shortcut", () => {
        const bind = jest.spyOn(Mousetrap, "bind");
        const { run, restore } = createActionSpies();
        const wrapper = setup();
        const [shortcut, callback] = bind.mock.calls[1];
        callback();
        expect(shortcut).toEqual("command+enter");
        expect(run).toHaveBeenCalled();
        bind.mockRestore();
        restore();
      });
      it("should register a run shortcut (Arc)", () => {
        const bind = jest.spyOn(Mousetrap, "bind");
        const { publishArc, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.Arc } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const [shortcut, callback] = bind.mock.calls[1];
        callback();
        expect(shortcut).toEqual("command+enter");
        expect(publishArc).toHaveBeenCalled();
        bind.mockRestore();
        restore();
      });
      it("should register a build & run shortcut", async () => {
        const bind = jest.spyOn(Mousetrap, "bind");
        const { build, run, restore } = createActionSpies();
        const wrapper = setup();
        const [shortcut, callback] = bind.mock.calls[2];
        callback();
        await wait(10); // Wait for build().then(run) Promise chain to finish
        expect(shortcut).toEqual("command+alt+enter");
        expect(build).toHaveBeenCalled();
        expect(run).toHaveBeenCalled();
        bind.mockRestore();
        restore();
      });
      it("should register a build & run shortcut (Arc)", async () => {
        const bind = jest.spyOn(Mousetrap, "bind");
        const { build, publishArc, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.Arc } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const [shortcut, callback] = bind.mock.calls[2];
        callback();
        await wait(10); // Wait for build().then(publishArc) Promise chain to finish
        expect(shortcut).toEqual("command+alt+enter");
        expect(build).toHaveBeenCalled();
        expect(publishArc).toHaveBeenCalled();
        bind.mockRestore();
        restore();
      });
    });
    describe("resize", () => {
      it("should add an event listener for resize events", () => {
        const wrapper = setup();
        (global as any).innerWidth = 1000;
        (global as any).innerHeight = 500;
        (global as any).devicePixelRatio = 2;
        window.dispatchEvent(new Event("resize"));
        expect(wrapper).toHaveState("windowDimensions", "1000x500@2");
      });
    });
  });
  describe("render", () => {
    it("should render correctly", () => {
      const { restore } = createActionSpies();
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      expect(wrapper).toMatchSnapshot();
      restore();
    });
    it("should render correctly (embedded)", () => {
      const { restore } = createActionSpies();
      const embeddingParams = { type: EmbeddingType.Default } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      expect(wrapper).toMatchSnapshot();
      restore();
    });
    it("should render correctly (arc)", () => {
      const { restore } = createActionSpies();
      const embeddingParams = { type: EmbeddingType.Arc } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      expect(wrapper).toMatchSnapshot();
      restore();
    });
    it("should render correctly (update)", () => {
      const { restore } = createActionSpies();
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams, update: true });
      expect(wrapper).toMatchSnapshot();
      restore();
    });
    it("should render correctly (fiddle)", () => {
      const { restore } = createActionSpies();
      const fiddle = { success: false, files: ["fileA.js"] };
      Service.loadJSON.mockImplementation(() => fiddle);
      const wrapper = setup({ fiddle: "fiddle-url" });
      expect(wrapper).toMatchSnapshot();
      restore();
    });
  });
  describe("Toolbar buttons", () => {
    enum ButtonIndex {
      ViewWorkspace,
      Fork,
      Gist,
      Download,
      Share,
      Build,
      Run,
      BuildAndRun,
      Help = 9
    }
    enum UpdateButtonIndex {
      Update = 1
    }
    enum ArcButtonIndex {
      Preview = 3,
      BuildAndPreview
    }
    describe("View Workspace", () => {
      it("should toggle the project explorer when clicking the View Workspace Button", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const toolbar = wrapper.find(Toolbar);
        toolbar.find(Button).at(ButtonIndex.ViewWorkspace).simulate("click");
        expect(wrapper).toHaveState("workspaceSplits", [ { min: 0, max: 0, value: 200 }, { min: 256 } ]);
      });
    });
    describe("Update", () => {
      it("should save the project when clicking the Update button", () => {
        const { saveProject, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const fiddle = "fiddle-url";
        const wrapper = setup({ embeddingParams, fiddle, update: true });
        const toolbar = wrapper.find(Toolbar);
        toolbar.find(Button).at(UpdateButtonIndex.Update).simulate("click");
        expect(saveProject).toHaveBeenCalledWith(fiddle);
        restore();
      });
    });
    describe("Fork", () => {
      it("should invoke App.fork when clicking the Fork button", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const fork = jest.spyOn((wrapper.instance() as App), "fork");
        fork.mockImplementation(() => {});
        const toolbar = wrapper.find(Toolbar);
        toolbar.find(Button).at(ButtonIndex.Fork).simulate("click");
        expect(fork).toHaveBeenCalled();
        fork.mockRestore();
      });
      it("should create a fork", async () => {
        Service.saveProject.mockImplementation(() => "fiddle-url");
        const { pushStatus, popStatus, notifyArcAboutFork, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        await (wrapper.instance() as App).fork();
        expect(pushStatus).toHaveBeenCalledWith("Forking Project");
        expect(popStatus).toHaveBeenCalled();
        expect(window.location.search).toEqual("?f=fiddle-url");
        expect(wrapper).toHaveState("fiddle", "fiddle-url");
        expect(notifyArcAboutFork).not.toHaveBeenCalled();
        restore();
      });
      it("should update the fiddle param in the url", async () => {
        Service.saveProject.mockImplementation(() => "new-fiddle-url");
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = await setup({ embeddingParams, fiddle: "fiddle-url" });
        await (wrapper.instance() as App).fork();
        expect(window.location.search).toEqual("?f=new-fiddle-url");
        expect(wrapper).toHaveState("fiddle", "new-fiddle-url");
      });
      it("should notify arc about the fork", async () => {
        Service.saveProject.mockImplementation(() => "fiddle-url");
        const { notifyArcAboutFork, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.Arc } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        await (wrapper.instance() as App).fork();
        expect(notifyArcAboutFork).toHaveBeenCalledWith("fiddle-url");
        restore();
      });
    });
    describe("Gist", () => {
      it("should invoke App.gist when clicking the Gist button", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const gist = jest.spyOn((wrapper.instance() as App), "gist");
        gist.mockImplementation(() => {});
        const toolbar = wrapper.find(Toolbar);
        toolbar.find(Button).at(ButtonIndex.Gist).simulate("click");
        expect(gist).toHaveBeenCalled();
        gist.mockRestore();
      });
      it("should export the project to a Gist", async () => {
        const { pushStatus, popStatus, restore } = createActionSpies();
        const showToast = jest.fn();
        App.prototype.toastContainer = { showToast } as any;
        Service.exportToGist.mockImplementation(() => "gist-url");
        const fiddle = "fiddle-url";
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams, fiddle });
        await (wrapper.instance() as App).gist();
        expect(pushStatus).toHaveBeenCalledWith("Exporting Project");
        expect(Service.exportToGist).toHaveBeenCalledWith((wrapper.state() as any).project.getModel(), fiddle);
        expect(popStatus).toHaveBeenCalled();
        expect(shallow(showToast.mock.calls[1][0])).toContainReact(<span>"Gist Created!" <a href={"gist-url"} target="_blank" className="toast-span">Open in new tab.</a></span>);
        App.prototype.toastContainer = undefined;
        restore();
      });
      it("should export the provided file to a Gist", async () => {
        Service.exportToGist.mockImplementation(() => "gist-url");
        const file = new File("file", FileType.JavaScript);
        const fiddle = "fiddle-url";
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams, fiddle });
        await (wrapper.instance() as App).gist(file);
        expect(Service.exportToGist).toHaveBeenCalledWith(file, fiddle);
      });
    });
    describe("Download", () => {
      it("should invoke App.download when clicking the Download button", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const download = jest.spyOn((wrapper.instance() as App), "download");
        download.mockImplementation(() => {});
        const toolbar = wrapper.find(Toolbar);
        toolbar.find(Button).at(ButtonIndex.Download).simulate("click");
        expect(download).toHaveBeenCalled();
        download.mockRestore();
      });
      it("should download the project as Zip file", async () => {
        const { logLn, restore } = createActionSpies();
        const fiddle = "fiddle-url";
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams, fiddle });
        const project = (wrapper.state() as any).project.getModel();
        await (wrapper.instance() as App).download();
        expect(logLn.mock.calls[0][0]).toEqual("Downloading Project ...");
        expect(logLn.mock.calls[1][0]).toEqual("Project Zip CREATED ");
        expect(downloadService.downloadProject).toHaveBeenCalledWith(project, fiddle);
        restore();
      });
    });
    describe("Share", () => {
      it("should open a ShareDialog when clicking the Share button", () => {
        const fiddle = "fiddle-url";
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams, fiddle });
        const toolbar = wrapper.find(Toolbar);
        toolbar.find(Button).at(ButtonIndex.Share).simulate("click");
        expect(wrapper).toHaveState("shareDialog", true);
        expect(wrapper.find(ShareDialog)).toExist();
      });
    });
    describe("Build", () => {
      it("should build the project when clicking the Build button", () => {
        const { build, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const toolbar = wrapper.find(Toolbar);
        toolbar.find(Button).at(ButtonIndex.Build).simulate("click");
        expect(build).toHaveBeenCalled();
        restore();
      });
    });
    describe("Run", () => {
      it("should run the project when clicking the Run button", () => {
        const { run, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const toolbar = wrapper.find(Toolbar);
        toolbar.find(Button).at(ButtonIndex.Run).simulate("click");
        expect(run).toHaveBeenCalled();
        restore();
      });
    });
    describe("Build and run", () => {
      it("should build and run the project when clicking the Build & Run button", async () => {
        const { run, build, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const toolbar = wrapper.find(Toolbar);
        toolbar.find(Button).at(ButtonIndex.BuildAndRun).simulate("click");
        await wait(10); // Wait for build().then(run) Promise chain to finish
        expect(run).toHaveBeenCalled();
        expect(build).toHaveBeenCalled();
        restore();
      });
    });
    describe("Preview", () => {
      it("should preview the project when clicking the Preview button", () => {
        const { publishArc, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.Arc } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const toolbar = wrapper.find(Toolbar);
        toolbar.find(Button).at(ArcButtonIndex.Preview).simulate("click");
        expect(publishArc).toHaveBeenCalled();
        restore();
      });
    });
    describe("Build and Preview", () => {
      it("should build and preview the project when clicking the Build & Preview button", async () => {
        const { build, publishArc, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.Arc } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const toolbar = wrapper.find(Toolbar);
        toolbar.find(Button).at(ArcButtonIndex.BuildAndPreview).simulate("click");
        await wait(10); // Wait for build().then(publishArc) Promise chain to finish
        expect(build).toHaveBeenCalled();
        expect(publishArc).toHaveBeenCalled();
        restore();
      });
    });
    describe("Help & Privacy", () => {
      it("should invoke App.loadHelp when clicking the Help & Privacy button", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const loadHelp = jest.spyOn((wrapper.instance() as App), "loadHelp");
        loadHelp.mockImplementation(() => {});
        const toolbar = wrapper.find(Toolbar);
        toolbar.find(Button).at(ButtonIndex.Help).simulate("click");
        expect(loadHelp).toHaveBeenCalled();
        loadHelp.mockRestore();
      });
      it("should load help", async () => {
        const text = jest.fn().mockImplementation(() => "help-text");
        const { restore } = mockFetch({ text });
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        await (wrapper.instance() as App).loadHelp();
        expect(window.fetch).toHaveBeenCalledWith("notes/help.md");
        expect((wrapper.state() as any).activeTabGroup.currentView.file.data).toEqual("help-text");
        expect((wrapper.state() as any).activeTabGroup.currentView.file.name).toEqual("Help");
        expect((wrapper.state() as any).activeTabGroup.currentView.file.type).toEqual(FileType.Markdown);
        restore();
      });
    });
  });
  describe("Dialogs", () => {
    describe("NewProjectDialog", () => {
      it("should be open if rendered", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        wrapper.setState({ newProjectDialog: true });
        const dialog = wrapper.find(NewProjectDialog);
        expect(dialog).toExist();
        expect(dialog).toHaveProp("isOpen", true);
      });
      it("should handle onCancel", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        wrapper.setState({ newProjectDialog: true });
        const dialog = wrapper.find(NewProjectDialog);
        const onCancel = dialog.prop("onCancel");
        onCancel();
        expect(wrapper).toHaveState({ newProjectDialog: null });
      });
      it("should handle onCreate", async () => {
        const { openProjectFiles, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        wrapper.setState({ newProjectDialog: true });
        const dialog = wrapper.find(NewProjectDialog);
        const onCreate = dialog.prop("onCreate");
        const template = {} as Template;
        await onCreate(template);
        expect(openProjectFiles).toHaveBeenCalledWith(template);
        expect(wrapper).toHaveState({ newProjectDialog: false });
        restore();
      });
    });
    describe("NewFileDialog", () => {
      it("should be open if rendered", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const newFileDialogDirectory = ModelRef.getRef(new Directory("src"));
        wrapper.setState({ newFileDialogDirectory });
        const dialog = wrapper.find(NewFileDialog);
        expect(dialog).toExist();
        expect(dialog).toHaveProp("isOpen", true);
      });
      it("should handle onCancel", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const newFileDialogDirectory = ModelRef.getRef(new Directory("src"));
        wrapper.setState({ newFileDialogDirectory });
        const dialog = wrapper.find(NewFileDialog);
        const onCancel = dialog.prop("onCancel");
        onCancel();
        expect(wrapper).toHaveState({ newFileDialogDirectory: null });
      });
      it("should handle onCreate", async () => {
        const { addFileTo, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const newFileDialogDirectory = ModelRef.getRef(new Directory("src"));
        wrapper.setState({ newFileDialogDirectory });
        const dialog = wrapper.find(NewFileDialog);
        const onCreate = dialog.prop("onCreate");
        const file = {} as File;
        await onCreate(file);
        expect(addFileTo).toHaveBeenCalledWith(file, newFileDialogDirectory.getModel());
        expect(wrapper).toHaveState({ newFileDialogDirectory: null });
        restore();
      });
    });
    describe("EditFileDialog", () => {
      it("should be open if rendered", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const editFileDialogFile = ModelRef.getRef(new File("file", FileType.JavaScript));
        wrapper.setState({ editFileDialogFile });
        const dialog = wrapper.find(EditFileDialog);
        expect(dialog).toExist();
        expect(dialog).toHaveProp("isOpen", true);
      });
      it("should handle onCancel", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const editFileDialogFile = ModelRef.getRef(new File("file", FileType.JavaScript));
        wrapper.setState({ editFileDialogFile });
        const dialog = wrapper.find(EditFileDialog);
        const onCancel = dialog.prop("onCancel");
        onCancel();
        expect(wrapper).toHaveState({ editFileDialogFile: null });
      });
      it("should handle onChange", () => {
        const { updateFileNameAndDescription, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const editFileDialogFile = ModelRef.getRef(new File("file", FileType.JavaScript));
        wrapper.setState({ editFileDialogFile });
        const dialog = wrapper.find(EditFileDialog);
        const onChange = dialog.prop("onChange");
        const newName = "newName";
        const newDescription = "newDescription";
        onChange(newName, newDescription);
        expect(updateFileNameAndDescription).toHaveBeenCalledWith(editFileDialogFile.getModel(), newName, newDescription);
        expect(wrapper).toHaveState({ editFileDialogFile: null });
        restore();
      });
    });
    describe("ShareDialog", () => {
      it("should be open if rendered", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        wrapper.setState({ shareDialog: true });
        const dialog = wrapper.find(ShareDialog);
        expect(dialog).toExist();
        expect(dialog).toHaveProp("isOpen", true);
      });
      it("should handle onCancel", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        wrapper.setState({ shareDialog: true });
        const dialog = wrapper.find(ShareDialog);
        const onCancel = dialog.prop("onCancel");
        onCancel();
        expect(wrapper).toHaveState({ shareDialog: false });
      });
    });
    describe("UploadFileDialog", () => {
      it("should be open if rendered", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const uploadFileDialogDirectory = ModelRef.getRef(new Directory("src"));
        wrapper.setState({ uploadFileDialogDirectory });
        const dialog = wrapper.find(UploadFileDialog);
        expect(dialog).toExist();
        expect(dialog).toHaveProp("isOpen", true);
      });
      it("should handle onCancel", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const uploadFileDialogDirectory = ModelRef.getRef(new Directory("src"));
        wrapper.setState({ uploadFileDialogDirectory });
        const dialog = wrapper.find(UploadFileDialog);
        const onCancel = dialog.prop("onCancel");
        onCancel();
        expect(wrapper).toHaveState({ uploadFileDialogDirectory: null });
      });
      it("should handle onUpload", () => {
        const { addFileTo, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const uploadFileDialogDirectory = ModelRef.getRef(new Directory("src"));
        wrapper.setState({ uploadFileDialogDirectory });
        const dialog = wrapper.find(UploadFileDialog);
        const onUpload = dialog.prop("onUpload");
        const fileA = new File("fileA", FileType.JavaScript);
        const fileB = new File("fileB", FileType.JavaScript);
        onUpload([fileA, fileB]);
        expect(addFileTo).toHaveBeenCalledWith(fileA, uploadFileDialogDirectory.getModel());
        expect(addFileTo).toHaveBeenCalledWith(fileB, uploadFileDialogDirectory.getModel());
        expect(wrapper).toHaveState({ uploadFileDialogDirectory: null });
        restore();
      });
    });
    describe("NewDirectoryDialog", () => {
      it("should be open if rendered", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const newDirectoryDialog = ModelRef.getRef(new Directory("src"));
        wrapper.setState({ newDirectoryDialog });
        const dialog = wrapper.find(NewDirectoryDialog);
        expect(dialog).toExist();
        expect(dialog).toHaveProp("isOpen", true);
      });
      it("should handle onCancel", () => {
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const newDirectoryDialog = ModelRef.getRef(new Directory("src"));
        wrapper.setState({ newDirectoryDialog });
        const dialog = wrapper.find(NewDirectoryDialog);
        const onCancel = dialog.prop("onCancel");
        onCancel();
        expect(wrapper).toHaveState({ newDirectoryDialog: null });
      });
      it("should handle onCreate", () => {
        const { addFileTo, restore } = createActionSpies();
        const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
        const wrapper = setup({ embeddingParams });
        const newDirectoryDialog = ModelRef.getRef(new Directory("src"));
        wrapper.setState({ newDirectoryDialog });
        const dialog = wrapper.find(NewDirectoryDialog);
        const onCreate = dialog.prop("onCreate");
        const createdDirectory = new Directory("created");
        onCreate(createdDirectory);
        expect(addFileTo).toHaveBeenCalledWith(createdDirectory, newDirectoryDialog.getModel());
        expect(wrapper).toHaveState({ newDirectoryDialog: null });
        restore();
      });
    });
  });
  describe("Workspace", () => {
    it("should handle onChange", () => {
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const split = wrapper.find(Split).at(0);
      const onChange = split.prop("onChange");
      const workspaceSplits = [] as any;
      onChange(workspaceSplits);
      expect(wrapper).toHaveState({ workspaceSplits });
    });
    it("should handle onNewFile", () => {
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const workspace = wrapper.find(Workspace);
      const onNewFile = workspace.prop("onNewFile");
      const directory = new Directory("src");
      onNewFile(directory);
      expect(wrapper).toHaveState({ newFileDialogDirectory: ModelRef.getRef(directory) });
    });
    it("should handle onEditFile", () => {
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const workspace = wrapper.find(Workspace);
      const onEditFile = workspace.prop("onEditFile");
      const file = new File("file", FileType.JavaScript);
      onEditFile(file);
      expect(wrapper).toHaveState({ editFileDialogFile: ModelRef.getRef(file) });
    });
    it("should handle onDeleteFile (file)", () => {
      const { deleteFile, closeTabs, restore } = createActionSpies();
      const confirm = jest.spyOn(window, "confirm");
      confirm.mockImplementation(() => true);
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const workspace = wrapper.find(Workspace);
      const onDeleteFile = workspace.prop("onDeleteFile");
      const file = new File("file", FileType.JavaScript);
      onDeleteFile(file);
      expect(confirm).toHaveBeenCalledWith("Are you sure you want to delete 'file'?");
      expect(deleteFile).toHaveBeenCalledWith(file);
      expect(closeTabs).toHaveBeenCalledWith(file);
      confirm.mockRestore();
      restore();
    });
    it("should handle onDeleteFile (directory)", () => {
      const { deleteFile, closeTabs, restore } = createActionSpies();
      const confirm = jest.spyOn(window, "confirm");
      confirm.mockImplementation(() => true);
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const workspace = wrapper.find(Workspace);
      const onDeleteFile = workspace.prop("onDeleteFile");
      const directory = new Directory("src");
      onDeleteFile(directory);
      expect(confirm).toHaveBeenCalledWith("Are you sure you want to delete 'src' and its contents?");
      expect(deleteFile).toHaveBeenCalledWith(directory);
      expect(closeTabs).toHaveBeenCalledWith(directory);
      confirm.mockRestore();
      restore();
    });
    it("should handle onDeleteFile (aborted)", () => {
      const { deleteFile, closeTabs, restore } = createActionSpies();
      const confirm = jest.spyOn(window, "confirm");
      confirm.mockImplementation(() => false);
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const workspace = wrapper.find(Workspace);
      const onDeleteFile = workspace.prop("onDeleteFile");
      const file = new File("file", FileType.JavaScript);
      onDeleteFile(file);
      expect(deleteFile).not.toHaveBeenCalled();
      expect(closeTabs).not.toHaveBeenCalled();
      confirm.mockRestore();
      restore();
    });
    it("should handle onClickFile", () => {
      const resetDOMSelection = jest.spyOn(utils, "resetDOMSelection");
      resetDOMSelection.mockImplementation(() => {});
      const { openFile, restore } = createActionSpies();
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const workspace = wrapper.find(Workspace);
      const onClickFile = workspace.prop("onClickFile");
      const file = new File("file", FileType.JavaScript);
      onClickFile(file);
      expect(resetDOMSelection).toHaveBeenCalled();
      expect(openFile).toHaveBeenCalledWith(file, ViewType.Editor);
      resetDOMSelection.mockRestore();
      restore();
    });
    it("should handle onDoubleClickFile (file)", () => {
      const { openFile, restore } = createActionSpies();
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const workspace = wrapper.find(Workspace);
      const onDoubleClickFile = workspace.prop("onDoubleClickFile");
      const file = new File("file", FileType.JavaScript);
      onDoubleClickFile(file);
      expect(openFile).toHaveBeenCalledWith(file, ViewType.Editor, false);
      restore();
    });
    it("should handle onDoubleClickFile (directory)", () => {
      const { openFile, restore } = createActionSpies();
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const workspace = wrapper.find(Workspace);
      const onDoubleClickFile = workspace.prop("onDoubleClickFile");
      const directory = new Directory("src");
      onDoubleClickFile(directory);
      expect(openFile).not.toHaveBeenCalled();
      restore();
    });
    it("should handle onMoveFile", () => {
      const { addFileTo, restore } = createActionSpies();
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const workspace = wrapper.find(Workspace);
      const onMoveFile = workspace.prop("onMoveFile");
      const file = new File("file", FileType.JavaScript);
      const directory = new Directory("src");
      onMoveFile(file, directory);
      expect(addFileTo).toHaveBeenCalledWith(file, directory);
      restore();
    });
    it("should handle onUploadFile", () => {
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const workspace = wrapper.find(Workspace);
      const onUploadFile = workspace.prop("onUploadFile");
      const directory = new Directory("src");
      onUploadFile(directory);
      expect(wrapper).toHaveState({ uploadFileDialogDirectory: ModelRef.getRef(directory) });
    });
    it("should handle onNewDirectory", () => {
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const workspace = wrapper.find(Workspace);
      const onNewDirectory = workspace.prop("onNewDirectory");
      const directory = new Directory("src");
      onNewDirectory(directory);
      expect(wrapper).toHaveState({ newDirectoryDialog: ModelRef.getRef(directory) });
    });
    it("should handle onCreateGist", () => {
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const gist = jest.spyOn((wrapper.instance() as App), "gist");
      gist.mockImplementation(() => {});
      const workspace = wrapper.find(Workspace);
      const onCreateGist = workspace.prop("onCreateGist");
      const file = new File("file", FileType.JavaScript);
      onCreateGist(file);
      expect(gist).toHaveBeenCalledWith(file);
      gist.mockRestore();
    });
  });
  describe("Console", () => {
    it("should handle onChange", () => {
      const layout = jest.spyOn(utils, "layout");
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const split = wrapper.find(Split).at(1);
      const onChange = split.prop("onChange");
      const controlCenterSplits = [] as any;
      onChange(controlCenterSplits);
      expect(layout).toHaveBeenCalled();
      expect(wrapper).toHaveState({ controlCenterSplits });
      layout.mockRestore();
    });
  });
  describe("ControlCenter", () =>  {
    it("should handle onToggle", () => {
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const layout = jest.spyOn(utils, "layout");
      const cc = wrapper.find(ControlCenter);
      const onToggle = cc.prop("onToggle");
      onToggle();
      expect(wrapper).toHaveState({ controlCenterSplits: [
        { min: 100 },
        { min: 40, value: 40 }
      ]});
      onToggle();
      expect(wrapper).toHaveState({ controlCenterSplits: [
        { min: 100 },
        { min: 40, value: 256 }
      ]});
      expect(layout).toHaveBeenCalledTimes(2);
      layout.mockRestore();
    });
  });
  describe("Editors", () => {
    it("should handle onChange", () => {
      const layout = jest.spyOn(utils, "layout");
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const split = wrapper.find(Split).at(2);
      const onChange = split.prop("onChange");
      const editorSplits = ["splitA", "splitB"] as any;
      onChange(editorSplits);
      expect(layout).toHaveBeenCalled();
      expect(wrapper).toHaveState({ editorSplits });
      layout.mockRestore();
    });
    it("should handle onSplitViews", () => {
      const { splitGroup, restore } = createActionSpies();
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const viewTabs = wrapper.find(ViewTabs);
      const onSplitViews = viewTabs.prop("onSplitViews");
      onSplitViews();
      expect(splitGroup).toHaveBeenCalled();
      restore();
    });
    it("should handle onFocus", () => {
      const { focusTabGroup, restore } = createActionSpies();
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const viewTabs = wrapper.find(ViewTabs);
      const onFocus = viewTabs.prop("onFocus");
      const group = (wrapper.state() as any).tabGroups[0];
      onFocus();
      expect(focusTabGroup).toHaveBeenCalledWith(group);
      restore();
    });
    it("should handle onChangeViewType", () => {
      const { setViewType, restore } = createActionSpies();
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const viewTabs = wrapper.find(ViewTabs);
      const onChangeViewType = viewTabs.prop("onChangeViewType");
      const view = new View(new File("file", FileType.JavaScript));
      const type = ViewType.Binary;
      onChangeViewType(view, type);
      expect(setViewType).toHaveBeenCalledWith(view, type);
      restore();
    });
    it("should handle onClickView", () => {
      const resetDOMSelection = jest.spyOn(utils, "resetDOMSelection");
      resetDOMSelection.mockImplementation(() => {});
      const { focusTabGroup, openView, restore } = createActionSpies();
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const viewTabs = wrapper.find(ViewTabs);
      const onClickView = viewTabs.prop("onClickView");
      const view = new View(new File("file", FileType.JavaScript));
      const group = (wrapper.state() as any).tabGroups[0];
      onClickView(view);
      expect(resetDOMSelection).toHaveBeenCalled();
      expect(focusTabGroup).toHaveBeenCalledWith(group);
      expect(openView).toHaveBeenCalledWith(view);
      restore();
      resetDOMSelection.mockRestore();
    });
    it("should handle onClickView (current view)", () => {
      const resetDOMSelection = jest.spyOn(utils, "resetDOMSelection");
      resetDOMSelection.mockImplementation(() => {});
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const viewTabs = wrapper.find(ViewTabs);
      const onClickView = viewTabs.prop("onClickView");
      const view = (wrapper.state() as any).activeTabGroup.currentView;
      onClickView(view);
      expect(resetDOMSelection).not.toHaveBeenCalled();
      resetDOMSelection.mockRestore();
    });
    it("should handle onDoubleClickView", () => {
      const { focusTabGroup, openView, restore } = createActionSpies();
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const viewTabs = wrapper.find(ViewTabs);
      const onDoubleClickView = viewTabs.prop("onDoubleClickView");
      const view = new View(new File("file", FileType.JavaScript));
      const group = (wrapper.state() as any).tabGroups[0];
      onDoubleClickView(view);
      expect(focusTabGroup).toHaveBeenCalledWith(group);
      expect(openView).toHaveBeenCalledWith(view, false);
      restore();
    });
    it("should handle onClose", () => {
      const { focusTabGroup, closeView, restore } = createActionSpies();
      const embeddingParams = { type: EmbeddingType.None } as EmbeddingParams;
      const wrapper = setup({ embeddingParams });
      const viewTabs = wrapper.find(ViewTabs);
      const onClose = viewTabs.prop("onClose");
      const view = new View(new File("file", FileType.JavaScript));
      const group = (wrapper.state() as any).tabGroups[0];
      onClose(view);
      expect(focusTabGroup).toHaveBeenCalledWith(group);
      expect(closeView).toHaveBeenCalledWith(view);
      restore();
    });
  });
});
