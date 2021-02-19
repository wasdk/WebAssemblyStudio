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
import { View } from "./editor";

export const colors = [
  "#ead780", "#efb8f6", "#89ee39", "#bbc3fe", "#cbed3a",
  "#d0cdee", "#7aec58", "#f2bcd5", "#35ed72", "#cbd5e7",
  "#e2de49", "#79d8f6", "#f3c63e", "#66e9de", "#bee869",
  "#e6cdc7", "#71ec77", "#f3bea5", "#67eb8f", "#edca95",
  "#53efb6", "#ebe8c8", "#a0eb7f", "#b3e1e0", "#d3e484",
  "#8de6c0", "#bfee98", "#c0e0c5", "#88e99a", "#cee1a8",
  "#8be8ad", "#a6e0a3"
];

export interface BinaryViewProps {
  view: View;
}

function toHex(n: number, width: number) {
  let s = n.toString(16).toUpperCase();
  while (s.length < width) {
    s = "0" + s;
  }
  return s;
}

export class BinaryView extends React.Component<BinaryViewProps, {
  data: ArrayBuffer;
}> {
  constructor(props: BinaryViewProps) {
    super(props);
    const data = this.props.view.file.getData() as ArrayBuffer;
    this.state = { data };
  }
  onDidChangeData = () => {
    const data = this.props.view.file.getData() as ArrayBuffer;
    this.setState({ data, });
  }
  componentDidMount() {
    this.props.view.file.onDidChangeData.register(this.onDidChangeData);
  }
  componentWillUnmount() {
    this.props.view.file.onDidChangeData.unregister(this.onDidChangeData);
  }
  componentWillReceiveProps(props: BinaryViewProps) {
    const last = this.props.view;
    const next = props.view;
    if (last !== next) {
      last.file.onDidChangeData.unregister(this.onDidChangeData);
      next.file.onDidChangeData.register(this.onDidChangeData);
    }
  }
  render() {
    const data = new Uint8Array(this.state.data);
    const perRow = 16;
    const rowCount = Math.max(1, Math.ceil(data.length / perRow));
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      const rowOffset = i * perRow;
      const colCount = Math.min(data.length - rowOffset, perRow);
      const cols = [];
      let str = "";
      for (let j = 0; j < colCount; j++) {
        const b = data[rowOffset + j];
        cols.push(<span className="byte" key={"col" + j} style={{color: colors[b & 0x1F]}}>{toHex(b, 2)}</span>);
        str += b >= 32 && b < 127 ? String.fromCharCode(b) : ".";
      }
      rows.push(
        <div className="row" key={"row" + i}>
          <div>
            <span className="address">{"0x" + toHex(rowOffset, 8)}</span>
            <span className="bytes">{cols}</span>
            <span>{str}</span>
          </div>
        </div>
      );
    }
    return <div className="binary">
      {rows}
    </div>;
  }
}
