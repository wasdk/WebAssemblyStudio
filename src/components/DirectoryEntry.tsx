import * as React from "react";
import { Project, File, Directory, FileType, getIconForFileType } from "../Project";

class DirectoryEntry extends React.Component<{
  label: string,
  depth: number,
  value: File,
  active: boolean,
  onClick?: Function;
  icon: string;
  marked?: boolean;
}, {}> {
  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.value);
    }
  }
  render() {
    let className = "directory-entry";
    if (this.props.active) {
      className += " active";
    }
    if (this.props.marked) {
      className += " marked";
    }
    return <div className={className} onClick={this.onClick}>
      <div style={{ width: `calc(${this.props.depth}rem - 2px)` }}></div>
      <div className="icon" style={{
        backgroundImage: `url(svg/${this.props.icon}.svg)`
      }}></div>
      <div className="label">{this.props.label}</div>
      <div className="close"></div>
    </div>
  }
}

interface DirectoryTreeProps {
  directory: Directory;
  value?: File;
  onActivate: (file: File) => void;
}

export class DirectoryTree extends React.Component<DirectoryTreeProps, {
}> {
  constructor(props: DirectoryTreeProps) {
    super(props);
  }
  makeDirectoryEntries(directory: Directory): DirectoryEntry[] {
    let self = this;
    let entries: any[] = [];
    function go(directory: Directory, depth: number) {
      directory.children.forEach(file => {
        let icon = getIconForFileType(file.type);
        if (file instanceof Directory && file.isOpen) {
          icon = "default_folder_opened";
        }
        entries.push(<DirectoryEntry
          key={file.key}
          icon={icon}
          marked={file.dirty}
          label={file.name} depth={depth} value={file} onClick={() => {
            if (file instanceof Directory) {
              file.isOpen = !file.isOpen;
              self.forceUpdate();
            } else if (self.props.onActivate) {
              self.props.onActivate(file);
            }
          }}
          active={self.props.value === file} />);
        if (file instanceof Directory && file.isOpen) {
          go(file, depth + 1);
        }
      });
    }
    go(directory, 1);
    return entries;
  }
  render() {
    return <div>{this.makeDirectoryEntries(this.props.directory)}</div>
  }
}