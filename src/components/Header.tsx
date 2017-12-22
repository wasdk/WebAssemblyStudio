import * as React from "react";

export class Header extends React.Component<{}, {}> {
  render() {
    return <div className="wasmStudioHeader">
      {/* <img className="waIcon" src="img/web-assembly-icon-white-64px.png"/> */}
      <span className="waHeaderText">Web Assembly Studio</span>
    </div>;
  }
}