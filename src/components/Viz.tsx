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

function isVizLoaded() {
  return typeof Viz !== "undefined";
}

async function loadViz(): Promise<any> {
  await Service.lazyLoad("lib/viz-lite.js");
}

export interface VizViewProps {
  view: View;
}

export class VizView extends React.Component<VizViewProps, {
  isVizLoaded: boolean;
  content: string;
}> {
  constructor(props: VizViewProps) {
    super(props);
    this.state = {
      isVizLoaded: isVizLoaded(),
      content: this.props.view.file.buffer.getValue(),
    };
  }
  updateThrottleDuration = 500;
  updateTimeout = 0;
  onDidChangeBuffer = () => {
    if (this.updateTimeout) {
      window.clearTimeout(this.updateTimeout);
    }
    this.updateTimeout = window.setTimeout(() => {
      this.updateTimeout = 0;
      this.setState({
        content: this.props.view.file.buffer.getValue(),
      });
    }, this.updateThrottleDuration);
  }
  async componentWillMount() {
    if (!this.state.isVizLoaded) {
      await loadViz();
      this.setState({
        isVizLoaded: isVizLoaded(),
      });
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
    if (!this.state.isVizLoaded) {
      return <div>Loading GraphViz, please wait ...</div>;
    }
    try {
      const svg = Viz(this.state.content);
      return <div style={{width: "100%", height: "100%", overflow: "scroll"}} dangerouslySetInnerHTML={{__html: svg}}/>;
    } catch (e) {
      return <div>GraphViz Error</div>;
    }
  }
}
