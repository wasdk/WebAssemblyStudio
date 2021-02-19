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

export interface MarkdownProps {
  src: string;
}

export class Markdown extends React.Component<MarkdownProps, {
  html: string
}> {
  constructor(props: MarkdownProps) {
    super(props);
    this.state = {
      html: "Loading ..."
    };
  }
  async componentDidMount() {
    const html = await Service.compileMarkdownToHtml(this.props.src);
    this.setState({html});
  }
  async componentWillReceiveProps(props: MarkdownProps) {
    if (this.props.src !== props.src) {
      const html = await Service.compileMarkdownToHtml(props.src);
      this.setState({html});
    }
  }
  render() {
    return <div style={{padding: "8px", height: "100%", overflow: "scroll"}} className="md" dangerouslySetInnerHTML={{__html: this.state.html}}/>;
  }
}

export interface MarkdownViewProps {
  view: View;
}

export class MarkdownView extends React.Component<MarkdownViewProps, {
  markdown: string;
}> {
  constructor(props: MarkdownViewProps) {
    super(props);
    this.state = {
      markdown: this.props.view.file.buffer.getValue()
    };
  }
  onDidChangeBuffer = () => {
    this.setState({
      markdown: this.props.view.file.buffer.getValue()
    });
  }
  componentDidMount() {
    this.props.view.file.onDidChangeBuffer.register(this.onDidChangeBuffer);
  }
  componentWillUnmount() {
    this.props.view.file.onDidChangeBuffer.unregister(this.onDidChangeBuffer);
  }
  componentWillReceiveProps(props: MarkdownViewProps) {
    const last = this.props.view;
    const next = props.view;
    if (last !== next) {
      last.file.onDidChangeBuffer.unregister(this.onDidChangeBuffer);
      next.file.onDidChangeBuffer.register(this.onDidChangeBuffer);
      this.setState({
        markdown: props.view.file.buffer.getValue()
      });
    }
  }
  render() {
    return <Markdown src={this.state.markdown}/>;
  }
}
