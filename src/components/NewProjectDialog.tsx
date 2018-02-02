import * as React from "react";
import { Service } from "../service";
import * as ReactModal from "react-modal";
import { Button } from "./Button";
import { GoGear, GoFile, GoX, Icon } from "./Icons";
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
    // let directory = this.props.directory;
    // if (this.state.name) {
    //   if (!/^[a-z0-9\.\-\_]+$/i.test(this.state.name)) {
    //     return "Illegal characters in file name.";
    //   } else if (!this.state.name.endsWith(extensionForFileType(this.state.fileType))) {
    //     return nameForFileType(this.state.fileType) + " file extension is missing.";
    //   } else if (directory && directory.getImmediateChild(this.state.name)) {
    //     return `File '${this.state.name}' already exists.`;
    //   }
    // }
    // return "";
  }
  // fileName() {
  //   let name = this.state.name;
  //   let extension = extensionForFileType(this.state.template);
  //   if (!name.endsWith("." + extension)) {
  //     name += "." + extension;
  //   }
  //   return name;
  // }
  createButtonLabel() {
    return "Create";
  }
  async componentDidMount() {
    const response = await fetch("templates/templates.js");
    const js = await response.text();
    let templates = eval(js);
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
              <ListBox value={this.state.template} height={240} onSelect={(template) => {
                this.setTemplate(template);
              }}>
              {
                this.state.templates.map((template) => {
                  return <ListItem value={template} label={template.name} icon={<Icon src={template.icon} />} />
                })
              }
              </ListBox>
            </div>
            <div style={{ flex: 1 }} className="new-project-dialog-description">
              <div className="md" dangerouslySetInnerHTML={{__html: this.state.description}}></div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "8px" }}>
          {/* <TextInputBox label={"Name: " + (this.props.directory ? this.props.directory.getPath() + "/": "")} error={this.nameError()} value={this.state.name} onChange={this.onChangeName}/> */}
        </div>
        <div>
          <Button icon={<GoX />} label="Cancel" title="Cancel" onClick={() => {
            this.props.onCancel();
          }} />
          <Button icon={<GoFile />} label={this.createButtonLabel()} title="Cancel" isDisabled={!this.state.template} onClick={() => {
            // let file = new File(this.fileName(), this.state.template);
            this.props.onCreate && this.props.onCreate(this.state.template);
          }} />
        </div>
      </div>
    </ReactModal>;
  }
}