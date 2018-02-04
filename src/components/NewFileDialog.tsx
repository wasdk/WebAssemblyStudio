import * as React from "react";
import { Service } from "../service";
import * as ReactModal from "react-modal";
import { Button } from "./Button";
import { GoGear, GoFile, GoX, Icon } from "./Icons";
import { File, FileType, Directory, extensionForFileType, nameForFileType } from "../model";
import { KeyboardEvent, ChangeEvent, ChangeEventHandler } from "react";
import { ListBox, ListItem, TextInputBox } from "./Widgets";

export class NewFileDialog extends React.Component<{
  isOpen: boolean;
  directory: Directory
  onCreate: (file: File) => void;
  onCancel: () => void;
}, {
    fileType: FileType;
    description: string;
    name: string;
  }> {
  constructor(props: any) {
    super(props);
    this.state = {
      fileType: FileType.C,
      description: "",
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
        return "Illegal characters in file name.";
      } else if (!this.state.name.endsWith(extensionForFileType(this.state.fileType))) {
        return nameForFileType(this.state.fileType) + " file extension is missing.";
      } else if (directory && directory.getImmediateChild(this.state.name)) {
        return `File '${this.state.name}' already exists.`;
      }
    }
    return "";
  }
  fileName() {
    let name = this.state.name;
    const extension = extensionForFileType(this.state.fileType);
    if (!name.endsWith("." + extension)) {
      name += "." + extension;
    }
    return name;
  }
  createButtonLabel() {
    return "Create";
  }
  render() {
    return <ReactModal
      isOpen={this.props.isOpen}
      contentLabel="Create New File"
      className="modal"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="modal-title-bar">
          Create New File
        </div>
        <div>
          <div style={{ display: "flex" }}>
            <div style={{ width: 250 }}>
              <ListBox value={this.state.fileType} height={240} onSelect={(fileType) => {
                let description = "";
                switch (fileType) {
                  case FileType.C: description = "Creates a file containing C source code."; break;
                  case FileType.Cpp: description = "Creates a file containing C++ source code."; break;
                  case FileType.Cretonne: description = "Cretonne intermediate language (IL) source code."; break;
                  default: description = "N/A";
                           break;
                }
                this.setState({ fileType, description });
              }}>
                <ListItem value={FileType.C} label={"C File (.c)"} icon={<Icon src="svg/file_type_c.svg" />} />
                <ListItem value={FileType.Cpp} label={"C++ File (.cpp)"} icon={<Icon src="svg/file_type_cpp.svg" />} />
                <ListItem value={FileType.Rust} label={"Rust File (.rs)"} icon={<Icon src="svg/file_type_rust.svg" />} />

                <ListItem value={FileType.Cretonne} label={"Cretonne (.cton)"} icon={<Icon src="svg/default_file.svg" />} />
                <ListItem value={FileType.Wast} label={"Wast (.wast)"} icon={<Icon src="svg/default_file.svg" />} />

                <ListItem value={FileType.JavaScript} label={"JavaScript (.js)"} icon={<Icon src="svg/file_type_js.svg" />} />
                <ListItem value={FileType.TypeScript} label={"TypeScript (.ts)"} icon={<Icon src="svg/file_type_typescript.svg" />} />
                <ListItem value={FileType.HTML} label={"HTML (.html)"} icon={<Icon src="svg/file_type_html.svg" />} />
                <ListItem value={FileType.CSS} label={"CSS (.css)"} icon={<Icon src="svg/file_type_css.svg" />} />
                <ListItem value={FileType.Markdown} label={"Markdown (.md)"} icon={<Icon src="svg/file_type_markdown.svg" />} />
              </ListBox>
            </div>
            <div className="new-file-dialog-description">
              {this.state.description}
            </div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "8px" }}>
          <TextInputBox label={"Name: " + (this.props.directory ? this.props.directory.getPath() + "/" : "")} error={this.nameError()} value={this.state.name} onChange={this.onChangeName}/>
        </div>
        <div>
          <Button icon={<GoX />} label="Cancel" title="Create New File" onClick={() => {
            this.props.onCancel();
          }} />
          <Button icon={<GoFile />} label={this.createButtonLabel()} title="Create New File" isDisabled={!this.state.fileType || !this.state.name || !!this.nameError()} onClick={() => {
            const file = new File(this.fileName(), this.state.fileType);
            return this.props.onCreate && this.props.onCreate(file);
          }} />
        </div>
      </div>
    </ReactModal>;
  }
}
