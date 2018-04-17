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
import appStore from "../stores/AppStore";

export class StatusBar extends React.Component<{}, {
  hasStatus: boolean;
  status: string;
}> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasStatus: false,
      status: ""
    };
  }
  onDidChangeStatus = () => {
    this.setState({
      hasStatus: appStore.hasStatus(),
      status: appStore.getStatus()
    });
  }
  componentDidMount() {
    appStore.onDidChangeStatus.register(this.onDidChangeStatus);
  }
  componentWillUnmount() {
    appStore.onDidChangeStatus.unregister(this.onDidChangeStatus);
  }
  render() {
    let className = "status-bar";
    if (this.state.hasStatus) {
      className += " active";
    }
    return <div className={className}>
      <div className="status-bar-item">
        {this.state.status}
      </div>
    </div>;
  }
}
