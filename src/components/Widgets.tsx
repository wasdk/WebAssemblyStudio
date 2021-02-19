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
import { ChangeEventHandler } from "react";

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

export class UploadInput extends React.Component<{
  onChange?: ChangeEventHandler<any>;
}, {

}> {
  inputElement: HTMLInputElement;
  setInputElement(ref: HTMLInputElement) {
    this.inputElement = ref;
  }
  constructor(props: any) {
    super(props);
  }
  open(upload: "files" | "directory") {
    if (this.inputElement && upload === "directory") {
      this.inputElement.setAttribute("directory", "true");
      this.inputElement.setAttribute("webkitdirectory", "true");
      this.inputElement.setAttribute("allowdirs", "true");
    } else {
      this.inputElement.removeAttribute("directory");
      this.inputElement.removeAttribute("webkitdirectory");
      this.inputElement.removeAttribute("allowdirs");
    }
    this.inputElement.click();
  }
  render() {
    return <input id="file-upload-input" ref={ref => this.setInputElement(ref)} type="file" onChange={this.props.onChange} multiple hidden/>;
  }
}

export class ListItem extends React.Component<{
  label: string;
  onClick?: Function;
  icon?: string;
  selected?: boolean;
  value: any;
  error?: string;
}, {

  }> {

  render() {
    let className = "list-item";
    if (this.props.selected) {
      className += " selected";
    }
    let content = <div className="label">{this.props.label}</div>;
    if (this.props.error) {
        content = <div className="list-item-flex">
          <div className="label">{this.props.label}</div>
          <div className="error">{this.props.error}</div>
        </div>;
    }
    return <div className={className} onClick={this.props.onClick as any}>
      <div className={"monaco-icon-label file-icon " + this.props.icon} />
      {content}
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
