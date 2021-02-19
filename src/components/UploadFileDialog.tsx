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
import * as ReactModal from "react-modal";
import appStore from "../stores/AppStore";
import { Button } from "./shared/Button";
import { GoFile, GoX, GoCloudUpload, GoFileDirectory } from "./shared/Icons";
import { File, Directory, ModelRef } from "../models";
import { UploadInput } from "./Widgets";
import { DirectoryTree } from "./DirectoryTree";
import { uploadFilesToDirectory } from "../util";
import { EditFileDialog } from "./EditFileDialog";
import { updateFileNameAndDescription, addFileTo } from "../actions/AppActions";

export interface UploadFileDialogProps {
  isOpen: boolean;
  directory: ModelRef<Directory>;
  onUpload: (file: File[]) => void;
  onCancel: () => void;
}

export interface UploadFileDialogState {
  hasFilesToUpload: boolean;
  editFileDialogFile?: ModelRef<File>;
}

export class UploadFileDialog extends React.Component<UploadFileDialogProps, UploadFileDialogState> {
  root: ModelRef<Directory>;
  uploadInput: UploadInput;
  constructor(props: any) {
    super(props);
    this.root = ModelRef.getRef(new Directory("root"));
    this.root.getModel().onDidChangeChildren.register(() => this.onRootChildrenChange());
    this.state = { hasFilesToUpload: false };
  }
  private async handleUpload(items: DataTransferItemList) {
    await uploadFilesToDirectory(items, this.root.getModel());
  }
  private onRootChildrenChange() {
    this.setState({ hasFilesToUpload: this.root.getModel().hasChildren() });
  }
  render() {
    const root = this.root.getModel();
    return <ReactModal
      isOpen={this.props.isOpen}
      contentLabel="Upload"
      className="modal show-file-icons"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
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
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="modal-title-bar">
          Upload Files & Directories to {this.props.directory.getModel().getPath()}
        </div>
        <div className="row">
          <div className="column">
            <UploadInput
              ref={(ref) => this.uploadInput = ref}
              onChange={(e) => {
                this.handleUpload(e.target.files);
              }}
            />
          </div>
          <div className="column" style={{height: "290px"}}>
            <DirectoryTree
              onlyUploadActions={true}
              directory={this.root}
              onDeleteFile={(file: File) => {
                file.parent.removeFile(file);
              }}
              onEditFile={(file: File) => {
                this.setState({ editFileDialogFile: ModelRef.getRef(file) });
              }}
              onMoveFile={(file: File, directory: Directory) => {
                addFileTo(file, directory);
              }}
            />
          </div>
        </div>
        <div>
          <Button
            icon={<GoX />}
            label="Cancel"
            title="Cancel"
            onClick={() => {
              this.props.onCancel();
            }}
          />
          <Button
            icon={<GoFile />}
            label="Files"
            title="Select Files"
            onClick={() => {
              this.uploadInput.open("files");
            }}
          />
          <Button
            icon={<GoFileDirectory />}
            label="Directory"
            title="Select Directory"
            onClick={() => {
              this.uploadInput.open("directory");
            }}
          />
          <Button
            icon={<GoCloudUpload />}
            label="Upload"
            title="Upload"
            isDisabled={!this.state.hasFilesToUpload}
            onClick={() => {
              return this.props.onUpload && this.props.onUpload(root.children.slice(0));
            }}
          />
          {
            root.children.length === 1 && root.children[0] instanceof Directory &&
              <Button
                icon={<GoCloudUpload />}
                label={"Upload Root Contents"}
                title={"Upload contents of " + root.children[0].name}
                onClick={() => {
                  return this.props.onUpload && this.props.onUpload((root.children[0] as Directory).children.slice(0));
                }}
              />
          }
        </div>
      </div>
    </ReactModal>;
  }
}
