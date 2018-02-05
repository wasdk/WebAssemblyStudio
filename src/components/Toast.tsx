import * as React from "react";
import * as ReactModal from "react-modal";
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
    return <ReactModal
      isOpen={true}
      contentLabel="Gist Created"
      className="toast-container"
      ariaHideApp={false}
      overlayClassName="toast-overlay"
    >
      <div className="toast">
        <div className="modal-title-bar toast-title">
          {this.props.message}
        </div>
        <div className={"button-toast-container"}>
          <Button icon={<GoX />} customClassName={"button-toast"} label="Dismiss" title="Dismiss" onClick={this.props.onDismiss} />
        </div>
      </div>
    </ReactModal>;
  }
}
