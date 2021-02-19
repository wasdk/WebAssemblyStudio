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
import {
  Component,
  PureComponent,
  ReactElement,
  ReactNode,
  MouseEvent,
  WheelEvent,
} from "react";
import { clamp } from "../../util";

export interface TabsProps {
  onDoubleClick?: Function;
  commands?: JSX.Element | JSX.Element [];
}

export interface TabsState {
  scrollLeft: number;
}

export class Tabs extends Component<TabsProps, TabsState> {
  static defaultProps: TabsProps = {
    // tslint:disable-next-line
    onDoubleClick: () => {},
  };

  container: HTMLDivElement;

  state = {
    scrollLeft: 0,
  };

  componentDidUpdate() {
    this.container.scrollLeft = this.state.scrollLeft;
  }

  onWheel = (e: WheelEvent<any>) => {
    const delta = clamp(e.deltaY, -16, 16);
    let { scrollLeft } = this.state;
    scrollLeft += delta;
    // TODO: Work out the details of scrolling.
    scrollLeft = clamp(scrollLeft, 0, this.container.clientWidth);
    this.setState({ scrollLeft });
    e.preventDefault();
  }

  onDoubleClick   = (e: MouseEvent<any>)  => { this.props.onDoubleClick(); };
  setContainerRef = (ref: HTMLDivElement) => { this.container = ref; };

  render() {
    const { onDoubleClick, children, commands } = this.props;
    return (
      <div className="tabs-container">
        <div
          ref={this.setContainerRef}
          className="tabs-tab-container"
          onWheel={this.onWheel}
          onDoubleClick={this.onDoubleClick}
        >
          {children}
        </div>
        <div className="tabs-command-container">
          {commands}
        </div>
      </div>
    );
  }
}

export interface TabProps {
  label?: string;
  value?: any;
  isActive?: boolean;
  isItalic?: boolean;
  onClick?: Function;
  onDoubleClick?: Function;
  onClose?: Function;
  icon?: string;
  isMarked?: boolean;
}

export class Tab extends PureComponent<TabProps, {}> {
  static defaultProps: TabProps = {
    // tslint:disable-next-line
    onClick: () => {},
    // tslint:disable-next-line
    onDoubleClick: () => {},
    // tslint:disable-next-line
    onClose: () => {},
  };

  onMouseHandle = (e: MouseEvent<HTMLElement>, handler: Function) => {
    e.stopPropagation();
    handler(this.props.value);
  }

  onClick = (e: MouseEvent<HTMLElement>) => {
    this.onMouseHandle(e, this.props.onClick);
  }

  onDoubleClick = (e: MouseEvent<HTMLElement>) => {
    this.onMouseHandle(e, this.props.onDoubleClick);
  }

  onClose = (e: MouseEvent<HTMLElement>) => {
    this.onMouseHandle(e, this.props.onClose);
  }

  render() {
    const {
      label,
      icon,
      isActive,
      isMarked,
      isItalic,
    } = this.props;

    let className = "tab";
    if (isActive) { className += " active"; }
    if (isMarked) { className += " marked"; }
    if (isItalic) { className += " italic"; }

    return (
      <div
        className={className}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
      >
        <div className={"monaco-icon-label file-icon " + icon} />
        <div className="label">{label}</div>
        <div
          className="close"
          onClick={this.onClose}
        />
      </div>
    );
  }
}
