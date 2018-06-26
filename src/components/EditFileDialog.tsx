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
import { Button } from "./shared/Button";
import { GoX, GoPencil } from "./shared/Icons";
import appStore from "../stores/AppStore";
import { File, FileType, Directory, extensionForFileType, nameForFileType, ModelRef } from "../models";
import { ChangeEvent } from "react";
import { TextInputBox, Spacer } from "./Widgets";

export interface EditFileDialogProps {
  isOpen: boolean;
  file: ModelRef<File>;
  onChange: (name: string, description: string) => void;
  onCancel: () => void;
}
export class EditFileDialog extends React.Component<EditFileDialogProps, {
    description: string;
    name: string;
    fileType: FileType;
  }> {
  constructor(props: EditFileDialogProps) {
    super(props);
    const { description, name, type: fileType } = props.file.getModel();
    this.state = {
      description,
      name,
      fileType,
    };
  }
  onChangeName = (event: ChangeEvent<any>) => {
    this.setState({ name: event.target.value });
  }
  onChangeDescription = (event: ChangeEvent<any>) => {
    this.setState({ description: event.target.value });
  }
  getNameError() {
    const directory = appStore.getParent(this.props.file);
    const file = appStore.getImmediateChild(directory, this.state.name);
    if (!/^[a-z0-9\.\-\_]+$/i.test(this.state.name)) {
      return "Illegal characters in file name.";
    } else if (!this.state.name.endsWith(extensionForFileType(this.state.fileType))) {
      return nameForFileType(this.state.fileType) + " file extension is missing.";
    } else if (file && this.props.file !== file) {
      return `File '${this.state.name}' already exists.`;
    }
    return "";
  }
  render() {
    const file = this.props.file;
    const fileModel = file.getModel();
    return <ReactModal
      isOpen={this.props.isOpen}
      contentLabel={"Edit " + (fileModel instanceof Directory ? "Directory" : "File")}
      className="modal"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="modal-title-bar">
          {`Edit ${fileModel instanceof Directory ? "Directory" : "File"} ${fileModel.name}`}
        </div>
        <div style={{ flex: 1, padding: "8px" }}>
          <TextInputBox label="Name:" error={this.getNameError()} value={this.state.name} onChange={this.onChangeName}/>
          <Spacer height={8}/>
          <TextInputBox label="Description:" value={this.state.description} onChange={this.onChangeDescription}/>
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
            icon={<GoPencil />}
            label="Edit"
            title="Edit"
            isDisabled={!this.state.name || !!this.getNameError()}
            onClick={() => {
              return this.props.onChange && this.props.onChange(this.state.name, this.state.description);
            }}
          />
        </div>
      </div>
    </ReactModal>;
  }
}
