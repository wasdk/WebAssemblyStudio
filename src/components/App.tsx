import * as React from "react";
import * as ReactDOM from "react-dom";
import { Workspace } from "./Workspace";
import { Console } from "./Console";
import { Editor } from "./Editor";
import { Header } from "./Header";
import { Toolbar } from "./Toolbar";

import { Tabs, Tab } from "./Tabs";
import { EditorPane, View } from "./EditorPane";
import { Project, File, FileType, Directory, shallowCompare } from "../model";
import { Service, Language } from "../service";
import { Split, SplitOrientation, SplitInfo } from "./Split";

import { layout, assert } from "../index";
import { Wast } from "../languages/wast";
import { Log } from "../languages/log";

import * as Mousetrap from "mousetrap";
import { Sandbox } from "./Sandbox";
import { Gulpy, testGulpy } from "../gulpy";
import { Menu, MenuItem } from "./Menu";
import { GoDelete, GoPencil, GoGear, GoVerified, GoFileCode, GoQuote, GoFileBinary, GoFile, GoDesktopDownload, GoBook, GoRepoForked, GoRocket, GoBeaker, GoThreeBars } from "./Icons";
import { Button } from "./Button";

import * as ReactModal from "react-modal";
import { NewFileDialog } from "./NewFileDialog";
import { EditFileDialog } from "./EditFileDialog";
import { Spacer, Divider } from "./Widgets";
import { Cton } from "../languages/cton";
import { X86 } from "../languages/x86";
import { ShareDialog } from "./ShareDialog";
import { NewProjectDialog, Template } from "./NewProjectDialog";
import { Errors } from "../errors";
import { ControlCenter } from "./ControlCenter";

export class Group {
  file: File;
  files: File[];
  preview: File;
  constructor(file: File, preview: File, files: File[]) {
    this.file = file;
    this.preview = preview;
    this.files = files;
  }
  open(file: File, shouldPreview: boolean = true) {
    let files = this.files;
    let index = files.indexOf(file);
    if (index >= 0) {
      // Switch to file if it's aleady open.
      this.file = file;
      if (!shouldPreview) {
        this.preview = null;
      }
      return;
    }
    if (shouldPreview) {
      if (this.preview) {
        // Replace preview file if there is one.
        let previewIndex = files.indexOf(this.preview);
        assert(previewIndex >= 0);
        this.file = this.preview = files[previewIndex] = file;
      } else {
        files.push(file);
        this.file = this.preview = file;
      }
    } else {
      files.push(file);
      this.file = file;
      this.preview = null;
    }
  }
  close(file: File) {
    let i = this.files.indexOf(file);
    assert(i >= 0);
    if (file == this.preview) {
      this.preview = null;
    }
    this.files.splice(i, 1);
    this.file = this.files.length ? this.files[Math.min(this.files.length - 1, i)] : null;
  }
}

export interface AppState {
  file: File;
  fiddle: string;
  groups: Group[];
  group: Group;

  /**
   * If not null, the the new file dialog is open and files are created in this
   * directory.
   */
  newFileDialogDirectory: Directory;

  /**
   * If not null, the the edit file dialog is open.
   */
  editFileDialogFile: File;

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

  showProblems: boolean;
  showSandbox: boolean;
}

export interface AppProps {
  embed: boolean;
  fiddle: string;
}

export class App extends React.Component<AppProps, AppState> {
  fiddle: string;
  project: Project;
  constructor(props: AppProps) {
    super(props);
    let group0 = new Group(null, null, []);
    this.state = {
      fiddle: props.fiddle,
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
      showSandbox: true
    };
    this.registerLanguages();
  }
  openProjectFiles(json: any) {
    let groups = json.openedFiles.map((paths: string[]) => {
      let files = paths.map(file => {
        return this.project.getFile(file)
      })
      return new Group(files[0], null, files);
    });
    this.setState({ group: groups[0], groups });
  }
  async initializeProject() {
    this.project = new Project();
    if (this.state.fiddle) {
      let json = await Service.loadJSON(this.state.fiddle);
      json = await Service.loadProject(json, this.project);
      if (false && (json as any).openedFiles) {
        // this.loadProject(json);
      }
      this.logLn("Project Loaded ...");
      this.forceUpdate();
    }
    this.project.onDidChangeBuffer.register(() => {
      this.forceUpdate();
    });
    this.project.onDidChangeData.register(() => {
      this.forceUpdate();
    });
    this.project.onDidChangeChildren.register(() => {
      this.forceUpdate();
    });

    this.project.onDirtyFileUsed.register((file: File) => {
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

  async registerLanguages() {
    monaco.editor.defineTheme("fiddle-theme", {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'custom-info', foreground: 'd4d4d4' },
        { token: 'custom-warn', foreground: 'ff9900' },
        { token: 'custom-error', background: '00ff00', foreground: 'ff0000', fontStyle: 'bold' }
      ]
    } as any);

    // Wast

    monaco.languages.register({
      id: "wast"
    });
    monaco.languages.onLanguage("wast", () => {
      monaco.languages.setMonarchTokensProvider("wast", Wast.MonarchDefinitions as any);
      monaco.languages.setLanguageConfiguration("wast", Wast.LanguageConfiguration);
      monaco.languages.registerCompletionItemProvider("wast", Wast.CompletionItemProvider);
      monaco.languages.registerHoverProvider("wast", Wast.HoverProvider);
    });

    // Log

    monaco.languages.register({
      id: "log"
    });
    monaco.languages.onLanguage("log", () => {
      monaco.languages.setMonarchTokensProvider("log", Log.MonarchTokensProvider as any);
    });

    // Cretonne

    monaco.languages.register({
      id: "cton"
    });
    monaco.languages.onLanguage("cton", () => {
      monaco.languages.setMonarchTokensProvider("cton", Cton.MonarchDefinitions as any);
      // monaco.languages.setLanguageConfiguration("cton", Cton.LanguageConfiguration);
      // monaco.languages.registerCompletionItemProvider("cton", Cton.CompletionItemProvider);
      // monaco.languages.registerHoverProvider("cton", Cton.HoverProvider);
    });

    // X86

    monaco.languages.register({
      id: "x86"
    });
    monaco.languages.onLanguage("x86", () => {
      monaco.languages.setMonarchTokensProvider("x86", X86.MonarchDefinitions as any);
      // monaco.languages.setLanguageConfiguration("cton", Cton.LanguageConfiguration);
      // monaco.languages.registerCompletionItemProvider("cton", Cton.CompletionItemProvider);
      // monaco.languages.registerHoverProvider("cton", Cton.HoverProvider);
    });

    let response = await fetch("lib/lib.es6.d.ts");
    monaco.languages.typescript.typescriptDefaults.addExtraLib(await response.text());

    response = await fetch("lib/fiddle.d.ts");
    monaco.languages.typescript.typescriptDefaults.addExtraLib(await response.text());

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({ noLib: true, allowNonTsExtensions: true });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ noLib: true, allowNonTsExtensions: true });

  }

  async loadReleaseNotes() {
    const response = await fetch("notes/notes.md");
    const src = await response.text();
    let notes = new File("Release Notes", FileType.Markdown);
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
    Mousetrap.bind('command+b', () => {
      Project.build();
    });
    Mousetrap.bind('command+enter', () => {
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
    if (this.controlCenter) {
      this.controlCenter.logLn(message, kind);
    }
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
    let root = this.project;
    let src = root.getFile("src/main.html").getData() as string;

    src = src.replace(/src\s*=\s*"(.+?)"/, (a: string, b: any) => {
      let src = root.getFile(b).buffer.getValue();
      let blob = new Blob([src], { type: "text/javascript" });
      return `src="${window.URL.createObjectURL(blob)}"`;
    });
    this.controlCenter.sandbox.run(this.project, src);
  }
  splitGroup() {
    let groups = this.state.groups;
    let lastGroup = groups[groups.length - 1];
    if (lastGroup.files.length === 0) {
      return;
    }
    let group = new Group(lastGroup.file, null, [lastGroup.file]);
    this.state.groups.push(group);
    this.setState({ group });
  }
  async build() {
    const run = (src: string) => {
      let fn = new Function("gulp", "project", "Service", "logLn", src);
      let gulp = new Gulpy();
      fn(gulp, this.project, Service, this.logLn.bind(self));
      gulp.run("default");
    };

    let buildTs = this.project.getFile("build.ts");
    let buildJS = this.project.getFile("build.js");
    if (buildTs) {
      const output = await buildTs.getEmitOutput();
      run(output.outputFiles[0].text);
    } else if (buildJS) {
      run(buildJS.getData() as string);
    } else {
      this.logLn(Errors.BuildFileMissing, "error");
      return;
    }
  }
  async update() {
    this.logLn("Saving Project ...");
    let openedFiles = this.state.groups.map((group) => {
      return group.files.map((file) => file.getPath());
    });
    await Service.saveProject(this.project, openedFiles, this.state.fiddle);
    this.logLn("Saved Project OK");
  }
  async fork() {
    this.logLn("Forking Project ...");
    const fiddle = await Service.saveProject(this.project, []);
    this.logLn("Forked Project OK " + fiddle);
    let search = window.location.search;
    if (this.state.fiddle) {
      assert(search.indexOf(this.state.fiddle) >= 0);
      history.replaceState({}, fiddle, search.replace(this.state.fiddle, fiddle));
    } else {
      history.pushState({}, fiddle, `?f=${fiddle}`);
    }
    this.setState({ fiddle });
  }
  // makeMenuItems(file: File) {
  //   let items = [];
  //   let directory = file.type === FileType.Directory ? file : file.parent;
  //   items.push(
  //     <MenuItem key="new file" label="New File" icon={<GoFile />} onClick={() => {
  //       this.setState({ newFileDialogDirectory: directory as Directory });
  //     }} />
  //   );
  //   if (file.type === FileType.Wasm) {
  //     items.push(
  //       <MenuItem key="opt bin" label="Optimize w/ Binaryen" icon={<GoGear />} onClick={() => {
  //         Service.optimizeWasmWithBinaryen(file);
  //       }} />
  //     );
  //     items.push(
  //       <MenuItem key="val bin" label="Validate w/ Binaryen" icon={<GoVerified />} onClick={() => {
  //         Service.validateWasmWithBinaryen(file);
  //       }} />
  //     );
  //     items.push(
  //       <MenuItem key="dld bin" label="Download" icon={<GoDesktopDownload />} onClick={() => {
  //         Service.download(file);
  //       }} />
  //     );
  //     items.push(
  //       <MenuItem key="dis bin" label="Disassemble w/ Wabt" icon={<GoFileCode />} onClick={() => {
  //         Service.disassembleWasmWithWabt(file);
  //       }} />
  //     );
  //     items.push(
  //       <MenuItem key="dis x86" label="Firefox x86" icon={<GoFileBinary />} onClick={() => {
  //         Service.disassembleX86(file);
  //       }} />,
  //       <MenuItem key="dis x86 base" label="Firefox x86 Baseline" icon={<GoFileBinary />} onClick={() => {
  //         Service.disassembleX86(file, "--wasm-always-baseline");
  //       }} />
  //     );
  //   } else if (file.type === FileType.C || file.type === FileType.Cpp) {
  //     items.push(
  //       <MenuItem key="format" label="Format w/ Clang" icon={<GoQuote />} onClick={() => {
  //         Service.clangFormat(file);
  //       }} />
  //     );
  //   } else if (file.type === FileType.Wast) {
  //     items.push(
  //       <MenuItem key="asm bin" label="Assemble w/ Wabt" icon={<GoFileBinary />} onClick={() => {
  //         Service.assembleWastWithWabt(file);
  //       }} />
  //     );
  //   }
  //   items.push(<Divider key="divider" height={8} />);
  //   items.push(<MenuItem key="edit" label="Edit" icon={<GoPencil />} onClick={() => {
  //     this.setState({ editFileDialogFile: file });
  //   }} />);
  //   items.push(<MenuItem key="delete" label="Delete" icon={<GoDelete />} onClick={() => {
  //     let message = "";
  //     if (file instanceof Directory) {
  //       message = `Are you sure you want to delete '${file.name}' and its contents?`;
  //     } else {
  //       message = `Are you sure you want to delete '${file.name}'?`;
  //     }
  //     if (confirm(message)) {
  //       file.parent.removeFile(file);
  //     }
  //   }} />);
  //   return items;
  // }

  /**
   * Remember workspace split.
   */
  private workspaceSplit: SplitInfo = null;

  makeToolbarButtons() {
    let toolbarButtons = [
      <Button icon={<GoThreeBars />} title="View Workspace" onClick={() => {
        let workspaceSplits = this.state.workspaceSplits;
        let first = workspaceSplits[0];
        let second = workspaceSplits[1];
        if (this.workspaceSplit) {
          Object.assign(first, this.workspaceSplit);
          this.workspaceSplit = null;
          delete second.value;
        } else {
          this.workspaceSplit = Object.assign({}, first);
          first.max = first.min = 0;
        }
        this.setState({ workspaceSplits });
      }} />
    ];
    if (this.props.embed) {
      toolbarButtons.push(
        <Button icon={<GoPencil />} label="Edit in Web Assembly Studio" title="Edit in WebAssembly Fiddle" onClick={() => {
          // this.update();
        }} />);
    } else {
      toolbarButtons.push(
        <Button icon={<GoPencil />} label="Update" title="Update Fiddle" onClick={() => {
          this.update();
        }} />,
        <Button icon={<GoRepoForked />} label="Fork" title="Fork Fiddle" onClick={() => {
          this.fork();
        }} />,
        <Button icon={<GoRocket />} label="Share" onClick={() => {
          this.share();
        }} />);
    }
    toolbarButtons.push(
      <Button icon={<GoBeaker />} label="Build" title="Build: CtrlCmd + B" onClick={() => {
        this.build();
      }} />,
      <Button icon={<GoGear />} label="Run" title="Run: CtrlCmd + Enter" onClick={() => {
        this.run();
      }} />);
    return toolbarButtons;
  }
  private controlCenter: ControlCenter;
  setControlCenter(controlCenter: ControlCenter) {
    this.controlCenter = controlCenter;
  }
  render() {
    let self = this;

    function makeEditorPanes(groups: Group[]): any {
      if (groups.length === 0) {
        return <div>No Groups</div>
      }
      return groups.map(group => {
        return <EditorPane files={group.files.slice(0)} file={group.file} preview={group.preview}
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
          onDoubleClickFile={(file) => {
            if (file instanceof Directory) {
              return;
            }
            group.open(file, false);
            self.setState({ group });
          }}
          onClose={(file) => {
            let groups = self.state.groups;
            group.close(file);
            if (group.files.length === 0 && groups.length > 1) {
              let i = groups.indexOf(group);
              groups.splice(i, 1);
              let g = groups.length ? groups[Math.min(groups.length - 1, i)] : null;
              self.setState({ groups, group: g });
              layout();
            } else {
              self.setState({ group });
            }
          }} />
      });
    }

    let editorPanes = <Split name="Editors" orientation={SplitOrientation.Vertical} defaultSplit={{
      min: 128,
    }} splits={this.state.editorSplits} onChange={(splits) => {
      this.setState({ editorSplits: splits });
      layout();
    }}>
      {makeEditorPanes(this.state.groups)}
    </Split>

    return <div className="fill">
      {this.state.newProjectDialog &&
        <NewProjectDialog isOpen={true} onCancel={() => {
          this.setState({ newProjectDialog: null });
        }}
          onCreate={async (template: Template) => {
            if (!template.project) {
              this.logLn("Template doesn't contain a project definition.", "error");
            } else {
              const json = await Service.loadProject(template.project, this.project);
              this.openProjectFiles(json);
            }
            this.setState({ newProjectDialog: false });
          }} />
      }
      {this.state.newFileDialogDirectory &&
        <NewFileDialog isOpen={true} directory={this.state.newFileDialogDirectory} onCancel={() => {
          this.setState({ newFileDialogDirectory: null });
        }}
          onCreate={(file: File) => {
            this.project.addFile(file);
            this.setState({ newFileDialogDirectory: null });
          }} />
      }
      {this.state.editFileDialogFile &&
        <EditFileDialog isOpen={true} file={this.state.editFileDialogFile} onCancel={() => {
          this.setState({ editFileDialogFile: null });
        }}
          onChange={(name: string, description) => {
            let file = this.state.editFileDialogFile;
            file.name = name;
            file.description = description;
            this.setState({ editFileDialogFile: null });
          }} />
      }
      {this.state.shareDialog &&
        <ShareDialog isOpen={true} fiddle={this.state.fiddle} onCancel={() => {
          this.setState({ shareDialog: false });
        }} />
      }
      <div style={{ height: "calc(100% - 22px)" }}>
        <Split name="Workspace" orientation={SplitOrientation.Vertical} splits={this.state.workspaceSplits} onChange={(splits) => {
          this.setState({ workspaceSplits: splits });
          layout();
        }}>
          <Workspace project={this.project}
            file={this.state.file}
            onNewFile={(directory: Directory) => {
              this.setState({ newFileDialogDirectory: directory});
            }}
            onEditFile={(file: File) => {
              this.setState({ editFileDialogFile: file});
            }}
            onDeleteFile={(file: File) => {
              let message = "";
              if (file instanceof Directory) {
                message = `Are you sure you want to delete '${file.name}' and its contents?`;
              } else {
                message = `Are you sure you want to delete '${file.name}'?`;
              }
              if (confirm(message)) {
                file.parent.removeFile(file);
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
            }}></Workspace>
          <div className="fill">
            <div style={{ height: "40px" }}>
              <Toolbar>{this.makeToolbarButtons()}</Toolbar>
            </div>
            <div style={{ height: "calc(100% - 40px)" }}>
              <Split name="Console" orientation={SplitOrientation.Horizontal} splits={this.state.consoleSplits} onChange={(splits) => {
                this.setState({ consoleSplits: splits });
                layout();
              }}>
                {editorPanes}
                <ControlCenter project={this.project} ref={(ref) => this.setControlCenter(ref)} />
              </Split>
            </div>
          </div>
        </Split>
      </div>
      <div className="status-bar">
        <div className="status-bar-item">
          Web Assembly Studio
        </div>
      </div>
    </div>
  }
}
