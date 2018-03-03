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
import { GoGear, GoFile, GoX, Icon, GoPencil, GoCheck } from "./shared/Icons";
import appStore from "../stores/AppStore";
import {File, FileType, Directory, extensionForFileType, nameForFileType, fileTypeForExtension, ModelRef, getIconForFileType, isBinaryFileType } from "../model";
import { KeyboardEvent, ChangeEvent, ChangeEventHandler } from "react";
import { ListBox, ListItem, FileUploadInput } from "./Widgets";
import { DirectoryTree } from "./DirectoryTree";
import { assert } from "../util";

export interface UploadFileDialogProps {
  isOpen: boolean;
  directory: ModelRef<Directory>;
  onUpload: (file: File[]) => void;
  onCancel: () => void;
}
export class UploadFileDialog extends React.Component<UploadFileDialogProps, {
    files: Object[];
  }> {
  root: ModelRef<Directory>;
  fileUploadInput: FileUploadInput;
  constructor(props: any) {
    super(props);
    this.state = {
      files: [],
    };
    this.root = ModelRef.getRef(new Directory("root"));
    this.root.getModel().onDidChangeChildren.register(() => {
      this.forceUpdate();
    });
  }
  private async handleUpload(files: FileList) {
    this.setState({files: []});
    Array.from(files).forEach(async (file: any) => {
      const name: string = file.name;
      const fileType = fileTypeForExtension(name.split(".").pop());
      let data: any;
      try {
        data = await this.readUploadedFile(file, isBinaryFileType(fileType) ? "arrayBuffer" : "text");
        const newFile = new File(file.name, fileType);
        newFile.setData(data);
        this.root.getModel().addFile(newFile);
        this.forceUpdate();
      } catch (e) {
        console.log("Unable to read the file!");
      }
    });
  }
  private readUploadedFile(inputFile: any, readAs: "text" | "arrayBuffer") {
    const temporaryFileReader = new FileReader();
    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };
      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      if (readAs === "text") {
        temporaryFileReader.readAsText(inputFile);
      } else if (readAs === "arrayBuffer") {
        temporaryFileReader.readAsArrayBuffer(inputFile);
      } else {
        assert(false, "NYI");
      }
    });
  }
  render() {
    return <ReactModal
      isOpen={this.props.isOpen}
      contentLabel="Upload Files"
      className="modal show-file-icons"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="modal-title-bar">
          Upload Files
        </div>
        <div className="row">
          <div className="column">
            <FileUploadInput label="Upload:" ref={(ref) => this.fileUploadInput = ref} onChange={(e) => this.handleUpload(e.target.files)}/>
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
            label="Select Files"
            title="Select Files"
            onClick={() => {
              this.fileUploadInput.open();
            }}
          />
          <Button
            icon={<GoCheck />}
            label="Done"
            title="Done"
            isDisabled={!this.root.getModel().children.length}
            onClick={() => {
              return this.props.onUpload && this.props.onUpload(this.root.getModel().children);
            }}
          />
        </div>
      </div>
    </ReactModal>;
  }
}
