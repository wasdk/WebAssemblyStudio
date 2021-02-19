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
import * as ReactModal from "react-modal";
import { Logger } from "../utils/Logger";
import { Button } from "./shared/Button";
import { GoOpenIssue, GoSync } from "./shared/Icons";

export interface ErrorBoundaryProps {
}

export interface ErrorBoundaryState {
  error: any;
  info: any;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, info: null };
  }
  componentDidCatch(error: any, info: any) {
    this.setState({ error, info });
    Logger.captureException(error, { extra: info });
  }
  getNewIssueUrl() {
    const id = Logger.getLastEventId();
    return `https://github.com/wasdk/WebAssemblyStudio/issues/new?body=Error%20ID:%20${id}`;
  }
  getStackTrace() {
    return this.state.info.componentStack
      .split("\n")
      .map((line: string, i: any) => (
        <span key={`stacktrace-line-${i}`} className="error-dialog-stacktrace-line">{line}</span>
      ));
  }
  render() {
    if (this.state.error) {
      return (
        <ReactModal
          isOpen={true}
          contentLabel="An error occured"
          className="modal"
          overlayClassName="overlay"
          ariaHideApp={false}
        >
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div className="modal-title-bar">An error occured</div>
            <div className="error-dialog-description">
              <p>
                An error occured in WebAssembly Studio.
                The error has been logged and will be investigated as soon as possible.
                Please open an issue on Github for further support.
              </p>
              <div className="error-dialog-stacktrace">
                <span className="error-dialog-stacktrace-title">Error: {this.state.error.message}</span>
                {this.getStackTrace()}
              </div>
              <span className="error-dialog-error-id">Error ID: {Logger.getLastEventId()}</span>
            </div>
            <div>
              <Button
                icon={<GoSync />}
                label="Reload"
                title="Reload"
                href="https://webassembly.studio/"
              />
              <Button
                icon={<GoOpenIssue />}
                label="Open Issue on Github"
                title="Open Issue on Github"
                href={this.getNewIssueUrl()}
                target="_blank"
                rel="noopener noreferrer"
              />
            </div>
          </div>
        </ReactModal>
      );
    } else {
      return this.props.children;
    }
  }
}
