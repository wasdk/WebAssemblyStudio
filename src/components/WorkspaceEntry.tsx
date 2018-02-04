import * as React from "react";

export class WorkspaceEntry extends React.Component<{
  name: string,
  expanded?: boolean,
  onClick?: () => void
}, {}> {
  render() {
    return <div>
      <div className="workspaceEntry" onClick={this.props.onClick}>
        <svg style={{ verticalAlign: "middle", width: "1em", height: "1em", paddingRight: "1rem" }} fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40"><g><path d="m12.3 13l7.7 7.7 7.7-7.7 2.3 2.4-10 10-10-10z"></path></g></svg>
        <span>{this.props.name}</span>
      </div>
      {this.props.expanded &&
        <div>
          {this.props.children}
        </div>
      }
    </div>;
  }
}
