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
import { FileType, getIconForFileType, Problem } from "../model";
import { Project, File, Directory, shallowCompare } from "../model";
import { Problems } from "./Problems";

export class ControlCenter extends React.Component<{
  project: Project;
}, {
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
    this.outputView = new View(new File("output", FileType.Log), null);
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
  logLnTimeout: any;
  logLn(message: string, kind: "" | "info" | "warn" | "error" = "") {
    message = message + "\n";
    if (kind) {
      message = "[" + kind + "]: " + message;
    }
    const model = this.outputView.file.buffer;
    const lineCount = model.getLineCount();
    const lastLineLength = model.getLineMaxColumn(lineCount);
    const range = new monaco.Range(lineCount, lastLineLength, lineCount, lastLineLength);
    model.applyEdits([
      { forceMoveMarkers: true, identifier: null, range, text: message }
    ]);
    if (!this.outputViewEditor) {
      return;
    }
    this.outputViewEditor.revealLastLine();
    if (!this.logLnTimeout) {
      this.logLnTimeout = window.setTimeout(() => {
        this.forceUpdate();
        this.logLnTimeout = null;
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
        return <Problems project={this.props.project} />;
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
          <Sandbox ref={(ref) => this.setSandbox(ref)} logger={this} />
        </Split>
      </div>
    </div>;
  }
}
