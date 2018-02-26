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
import { Service } from "../service";
import { View } from "./editor";

declare const Viz: any;

export interface VizViewProps {
  view: View;
}

const updateThrottleDuration = 500;
export class VizView extends React.Component<VizViewProps> {
  updateTimeout = 0;
  onDidChangeBuffer = () => {
    if (this.updateTimeout) {
      window.clearTimeout(this.updateTimeout);
    }
    this.updateTimeout = window.setTimeout(() => {
      this.updateTimeout = 0;
      this.forceUpdate();
    }, updateThrottleDuration);
  }
  async componentWillMount() {
    if (typeof Viz === "undefined") {
      await Service.lazyLoad("lib/viz-lite.js");
      this.forceUpdate();
    }
  }
  componentDidMount() {
    this.props.view.file.onDidChangeBuffer.register(this.onDidChangeBuffer);
  }
  componentWillUnmount() {
    this.props.view.file.onDidChangeBuffer.unregister(this.onDidChangeBuffer);
  }
  componentWillReceiveProps(props: VizViewProps) {
    const last = this.props.view;
    const next = props.view;
    if (last !== next) {
      last.file.onDidChangeBuffer.unregister(this.onDidChangeBuffer);
      next.file.onDidChangeBuffer.register(this.onDidChangeBuffer);
    }
  }
  render() {
    if (typeof Viz === "undefined") {
      return <div>Loading GraphViz, please wait ...</div>;
    }
    try {
      const svg = Viz(this.props.view.file.buffer.getValue());
      return <div style={{width: "100%", height: "100%", overflow: "scroll"}} dangerouslySetInnerHTML={{__html: svg}}/>;
    } catch (e) {
      return <div>GraphViz Error</div>;
    }
  }
}
