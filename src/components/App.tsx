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

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactModal from 'react-modal';

import { Workspace } from './Workspace';
import { RightPanel } from './RightPanel';
import { EditorView, ViewTabs, View, Tab, Tabs } from './editor';
import { Header } from './Header';
import { Toolbar } from './Toolbar';
import { ViewType, defaultViewTypeForFileType, isViewFileDirty } from './editor/View';
import { build, deploy as deployTask, run, runTask, openFiles, pushStatus, popStatus } from '../actions/AppActions';

import appStore from '../stores/AppStore';
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
  closeTabs,
  saveProject,
  focusTabGroup,
  setViewType,
  logLn,
} from '../actions/AppActions';
import { Project, File, FileType, Directory, ModelRef, IStatusProvider } from '../models';
import { Service, Language } from '../service';
import { Split, SplitOrientation, SplitInfo } from './Split';

import { layout, assert, resetDOMSelection } from '../util';

import * as Mousetrap from 'mousetrap';
import { Sandbox } from './Sandbox';
import { Gulpy } from '../gulpy';
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
  GoBeakerGear,
  GoThreeBars,
  GoGist,
  GoCheck,
  GoOpenIssue,
  GoQuestion,
} from './shared/Icons';
import { Button } from './shared/Button';

import { NewFileDialog } from './NewFileDialog';
import { EditFileDialog } from './EditFileDialog';
import { UploadFileDialog } from './UploadFileDialog';
import { ToastContainer } from './Toasts';
import { Spacer, Divider } from './Widgets';
import { ShareDialog } from './ShareDialog';
import { NewProjectDialog, Template } from './NewProjectDialog';
import { NewDirectoryDialog } from './NewDirectoryDialog';
import { Errors } from '../errors';
import { ControlCenter } from './ControlCenter';
import Group from '../utils/group';
import { StatusBar } from './StatusBar';
import { publishArc, notifyArcAboutFork } from '../actions/ArcActions';
import { RunTaskExternals } from '../utils/taskRunner';
import { SaveCFDialog } from './SaveCFDialog';
import { DeployContractDialog } from './DeployContractDialog';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { isDeepStrictEqual } from 'util';
import { IceteaWeb3 } from '@iceteachain/web3';
const tweb3 = new IceteaWeb3('https://rpc.icetea.io');

export interface AppState {
  project: ModelRef<Project>;
  file: ModelRef<File>;
  fiddle: string;
  deployedAddresses: string[];

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
   * If true, the call contract dialog is open.
   */
  callContractDialog: boolean;

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
  tabGroups: Group[];
  activeTabGroup: Group;
  hasStatus: boolean;
  isContentModified: boolean;
  windowDimensions: string;
  /**
   * If true, the confirm dialog is open.
   */
  confirmDialog: boolean;
  isDeploy: boolean;
  deployDialog: boolean;
   /**
   * Contract deploy signer(may be Payer)
   */
  signer: string[];
}

export interface AppProps {
  /**
   * If true, the Update button is visible.
   */
  update: boolean;
  fiddle: string;
  deployedAddresses: string[];
  embeddingParams: EmbeddingParams;
  windowContext: AppWindowContext;
}

export enum EmbeddingType {
  None,
  Default,
  Arc,
}

export interface EmbeddingParams {
  type: EmbeddingType;
  templatesName: string;
}

export interface AppWindowContext {
  promptWhenClosing: boolean;
}

export class App extends React.Component<AppProps, AppState> {
  fiddle: string;
  toastContainer: ToastContainer;
  status: IStatusProvider;
  constructor(props: AppProps) {
    super(props);
    this.state = {
      fiddle: props.fiddle,
      deployedAddresses: props.deployedAddresses,
      project: null,
      file: null,
      newFileDialogDirectory: null,
      editFileDialogFile: null,
      newProjectDialog: !props.fiddle,
      shareDialog: false,
      callContractDialog: false,
      workspaceSplits: [
        {
          min: 200,
          max: 400,
          value: 200,
        },
        {
          min: 256,
        },
        {
          min: 300,
          max: 500,
          value: 400,
        },
      ],
      controlCenterSplits: [{ min: 100 }, { min: 40, value: 256 }],
      editorSplits: [],
      showProblems: true,
      showSandbox: props.embeddingParams.type !== EmbeddingType.Arc,
      uploadFileDialogDirectory: null,
      newDirectoryDialog: null,
      tabGroups: null,
      activeTabGroup: null,
      windowDimensions: App.getWindowDimensions(),
      hasStatus: false,
      isContentModified: false,
      confirmDialog: false,
      isDeploy: false,
      deployDialog: false,
      signer: [],
    };
  }
  private async initializeProject() {
    initStore();
    this.setState({
      project: appStore.getProject(),
      tabGroups: appStore.getTabGroups(),
      activeTabGroup: appStore.getActiveTabGroup(),
      hasStatus: appStore.hasStatus(),
    });
    this.bindAppStoreEvents();
    if (this.state.fiddle) {
      this.loadProjectFromFiddle(this.state.fiddle);
    }
    let address;
    let account = [];
    for (let i = 0; i < 10; i++) {
      address = tweb3.wallet.createAccount().address;
      account.push(address);
    }
    this.setState({
      signer: account,
    });
  }
  private static getWindowDimensions(): string {
    return `${window.innerWidth}x${window.innerHeight}@${window.devicePixelRatio}`;
  }
  private async loadProjectFromFiddle(uri: string) {
    const project = new Project();
    pushStatus('Downloading Project');
    const fiddle = await Service.loadJSON(uri);
    popStatus();
    if (fiddle.success) {
      await Service.loadFilesIntoProject(fiddle.files, project);
      loadProject(project);
      if (project.getFile('README.md')) {
        openFiles([['README.md']]);
      }
    } else {
      if (this.toastContainer) {
        this.toastContainer.showToast(<span>Project {uri} was not found.</span>, 'error');
      }
    }
  }
  bindAppStoreEvents() {
    appStore.onLoadProject.register(() => {
      this.setState({ project: appStore.getProject() });
      runTask('project:load', true, RunTaskExternals.Setup);
    });
    appStore.onDirtyFileUsed.register((file: File) => {
      this.logLn(`Changes in ${file.getPath()} were ignored, save your changes.`, 'warn');
    });
    appStore.onTabsChange.register(() => {
      this.setState({
        tabGroups: appStore.getTabGroups(),
        activeTabGroup: appStore.getActiveTabGroup(),
      });
      layout();
    });
    appStore.onDidChangeStatus.register(() => {
      this.setState({
        hasStatus: appStore.hasStatus(),
      });
    });
    appStore.onDidChangeIsContentModified.register(() => {
      this.props.windowContext.promptWhenClosing = appStore.getIsContentModified();

      this.setState({
        isContentModified: appStore.getIsContentModified(),
      });
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
    const response = await fetch('notes/notes.md');
    const src = await response.text();
    const notes = new File('Release Notes', FileType.Markdown);
    notes.setData(src);
    openFile(notes, defaultViewTypeForFileType(notes.type));
  }

  async loadHelp() {
    const response = await fetch('notes/help.md');
    const src = await response.text();
    const help = new File('Help', FileType.Markdown);
    help.setData(src);
    openFile(help, defaultViewTypeForFileType(help.type));
  }

  private publishArc(): Promise<void> {
    if (this.state.isContentModified) {
      return this.fork().then(publishArc);
    } else {
      return publishArc();
    }
  }

  private async deploy() {
    const { deployedAddresses } = this.state;

    return deployTask().then(result => {
      if (result) {
        const address = result.address || result;
        if (address) {
          // this.state.deployedAddresses.unshift(address);
          this.setState({ deployedAddresses: [...deployedAddresses, address] });
          if (this.toastContainer) {
            const index = this.toastContainer.showToast(
              <span>
                {' '}
                Deployed to <b>{address.slice(0, 12) + '...' + address.substr(-6)}</b> -{' '}
                <a
                  href={'https://devtools.icetea.io/contract.html?address=' + address}
                  target="_blank"
                  className="toast-span"
                  onClick={() => {
                    this.toastContainer.onDismiss(index);
                  }}
                >
                  Call this contract
                </a>
              </span>
            );
            const timeout = this.props.embeddingParams.type === EmbeddingType.Default ? 15000 : 5000;
            setTimeout(() => {
              this.toastContainer.onDismiss(index);
            }, timeout);
          }
        }
      }
    });
  }

  registerShortcuts() {
    Mousetrap.bind('command+b', () => {
      build();
    });
    Mousetrap.bind('command+enter', () => {
      if (this.props.embeddingParams.type !== EmbeddingType.Arc) {
        //run();
        this.callContract();
      } else {
        this.publishArc();
      }
    });
    Mousetrap.bind('command+alt+enter', () => {
      if (this.props.embeddingParams.type !== EmbeddingType.Arc) {
        build().then(this.deploy.bind(this));
      } else {
        build().then(() => this.publishArc());
      }
    });
  }
  logLn(message: string, kind: '' | 'info' | 'warn' | 'error' = '') {
    logLn(message, kind);
  }
  componentWillMount() {
    this.initializeProject();
  }
  componentDidMount() {
    layout();
    this.registerShortcuts();
    window.addEventListener(
      'resize',
      () => {
        this.setState({
          windowDimensions: App.getWindowDimensions(),
        });
      },
      false
    );
    if (this.props.embeddingParams.type === EmbeddingType.Arc) {
      window.addEventListener('message', e => {
        if (typeof e.data === 'object' && e.data !== null && e.data.type === 'arc/fork') {
          this.fork();
        }
      });
    }
  }

  share() {
    this.setState({ shareDialog: true });
  }

  callContract() {
    this.setState({ callContractDialog: true });
  }

  async update() {
    saveProject(this.state.fiddle);
  }
  async fork() {
    pushStatus('Forking Project');
    const fiddle = await saveProject('');
    popStatus();
    const search = window.location.search;
    if (this.state.fiddle) {
      assert(search.indexOf(this.state.fiddle) >= 0);
      history.replaceState({}, fiddle, search.replace(this.state.fiddle, fiddle));
    } else {
      const prefix = search ? search + '&' : '?';
      history.pushState({}, fiddle, `${prefix}f=${fiddle}`);
    }
    this.setState({ fiddle });
    if (this.props.embeddingParams.type === EmbeddingType.Arc) {
      notifyArcAboutFork(fiddle);
    }
  }
  async gist(fileOrDirectory?: File) {
    pushStatus('Exporting Project');
    const target: File = fileOrDirectory || this.state.project.getModel();
    const gistURI = await Service.exportToGist(target, this.state.fiddle);
    popStatus();
    if (gistURI) {
      if (this.toastContainer) {
        this.toastContainer.showToast(
          <span>
            "Gist Created!"{' '}
            <a href={gistURI} target="_blank" className="toast-span">
              Open in new tab.
            </a>
          </span>
        );
      }
      console.log(`Gist created: ${gistURI}`);
    } else {
      console.log('Failed!');
    }
  }
  async download() {
    this.logLn('Downloading Project ...');
    const downloadService = await import('../utils/download');
    const projectModel = this.state.project.getModel();
    await downloadService.downloadProject(projectModel, this.state.fiddle);
    this.logLn('Project Zip CREATED ');
  }
  /**
   * Remember workspace split.
   */
  private workspaceSplit: SplitInfo = null;

  toolbarButtonsAreDisabled() {
    return this.state.hasStatus;
  }

  async saveToBuild(isDeploy = false) {
    // isViewFileDirty
    const groups = this.state.activeTabGroup;
    let view = groups.currentView;
    if (isViewFileDirty(view)) {
      this.setState({ confirmDialog: true });
    } else {
      await build();
      // isDeploy && (await this.deploy.call(this));
      isDeploy && this.setState({ deployDialog: true });
    }
  }

  async saveCurrentTab() {
    this.setState({ confirmDialog: false });
    const activeGroup = this.state.activeTabGroup;
    activeGroup.currentView.file.save(this.status);
    await build();
    // this.state.isDeploy && (await this.deploy.call(this));
    this.state.isDeploy && this.setState({ deployDialog: true });
    this.setState({ isDeploy: false });
  }

  async saveAllTab() {
    this.setState({ confirmDialog: false });
    const groups = this.state.tabGroups;
    let views = groups[0].views.slice(0);
    // console.log("I want to show views", views);
    for (let i = 0; i < views.length; i++) {
      views[i].file.save(this.status);
    }
    await build();
    // this.state.isDeploy && (await this.deploy.call(this));
    this.state.isDeploy && this.setState({ deployDialog: true });
    this.setState({ isDeploy: false });
  }

  makeToolbarButtons() {
    const toolbarButtons = [
      <Button
        key="ViewWorkspace"
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
      />,
    ];
    if (this.props.embeddingParams.type === EmbeddingType.Default) {
      toolbarButtons.push(
        <Button
          key="EditInWebAssemblyStudio"
          icon={<GoPencil />}
          label="Edit in Icetea Studio"
          title="Edit Project in Icetea Studio"
          isDisabled={!this.state.fiddle}
          href={`//studio.icetea.io/?f=${this.state.fiddle}`}
          target="wasm.studio"
          rel="noopener noreferrer"
        />
      );
    }
    if (this.props.embeddingParams.type === EmbeddingType.None && this.props.update) {
      toolbarButtons.push(
        <Button
          key="UpdateProject"
          icon={<GoPencil />}
          label="Update"
          title="Update Project"
          isDisabled={this.toolbarButtonsAreDisabled()}
          onClick={() => {
            this.update();
          }}
        />
      );
    }
    if (
      this.props.embeddingParams.type === EmbeddingType.None ||
      this.props.embeddingParams.type === EmbeddingType.Arc
    ) {
      toolbarButtons.push(
        <Button
          key="ForkProject"
          icon={<GoRepoForked />}
          label="Fork"
          title="Fork Project"
          isDisabled={this.toolbarButtonsAreDisabled()}
          onClick={() => {
            this.fork();
          }}
        />
      );
    }
    if (this.props.embeddingParams.type === EmbeddingType.None) {
      toolbarButtons.push(
        // <Button
        //   key="CreateGist"
        //   icon={<GoGist />}
        //   label="Create Gist"
        //   title="Cannot create gist since Github requires authentication."
        //   isDisabled={this.toolbarButtonsAreDisabled()}
        //   onClick={() => {
        //     this.gist();
        //   }}
        // />,
        <Button
          key="Download"
          icon={<GoDesktopDownload />}
          label="Download"
          title="Download Project"
          isDisabled={this.toolbarButtonsAreDisabled()}
          onClick={() => {
            this.download();
          }}
        />,
        <Button
          key="Share"
          icon={<GoRocket />}
          label="Share"
          title={this.state.fiddle ? 'Share & Embed Project' : 'Please fork the project first.'}
          isDisabled={this.toolbarButtonsAreDisabled() || !this.state.fiddle}
          onClick={() => {
            this.share();
          }}
        />
      );
    }
    toolbarButtons.push(
      <Button
        key="Build"
        icon={<GoBeaker />}
        label="Build"
        title="Build Project: CtrlCmd + B"
        isDisabled={this.toolbarButtonsAreDisabled()}
        onClick={() => {
          this.saveToBuild();
        }}
      />
    );
    toolbarButtons.push(
      <Button
        key="Deploy"
        icon={<GoRocket />}
        label="Deploy"
        title="Deploy"
        isDisabled={this.toolbarButtonsAreDisabled()}
        onClick={() => {
          this.setState({ deployDialog: true}); 
          // this.deploy.call(this);
        }}
      />
    );
    {
      if (this.props.embeddingParams.type !== EmbeddingType.Arc) {
        toolbarButtons.push(
          <Button
            key="BuildAndRun"
            icon={<GoCheck />}
            label="Build &amp; Deploy"
            title="Build &amp; Deploy Project: CtrlCmd + Alt + Enter"
            isDisabled={this.toolbarButtonsAreDisabled()}
            onClick={() => {
              // build().then(this.deploy.bind(this));
              const groups = this.state.activeTabGroup;
              let view = groups.currentView;
              if (!isViewFileDirty(view)) {
                this.saveToBuild(true);
              } else {
                this.setState({ isDeploy: true });
                this.saveToBuild();
              }
            }}
          />
          // <Button
          //   key="Call"
          //   icon={<GoGist />}
          //   label="Call"
          //   title="Call Contract: CtrlCmd + Enter"
          //   isDisabled={this.toolbarButtonsAreDisabled()}
          //   onClick={() => {
          //     this.callContract();
          //   }}
          // />
          // <Button
          //   key="Run"
          //   icon={<GoGear />}
          //   label="Run"
          //   title="Run Project: CtrlCmd + Enter"
          //   isDisabled={this.toolbarButtonsAreDisabled()}
          //   onClick={() => {
          //     run();
          //   }}
          // />,
        );
      }
    }
    if (this.props.embeddingParams.type === EmbeddingType.Arc) {
      toolbarButtons.push(
        <Button
          key="Preview"
          icon={<GoGear />}
          label="Preview"
          title="Preview Project: CtrlCmd + Enter"
          isDisabled={this.toolbarButtonsAreDisabled()}
          onClick={() => {
            this.publishArc();
          }}
        />
      );
      toolbarButtons.push(
        <Button
          key="BuildAndPreview"
          icon={<GoGear />}
          label="Build &amp; Preview"
          title="Build &amp; Preview Project: CtrlCmd + Alt + Enter"
          isDisabled={this.toolbarButtonsAreDisabled()}
          onClick={() => {
            build().then(() => this.publishArc());
          }}
        />
      );
    }
    if (this.props.embeddingParams.type === EmbeddingType.None) {
      toolbarButtons.push(
        <Button
          key="GithubIssues"
          icon={<GoOpenIssue />}
          label="GitHub Issues"
          title="GitHub Issues"
          customClassName="issue"
          href="https://github.com/TradaTech/icetea-studio"
          target="_blank"
          rel="noopener noreferrer"
        />,
        <Button
          key="HelpAndPrivacy"
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
    const { deployedAddresses } = this.state;
    // console.log('deployedAddresses', deployedAddresses);
    const self = this;
    // console.log("state CK", this.state.isDeploy);

    const makeEditorPanes = () => {
      const groups = this.state.tabGroups;
      const activeGroup = this.state.activeTabGroup;

      if (groups.length === 0) {
        return <div>No Groups</div>;
      }
      return groups.map((group: Group, i: number) => {
        // tslint:disable-next-line:jsx-key
        return (
          <ViewTabs
            key={`editorPane${i}`}
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
              if (!(appStore.getActiveTabGroup().currentView === view)) {
                // Avoids the propagation of content selection between tabs.
                resetDOMSelection();
              }
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
          />
        );
      });
    };

    const editorPanes = (
      <Split
        name="Editors"
        orientation={SplitOrientation.Vertical}
        defaultSplit={{
          min: 128,
        }}
        splits={this.state.editorSplits}
        onChange={splits => {
          this.setState({ editorSplits: splits });
          layout();
        }}
      >
        {makeEditorPanes()}
      </Split>
    );

    return (
      <div className="fill">
        <ToastContainer ref={ref => (this.toastContainer = ref)} />
        {this.state.newProjectDialog && (
          <NewProjectDialog
            isOpen={true}
            templatesName={this.props.embeddingParams.templatesName}
            onCancel={() => {
              this.setState({ newProjectDialog: null });
            }}
            onCreate={async (template: Template) => {
              await openProjectFiles(template);
              this.setState({ newProjectDialog: false });
            }}
          />
        )}
        {this.state.newFileDialogDirectory && (
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
        )}
        {this.state.editFileDialogFile && (
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
        )}
        {this.state.shareDialog && (
          <ShareDialog
            isOpen={true}
            fiddle={this.state.fiddle}
            onCancel={() => {
              this.setState({ shareDialog: false });
            }}
          />
        )}
        {/* {this.state.callContractDialog && (
          <CallContractDialog
            isOpen={true}
            deployedAddresses={this.state.deployedAddresses}
            onCancel={() => {
              this.setState({ callContractDialog: false });
            }}
          />
        )} */}
        {this.state.uploadFileDialogDirectory && (
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
        )}
        {this.state.newDirectoryDialog && (
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
        )}
        {this.state.confirmDialog && (
          <SaveCFDialog
            isOpen={true}
            onSave={() => {
              this.saveCurrentTab();
            }}
            onSaveAll={() => {
              this.saveAllTab();
            }}
            onCancel={() => {
              this.setState({ confirmDialog: false });
            }}
            content={(props: any) => <div>Are you sure?</div>}
          />
        )}
        {this.state.deployDialog && (
          <DeployContractDialog
            isOpen={true}
            signer={this.state.signer}
            onCancel={() => {
              this.setState({ deployDialog: false });
            }}
            onDeploy={() => {
              this.deploy.call(this);
              this.setState({ deployDialog: false });
            }}
          />
        )}
        <div style={{ height: 'calc(100% - 22px)' }}>
          <Split
            name="Workspace"
            orientation={SplitOrientation.Vertical}
            splits={this.state.workspaceSplits}
            onChange={splits => {
              this.setState({ workspaceSplits: splits });
              layout();
            }}
          >
            <Workspace
              project={this.state.project}
              file={this.state.file}
              onNewFile={(directory: Directory) => {
                this.setState({
                  newFileDialogDirectory: ModelRef.getRef(directory),
                });
              }}
              onEditFile={(file: File) => {
                this.setState({ editFileDialogFile: ModelRef.getRef(file) });
              }}
              onDeleteFile={(file: File) => {
                let message = '';
                if (file instanceof Directory) {
                  message = `Are you sure you want to delete '${file.name}' and its contents?`;
                } else {
                  message = `Are you sure you want to delete '${file.name}'?`;
                }
                if (confirm(message)) {
                  closeTabs(file);
                  deleteFile(file);
                }
              }}
              onClickFile={(file: File) => {
                // Avoids the propagation of content selection between tabs.
                resetDOMSelection();
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
                this.setState({
                  uploadFileDialogDirectory: ModelRef.getRef(directory),
                });
              }}
              onNewDirectory={(directory: Directory) => {
                this.setState({
                  newDirectoryDialog: ModelRef.getRef(directory),
                });
              }}
              onCreateGist={(fileOrDirectory: File) => {
                this.gist(fileOrDirectory);
              }}
            />
            <div className="fill">
              <div style={{ height: '40px' }}>
                <Toolbar>{this.makeToolbarButtons()}</Toolbar>
              </div>
              <div style={{ height: 'calc(100% - 40px)' }}>
                <Split
                  name="Console"
                  orientation={SplitOrientation.Horizontal}
                  splits={this.state.controlCenterSplits}
                  onChange={splits => {
                    this.setState({ controlCenterSplits: splits });
                    layout();
                  }}
                >
                  {editorPanes}
                  <ControlCenter
                    showSandbox={this.state.showSandbox}
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
            <RightPanel address={deployedAddresses} />
          </Split>
        </div>
        <StatusBar />
        <div id="task-runner-content" />
      </div>
    );
  }
}
