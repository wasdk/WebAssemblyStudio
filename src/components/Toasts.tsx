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
