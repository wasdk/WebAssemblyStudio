import * as React from "react";
import * as ReactDOM from "react-dom";
import * as SplitPane from "react-split-pane";
import { Workspace } from "./Workspace";
import { Console } from "./Console";
import { Editor } from "./Editor";
import { Header } from "./Header";
import { Toolbar } from "./Toolbar";

import { Tabs, Tab } from "./Tabs";
import { EditorPane } from "./EditorPane";
import { Project, File } from "../Project";

import { layout, assert } from "../index";

class Group {
  file: File;
  files: File[];
  constructor(file: File, files: File[]) {
    this.file = file;
    this.files = files;
  }
  open(file: File) {
    let files = this.files;
    if (files.indexOf(file) < 0) {
      files.push(file);
    }
    this.file = file;
  }
  close(file: File) {
    let i = this.files.indexOf(file);
    assert(i >= 0);
    this.files.splice(i, 1);
    this.file = this.files.length ? this.files[Math.min(this.files.length - 1, i)] : null;
  }
}

export class App extends React.Component<{
}, {
    file: File;
    groups: Group[];
    group: Group;
  }> {
  project: Project;
  constructor(props: any) {
    super(props);
    this.project = new Project();
    let group0 = new Group(null, []);
    this.state = {
      file: null,
      groups: [
        group0,
      ],
      group: group0
    };
  }
  render() {
    // console.log("What the hell: " + this.state.file);
    let self = this;
    function split(groups: Group[]): any {
      if (groups.length === 0) {
        return <div>No Groups</div>
      }
      let splitWidth = ((100 / groups.length) | 0) + "%";
      assert(groups.length > 0);
      let group = groups[0];
      let editor = <EditorPane files={group.files.slice(0)} file={group.file}
        hasFocus={self.state.group === group}
        onFocus={() => {
          self.setState({ group });
        }}
        onSelect={(file) => {
          group.file = file;
          self.setState({ group });
        }}
        onClose={(file) => {
          let groups = self.state.groups;
          group.close(file);
          if (group.files.length === 0) {
            let i = groups.indexOf(group);
            groups.splice(i, 1);
            let g = groups.length ? groups[Math.min(groups.length - 1, i)] : null;
            self.setState({ groups, group: g });
          } else {
            self.setState({ group });
          }
        }} />
      if (groups.length === 1) {
        return editor;
      } else if (groups.length > 1) {
        return <SplitPane split="vertical" minSize={200} defaultSize={splitWidth} onChange={layout}>
          {editor}
          {split(groups.slice(1))}
        </SplitPane>
      }
    }

    return <SplitPane split="vertical" minSize={200} defaultSize={200} maxSize={400}>
      <Workspace project={this.project} file={this.state.file} onSelect={(file: File) => {
        this.state.group.open(file);
        this.forceUpdate();
      }}></Workspace>
      <div className="fill" style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: "40px" }}>
          <Toolbar>
            <button onClick={() => {
              let group = new Group(null, []);
              this.state.groups.push(group);
              this.setState({ group });
              self.forceUpdate();
            }
            }>New Group</button>
            <button>Save File</button>
            <button>Save All Files</button>
            <button>Save All Files</button>
            <button>Save All Files</button>
          </Toolbar>
        </div>
        <div style={{ backgroundColor: "blue", flex: 1 }}>
          {split(this.state.groups)}
        </div>
        <div style={{ backgroundColor: "green", height: "40px" }}>
          XX
        </div>
      </div>
    </SplitPane>
  }
}


{/* <SplitPane split="horizontal" minSize={600} defaultSize={"80%"} onChange={layout}>
              <div className="fill">
                {split(this.state.groups)}
              </div>
              <div>X</div>
            </SplitPane> */}



