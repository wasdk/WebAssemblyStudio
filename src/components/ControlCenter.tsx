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
import { Split, SplitOrientation, SplitInfo } from "./Split";
import { Editor, View, Tab, Tabs } from "./editor";
import { Sandbox } from "./Sandbox";
import { GoThreeBars, GoFile } from "./shared/Icons";
import { Button } from "./shared/Button";
import { FileType, getIconForFileType, Problem, ModelRef } from "../model";
import { Project, File, Directory, shallowCompare } from "../model";
import { Problems } from "./Problems";
import appStore from "../stores/AppStore";

export class ControlCenter extends React.Component<{}, {
    /**
     * Split state.
     */
    splits: SplitInfo[];

    /**
     * Visible pane.
     */
    visible: "output" | "problems";
  }> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: "problems",
      splits: [
        { min: 128, value: 512 },
        { min: 128, value: 256 }
      ]
    };
    const outputFile = appStore.getOutput().getModel();
    this.outputView = new View(outputFile, null);
  }
  onOutputChanged = () => {
    this.updateOutputView();
  }
  componentDidMount() {
    appStore.onOutputChanged.register(this.onOutputChanged);
  }
  componentWillUnmount() {
    appStore.onOutputChanged.unregister(this.onOutputChanged);
  }
  sandbox: Sandbox;
  outputView: View;
  refs: {
    container: HTMLDivElement;
  };
  outputViewEditor: Editor;
  setOutputViewEditor(editor: Editor) {
    this.outputViewEditor = editor;
  }
  setSandbox(sandbox: Sandbox) {
    this.sandbox = sandbox;
  }
  updateOutputViewTimeout: any;
  updateOutputView() {
    if (!this.outputViewEditor) {
      return;
    }
    this.outputViewEditor.revealLastLine();
    if (!this.updateOutputViewTimeout) {
      this.updateOutputViewTimeout = window.setTimeout(() => {
        this.forceUpdate();
        this.updateOutputViewTimeout = null;
      });
    }
  }
  createPane() {
    switch (this.state.visible) {
      case "output":
        return <Editor
          ref={(ref) => this.setOutputViewEditor(ref)}
          view={this.outputView}
        />;
      case "problems":
        return <Problems />;
      default:
        return null;
    }
  }
  render() {
    return <div className="fill">
      <div style={{ display: "flex" }}>
        <div>
          <Button
            icon={<GoThreeBars />}
            title="View Console"
            onClick={() => {
            // TODO: Figure out how the UX should work when toggling the console.
            // let consoleSplits = this.state.consoleSplits;
            // let second = consoleSplits[1];
            // second.value = second.value == 40 ? 128 : 40;
            // this.setState({ consoleSplits });
            // layout();
            }}
          />
        </div>
        <div>
          <Tabs>
            <Tab
              label={`Output (${this.outputView.file.buffer.getLineCount()})`}
              onClick={() => {
                this.setState({ visible: "output" });
              }}
            />
            <Tab
              label="Problems"
              onClick={() => {
                this.setState({ visible: "problems" });
              }}
            />
          </Tabs>
        </div>
      </div>
      <div style={{ height: "calc(100% - 40px)" }}>
        <Split
          name="editor/sandbox"
          orientation={SplitOrientation.Vertical}
          defaultSplit={{
            min: 256,
          }}
          splits={this.state.splits}
          onChange={(splits) => {
            this.setState({ splits });
            // layout();
          }}
        >
          {this.createPane()}
          <Sandbox ref={(ref) => this.setSandbox(ref)} />
        </Split>
      </div>
    </div>;
  }
}
