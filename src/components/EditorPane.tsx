import * as React from "react";
import { assert } from "../index";
import { Tabs, Tab, TabProps } from "./Tabs";
import { Editor } from "./Editor";
import { Project, File, getIconForFileType } from "../Project";
import "monaco-editor";

export class View {
  constructor(
    public file: File,
    public state: monaco.editor.ICodeEditorViewState) {
    // ...
  }
}

class EditorPaneProps {
  file: File;
  files: File[];
  onSelect?: (file: File) => void;
  onClose?: (file: File) => void;
  onNewFile?: () => void;
  onFocus?: () => void;
  hasFocus?: boolean;
}

function diff(a: any[], b: any[]): { ab: any[], ba: any[] } {
  return {
    ab: a.filter(x => b.indexOf(x) < 0),
    ba: b.filter(x => a.indexOf(x) < 0)
  }
}

export class EditorPane extends React.Component<EditorPaneProps, {
  views: Map<File, View>;
}> {
  constructor(props: any) {
    super(props)
    let views = new Map<File, View>();
    props.files.forEach((file: File) => {
      views.set(file, new View(file, null))
    });
    this.state = { views };
  }

  private onUpdate = () => {
    this.forceUpdate();
  }

  componentWillReceiveProps(nextProps: EditorPaneProps) {
    let views = this.state.views;
    nextProps.files.forEach((file: File) => {
      if (!views.has(file)) {
        views.set(file, new View(file, null))
      }
    });
  }

  render() {
    let { onSelect, onClose, file, hasFocus } = this.props;
    let { views } = this.state;
    let view;
    if (this.props.file) {
      view = views.get(this.props.file);
      assert(view);
    }
    let className = "editor-pane-container";
    if (hasFocus) className += " focus";
    return <div className={className} onClick={this.props.onFocus}>
      <Tabs onDoubleClick={
        () => {
          this.props.onNewFile && this.props.onNewFile();
        }
      }>
        {this.props.files.map(x => {
          return <Tab
            key={x.key}
            label={x.name}
            value={x}
            icon={getIconForFileType(x.type)}
            isMarked={x.dirty}
            isActive={x === file}
            onClick={onSelect}
            onClose={onClose}>
          </Tab>
        })}
      </Tabs>
      <div style={{ paddingTop: "4px" }}>
        {file ? <Editor view={view}></Editor> : <div>?</div>}
      </div>
    </div>;
  }
}
