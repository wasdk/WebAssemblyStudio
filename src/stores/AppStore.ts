/* Copyright 2018 Mozilla Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { EventDispatcher, ModelRef, Project, File, Directory, FileType, SandboxRun } from "../model";
import { Service } from "../service";

import dispatcher from "../dispatcher";
import {
  AppActionType,
  AppAction,
  AddFileToAction,
  DeleteFileAction,
  UpdateFileNameAndDescriptionAction,
  LoadProjectAction,
  SetViewType,
  LogLnAction,
  OpenFilesAction,
  FocusTabGroupAction,
  SetStatusAction,
  SandboxRunAction,
  OpenViewAction,
  CloseViewAction,
  OpenFileAction
} from "../actions/AppActions";
import Group from "../utils/group";
import { assert } from "../util";
import { ProjectTemplate } from "../components/NewProjectDialog";
import { ViewType, View, defaultViewTypeForFileType } from "../components/editor/View";

export class AppStore {
  private project: Project;
  private output: File;
  private tabGroups: Group[];
  private activeTabGroup: Group;

  onLoadProject = new EventDispatcher("AppStore onLoadProject");
  onDidChangeStatus = new EventDispatcher("AppStore onDidChangeStatus");
  onDidChangeProblems = new EventDispatcher("AppStore onDidChangeProblems");
  onChange = new EventDispatcher("AppStore onChange");
  onDirtyFileUsed = new EventDispatcher("AppStore onDirtyFileUsed");
  onDidChangeBuffer = new EventDispatcher("AppStore onDidChangeBuffer");
  onDidChangeData = new EventDispatcher("AppStore onDidChangeData");
  onDidChangeChildren = new EventDispatcher("AppStore onDidChangeChildren");
  onOutputChanged = new EventDispatcher("AppStore onOutputChanged");
  onTabsChange = new EventDispatcher("AppStore onTabsChange");
  onSandboxRun = new EventDispatcher("AppStore onSandboxRun");

  constructor() {
    this.project = null;
    this.output = null;
  }

  private initStore() {
    this.project = new Project();
    this.activeTabGroup = new Group(null, []);
    this.tabGroups = [this.activeTabGroup];
    this.bindProject();
    this.output = new File("output", FileType.Log);
  }

  private loadProject(project: Project) {
    this.project = project;
    this.bindProject();
    this.onLoadProject.dispatch();
  }

  private bindProject() {
    this.project.onDidChangeStatus.register(() => this.onDidChangeStatus.dispatch());
    this.project.onDidChangeProblems.register(() => this.onDidChangeProblems.dispatch());
    this.project.onChange.register(() => this.onChange.dispatch());
    this.project.onDirtyFileUsed.register((file: File) => this.onDirtyFileUsed.dispatch(file));
    this.project.onDidChangeBuffer.register(() => this.onDidChangeBuffer.dispatch());
    this.project.onDidChangeData.register(() => this.onDidChangeData.dispatch());
    this.project.onDidChangeChildren.register(() => this.onDidChangeChildren.dispatch());
  }

  private addFileTo(file: File, parent: Directory) {
    if (file.parent) {
      this.deleteFile(file);
    }
    parent.addFile(file);
  }

  private deleteFile(file: File) {
    file.parent.removeFile(file);
  }

  private updateFileNameAndDescription(file: File, name: string, description: string) {
    file.name = name;
    file.description = description;
  }

  public getActiveTabGroup(): Group {
    return this.activeTabGroup;
  }

  public getTabGroups(): Group[] {
    return this.tabGroups;
  }

  public getProject(): ModelRef<Project> {
    return ModelRef.getRef(this.project);
  }

  public getOutput(): ModelRef<File> {
    return ModelRef.getRef(this.output);
  }

  public getFileByName(name: string): ModelRef<File> {
    const file = this.project.getFile(name);
    return file ? ModelRef.getRef(file) : null;
  }

  public getFileSource(file: ModelRef<File>): string {
    return file.getModel().getData() as string;
  }

  public getFileBuffer(file: ModelRef<File>) {
    return file.getModel().buffer;
  }

  public getParent(file: ModelRef<File>): ModelRef<Directory> {
    const { parent } = file.getModel();
    return parent ? ModelRef.getRef(parent) : null;
  }

  public getImmediateChild(directory: ModelRef<Directory>, name: string): ModelRef<File> {
    const child = directory.getModel().getImmediateChild(name);
    return child ? ModelRef.getRef(child) : null;
  }

  public getPath(directory: ModelRef<Directory>): string;
  public getPath(file: ModelRef<File>): string {
    return file.getModel().getPath();
  }

  public getStatus(): string {
    return this.project.status;
  }

  private logLn(message: string, kind: "" | "info" | "warn" | "error" = "") {
    message = message + "\n";
    if (kind) {
      message = "[" + kind + "]: " + message;
    }
    const model = this.output.buffer;
    const lineCount = model.getLineCount();
    const lastLineLength = model.getLineMaxColumn(lineCount);
    const range = new monaco.Range(lineCount, lastLineLength, lineCount, lastLineLength);
    model.applyEdits([
      { forceMoveMarkers: true, identifier: null, range, text: message }
    ]);
    this.onOutputChanged.dispatch();
  }

  private splitGroup() {
    const { tabGroups, activeTabGroup } = this;
    if (activeTabGroup.views.length === 0) {
      return;
    }
    const activeGroupIndex = tabGroups.findIndex(group => group === activeTabGroup);

    // Create a new group from the last file of currently active group
    const view = activeTabGroup.currentView.clone();
    const group = new Group(view, [view]);
    this.tabGroups.splice(activeGroupIndex + 1, 0, group);
    this.activeTabGroup = group;
    this.onTabsChange.dispatch();
  }

  private openFile(file: File, type: ViewType, preview: boolean) {
    this.activeTabGroup.openFile(file, type, preview);
    this.onTabsChange.dispatch();
  }

  private openView(view: View, preview: boolean) {
    this.activeTabGroup.open(view, preview);
    this.onTabsChange.dispatch();
  }

  private closeView(view: View) {
    const { activeTabGroup, tabGroups } = this;
    let numGroups = tabGroups.length;
    activeTabGroup.close(view);
    if (activeTabGroup.views.length === 0 && numGroups > 1) {
      const i = tabGroups.indexOf(activeTabGroup);
      tabGroups.splice(i, 1);
      numGroups = tabGroups.length;
      const g = numGroups ? tabGroups[Math.min(numGroups - 1, i)] : null;
      this.activeTabGroup = g;
      this.tabGroups = tabGroups;
    }
    this.onTabsChange.dispatch();
  }

  private openFiles(files: string[][]) {
    const groups = files.map((paths: string[]) => {
      const views = paths.map(file => {
        const newFile = this.getFileByName(file).getModel();
        return new View(newFile, defaultViewTypeForFileType(newFile.type));
      });
      assert(views.length > 0);
      return new Group(views[0], views);
    });
    this.activeTabGroup = groups[0];
    this.tabGroups = groups;
    this.onTabsChange.dispatch();
  }

  private setViewType(view: View, type: ViewType) {
    // const { file } = view;
    // const newView = new View(file, type);

    // const previewGroup = new Group(newView, [newView]);
    // this.tabGroups.push(previewGroup);
    // this.activeTabGroup = previewGroup;
    view.type = type;
    this.onTabsChange.dispatch();
  }

  private setStatus(status: string) {
    if (status) {
      this.project.setStatus(status);
    } else {
      this.project.clearStatus();
    }
  }

  private sendSandboxRun(src: string) {
    this.onSandboxRun.dispatch({
      project: this.project,
      src,
    } as SandboxRun);
  }

  public handleActions(action: AppAction ) {
    switch (action.type) {
      case AppActionType.OPEN_VIEW: {
        const { view, preview } = action as OpenViewAction;
        this.openView(view, preview);
        break;
      }
      case AppActionType.CLOSE_VIEW: {
        const { view } = action as CloseViewAction;
        this.closeView(view);
        break;
      }
      case AppActionType.FOCUS_TAB_GROUP: {
        const { group } = action as FocusTabGroupAction;
        this.activeTabGroup = group;
        this.onTabsChange.dispatch();
        break;
      }
      case AppActionType.OPEN_FILE: {
        const { file, viewType, preview } = action as OpenFileAction;
        this.openFile(file, viewType, preview);
        break;
      }
      case AppActionType.OPEN_FILES: {
        const { files } = action as OpenFilesAction;
        this.openFiles(files);
        break;
      }
      case AppActionType.SPLIT_GROUP: {
        this.splitGroup();
        break;
      }
      case AppActionType.ADD_FILE_TO: {
        const { file, parent } = action as AddFileToAction;
        this.addFileTo(file, parent);
        break;
      }
      case AppActionType.DELETE_FILE: {
        const { file } = action as DeleteFileAction;
        this.deleteFile(file);
        break;
      }
      case AppActionType.UPDATE_FILE_NAME_AND_DESCRIPTION: {
        const { file, name, description } = action as UpdateFileNameAndDescriptionAction;
        this.updateFileNameAndDescription(file, name, description);
        break;
      }
      case AppActionType.LOAD_PROJECT: {
        const { project } = action as LoadProjectAction;
        this.loadProject(project);
        break;
      }
      case AppActionType.INIT_STORE: {
        this.initStore();
        break;
      }
      case AppActionType.SET_VIEW_TYPE: {
        const { view, viewType } = action as SetViewType;
        this.setViewType(view, viewType);
        break;
      }
      case AppActionType.LOG_LN: {
        const { message, kind } = action as LogLnAction;
        this.logLn(message, kind);
        break;
      }
      case AppActionType.SET_STATUS: {
        const { status } = action as SetStatusAction;
        this.setStatus(status);
        break;
      }
      case AppActionType.SANDBOX_RUN: {
        const { src } = action as SandboxRunAction;
        this.sendSandboxRun(src);
        break;
      }
    }
  }
}

const appStore = new AppStore();
dispatcher.register((action: any) => appStore.handleActions(action));

export default appStore;
