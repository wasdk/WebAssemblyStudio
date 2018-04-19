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

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactModal from "react-modal";

import { Workspace } from "./Workspace";
import { EditorView, ViewTabs, View, Tab, Tabs } from "./editor";
import { Header } from "./Header";
import { Toolbar } from "./Toolbar";
import { ViewType, defaultViewTypeForFileType } from "./editor/View";
import { build, run, runTask, editInWebAssemblyStudio, openFiles } from "../actions/AppActions";

import appStore from "../stores/AppStore";
import {
  addFileTo,
  loadProject,
  initStore,
  updateFileNameAndDescription,
  deleteFile,
  splitGroup,
  openProjectFiles,
  openFile,
  openView,
  closeView,
  saveProject,
  focusTabGroup,
  setViewType,
  logLn,
} from "../actions/AppActions";
import { Project, File, FileType, Directory, shallowCompare, ModelRef, filetypeForExtension } from "../model";
import { Service, Language } from "../service";
import { Split, SplitOrientation, SplitInfo } from "./Split";

import { layout, assert } from "../util";
import registerLanguages from "../utils/registerLanguages";

import * as Mousetrap from "mousetrap";
import { Sandbox } from "./Sandbox";
import { Gulpy, testGulpy } from "../gulpy";
import {
  GoDelete,
  GoPencil,
  GoGear,
  GoVerified,
  GoFileCode,
  GoQuote,
  GoFileBinary,
  GoFile,
  GoDesktopDownload,
  GoBook,
  GoRepoForked,
  GoRocket,
  GoBeaker,
  GoThreeBars,
  GoGist,
  GoOpenIssue,
  GoQuestion
} from "./shared/Icons";
import { Button } from "./shared/Button";

import { NewFileDialog } from "./NewFileDialog";
import { EditFileDialog } from "./EditFileDialog";
import { UploadFileDialog } from "./UploadFileDialog";
import { ToastContainer } from "./Toasts";
import { Spacer, Divider } from "./Widgets";
import { ShareDialog } from "./ShareDialog";
import { NewProjectDialog, Template } from "./NewProjectDialog";
import { NewDirectoryDialog } from "./NewDirectoryDialog";
import { Errors } from "../errors";
import { ControlCenter } from "./ControlCenter";
import Group from "../utils/group";
import { StatusBar } from "./StatusBar";

export interface AppState {
  project: ModelRef<Project>;
  file: ModelRef<File>;
  fiddle: string;

  /**
   * If not null, the the new file dialog is open and files are created in this
   * directory.
   */
  newFileDialogDirectory?: ModelRef<Directory>;

  /**
   * If not null, the the edit file dialog is open.
   */
  editFileDialogFile?: ModelRef<File>;

  /**
   * If true, the share fiddle dialog is open.
   */
  shareDialog: boolean;

  /**
   * If true, the new project dialog is open.
   */
  newProjectDialog: boolean;

  /**
   * Primary workspace split state.
   */
  workspaceSplits: SplitInfo[];

  /**
   * Secondary control center split state.
   */
  controlCenterSplits: SplitInfo[];

  /**
   * Editor split state.
   */
  editorSplits: SplitInfo[];
  /**
   * If not null, the upload file dialog is open.
   */
  uploadFileDialogDirectory: ModelRef<Directory>;
  /**
   * If true, the new directory dialog is open.
   */
  newDirectoryDialog: ModelRef<Directory>;
  showProblems: boolean;
  showSandbox: boolean;
}

export interface AppProps {
  embed: boolean;
  /**
   * If true, the Update button is visible.
   */
  update: boolean;
  fiddle: string;
}

export class App extends React.Component<AppProps, AppState> {
  fiddle: string;
  toastContainer: ToastContainer;
  constructor(props: AppProps) {
    super(props);
    this.state = {
      fiddle: props.fiddle,
      project: null,
      file: null,
      newFileDialogDirectory: null,
      editFileDialogFile: null,
      newProjectDialog: !props.fiddle,
      shareDialog: false,
      workspaceSplits: [
        {
          min: 200,
          max: 400,
          value: 200,
        },
        {
          min: 256
        }
      ],
      controlCenterSplits: [
        { min: 100 },
        { min: 40, value: 256 }
      ],
      editorSplits: [],
      showProblems: true,
      showSandbox: true,
      uploadFileDialogDirectory: null,
      newDirectoryDialog: null
    };
    registerLanguages();
  }
  async initializeProject() {
    initStore();
    this.setState({ project: appStore.getProject() });
    this.bindAppStoreEvents();
    if (this.state.fiddle) {
      this.loadProjectFromFiddle();
    }
  }
  async loadProjectFromFiddle() {
    const newProject = new Project();
    let json = await Service.loadJSON(this.state.fiddle);
    json = await Service.loadProject(json, newProject);
    // TODO openProjectFiles ?
    this.logLn("Project Loaded ...");
    loadProject(newProject);
    if (newProject.getFile("README.md")) {
      openFiles([["README.md"]]);
    }
  }
  bindAppStoreEvents() {
    appStore.onLoadProject.register(() => {
      this.setState({ project: appStore.getProject() });
      this.forceUpdate();
      runTask("project:load", true);
    });
    appStore.onDidChangeBuffer.register(() => {
      this.forceUpdate();
    });
    appStore.onDidChangeData.register(() => {
      this.forceUpdate();
    });
    appStore.onDidChangeChildren.register(() => {
      this.forceUpdate();
    });
    appStore.onDirtyFileUsed.register((file: File) => {
      this.logLn(`Changes in ${file.getPath()} were ignored, save your changes.`, "warn");
    });
    appStore.onTabsChange.register(() => {
      this.forceUpdate();
      layout();
    });
  }

  // TODO: Optimize
  // shouldComponentUpdate(nextProps: any, nextState: AppState) {
  //   let state = this.state;
  //   if (state.file !== nextState.file) return true;
  //   if (state.group !== nextState.group) return true;
  //   if (!shallowCompare(state.groups, nextState.groups)) return true;
  //   return false;
  // }

  async loadReleaseNotes() {
    const response = await fetch("notes/notes.md");
    const src = await response.text();
    const notes = new File("Release Notes", FileType.Markdown);
    notes.setData(src);
    openFile(notes, defaultViewTypeForFileType(notes.type));
  }

  async loadHelp() {
    const response = await fetch("notes/help.md");
    const src = await response.text();
    const help = new File("Help", FileType.Markdown);
    help.setData(src);
    openFile(help, defaultViewTypeForFileType(help.type));
  }

  registerShortcuts() {
    Mousetrap.bind("command+b", () => {
      build();
    });
    Mousetrap.bind("command+enter", () => {
      run();
    });
  }
  logLn(message: string, kind: "" | "info" | "warn" | "error" = "") {
    logLn(message, kind);
  }
  componentWillMount() {
    this.initializeProject();
  }
  componentDidMount() {
    layout();
    this.registerShortcuts();
    // if (!this.props.embed) {
    //   this.loadReleaseNotes();
    // }
    window.addEventListener("resize", () => {
      console.log("App.forceUpdate because of window resize.");
      this.forceUpdate();
    }, false);
  }

  share() {
    this.setState({ shareDialog: true });
  }

  async update() {
    saveProject(this.state.fiddle);
  }
  async fork() {
    this.logLn("Forking Project ...");
    const projectModel = this.state.project.getModel();
    const fiddle = await Service.saveProject(projectModel, []);
    this.logLn("Forked Project OK " + fiddle);
    const search = window.location.search;
    if (this.state.fiddle) {
      assert(search.indexOf(this.state.fiddle) >= 0);
      history.replaceState({}, fiddle, search.replace(this.state.fiddle, fiddle));
    } else {
      history.pushState({}, fiddle, `?f=${fiddle}`);
    }
    this.setState({ fiddle });
  }
  async gist(fileOrDirectory?: File) {
    this.logLn("Exporting Project ...");
    const target: File = fileOrDirectory || this.state.project.getModel();
    const gistURI = await Service.exportToGist(target, this.state.fiddle);
    this.logLn("Project Gist CREATED ");
    if (gistURI) {
      if (this.toastContainer) {
        this.toastContainer.showToast(<span>"Gist Created!" <a href={gistURI} target="_blank" className="toast-span">Open in new tab.</a></span>);
      }
      console.log(`Gist created: ${gistURI}`);
    } else {
      console.log("Failed!");
    }
  }
  async download() {
    this.logLn("Downloading Project ...");
    const downloadService = await import("../utils/download");
    const projectModel = this.state.project.getModel();
    await downloadService.downloadProject(projectModel, this.state.fiddle);
    this.logLn("Project Zip CREATED ");
  }
  /**
   * Remember workspace split.
   */
  private workspaceSplit: SplitInfo = null;

  makeToolbarButtons() {
    const toolbarButtons = [
      <Button
        key="View Workspace"
        icon={<GoThreeBars />}
        title="View Project Workspace"
        onClick={() => {
          const workspaceSplits = this.state.workspaceSplits;
          const first = workspaceSplits[0];
          const second = workspaceSplits[1];
          if (this.workspaceSplit) {
            Object.assign(first, this.workspaceSplit);
            this.workspaceSplit = null;
            delete second.value;
          } else {
            this.workspaceSplit = Object.assign({}, first);
            first.max = first.min = 0;
          }
          this.setState({ workspaceSplits });
        }}
      />
    ];
    if (this.props.embed) {
      toolbarButtons.push(
        <Button
          icon={<GoPencil />}
          label="Edit in WebAssembly Studio"
          title="Edit Project in WebAssembly Studio"
          onClick={() => {
            assert(this.state.fiddle);
            editInWebAssemblyStudio(this.state.fiddle);
          }}
        />);
    } else {
      if (this.props.update) {
        toolbarButtons.push(
          <Button
            icon={<GoPencil />}
            label="Update"
            title="Update Project"
            onClick={() => {
              this.update();
            }}
          />
        );
      }
      toolbarButtons.push(
        <Button
          icon={<GoRepoForked />}
          label="Fork"
          title="Fork Project"
          onClick={() => {
            this.fork();
          }}
        />,
        <Button
          icon={<GoGist />}
          label="Create Gist"
          title="Create GitHub Gist from Project"
          onClick={() => {
            this.gist();
          }}
        />,
        <Button
          icon={<GoDesktopDownload />}
          label="Download"
          title="Download Project"
          onClick={() => {
            this.download();
          }}
        />,
        <Button
          icon={<GoRocket />}
          label="Share"
          title={this.state.fiddle ? "Share Project" : "Cannot share a project that has not been forked yet."}
          isDisabled={!this.state.fiddle}
          onClick={() => {
            this.share();
          }}
        />);
    }
    toolbarButtons.push(
      <Button
        icon={<GoBeaker />}
        label="Build"
        title="Build Project: CtrlCmd + B"
        onClick={() => {
          build();
        }}
      />,
      <Button
        icon={<GoGear />}
        label="Run"
        title="Run Project: CtrlCmd + Enter"
        onClick={() => {
          run();
        }}
      />
    );
    if (!this.props.embed) {
      toolbarButtons.push(
        <Button
          icon={<GoOpenIssue />}
          label="GitHub Issues"
          title="GitHub Issues"
          customClassName="issue"
          onClick={() => {
            window.open("https://github.com/wasdk/WebAssemblyStudio", "_blank");
          }}
        />,
        <Button
          icon={<GoQuestion />}
          label="Help & Privacy"
          title="Help & Privacy"
          customClassName="help"
          onClick={() => {
            this.loadHelp();
          }}
        />
      );
    }
    return toolbarButtons;
  }
  render() {
    const self = this;

    function makeEditorPanes(): any {
      const groups = appStore.getTabGroups();
      const activeGroup = appStore.getActiveTabGroup();

      if (groups.length === 0) {
        return <div>No Groups</div>;
      }
      return groups.map(group => {
        // tslint:disable-next-line:jsx-key
        return <ViewTabs
          views={group.views.slice(0)}
          view={group.currentView}
          preview={group.preview}
          onSplitViews={() => splitGroup()}
          hasFocus={activeGroup === group}
          onFocus={() => {
            // TODO: Should be taken care of in shouldComponentUpdate instead.
            focusTabGroup(group);
          }}
          onChangeViewType={(view, type) => setViewType(view, type)}
          onClickView={(view: View) => {
            focusTabGroup(group);
            openView(view);
          }}
          onDoubleClickView={(view: View) => {
            focusTabGroup(group);
            openView(view, false);
          }}
          onClose={(view: View) => {
            focusTabGroup(group);
            closeView(view);
          }}
        />;
      });
    }

    const editorPanes = <Split
      name="Editors"
      orientation={SplitOrientation.Vertical}
      defaultSplit={{
        min: 128,
      }}
      splits={this.state.editorSplits}
      onChange={(splits) => {
        this.setState({ editorSplits: splits });
        layout();
      }}
    >
      {makeEditorPanes()}
    </Split>;

    return <div className="fill">
      <ToastContainer ref={(ref) => this.toastContainer = ref}/>
      {this.state.newProjectDialog &&
        <NewProjectDialog
          isOpen={true}
          onCancel={() => {
            this.setState({ newProjectDialog: null });
          }}
          onCreate={async (template: Template) => {
            if (!template.project) {
              logLn("Template doesn't contain a project definition.", "error");
            } else {
              await openProjectFiles(template.project);
            }
            this.setState({ newProjectDialog: false });
          }}
        />
      }
      {this.state.newFileDialogDirectory &&
        <NewFileDialog
          isOpen={true}
          directory={this.state.newFileDialogDirectory}
          onCancel={() => {
            this.setState({ newFileDialogDirectory: null });
          }}
          onCreate={(file: File) => {
            addFileTo(file, this.state.newFileDialogDirectory.getModel());
            this.setState({ newFileDialogDirectory: null });
          }}
        />
      }
      {this.state.editFileDialogFile &&
        <EditFileDialog
          isOpen={true}
          file={this.state.editFileDialogFile}
          onCancel={() => {
            this.setState({ editFileDialogFile: null });
          }}
          onChange={(name: string, description) => {
            const file = this.state.editFileDialogFile.getModel();
            updateFileNameAndDescription(file, name, description);
            this.setState({ editFileDialogFile: null });
          }}
        />
      }
      {this.state.shareDialog &&
        <ShareDialog
          isOpen={true}
          fiddle={this.state.fiddle}
          onCancel={() => {
            this.setState({ shareDialog: false });
          }}
        />
      }
      {this.state.uploadFileDialogDirectory &&
        <UploadFileDialog
          isOpen={true}
          directory={this.state.uploadFileDialogDirectory}
          onCancel={() => {
            this.setState({ uploadFileDialogDirectory: null });
           }}
          onUpload={(files: File[]) => {
            files.map((file: File) => {
              addFileTo(file, this.state.uploadFileDialogDirectory.getModel());
            });
            this.setState({ uploadFileDialogDirectory: null });
          }}
        />
      }
      {this.state.newDirectoryDialog &&
        <NewDirectoryDialog
          isOpen={true}
          directory={this.state.newDirectoryDialog}
          onCancel={() => {
            this.setState({ newDirectoryDialog: null });
           }}
          onCreate={(directory: Directory) => {
            addFileTo(directory, this.state.newDirectoryDialog.getModel());
            this.setState({ newDirectoryDialog: null });
          }}
        />
      }
      <div style={{ height: "calc(100% - 22px)" }}>
        <Split
          name="Workspace"
          orientation={SplitOrientation.Vertical}
          splits={this.state.workspaceSplits}
          onChange={(splits) => {
            this.setState({ workspaceSplits: splits });
            layout();
          }}
        >
          <Workspace
            project={this.state.project}
            file={this.state.file}
            onNewFile={(directory: Directory) => {
              this.setState({ newFileDialogDirectory: ModelRef.getRef(directory)});
            }}
            onEditFile={(file: File) => {
              this.setState({ editFileDialogFile: ModelRef.getRef(file)});
            }}
            onDeleteFile={(file: File) => {
              let message = "";
              if (file instanceof Directory) {
                message = `Are you sure you want to delete '${file.name}' and its contents?`;
              } else {
                message = `Are you sure you want to delete '${file.name}'?`;
              }
              if (confirm(message)) {
                deleteFile(file);
              }
            }}
            onClickFile={(file: File) => {
              openFile(file, defaultViewTypeForFileType(file.type));
            }}
            onDoubleClickFile={(file: File) => {
              if (file instanceof Directory) {
                return;
              }
              openFile(file, defaultViewTypeForFileType(file.type), false);
            }}
            onMoveFile={(file: File, directory: Directory) => {
              addFileTo(file, directory);
            }}
            onUploadFile={(directory: Directory) => {
              this.setState({ uploadFileDialogDirectory: ModelRef.getRef(directory)});
            }}
            onNewDirectory={(directory: Directory) => {
              this.setState({ newDirectoryDialog: ModelRef.getRef(directory)});
            }}
            onCreateGist={(fileOrDirectory: File) => {
                this.gist(fileOrDirectory);
            }}
          />
          <div className="fill">
            <div style={{ height: "40px" }}>
              <Toolbar>{this.makeToolbarButtons()}</Toolbar>
            </div>
            <div style={{ height: "calc(100% - 40px)" }}>
              <Split
                name="Console"
                orientation={SplitOrientation.Horizontal}
                splits={this.state.controlCenterSplits}
                onChange={(splits) => {
                  this.setState({ controlCenterSplits: splits });
                  layout();
                }}
              >
                {editorPanes}
                <ControlCenter
                  onToggle={() => {
                    const splits = this.state.controlCenterSplits;
                    splits[1].value = splits[1].value === 40 ? 256 : 40;
                    this.setState({ controlCenterSplits: splits });
                    layout();
                  }}
                />
              </Split>
            </div>
          </div>
        </Split>
      </div>
      <StatusBar />
    </div>;
  }
}
