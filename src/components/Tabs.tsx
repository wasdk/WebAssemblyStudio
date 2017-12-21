import * as React from "react";
import { ReactElement, ReactNode, MouseEvent, WheelEvent } from "react";
import { clamp } from "../index";

export class Tabs extends React.Component<{
  onDoubleClick?: Function;
}, {
    scrollLeft: number;
  }> {
  refs: {
    container: HTMLDivElement;
  }
  constructor(props: any) {
    super(props);
    this.state = {
      scrollLeft: 0
    }
  }
  onWheel = (e: WheelEvent<any>) => {
    let delta = clamp(e.deltaY, -16, 16);
    let { scrollLeft } = this.state;
    scrollLeft += delta;
    // TODO: Work out the details of scrolling.
    scrollLeft = clamp(scrollLeft, 0, this.refs.container.clientWidth);
    this.setState({ scrollLeft });
    e.preventDefault();
  }

  onDoubleClick = (e: MouseEvent<any>) => {
    this.props.onDoubleClick && this.props.onDoubleClick();
  }

  render() {
    return <div ref="container" className="tabs-container" onWheel={this.onWheel} onDoubleClick={this.onDoubleClick}>
      {this.props.children}
    </div>;
  }
  componentDidUpdate() {
    this.refs.container.scrollLeft = this.state.scrollLeft;
  }
}

export interface TabProps {
  label?: string;
  value?: any;
  isActive?: boolean;
  onClick?: Function;
  onDoubleClick?: Function;
  onClose?: Function;
  icon?: string;
  isMarked?: boolean;
}

export class Tab extends React.Component<TabProps, {}> {
  render() {
    let { onClick, onDoubleClick, onClose } = this.props;
    let className = "tab";
    if (this.props.isActive) className += " active";
    if (this.props.isMarked) className += " marked";
    return <div className={className} onClick={(e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      onClick && onClick(this.props.value);
    }}
    onDoubleClick={(e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      onDoubleClick && onDoubleClick(this.props.value);
    }}>
      {this.props.icon && <div className="icon"
        style={{
          backgroundImage: `url(svg/${this.props.icon}.svg)`
        }}></div>
      }
      <div className="label">{this.props.label}</div>
      <div className="close" onClick={(e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        onClose && onClose(this.props.value);
      }}></div>
    </div>;
  }
}

