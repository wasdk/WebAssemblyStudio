import * as React from "react";
import { Button } from "./Button";
import { GoX } from "./Icons";

export class ToastContainer extends React.Component<{}, {
    toasts: JSX.Element[]
}> {
  constructor(props?: any) {
    super(props);
    this.state = {
        toasts: []
    };
  }

  showToast(message: JSX.Element) {
    this.setState((prevState: any) => ({
      toasts: [...prevState.toasts, message]
    }));
  }

  _onToastDismiss(index: number) {
    this.setState((prevState: any) => ({
      toasts: prevState.toasts.filter((key: number, value: number) => value !== index )
    }));
  }

  render() {
    return  this.state.toasts.length > 0 &&
      <div className="toast-container">
        {this.state.toasts.map((toast: JSX.Element, key: number) =>
          <Toast
            onDismiss={this._onToastDismiss.bind(this, key)}
            key={key}
            message={toast}
          />
        )}
      </div>;
  }
}

class Toast extends React.Component<{
  message: JSX.Element;
  onDismiss: Function;
}, {}> {
  render() {
    const {message, onDismiss} = this.props;
    return <div className="toast">
      <div className="toast-header">
        {message}
      <Button icon={<GoX />} customClassName={"button-toast"} label="Dismiss" title="Dismiss" onClick={onDismiss} />
      </div>
    </div>;
  }
}
