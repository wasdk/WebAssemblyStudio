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

export class ShareDialog extends React.Component<{
  isOpen: boolean;
  fiddle: string;
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
      contentLabel="Share Project"
      className="modal"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="modal-title-bar">
          Share Project
        </div>
        <div style={{ flex: 1, padding: "8px" }}>
          <TextInputBox label="URL" value={`${urlPrefix}?f=${this.props.fiddle}`}/>
          <TextInputBox label="IFrame" value={`<iframe src="${urlPrefix}?embed&f=${this.props.fiddle}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`}/>
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
