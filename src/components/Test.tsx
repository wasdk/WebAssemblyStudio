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
import { Project, File, FileType } from "../Project";
import { App } from "./App";

import { layout, assert } from "../index";
import { setInterval } from "timers";

class TabBasicTest extends React.Component<{
}, {

  }> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return <div>
      <Tabs>
        <Tab label="A"></Tab>
        <Tab label="Really Long Name That I Can't Fit In This Tab"></Tab>
        <Tab label="Ion" icon="default_file"></Tab>
        <Tab label="Active" isActive></Tab>
        <Tab label="Marked" isMarked></Tab>
        <Tab label="Active & Marked" isActive isMarked></Tab>
      </Tabs>
    </div>;
  }
}

class TabSelectTest extends React.Component<{
}, {
    tabs: string[];
    selectedTab: number;
  }> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedTab: 0,
      tabs: ["Arabaalelealel", "Bannanananana", "Copaoappaoasasoas", "Dendododlaoadad"]
    }
  }
  render() {
    return <div>
      <Tabs>
        {this.state.tabs.map((x, i) => {
          return <Tab key={x} label={x}
            onClick={() => {
              this.setState({ selectedTab: i });
            }}
            isActive={i === this.state.selectedTab} />
        })}
      </Tabs>
    </div>;
  }
}


class TabSelectRandomTest extends TabSelectTest {
  constructor(props: any) {
    super(props);
    setInterval(() => {
      this.setState({
        selectedTab: Math.random() * this.state.tabs.length | 0
      });
    }, 200);
  }
}

class TabBasicScrollTest extends React.Component<{
}, {}> {
  render() {
    return <div style={{ width: 512 }}>
      <TabBasicTest />
    </div>
  }
}

class EditorPaneTest extends React.Component<{
}, {
    file: File,
    files: File[]
  }> {
  constructor(props: any) {
    super(props);
    let a = new File("A", FileType.JavaScript);
    let b = new File("B", FileType.JavaScript);
    let c = new File("C", FileType.JavaScript);

    a.onChange.register(() => this.forceUpdate());
    b.onChange.register(() => this.forceUpdate());
    c.onChange.register(() => this.forceUpdate());

    this.state = {
      file: a,
      files: [a, b, c]
    }
  }
  render() {
    return <div style={{ height: 128 }}>
      <EditorPane file={this.state.file} files={this.state.files}
        onNewFile={
          () => {
            let { files } = this.state;
            let f = new File("X", FileType.JavaScript);
            files.push(f);
            // files.splice(i, 1);
            this.setState({ files, file: files[files.length - 1] });
          }
        }
        onSelect={
          (x) => { this.setState({ file: x }) }
        }
        onClose={
          (x) => {
            let { files } = this.state;
            let i = files.indexOf(x);
            files.splice(i, 1);
            this.setState({ files, file: files[0] });
          }
        }
      />
    </div>
  }
}

export class Test extends React.Component<{
}, {

  }> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return <div>
      <TabBasicTest />
      <TabBasicScrollTest />
      <TabSelectTest />
      <EditorPaneTest />
      {/* <TabSelectRandomTest /> */}
    </div>;
  }
}