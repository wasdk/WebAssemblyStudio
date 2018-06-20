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
import { GoFile, GoX, Icon } from "./shared/Icons";
import appStore from "../stores/AppStore";
import { Directory, ModelRef } from "../models";
import { ChangeEvent } from "react";
import { TextInputBox } from "./Widgets";

export class NewDirectoryDialog extends React.Component<{
  isOpen: boolean;
  directory: ModelRef<Directory>
  onCreate: (directory: Directory) => void;
  onCancel: () => void;
}, {
    name: string;
  }> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: ""
    };
  }
  onChangeName = (event: ChangeEvent<any>) => {
    this.setState({ name: event.target.value });
  }
  nameError() {
    const directory = this.props.directory;
    if (this.state.name) {
      if (!/^[a-z0-9\.\-\_]+$/i.test(this.state.name)) {
        return "Illegal characters in directory name.";
      } else if (directory && appStore.getImmediateChild(directory, this.state.name)) {
        return `Directory '${this.state.name}' already exists.`;
      }
    }
    return "";
  }
  createButtonLabel() {
    return "Create";
  }
  render() {
    return <ReactModal
      isOpen={this.props.isOpen}
      contentLabel="Create New Directory"
      className="modal"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="modal-title-bar">
          Create New Directory
        </div>
        <div style={{ flex: 1, padding: "8px" }}>
          <TextInputBox label="Name:" error={this.nameError()} value={this.state.name} onChange={this.onChangeName}/>
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
            label={this.createButtonLabel()}
            title="Create New Directory"
            isDisabled={!this.state.name || !!this.nameError()}
            onClick={() => {
              const directory = new Directory(this.state.name);
              return this.props.onCreate && this.props.onCreate(directory);
            }}
          />
        </div>
      </div>
    </ReactModal>;
  }
}
