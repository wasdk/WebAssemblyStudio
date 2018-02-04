import * as React from "react";

export class Button extends React.Component<{
  icon?: JSX.Element;
  label?: string;
  title?: string;
  isDisabled?: boolean;
  onClick?: Function
}, {}> {
  render() {
    let className = "button";
    if (this.props.isDisabled) {
      className += " disabled";
    }
    return <div className={className} onClick={() => {
      if (this.props.onClick && !this.props.isDisabled) {
        this.props.onClick();
      }
    }} title={this.props.title}>{this.props.icon} {this.props.label}</div>;
  }
}
