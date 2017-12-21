import * as React from "react";
import { Project, File, Directory, FileType } from "../Project";
import { View } from "./EditorPane";
import "monaco-editor";

declare var window: any;

interface EditorProps {
  view: View
}
export class Editor extends React.Component<EditorProps, {}> {
  editor: monaco.editor.IStandaloneCodeEditor;
  refs: {
    container: HTMLDivElement;
  }
  componentDidMount() {
    let view = this.props.view;
    let refs = this.refs;
    let editor = this.editor = monaco.editor.create(refs.container, {
      value: "",
      theme: "vs-dark",
      minimap: {
        enabled: false
      },
      // tabSize: 2,
      language: 'javascript',
      fontWeight: "bold",
      renderLineHighlight: "none"
      // insertSpaces: true
    });
    editor.getModel().updateOptions({ tabSize: 2, insertSpaces: true });

    document.addEventListener("layout", this.layout);
    
    if (view) {
      this.editor.setModel(view.file.model);
      this.editor.restoreViewState(view.state);
    }
    this.registerActions();
    
  }

  registerActions() {
    let self = this;
    this.editor.addAction({
      id: 'save',
      label: 'Save',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S
      ],
    
      precondition: null,
      keybindingContext: null,
      run: function(ed) {
        if (self.props.view) {
          self.props.view.file.save();
        }
        return null;
      }
    });
  }

  componentWillReceiveProps(nextProps: EditorProps) {
    if (this.props.view !== nextProps.view) {
      this.props.view.state = this.editor.saveViewState();

      this.editor.setModel(nextProps.view.file.model);
      this.editor.restoreViewState(nextProps.view.state);
    }
  }

  layout = () => {
    setTimeout(() => {
      console.log("LAYING OUT NOW");
      this.editor.layout();
    }, 100);
  }

  componentWillUnmount() {
    document.removeEventListener("layout", this.layout);
  }

  render() {
    return <div className="editorContainer" ref="container"></div>;
  }
}