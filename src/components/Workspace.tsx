import * as React from "react";

import { Header } from "./Header";
import { DirectoryTree } from "./DirectoryEntry";
import { WorkspaceEntry } from "./WorkspaceEntry";
import { Project, File, Directory } from "../model";

export interface WorkspaceProps {
  /**
   * Active file.
   */
  file: File,
  project: Project,
  onClickFile: (file: File) => void;
  onDoubleClickFile: (file: File) => void;
  makeMenuItems?: (file: File) => JSX.Element [];
}


export class Workspace extends React.Component<WorkspaceProps, {
  showProject: boolean,
  showFiles: boolean
}> {
  constructor(props: any) {
    super(props);
    this.state = {
      showProject: false,
      showFiles: true
    }
  }
  render() {
    let project = this.props.project;
    return <div className="workspaceContainer">
      <Header />
      <WorkspaceEntry
        name={"Project " + project.name}
        expanded={this.state.showProject}
        onClick={() => this.setState({ showProject: !this.state.showProject })}>
      </WorkspaceEntry>
      <WorkspaceEntry
        name="Files"
        expanded={this.state.showFiles}
        onClick={() => this.setState({ showFiles: !this.state.showFiles })}>
        <DirectoryTree makeMenuItems={this.props.makeMenuItems} directory={project} value={this.props.file} onClickFile={(file: File) => {
          this.props.onClickFile(file);
        }}
        onDoubleClickFile={(file: File) => {
          this.props.onDoubleClickFile(file);
        }}/>
      </WorkspaceEntry>
    </div>;
  }
}