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
import { Button } from "./shared/Button";
import { GoX } from "./shared/Icons";
import { TextInputBox } from "./Widgets";

export class CallContractDialog extends React.Component<{
  isOpen: boolean;
  address: string;
  onCancel: () => void;
}, {
  }> {
  constructor(props: any) {
    super(props);
    this.state = {
    };
  }

  render() {
    const urlPrefix = `${location.protocol}//${location.host}${location.pathname}`;
    return <ReactModal
      isOpen={this.props.isOpen}
      contentLabel="Call Contract"
      className="modal"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="modal-title-bar">
          Call Contract
        </div>
        <div style={{ flex: 1, padding: "8px" }}>
          <p>Contract address: <b>{this.props.address}</b></p>
          <Button
            label=" Call this contract "
            title="Go to DevTools to call contract"
            onClick={() => {
              this.props.onCancel();
              const url = "https://devtools.icetea.io/contract.html?address=" + this.props.address
              const win = window.open(url, '_blank');
              win.focus();
            }}
            />
        </div>
        <div>
          <Button
            icon={<GoX />}
            label="Cancel"
            title="Cancel"
            onClick={() => {
              this.props.onCancel();
            }}
          />
        </div>
      </div>
    </ReactModal>;
  }
}
