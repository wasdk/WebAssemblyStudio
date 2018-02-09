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
import { assert } from "../../index";
import { Tabs, Tab, TabProps } from "./Tabs";
import { Editor } from "./Editor";
import { Project, File, getIconForFileType, FileType } from "../../model";
import "monaco-editor";
import { Markdown } from ".././Markdown";
import { Button } from "../shared/Button";
import { GoBook, GoFile, GoKebabHorizontal } from "../shared/Icons";

export class View {
  constructor(
    public file: File,
    public state: monaco.editor.ICodeEditorViewState) {
    // ...
  }
}

export class EditorPaneProps {
  file: File;
  files: File[];
  preview: File;
  onClickFile?: (file: File) => void;
  onDoubleClickFile?: (file: File) => void;
  onClose?: (file: File) => void;
  onNewFile?: () => void;
  onFocus?: () => void;
  hasFocus?: boolean;
  onSplitEditor?: () => void;
}

function diff(a: any[], b: any[]): { ab: any[], ba: any[] } {
  return {
    ab: a.filter(x => b.indexOf(x) < 0),
    ba: b.filter(x => a.indexOf(x) < 0)
  };
}

export class EditorPane extends React.Component<EditorPaneProps, {
  views: Map<File, View>;
}> {
  constructor(props: any) {
    super(props);
    const views = new Map<File, View>();
    props.files.forEach((file: File) => {
      views.set(file, new View(file, null));
    });
    this.state = { views };
  }

  private onUpdate = () => {
    this.forceUpdate();
  }

  componentWillReceiveProps(nextProps: EditorPaneProps) {
    const views = this.state.views;
    nextProps.files.forEach((file: File) => {
      if (!views.has(file)) {
        views.set(file, new View(file, null));
      }
    });
  }

  render() {
    const { onClickFile, onDoubleClickFile, onClose, file, preview, hasFocus } = this.props;
    const { views } = this.state;
    let view;
    if (file) {
      view = views.get(file);
      assert(view);
    }
    let viewer;
    if (file) {
      viewer = <Editor view={view} options={{ readOnly: file.isBufferReadOnly }} />;
    } else {
      return <div className="editor-pane-container empty"/>;
    }
    let className = "editor-pane-container";
    if (!hasFocus) { className += " blurred"; }
    return <div className={className} onClick={this.props.onFocus}>
      <Tabs
        onDoubleClick={() => {
          return this.props.onNewFile && this.props.onNewFile();
        }
      }
        commands={[
          <Button
            key="split"
            icon={<GoBook />}
            title="Split Editor"
            onClick={() => {
              return this.props.onSplitEditor && this.props.onSplitEditor();
            }}
          />
        ]}
      >
        {this.props.files.map(x => {
          return <Tab
            key={x.key}
            label={x.name}
            value={x}
            icon={getIconForFileType(x.type)}
            isMarked={x.isDirty}
            isActive={x === file}
            isItalic={x === preview}
            onClick={onClickFile}
            onDoubleClick={onDoubleClickFile}
            onClose={onClose}
          />;
        })}
      </Tabs>
      <div style={{ height: "calc(100% - 40px)" }}>
        {viewer}
      </div>
    </div>;
  }
}
