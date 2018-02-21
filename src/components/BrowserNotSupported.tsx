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

export class BrowserNotSupported extends React.Component<{
}, {
  }> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return <ReactModal
      isOpen={true}
      contentLabel="Browser Not Supported"
      className="modal"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="modal-title-bar">
        Browser Version Not Supported
      </div>
      <div className="browser-not-supported-description">
        <a href="https://developer.mozilla.org/en-US/docs/WebAssembly">WebAssembly</a> is not available in your browser. Please try using the latest version of Edge, Safari, Chrome or Firefox.
      </div>
    </div>
    </ReactModal>;
  }
}
