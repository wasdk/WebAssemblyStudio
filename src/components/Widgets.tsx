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
import { GoGear, GoFile, GoX, Icon } from "./Icons";
import { File, FileType, Directory, extensionForFileType, nameForFileType } from "../model";
import { KeyboardEvent, ChangeEvent, ChangeEventHandler } from "react";

export class Spacer extends React.Component<{
  height: number
}, {}> {
  render() {
    return <div style={{ height: this.props.height }} />;
  }
}

export class Divider extends React.Component<{
  height: number
}, {}> {
  render() {
    return <div
      className="divider"
      style={{
        marginTop: this.props.height / 2,
        marginBottom: this.props.height / 2
      }}
    />;
  }
}

export class TextInputBox extends React.Component<{
  label: string;
  value: string;
  error?: string;
  onChange?: ChangeEventHandler<any>;
}, {

  }> {
  constructor(props: any) {
    super(props);
  }
  render() {
    const input = <input className="text-input-box" type="text" value={this.props.value} onChange={this.props.onChange} />;
    if (this.props.label) {
      return <div style={{ display: "flex", flexDirection: "row" }}>
        <div className="text-input-box-label">{this.props.label}</div>
        <div style={{ flex: 1 }}>{input}</div>
        {this.props.error && <div className="text-input-box-error">{this.props.error}</div>}
      </div>;
    } else {
      return input;
    }
  }
}

export class FileUploadInput extends React.Component<{
  label: string;
  error?: string;
  onChange?: ChangeEventHandler<any>;
}, {

}> {
  constructor(props: any) {
    super(props);
  }
  render() {
    const input = <input className="file-upload-input" type="file" onChange={this.props.onChange} multiple/>;
    if (this.props.label) {
      return <div>
          <div className="row">
            <div className="column">
              <div className="text-input-box-label">{this.props.label}</div>
            </div>
            <div className="column">
              <div>{input}</div>
            </div>
          </div>
          {this.props.error && <div className="text-input-box-error">{this.props.error}</div>}
        </div>;
    } else {
      return input;
    }
  }
}

export class ListItem extends React.Component<{
  label: string;
  onClick?: Function;
  icon?: JSX.Element;
  selected?: boolean;
  value: any;
}, {

  }> {

  render() {
    let className = "list-item";
    if (this.props.selected) {
      className += " selected";
    }
    return <div className={className} onClick={this.props.onClick as any}>
      <div className="icon">{this.props.icon}</div>
      <div className="label">{this.props.label}</div>
    </div>;
  }
}

export class ListBox extends React.Component<{
  height: number;
  value?: any;
  onSelect?: (value: any) => void;
}, {

  }> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { children, onSelect } = this.props;

    const newChildren = React.Children.map(children, (child: any, index) => {
      return React.cloneElement(child as any, {
        onClick: () => {
          return onSelect && onSelect(child.props.value);
        },
        selected: this.props.value === child.props.value
      });
    });

    return <div
      className="list-box"
      style={{
        height: this.props.height
      }}
    >
      {newChildren}
    </div>;
  }
}
