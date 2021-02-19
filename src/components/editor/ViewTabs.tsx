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
import { assert } from "../../util";
import { Tabs, Tab, TabProps } from "./Tabs";
import { EditorView } from "./Editor";
import { getIconForFileType, FileType, IStatusProvider } from "../../models";
import { Markdown, MarkdownView } from ".././Markdown";
import { Button } from "../shared/Button";
import { GoBook, GoClippy, GoFile, GoKebabHorizontal, GoEye, GoCode } from "../shared/Icons";
import { View, ViewType, isViewFileDirty } from "./View";
import { BinaryView } from "../Binary";
import { VizView } from "../Viz";
import { pushStatus, popStatus, logLn } from "../../actions/AppActions";
import appStore from "../../stores/AppStore";

export interface ViewTabsProps {
  /**
   * Currently active view tab.
   */
  view: View;
  /**
   * View tabs.
   */
  views: View[];
  /**
   * View tab that is marked as a preview tab.
   */
  preview?: View;
  /**
   * Called when a view tab is clicked.
   */
  onClickView?: (view: View) => void;
  /**
   * Called when a view tab is double clicked.
   */
  onDoubleClickView?: (view: View) => void;
  /**
   * Called when a view tab is closed.
   */
  onClose?: (view: View) => void;
  /**
   * Called when a view tab's view type is changed.
   */
  onChangeViewType?: (view: View, type: ViewType) => void;
  /**
   * Called when the creation of a new view is requeted.
   */
  onNewFile?: () => void;
  /**
   * Called when the view tabs receive focus.
   */
  onFocus?: () => void;
  hasFocus?: boolean;
  /**
   * Called when view tabs are split.
   */
  onSplitViews?: () => void;
}

export interface ViewTabsState {
  isActiveViewFileDirty: boolean;
}

export class ViewTabs extends React.Component<ViewTabsProps, ViewTabsState> {
  static defaultProps: ViewTabsProps = {
    view: null,
    views: [],
    // tslint:disable-next-line
    onChangeViewType: (view: View, type: ViewType) => {},
    // tslint:disable-next-line
    onNewFile: () => {},
    // tslint:disable-next-line
    onSplitViews: () => {}
  };

  status: IStatusProvider;

  constructor(props: any) {
    super(props);
    this.status = {
      push: pushStatus,
      pop: popStatus,
      logLn: logLn
    };
    this.state = {
      isActiveViewFileDirty: isViewFileDirty(props.view)
    };
  }

  componentDidMount() {
    appStore.onDidChangeDirty.register(this.onFileDidChangeDirty);
  }

  componentWillUnmount() {
    appStore.onDidChangeDirty.unregister(this.onFileDidChangeDirty);
  }

  componentWillReceiveProps(nextProps: ViewTabsProps) {
    if (this.props.view !== nextProps.view) {
      this.setState({
        isActiveViewFileDirty: isViewFileDirty(nextProps.view)
      });
    }
  }

  onFileDidChangeDirty = () => {
    this.setState({
      isActiveViewFileDirty: isViewFileDirty(this.props.view)
    });
  }

  renderViewCommands() {
    const { view } = this.props;
    const commands = [
      <Button
        key="split"
        icon={<GoBook />}
        title="Split Editor"
        onClick={() => {
          return this.props.onSplitViews();
        }}
      />,
      <Button
        key="save"
        icon={<GoClippy />}
        label="Save"
        title="Save: CtrlCmd + S"
        isDisabled={!this.state.isActiveViewFileDirty}
        onClick={() => {
          this.props.view.file.save(this.status);
        }}
      />
    ];
    if (view.file.type === FileType.Markdown) {
      const markdown = view.type === ViewType.Markdown;
      commands.unshift(
        <Button
          key="toggle"
          icon={markdown ? <GoCode /> : <GoEye />}
          title={markdown ? "Edit Markdown" : "Preview Markdown"}
          onClick={() =>
            this.props.onChangeViewType(view, markdown ? ViewType.Editor : ViewType.Markdown)
          }
        />
      );
    } else if (view.file.type === FileType.DOT) {
      const viz = view.type === ViewType.Viz;
      commands.unshift(
        <Button
          key="toggle"
          icon={viz ? <GoCode /> : <GoEye />}
          title={viz ? "Edit GraphViz DOT File" : "Preview GraphViz DOT File"}
          onClick={() =>
            this.props.onChangeViewType(view, viz ? ViewType.Editor : ViewType.Viz)
          }
        />
      );
    }
    return commands;
  }

  render() {
    const { onClickView, onDoubleClickView, onClose, view, views, preview, hasFocus } = this.props;
    if (!view) {
      return <div />;
    }
    const { file } = view;
    let viewer;
    if (file && file.type === FileType.Markdown && view.type === ViewType.Markdown) {
      viewer = <MarkdownView view={view} />;
    } else if (file && file.type === FileType.DOT && view.type === ViewType.Viz) {
      viewer = <VizView view={view} />;
    } else if (view.type === ViewType.Binary) {
      viewer = <BinaryView view={view} />;
    } else if (file) {
      viewer = <EditorView view={view} options={{ readOnly: file.isBufferReadOnly }} />;
    } else {
      return <div className="editor-pane-container empty"/>;
    }
    let className = "editor-pane-container";
    if (!hasFocus) { className += " blurred"; }
    return <div className={className} onClick={this.props.onFocus}>
      <Tabs
        onDoubleClick={() => {
          return this.props.onNewFile();
        }
      }
        commands={this.renderViewCommands()}
      >
        {views.map(v => {
          const { file: x } = v;
          let name = x.name;
          if (v.type === ViewType.Binary) {
            name = "Binary " + name;
          } else if (v.type === ViewType.Markdown || v.type === ViewType.Viz) {
            name = "Preview " + name;
          }
          return <Tab
            key={x.key}
            label={name}
            value={v}
            icon={getIconForFileType(x.type)}
            isMarked={x.isDirty}
            isActive={v === view}
            isItalic={v === preview}
            onClick={onClickView}
            onDoubleClick={onDoubleClickView}
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
