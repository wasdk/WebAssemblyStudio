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
=======
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
