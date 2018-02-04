import * as React from "react";
import { assert } from "../index";
import { Tabs, Tab, TabProps } from "./Tabs";
import { Editor } from "./Editor";
import { Project, File, getIconForFileType, FileType } from "../model";
import "monaco-editor";
import { Markdown } from "./Markdown";
import { Button } from "./Button";
import { GoBook, GoFile, GoKebabHorizontal } from "./Icons";

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
    if (file && file.type === FileType.Markdown) {
      viewer = <Markdown src={file.getData() as string} />;
    } else if (file) {
      viewer = <Editor view={view} options={{ readOnly: file.isBufferReadOnly }} />;
    } else {
      return <div className="editor-pane-container empty">
        {/* <img width="80%" height="80%" src="svg/web-assembly-logo-black.svg" /> */}
        {/* Build, Run and Share WebAssembly Fiddles */}
      </div>;
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
