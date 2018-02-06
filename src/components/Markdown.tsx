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

export interface MarkdownProps {
  src: string;
}

export class Markdown extends React.Component<MarkdownProps, {
  html: string
}> {
  constructor(props: any) {
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
    return <div style={{padding: "8px"}} className="md" dangerouslySetInnerHTML={{__html: this.state.html}}/>;
  }
}
