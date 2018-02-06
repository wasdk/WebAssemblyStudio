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
import { GoGear, GoFile, GoX, Icon } from "./shared/Icons";
import { File, FileType, Directory, extensionForFileType, nameForFileType, Project } from "../model";
import { KeyboardEvent, ChangeEvent, ChangeEventHandler } from "react";
import { ListBox, ListItem, TextInputBox } from "./Widgets";

export interface Template {
  name: string;
  description: string;
  project: any;
  icon: string;
}

export class NewProjectDialog extends React.Component<{
  isOpen: boolean;
  onCreate: (template: Template) => void;
  onCancel: () => void;
}, {
    description: string;
    name: string;
    template: Template;
    templates: Template [];
  }> {
  constructor(props: any) {
    super(props);
    this.state = {
      template: null,
      description: "",
      name: "",
      templates: []
    };
  }
  onChangeName = (event: ChangeEvent<any>) => {
    this.setState({ name: event.target.value });
  }
  nameError() {
    return;
  }

  createButtonLabel() {
    return "Create";
  }
  async componentDidMount() {
    const response = await fetch("templates/templates.js");
    const js = await response.text();
    const templates = eval(js);
    this.setState({templates});
    this.setTemplate(templates[0]);
  }
  async setTemplate(template: Template) {
    const description = await Service.compileMarkdownToHtml(template.description);
    this.setState({template, description});
  }
  render() {
    return <ReactModal
      isOpen={this.props.isOpen}
      contentLabel="Create New Project"
      className="modal"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="modal-title-bar">
          Create New Project
        </div>
        <div>
          <div style={{ display: "flex" }}>
            <div style={{ width: 200 }}>
              <ListBox
                value={this.state.template}
                height={240}
                onSelect={(template) => {
                  this.setTemplate(template);
                }}
              >
              {
                this.state.templates.map((template) => {
                  return <ListItem
                    key={template.name}
                    value={template}
                    label={template.name}
                    icon={<Icon src={template.icon}/>}
                  />;
                })
              }
              </ListBox>
            </div>
            <div style={{ flex: 1 }} className="new-project-dialog-description">
              <div className="md" dangerouslySetInnerHTML={{__html: this.state.description}}/>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "8px" }}/>
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
            title="Cancel"
            isDisabled={!this.state.template}
            onClick={() => {
              return this.props.onCreate && this.props.onCreate(this.state.template);
            }}
          />
        </div>
      </div>
    </ReactModal>;
  }
}
