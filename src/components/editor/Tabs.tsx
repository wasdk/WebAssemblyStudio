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
import { ReactElement, ReactNode, MouseEvent, WheelEvent } from "react";
import { clamp } from "../../index";

export class Tabs extends React.Component<{
  onDoubleClick?: Function;
  commands?: JSX.Element | JSX.Element [];
}, {
    scrollLeft: number;
  }> {
  container: HTMLDivElement;
  constructor(props: any) {
    super(props);
    this.state = {
      scrollLeft: 0
    };
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

  onDoubleClick = (e: MouseEvent<any>) => {
    return this.props.onDoubleClick && this.props.onDoubleClick();
  }

  render() {
    return <div className="tabs-container">
      <div
        ref={(ref) => { this.container = ref; }}
        className="tabs-tab-container"
        onWheel={this.onWheel}
        onDoubleClick={this.onDoubleClick}
      >
        {this.props.children}
      </div>
      <div className="tabs-command-container">
        {this.props.commands}
      </div>
    </div>;
  }
  componentDidUpdate() {
    this.container.scrollLeft = this.state.scrollLeft;
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

export class Tab extends React.Component<TabProps, {}> {
  render() {
    const { onClick, onDoubleClick, onClose } = this.props;
    let className = "tab";
    if (this.props.isActive) { className += " active"; }
    if (this.props.isMarked) { className += " marked"; }
    if (this.props.isItalic) { className += " italic"; }
    return <div
      className={className}
      onClick={(e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        return onClick && onClick(this.props.value);
      }}
      onDoubleClick={(e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        return onDoubleClick && onDoubleClick(this.props.value);
      }}
    >
      {this.props.icon && <div
        className="icon"
        style={{
          backgroundImage: `url(svg/${this.props.icon}.svg)`
        }}
      />
      }
      <div className="label">{this.props.label}</div>
      <div
        className="close"
        onClick={(e: MouseEvent<HTMLElement>) => {
          e.stopPropagation();
          return onClose && onClose(this.props.value);
        }}
      />
    </div>;
  }
}
