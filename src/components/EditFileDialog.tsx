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
import { GoGear, GoFile, GoX, Icon, GoPencil } from "./shared/Icons";
import { File, FileType, Directory, extensionForFileType, nameForFileType } from "../model";
import { KeyboardEvent, ChangeEvent, ChangeEventHandler } from "react";
import { ListBox, ListItem, TextInputBox, Spacer } from "./Widgets";

export interface EditFileDialogProps {
  isOpen: boolean;
  file: File;
  onChange: (name: string, description: string) => void;
  onCancel: () => void;
}
export class EditFileDialog extends React.Component<EditFileDialogProps, {
    description: string;
    name: string;
  }> {
  constructor(props: EditFileDialogProps) {
    super(props);
    this.state = {
      description: props.file.description,
      name: props.file.name
    };
  }
  onChangeName = (event: ChangeEvent<any>) => {
    this.setState({ name: event.target.value });
  }
  onChangeDescription = (event: ChangeEvent<any>) => {
    this.setState({ description: event.target.value });
  }
  error() {
    const directory = this.props.file.parent;
    const file = directory.getImmediateChild(this.state.name);
    if (file && file !== this.props.file) {
      return `A file with the same name already exists.`;
    }
    return "";
  }
  render() {
    const file = this.props.file;
    return <ReactModal
      isOpen={this.props.isOpen}
      contentLabel={"Edit " + (file instanceof Directory ? "Directory" : "File")}
      className="modal"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="modal-title-bar">
          {`Edit ${file instanceof Directory ? "Directory" : "File"} ${file.name}`}
        </div>
        <div style={{ flex: 1, padding: "8px" }}>
          <TextInputBox label="Name:" error={this.error()} value={this.state.name} onChange={this.onChangeName}/>
          <Spacer height={8}/>
          <TextInputBox label="Description:" error={this.error()} value={this.state.description} onChange={this.onChangeDescription}/>
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
            isDisabled={!this.state.name || !!this.error()}
            onClick={() => {
              return this.props.onChange && this.props.onChange(this.state.name, this.state.description);
            }}
          />
        </div>
      </div>
    </ReactModal>;
  }
}
