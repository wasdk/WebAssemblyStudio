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
import { Header } from "./Header";
import { DirectoryTree } from "./DirectoryTree";
import { Project, File, Directory, ModelRef } from "../models";
import { SplitOrientation, SplitInfo, Split } from "./Split";
import appStore from "../stores/AppStore";

export interface WorkspaceProps {
  /**
   * Active file.
   */
  file: ModelRef<File>;
  project: ModelRef<Project>;
  onEditFile?: (file: File) => void;
  onDeleteFile?: (file: File) => void;
  onMoveFile?: (file: File, directory: Directory) => void;
  onRenameFile?: (file: File) => void;
  onNewFile?: (directory: Directory) => void;
  onNewDirectory?: (directory: Directory) => void;
  onClickFile: (file: File) => void;
  onDoubleClickFile?: (file: File) => void;
  onUploadFile?: (directory: Directory) => void;
  onCreateGist: (fileOrDirectory: File) => void;
}

export interface WorkSpaceState {
  splits: SplitInfo[];
}

export class Workspace extends React.Component<WorkspaceProps, WorkSpaceState> {
  directoryTree: DirectoryTree;
  constructor(props: any) {
    super(props);
    this.state = {
      splits: []
    };
  }
  componentDidMount() {
    appStore.onDidChangeDirty.register(this.refreshTree);
    appStore.onDidChangeChildren.register(this.refreshTree);
  }
  componentWillUnmount() {
    appStore.onDidChangeDirty.unregister(this.refreshTree);
    appStore.onDidChangeChildren.unregister(this.refreshTree);
  }
  refreshTree = () => {
    this.directoryTree.tree.refresh();
  }
  render() {
    const project = this.props.project;
    return <div className="workspaceContainer">
      <Header />
      <div style={{ height: "calc(100% - 41px)" }}>
        <Split
          name="Workspace"
          orientation={SplitOrientation.Horizontal}
          splits={this.state.splits}
          onChange={(splits) => {
            this.setState({ splits: splits });
          }}
        >
          <div/>
          <DirectoryTree
            ref={(ref) => this.directoryTree = ref}
            directory={project}
            value={this.props.file}
            onNewFile={this.props.onNewFile}
            onNewDirectory={this.props.onNewDirectory}
            onEditFile={this.props.onEditFile}
            onDeleteFile={this.props.onDeleteFile}
            onUploadFile={this.props.onUploadFile}
            onMoveFile={this.props.onMoveFile}
            onClickFile={this.props.onClickFile}
            onDoubleClickFile={this.props.onDoubleClickFile}
            onCreateGist={this.props.onCreateGist}
          />
        </Split>
      </div>
    </div>;
  }
}
