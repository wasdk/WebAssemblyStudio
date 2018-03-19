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
import { Button } from "./shared/Button";
import { GoX } from "./shared/Icons";

export declare type ToastKind = "info" | "error" | "warning";

export class ToastContainer extends React.Component<{}, {
  toasts: Array<{message: JSX.Element, kind: ToastKind}>
}> {
  constructor(props?: any) {
    super(props);
    this.state = {
      toasts: []
    };
  }

  showToast(message: JSX.Element, kind: ToastKind = "info") {
    const { toasts } = this.state;
    toasts.push({message, kind});
    this.setState({toasts});
  }

  private onDismiss(index: number) {
    this.setState((prevState: any) => ({
      toasts: prevState.toasts.filter((key: number, value: number) => value !== index )
    }));
  }

  render() {
    if (this.state.toasts.length === 0) {
      return null;
    }
    return <div className="toast-container">
      {this.state.toasts.map((toast, key: number) =>
        <Toast
          onDismiss={this.onDismiss.bind(this, key)}
          key={key}
          message={toast.message}
          kind={toast.kind}
        />
      )}
    </div>;
  }
}

export interface ToastProps {
  message: JSX.Element;
  kind?: ToastKind;
  onDismiss: Function;
}

export class Toast extends React.Component<ToastProps, {}> {
  static defaultProps: ToastProps = {
    message: null,
    kind: "info",
    // tslint:disable-next-line
    onDismiss: () => {}
  };
  render() {
    const {message, onDismiss} = this.props;
    const className = "toast " + this.props.kind;
    return <div className={className}>
      <div className="toast-header">
        {message}
      <Button icon={<GoX />} customClassName={"button-toast"} label="Dismiss" title="Dismiss" onClick={onDismiss} />
      </div>
    </div>;
  }
}
