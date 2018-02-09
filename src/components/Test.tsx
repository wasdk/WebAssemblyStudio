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
import * as ReactDOM from "react-dom";
import { Workspace } from "./Workspace";
import { Editor, EditorPane, View, Tab, Tabs } from "./editor";
import { Header } from "./Header";
import { Toolbar } from "./Toolbar";

import { Project, File, FileType } from "../model";
import { App } from "./App";

import { layout, assert } from "../index";
import { setInterval } from "timers";
import { Split, SplitOrientation, SplitInfo } from "./Split";
import { Z_STREAM_END } from "zlib";
import { Button } from "./shared/Button";

class TabBasicTest extends React.Component<{
}, {

  }> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return <div>
      <Tabs>
        <Tab label="A"/>
        <Tab label="Really Long Name That I Can't Fit In This Tab"/>
        <Tab label="Ion" icon="default_file"/>
        <Tab label="Active" isActive/>
        <Tab label="Marked" isMarked/>
        <Tab label="Active & Marked" isActive isMarked/>
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
      tabs: ["One Large Tab", "One Large Tab", "One Large Tab", "One Large Tab"]
    };
  }
  render() {
    return <div>
      <Tabs>
        {this.state.tabs.map((x, i) => {
          return <Tab
            key={x}
            label={x}
            onClick={() => {
              this.setState({ selectedTab: i });
            }}
            isActive={i === this.state.selectedTab}
          />;
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
    </div>;
  }
}

class EditorPaneTest extends React.Component<{
}, {
    file: File,
    files: File[]
  }> {
  constructor(props: any) {
    super(props);
    const a = new File("A", FileType.JavaScript);
    const b = new File("B", FileType.JavaScript);
    const c = new File("C", FileType.JavaScript);

    a.onDidChangeData.register(() => this.forceUpdate());
    b.onDidChangeData.register(() => this.forceUpdate());
    c.onDidChangeData.register(() => this.forceUpdate());

    this.state = {
      file: a,
      files: [a, b, c]
    };
  }
  render() {
    return <div style={{ height: 128 }}>
      <EditorPane
        preview={this.state.file}
        file={this.state.file}
        files={this.state.files}
        onNewFile={
          () => {
            const { files } = this.state;
            const f = new File("X", FileType.JavaScript);
            files.push(f);
            // files.splice(i, 1);
            this.setState({ files, file: files[files.length - 1] });
          }
        }
        onClickFile={
          (x) => {
            this.setState({ file: x });
          }
        }
        onClose={
          (x) => {
            const { files } = this.state;
            const i = files.indexOf(x);
            files.splice(i, 1);
            this.setState({ files, file: files[0] });
          }
        }
      />
    </div>;
  }
}

export class Test extends React.Component<{
}, {
  splits: SplitInfo [];
  width: number;
  }> {
  constructor(props: any) {
    super(props);
    this.state = {
      splits: [
        { min: 128, max: 192, value: 130 }, {}, {}, { value: 64 }
      ],
      width: 600
    };
  }
  componentDidMount() {
    layout();
  }
  render() {
    const view = new View(new File("X", FileType.JavaScript), null);
    view.file.buffer.setValue(`
    render() {
      let { splits } = this.state;
      let resizerClassName = "resizer";
      let isHorizontal = this.props.orientation === SplitOrientation.Horizontal;
      if (isHorizontal) {
        resizerClassName += " horizontal";
      } else {
        resizerClassName += " vertical";
      }
      // console.log("Splits", splits, sum(splits), this.state.size);
      let count = React.Children.count(this.props.children);
      let children: any[] = [];
      React.Children.forEach(this.props.children, (child, i) => {
        let style: any = {};
        if (i < count - 1) {
          style.flexBasis = toCSSPx(Math.round(splits[i]));
        } else {
          style.flex = 1;
        }
        children.push(<div key={i} className="split-pane" style={style}>{child}</div>);
        if (i < count - 1) {
          children.push(<div key={"split:" + i} className={resizerClassName} onMouseDown={this.onResizerMouseDown.bind(this, i)}>
          </div>);
        }
      });
      return <div className="split" ref="container" style={{ flexDirection: isHorizontal ? "column" : "row" }}>
        {children}
      </div>;
    }
    `);
    return <div>
      {/* <TabBasicTest />
      <TabBasicScrollTest />
      <TabSelectTest />
      <EditorPaneTest /> */}
      <div style={{ width: this.state.width, height: 128, border: "solid 1px red" }}>
        <Split
          orientation={SplitOrientation.Vertical}
          splits={this.state.splits}
          onChange={(splits: SplitInfo []) => {
          this.setState({splits});
          }}
        >
          <div>A</div>
          <div>B</div>
          <div>C</div>
          <div>D</div>
        </Split>
      </div>
      {/* <div>
        App Layout
      </div>
      <div style={{ width: 1024, height: 512, border: "solid 1px red" }}>
        <Split orientation={SplitOrientation.Vertical} splits={[
          { min: 256, default: 256, resize: "fixed" }
        ]}>
          <div>Left Pane</div>
          <Split orientation={SplitOrientation.Horizontal} onChange={layout}>
            <Editor view={view} />
            <Split orientation={SplitOrientation.Vertical}>
              <Editor view={view} />
              <Editor view={view} />
              <Editor view={view} />
            </Split>
            <div className="fill">
              <Tabs>
                <Tab label="Output"></Tab>
                <Tab label="Problems"></Tab>
              </Tabs>
              <div style={{height: "calc(100% - 40px)"}}>
                <Editor view={view}></Editor>
              </div>
            </div>
          </Split>
        </Split>
      </div> */}
      {/* <TabSelectRandomTest /> */}
    </div>;
  }
}
