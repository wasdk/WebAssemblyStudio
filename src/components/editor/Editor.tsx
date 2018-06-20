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
import { languageForFileType, IStatusProvider } from "../../models";
import { ViewTabs } from "./ViewTabs";
import { View } from "./View";
import { build, run, pushStatus, popStatus, logLn } from "../../actions/AppActions";

declare var window: any;

// Life Cycle
// https://cdn-images-1.medium.com/max/1600/0*VoYsN6eq7I_wjVV5.png

export interface MonacoProps {
  view: View;
  options?: monaco.editor.IEditorConstructionOptions;
}

export class Monaco extends React.Component<MonacoProps, {}> {
  editor: monaco.editor.IStandaloneCodeEditor;
  container: HTMLDivElement;
  status: IStatusProvider;

  constructor(props: MonacoProps) {
    super(props);
    this.status = {
      push: pushStatus,
      pop: popStatus,
      logLn: logLn
    };
  }
  revealLastLine() {
    this.editor.revealLine(this.editor.getModel().getLineCount());
  }

  componentDidMount() {
    const { view } = this.props;
    if (view) {
      this.ensureEditor();
      this.editor.setModel(view.file.buffer);

      // TODO: Weird that we need this to make monaco really think it needs to update the language.
      monaco.editor.setModelLanguage(this.editor.getModel(), languageForFileType(view.file.type));

      this.editor.restoreViewState(view.state);
      this.editor.updateOptions({ readOnly: view.file.isBufferReadOnly });
    }
    document.addEventListener("layout", this.onLayout);
  }

  componentWillReceiveProps(nextProps: EditorViewProps) {
    if (this.props.view !== nextProps.view) {
      // We're about to switch to a new file, save the view state.
      this.props.view.state = this.editor.saveViewState();
    }
  }

  shouldComponentUpdate(nextProps: EditorViewProps, nextState: any) {
    if (this.props.view === nextProps.view) {
      return false;
    }
    return true;
  }

  componentDidUpdate() {
    const { view } = this.props;
    if (view) {
      this.ensureEditor();
      this.editor.setModel(view.file.buffer);
      this.editor.restoreViewState(view.state);
      this.editor.updateOptions({ readOnly: view.file.isBufferReadOnly });
    }
  }

  onLayout = () => {
    this.editor.layout();
  }

  componentWillUnmount() {
    document.removeEventListener("layout", this.onLayout);
    // We're about to close the editor, save the view state.
    this.props.view.state = this.editor.saveViewState();
  }

  registerActions() {
    const self = this;
    this.editor.addAction({
      id: "save",
      label: "Save",
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S
      ],
      precondition: null,
      keybindingContext: null,
      run: function() {
        const view = self.props.view;
        if (view && !view.file.isBufferReadOnly) {
          view.file.save(self.status);
        }
        return null;
      }
    });

    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_B, function() {
      build();
    },  null);

    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function() {
      run();
    },  null);

    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.Enter, function() {
      build().then(run);
    },  null);

  }

  private ensureEditor() {
    if (this.editor) { return; }
    const options = Object.assign({
      value: "",
      theme: "fiddle-theme",
      minimap: {
        enabled: false
      },
      fontWeight: "bold",
      renderLineHighlight: "none",
    }, this.props.options);
    if (this.container.lastChild) {
      this.container.removeChild(this.container.lastChild);
    }
    this.editor = monaco.editor.create(this.container, options as any);
    this.editor.onContextMenu(e => {
      this.resolveMenuPosition(e);
      this.disableEditorScroll(); // This makes it possible to scroll inside the menu
    });
    this.editor.onDidFocusEditor(() => this.enableEditorScroll());
    this.editor.onDidFocusEditorText(() => this.enableEditorScroll());
    this.registerActions();
    console.info("Created a new Monaco editor.");
  }
  resolveMenuPosition(e: any) {
    const anchorOffset = { x: -10, y: -3 };
    const menu: HTMLElement = this.container.querySelector(".monaco-editor > .monaco-menu-container");
    const top = (parseInt(menu.style.top, 10) + e.event.editorPos.y + anchorOffset.y);
    const left = (parseInt(menu.style.left, 10) + e.event.editorPos.x + anchorOffset.x);
    const windowPadding = 10;
    menu.style.top = top + "px";
    menu.style.left = left  + "px";
    menu.style.maxHeight = Math.min(window.innerHeight - top - windowPadding, 380) + "px";
  }
  disableEditorScroll() {
    this.editor.updateOptions({
      scrollbar: {
        handleMouseWheel: false
      }
    });
  }
  enableEditorScroll() {
    this.editor.updateOptions({
      scrollbar: {
        handleMouseWheel: true
      }
    });
  }
  private setContainer(container: HTMLDivElement) {
    if (container == null) { return; }
    this.container = container;
  }
  render() {
    return <div className="fill" ref={(ref) => this.setContainer(ref)}/>;
  }
}

export interface EditorViewProps {
  view: View;
  options?: monaco.editor.IEditorConstructionOptions;
}

export class EditorView extends React.Component<EditorViewProps, {}> {
  monaco: Monaco;
  setMonaco(monaco: Monaco) {
    this.monaco = monaco;
  }
  revealLastLine() {
    this.monaco.revealLastLine();
  }
  render() {
    const file = this.props.view.file;
    if (file.description) {
      return <div className="fill">
        <div className="editor-status-bar">
          <div className="status-bar-item">{file.description}</div>
        </div>
        <div className="editor-container">
          <Monaco ref={(ref) => this.setMonaco(ref)} view={this.props.view} options={this.props.options} />
        </div>;
      </div>;
    } else {
      return <div className="fill">
        <Monaco ref={(ref) => this.setMonaco(ref)} view={this.props.view} options={this.props.options} />
      </div>;
    }
  }
}
