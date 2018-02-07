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
import { Button } from "./Button";
import { GoGear, GoFile, GoX, Icon, GoPencil } from "./Icons";
import {File, FileType, Directory, extensionForFileType, nameForFileType, filetypeForExtension} from "../model";
import { KeyboardEvent, ChangeEvent, ChangeEventHandler } from "react";
import { ListBox, ListItem, FileUploadInput } from "./Widgets";

export interface UploadFileDialogProps {
  isOpen: boolean;
  directory: Directory;
  onUpload: (file: File[]) => void;
  onCancel: () => void;
}
export class UploadFileDialog extends React.Component<UploadFileDialogProps, {
    files: Object[];
  }> {
  constructor(props: any) {
    super(props);
    this.state = {
      files: []
    };
  }
  _nameError() {
    const directory = this.props.directory;
    let errorStr: string = "";
    this.state.files.map((file: any) => {
      if (file.fileType == null) {
          errorStr += `File '${file.name}' is not supported.`;
      }
      if (file.name) {
        if (!/^[a-z0-9\.\-\_]+$/i.test(file.name)) {
            errorStr += "Illegal characters in file name.";
        } else if (!file.name.endsWith(extensionForFileType(file.fileType))) {
            errorStr +=  nameForFileType(file.fileType) + " file extension is missing.";
        } else if (directory && directory.getImmediateChild(file.name)) {
            errorStr += `File '${file.name}' already exists.`;
        }
      }
    });
    return errorStr;
  }
  async _handleUpload(files: FileList) {
    this.setState({files: []});
    Array.from(files).forEach(async (file: any) => {
      const name: string = file.name;
      const fileType: string = filetypeForExtension(name.split(".").pop());
      let data: any;
      try {
        data = await this._readUploadedFileAsText(file);
        this.setState(prevState => ({
          files: [...prevState.files, {name, fileType, data}]
        }));
      } catch (e) {
          console.log("Unable to read the file!");
      }
    });
  }
  _readUploadedFileAsText(inputFile: any) {
    const temporaryFileReader = new FileReader();
    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
      };
      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsText(inputFile);
    });
  }
  render() {
    const directory = this.props.directory;
    return <ReactModal
      isOpen={this.props.isOpen}
      contentLabel="Upload File"
      className="modal"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="modal-title-bar">
          Upload File
        </div>
        <div className="row">
          <div className="column">
            <FileUploadInput label="Upload:" error={this._nameError()} onChange={(e) => this._handleUpload(e.target.files)}/>
          </div>
          <div className="column">
            <ListBox height={290}>
              {this.state.files.map( (file: any, key: number) => {
                return <ListItem key={key} value={file.fileType} label={file.name} icon={<Icon src="svg/default_file.svg"/>} />;
              })}
            </ListBox>
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
            label="Upload"
            title="Upload New File"
            isDisabled={!this.state.files.length || !!this._nameError()}
            onClick={() => {
            const newFiles: File[] = [];
            this.state.files.map((file: any) => {
              const newFile = new File(file.name, file.fileType);
              newFile.setData(file.data);
              newFiles.push(newFile);
            });
            return this.props.onUpload && this.props.onUpload(newFiles);
            }}
          />
        </div>
      </div>
    </ReactModal>;
  }
}
