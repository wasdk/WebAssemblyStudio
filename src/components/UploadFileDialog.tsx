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
    hasError: boolean;
  }> {
  fileUploadInput: FileUploadInput;
  constructor(props: any) {
    super(props);
    this.state = {
      files: [],
      hasError: false
    };
  }
  _checkErrorForFile(file: any) {
    const directory = this.props.directory;
    let errorStr: string = "";
    if (file.fileType == null) {
      errorStr += `File '${file.name}' is not supported.`;
    }
    if (file.name) {
      if (!this._isFilenameValid(file.name)) {
        errorStr += "Illegal characters in file name.";
      } else if (!file.name.endsWith(extensionForFileType(file.fileType))) {
        errorStr +=  nameForFileType(file.fileType) + " file extension is missing.";
      } else if (directory && directory.getImmediateChild(file.name)) {
        errorStr += `File '${file.name}' already exists.`;
      }
    }
    return errorStr;
  }
  async _handleUpload(files: FileList) {
    this.setState({files: [], hasError: false});
    Array.from(files).forEach(async (file: any) => {
      const name: string = file.name;
      const fileType: string = filetypeForExtension(name.split(".").pop());
      let data: any;
      try {
        data = await this._readUploadedFileAsText(file);
        const error = this._checkErrorForFile({name, fileType});
        if (error) {
          this._setHasError();
        }
        this.setState(prevState => ({
          files: [...prevState.files, {name, fileType, data, error}]
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
  _setHasError() {
      this.setState({hasError: true});
  }
  _isFilenameValid(name: string) {
      return /^[a-z0-9\.\-\_]+$/i.test(name);
  }
  render() {
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
            <FileUploadInput label="Upload:" ref={(ref) => this.fileUploadInput = ref} onChange={(e) => this._handleUpload(e.target.files)}/>
          </div>
          <div className="column">
            <ListBox height={290}>
              {this.state.files.map( (file: any, key: number) => {
                return <ListItem key={key} value={file.fileType} label={file.name} error={file.error} icon={<Icon src="svg/default_file.svg"/>} />;
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
            title="Upload files"
            onClick={() => {
              this.fileUploadInput.open();
            }}
          />
          <Button
            icon={<GoCheck />}
            label="Done"
            title="Done"
            isDisabled={!this.state.files.length || this.state.hasError}
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
