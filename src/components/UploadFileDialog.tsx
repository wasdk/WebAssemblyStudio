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
import { Service } from "../service";
import * as ReactModal from "react-modal";
import { Button } from "./shared/Button";
import { GoGear, GoFile, GoX, Icon, GoPencil, GoCheck, GoCloudUpload, GoFileDirectory } from "./shared/Icons";
import appStore from "../stores/AppStore";
import {File, FileType, Directory, extensionForFileType, nameForFileType, fileTypeForExtension, ModelRef, getIconForFileType, isBinaryFileType } from "../model";
import { UploadInput } from "./Widgets";
import { DirectoryTree } from "./DirectoryTree";
import { assert, readUploadedFile, uploadFilesToDirectory } from "../util";

export interface UploadFileDialogProps {
  isOpen: boolean;
  directory: ModelRef<Directory>;
  onUpload: (file: File[]) => void;
  onCancel: () => void;
}
export class UploadFileDialog extends React.Component<UploadFileDialogProps, {
  }> {
  root: ModelRef<Directory>;
  uploadInput: UploadInput;
  constructor(props: any) {
    super(props);
    this.root = ModelRef.getRef(new Directory("root"));
    this.root.getModel().onDidChangeChildren.register(() => {
      this.forceUpdate();
    });
  }
  private async handleUpload(files: FileList) {
    const root = this.root.getModel();
    this.setState({files: []});
    await uploadFilesToDirectory(files, root);
    this.forceUpdate();
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
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="modal-title-bar">
          Upload Files & Directories to {this.props.directory.getModel().getPath()}
        </div>
        <div className="row">
          <div className="column">
            <UploadInput ref={(ref) => this.uploadInput = ref} onChange={(e) => this.handleUpload(e.target.files)}/>
          </div>
          <div className="column" style={{height: "290px"}}>
            <DirectoryTree
              directory={this.root}
              onDeleteFile={(file: File) => {
                file.parent.removeFile(file);
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
            isDisabled={!root.children.length}
            onClick={() => {
              return this.props.onUpload && this.props.onUpload(root.children.slice(0));
            }}
          />
          {
            root.children.length === 1 && root.children[0] instanceof Directory && <Button
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
