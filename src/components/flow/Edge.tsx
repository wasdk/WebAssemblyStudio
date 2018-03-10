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
import { IPoint } from "./flows";

export interface EdgeViewProps {
  forward: boolean;
  from: IPoint;
  to: IPoint;
}

export class EdgeView extends React.Component<EdgeViewProps, {
}> {
  constructor(props: EdgeViewProps) {
    super(props);
  }
  render() {
    const { forward, from, to } = this.props;
    const force = Math.abs(to.x - from.x) / 1.6;
    let offset = 10;
    if (!forward) {
      offset *= -1;
    }
    return <path
      className="flow-edge"
      // d={`M${x0} ${y0} h ${offset} C ${x0 + force} ${y0}, ${x1 - offset - force} ${y1}, ${x1 - offset} ${y1} h ${offset}`}
      d={`M${from.x} ${from.y} h ${offset} L ${to.x - offset} ${to.y} h ${offset}`}
      stroke="white"
      fill="transparent"
    />;
  }
}