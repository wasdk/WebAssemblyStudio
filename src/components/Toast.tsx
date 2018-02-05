import * as React from "react";
import { Button } from "./Button";
import { GoX } from "./Icons";

export class Toast extends React.Component<{
  onDismiss: Function;
  message: JSX.Element;
}, {
  }> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return   <div className="toast">
        <div className="toast-header">
          {this.props.message}
                <Button icon={<GoX />} customClassName={"button-toast"} label="Dismiss" title="Dismiss" onClick={this.props.onDismiss} />
        </div>
    </div>;
  }
}
