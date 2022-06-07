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
import { File } from "../models";
import appStore from "../stores/AppStore";
import { layout } from "../util";
import { EditorView, Tab, Tabs, View } from "./editor";
import { Problems } from "./Problems";
import Console from "./Console";
import { Sandbox } from "./Sandbox";
import { Button } from "./shared/Button";
import { GoThreeBars } from "./shared/Icons";
import { Split, SplitInfo, SplitOrientation } from "./Split";

export class ControlCenter extends React.Component<
  {
    onToggle?: Function;
    showSandbox: boolean;
  },
  {
    /**
     * Split state.
     */
    splits: SplitInfo[];

    /**
     * Visible pane.
     */
    visible: "output" | "problems" | "terminal";

    problemCount: number;
    outputLineCount: number;
  }
> {
  outputView: View;
  refs: { container: HTMLDivElement };
  outputViewEditor: EditorView;
  updateOutputViewTimeout: any;

  constructor(props: any) {
    super(props);
    const outputFile = appStore.getOutput().getModel();
    this.outputView = new View(outputFile);

    this.state = {
      visible: "output",
      splits: [
        { min: 128, value: 512 },
        { min: 128, value: 256 },
      ],
      problemCount: this.getProblemCount(),
      outputLineCount: this.getOutputLineCount(),
    };
  }
  onOutputChanged = () => {
    this.updateOutputView();
  };
  onDidChangeProblems = () => {
    this.updateOutputView();
  };
  componentDidMount() {
    appStore.onOutputChanged.register(this.onOutputChanged);
    appStore.onDidChangeProblems.register(this.onDidChangeProblems);
  }
  componentWillUnmount() {
    appStore.onOutputChanged.unregister(this.onOutputChanged);
    appStore.onDidChangeProblems.unregister(this.onDidChangeProblems);
  }
  setOutputViewEditor(editor: EditorView) {
    this.outputViewEditor = editor;
  }
  updateOutputView() {
    if (!this.updateOutputViewTimeout) {
      this.updateOutputViewTimeout = window.setTimeout(() => {
        this.updateOutputViewTimeout = null;
        this.setState({
          problemCount: this.getProblemCount(),
          outputLineCount: this.getOutputLineCount(),
        });
      });
    }
    if (!this.outputViewEditor) {
      return;
    }
    this.outputViewEditor.revealLastLine();
  }
  createPane() {
    switch (this.state.visible) {
      case "output":
        return (
          <EditorView
            ref={(ref) => this.setOutputViewEditor(ref)}
            view={this.outputView}
            options={{ renderIndentGuides: false }}
          />
        );
      case "problems":
        return <Problems />;
      case "terminal":
        // @ts-ignore
        return <Console />;
      default:
        return null;
    }
  }
  getOutputLineCount() {
    return this.outputView.file.buffer.getLineCount();
  }
  getProblemCount() {
    let problemCount = 0;
    appStore
      .getProject()
      .getModel()
      .forEachFile(
        (file: File) => {
          problemCount += file.problems.length;
        },
        false,
        true
      );
    return problemCount;
  }
  render() {
    return (
      <div className="fill">
        <div className="tabs" style={{ display: "flex" }}>
          <div>
            <Button
              icon={<GoThreeBars />}
              title="View Console"
              onClick={() => {
                return this.props.onToggle && this.props.onToggle();
              }}
            />
          </div>
          <div>
            <Tabs>
              <Tab
                label={`Output (${this.state.outputLineCount})`}
                isActive={this.state.visible === "output"}
                onClick={() => {
                  this.setState({ visible: "output" });
                }}
              />
              <Tab
                label={`Problems (${this.state.problemCount})`}
                isActive={this.state.visible === "problems"}
                onClick={() => {
                  this.setState({ visible: "problems" });
                }}
              />
              <Tab
                label={`Terminal (${this.state.problemCount})`}
                isActive={this.state.visible === "terminal"}
                onClick={() => {
                  this.setState({ visible: "terminal" });
                }}
              />
            </Tabs>
          </div>
        </div>
        <div style={{ height: "calc(100% - 40px)" }}>
          {this.props.showSandbox ? (
            <Split
              name="editor/sandbox"
              orientation={SplitOrientation.Vertical}
              defaultSplit={{
                min: 256,
              }}
              splits={this.state.splits}
              onChange={(splits) => {
                this.setState({ splits });
                layout();
              }}
            >
              {this.createPane()}
              <Sandbox />
            </Split>
          ) : (
            this.createPane()
          )}
        </div>
      </div>
    );
  }
}
