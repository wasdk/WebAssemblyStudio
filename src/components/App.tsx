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
import { Editor, EditorPane, View, Tab, Tabs } from "./editor";
import { Header } from "./Header";
import { Toolbar } from "./Toolbar";

import appStore from "../stores/AppStore";
import {
  addFileTo,
  loadProject,
  initStore,
  updateFileNameAndDescription,
  deleteFile,
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
  GoOpenIssue
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
  groups: Group[];
  group: Group;

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
   * Secondary console split state.
   */
  consoleSplits: SplitInfo[];

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
  fiddle: string;
}

export class App extends React.Component<AppProps, AppState> {
  fiddle: string;
  toastContainer: ToastContainer;
  constructor(props: AppProps) {
    super(props);
    const group0 = new Group(null, null, []);
    this.state = {
      fiddle: props.fiddle,
      project: null,
      file: null,
      groups: [
        group0,
      ],
      group: group0,
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
      consoleSplits: [
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
  openProjectFiles(json: any) {
    const groups = json.openedFiles.map((paths: string[]) => {
      const files = paths.map(file => {
        return appStore.getFileByName(file).getModel();
      });
      return new Group(files[0], null, files);
    });
    this.setState({ group: groups[0], groups });
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
    if (false && (json as any).openedFiles) {
      // this.openProjectFiles(json);
    }
    this.logLn("Project Loaded ...");
    loadProject(newProject);
  }
  bindAppStoreEvents() {
    appStore.onLoadProject.register(() => {
      this.setState({ project: appStore.getProject() });
      this.forceUpdate();
      this.runTask("project:load");
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
    this.state.group.open(notes);
    this.forceUpdate();
  }

  registerShortcuts() {
    Project.onBuild.register(() => {
      this.build();
    });
    Project.onRun.register(() => {
      this.run();
    });
    Mousetrap.bind("command+b", () => {
      Project.build();
    });
    Mousetrap.bind("command+enter", () => {
      Project.run();
    });
    // Mousetrap.bind('command+1', (e) => {
    //   let groups = this.state.groups;
    //   groups.length > 0 && this.setState({group: groups[0]});
    //   e.preventDefault();
    // });
    // Mousetrap.bind('command+2', (e) => {
    //   let groups = this.state.groups;
    //   groups.length > 1 && this.setState({group: groups[1]});
    //   e.preventDefault();
    // });
    // Mousetrap.bind('command+3', (e) => {
    //   let groups = this.state.groups;
    //   groups.length > 2 && this.setState({group: groups[2]});
    //   e.preventDefault();
    // });
    // Mousetrap.bind('command+shift+left', (e) => {
    //   console.log("left");
    //   e.preventDefault();
    // });
    // Mousetrap.bind('command+shift+right', (e) => {
    //   console.log("right");
    //   e.preventDefault();
    // });
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
    if (!this.props.embed) {
      this.loadReleaseNotes();
    }

    window.addEventListener("resize", () => {
      console.log("App.forceUpdate because of window resize.");
      this.forceUpdate();
    }, false);
  }

  share() {
    this.setState({ shareDialog: true });
  }

  run() {
    const file = appStore.getFileByName("src/main.html");
    let src = appStore.getFileSource(file);

    src = src.replace(/src\s*=\s*"(.+?)"/, (a: string, b: any) => {
      const bFile = appStore.getFileByName(b);
      const src = appStore.getFileBuffer(bFile).getValue();
      const blob = new Blob([src], { type: "text/javascript" });
      return `src="${window.URL.createObjectURL(blob)}"`;
    });
    const projectModel = this.state.project.getModel();
    this.controlCenter.sandbox.run(projectModel, src);
  }
  splitGroup() {
    const groups = this.state.groups;
    const lastGroup = groups[groups.length - 1];
    if (lastGroup.files.length === 0) {
      return;
    }
    const group = new Group(lastGroup.file, null, [lastGroup.file]);
    this.state.groups.push(group);
    this.setState({ group });
  }
  /**
   * Runs a gulp task.
   */
  async runTask(name: string, optional: boolean = false) {
    const run = async (src: string) => {
      const gulp = new Gulpy();
      const context = {
        gulp,
        project: this.state.project.getModel(),
        Service,
        Language,
        logLn: this.logLn.bind(this),
        filetypeForExtension
      };
      Function.apply(null, Object.keys(context).concat(src)).apply(gulp, Object.values(context));
      if (gulp.hasTask(name)) {
        try {
          await gulp.run(name);
        } catch (e) {
          this.logLn(e.message, "error");
        }
      } else if (!optional) {
        this.logLn(`Task ${name} is not optional.` , "error");
      }
    };
    const buildTsFile = appStore.getFileByName("build.ts");
    const buildJsFile = appStore.getFileByName("build.js");
    if (buildTsFile) {
      const output = await buildTsFile.getModel().getEmitOutput();
      await run(output.outputFiles[0].text);
    } else if (buildJsFile) {
      await run(appStore.getFileSource(buildJsFile));
    } else {
      this.logLn(Errors.BuildFileMissing, "error");
    }
  }
  async build() {
    const projectModel = this.state.project.getModel();
    projectModel.setStatus("Building Project ...");
    await this.runTask("default");
    projectModel.clearStatus();
    return;
  }
  async update() {
    this.logLn("Saving Project ...");
    const openedFiles = this.state.groups.map((group) => {
      return group.files.map((file) => file.getPath());
    });
    const projectModel = this.state.project.getModel();
    await Service.saveProject(projectModel, openedFiles, this.state.fiddle);
    this.logLn("Saved Project OK");
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
  async gist() {
    this.logLn("Exporting Project ...");
    const projectModel = this.state.project.getModel();
    const gistURI = await Service.exportProjectToGist(projectModel, this.state.fiddle);
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
        title="View Workspace"
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
          label="Edit in Web Assembly Studio"
          title="Edit in WebAssembly Studio"
          onClick={() => {
            // this.update();
          }}
        />);
    } else {
      toolbarButtons.push(
        <Button
          icon={<GoPencil />}
          label="Update"
          title="Update Fiddle"
          onClick={() => {
            this.update();
          }}
        />,
        <Button
          icon={<GoRepoForked />}
          label="Fork"
          title="Fork Fiddle"
          onClick={() => {
            this.fork();
          }}
        />,
        <Button
          icon={<GoGist />}
          label="Gist"
          title="Export to Gist"
          onClick={() => {
            this.gist();
          }}
        />,
        <Button
          icon={<GoDesktopDownload />}
          label="Download"
          title="Download as zip"
          onClick={() => {
            this.download();
          }}
        />,
        <Button
          icon={<GoRocket />}
          label="Share"
          onClick={() => {
            this.share();
          }}
        />);
    }
    toolbarButtons.push(
      <Button
        icon={<GoBeaker />}
        label="Build"
        title="Build: CtrlCmd + B"
        onClick={() => {
          this.build();
        }}
      />,
      <Button
        icon={<GoGear />}
        label="Run"
        title="Run: CtrlCmd + Enter"
        onClick={() => {
          this.run();
        }}
      />,
      <Button
        icon={<GoOpenIssue />}
        label="GitHub Issues"
        title="GitHub Issues"
        customClassName="issue"
        onClick={() => {
          window.open("https://github.com/wasdk/WebAssemblyStudio", "_blank");
        }}
      />);
    return toolbarButtons;
  }
  private controlCenter: ControlCenter;
  setControlCenter(controlCenter: ControlCenter) {
    this.controlCenter = controlCenter;
  }
  render() {
    const self = this;

    function makeEditorPanes(groups: Group[]): any {
      if (groups.length === 0) {
        return <div>No Groups</div>;
      }
      return groups.map(group => {
        // tslint:disable-next-line:jsx-key
        return <EditorPane
          files={group.files.slice(0)}
          file={group.file}
          preview={group.preview}
          onSplitEditor={() => {
            self.splitGroup();
          }}
          hasFocus={self.state.group === group}
          onFocus={() => {
            // TODO: Should be taken care of in shouldComponentUpdate instead.
            if (self.state.group !== group) {
              self.setState({ group });
            }
          }}
          onClickFile={(file) => {
            group.open(file);
            self.setState({ group });
          }}
          onDoubleClickFile={(file: File) => {
            if (file instanceof Directory) {
              return;
            }
            group.open(file, false);
            self.setState({ group });
          }}
          onClose={(file) => {
            const groups = self.state.groups;
            group.close(file);
            if (group.files.length === 0 && groups.length > 1) {
              const i = groups.indexOf(group);
              groups.splice(i, 1);
              const g = groups.length ? groups[Math.min(groups.length - 1, i)] : null;
              self.setState({ groups, group: g });
              layout();
            } else {
              self.setState({ group });
            }
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
      {makeEditorPanes(this.state.groups)}
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
              this.logLn("Template doesn't contain a project definition.", "error");
            } else {
              const projectModel = this.state.project.getModel();
              const json = await Service.loadProject(template.project, projectModel);
              this.openProjectFiles(json);
              this.runTask("project:load", true);
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
              this.state.group.open(file);
              this.forceUpdate();
            }}
            onDoubleClickFile={(file: File) => {
              if (file instanceof Directory) {
                return;
              }
              this.state.group.open(file, false);
              this.forceUpdate();
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
          />
          <div className="fill">
            <div style={{ height: "40px" }}>
              <Toolbar>{this.makeToolbarButtons()}</Toolbar>
            </div>
            <div style={{ height: "calc(100% - 40px)" }}>
              <Split
                name="Console"
                orientation={SplitOrientation.Horizontal}
                splits={this.state.consoleSplits}
                onChange={(splits) => {
                  this.setState({ consoleSplits: splits });
                  layout();
                }}
              >
                {editorPanes}
                <ControlCenter ref={(ref) => this.setControlCenter(ref)} />
              </Split>
            </div>
          </div>
        </Split>
      </div>
      <StatusBar />
    </div>;
  }
}
