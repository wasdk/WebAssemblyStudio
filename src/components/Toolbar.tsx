import * as React from "react";

export class Toolbar extends React.Component<{}, {}> {
  render() {
    return <div className="toolbar">
      {this.props.children}
    </div>;
  }
}
