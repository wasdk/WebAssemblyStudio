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

import { Port, IPoint, PORT_HEIGHT, PortKind, Point } from "./flows";
import * as React from "react";
import { ChangeEvent } from "react";
import { TransformProvider } from "./Flow";

const tmpCanvas: HTMLCanvasElement = document.createElement("canvas");
const tmpCanvasCtx = tmpCanvas.getContext("2d");

function measureTextWidth(font: string, text: string) {
  tmpCanvasCtx.font = font;
  return tmpCanvasCtx.measureText(text).width;
}

export interface PortViewProps {
  x: number;
  y: number;
  port: Port;
  transformProvider: TransformProvider;

  onChange?(): void;
  onBeginEdge?(from: Port, to: IPoint): void;
  onMoveEdge?(from: Port, to: IPoint): void;
  onEndEdge?(from: Port, to: Port): void;
}

export class PortViewDrawState {
  constructor() {
    // Nop;
  }
}

export class PortView extends React.Component<PortViewProps, {
  drawState: PortViewDrawState
  hover: boolean;
}> {
  static toPort: Port;
  constructor(props: PortViewProps) {
    super(props);
    this.state = {
      drawState: null,
      hover: false
    };
  }
  onMouseMove = (e: MouseEvent) => {
    const { drawState } = this.state;
    if (!drawState) {
      return;
    }
    if (PortView.toPort) {
      this.props.onMoveEdge(this.props.port, {x: 0, y: 0});
      this.props.onMoveEdge(
        this.props.port,
        PortView.toPort.getPosition()
      );
    } else {
      this.props.onMoveEdge(
        this.props.port,
        this.props.transformProvider.clientToWorld(new Point(e.clientX, e.clientY))
      );
    }
    e.stopPropagation();
    return;
  }

  onMouseEnter = (e: MouseEvent) => {
    PortView.toPort = this.props.port;
    this.setState({hover: true});
  }

  onMouseLeave = (e: MouseEvent) => {
    PortView.toPort = null;
    this.setState({hover: false});
  }

  onMouseUp = (e: MouseEvent) => {
    const { drawState } = this.state;
    if (drawState) {
      this.props.onEndEdge(this.props.port, PortView.toPort);
    }
    this.setState({
      drawState: null
    });
    e.stopPropagation();
  }

  onMouseDown = (e: MouseEvent) => {
    this.props.onBeginEdge(
      this.props.port,
      this.props.transformProvider.clientToWorld(new Point(e.clientX, e.clientY))
    );
    this.setState({
      drawState: new PortViewDrawState()
    });
    e.stopPropagation();
    return;
  }

  componentDidMount() {
    document.addEventListener("mousemove", this.onMouseMove as any);
    document.addEventListener("mouseup", this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.onMouseMove as any);
    document.removeEventListener("mouseup", this.onMouseUp);
  }

  onChangeValue = (event: ChangeEvent<any>) => {
    this.props.port.setValue(event.target.value);
    this.props.onChange();
  }

  render() {
    const { port } = this.props;
    const margin = 10;
    const dy = -PORT_HEIGHT / 2;
    const textAnchor = port.kind === PortKind.In ? "start" : "end";
    const textDx = port.kind === PortKind.In ? 10 : -10;
    let highlight = !!(port.kind === PortKind.In ? port.ins.length : port.outs.length);
    if (this.state.hover) {
      highlight = true;
    }
    let flowPortClassName = "flow-port";
    if (port.totalEdgeCount() === 0) {
      flowPortClassName += " not-connected";
    }
    return <g className={flowPortClassName} transform={`translate(${this.props.x},${this.props.y})`}>
      <rect className="port-capture" x="-10" y={-PORT_HEIGHT / 2} width="20" height="24" onMouseDown={this.onMouseDown as any} onMouseEnter={this.onMouseEnter as any} onMouseLeave={this.onMouseLeave as any}/>
      <text className="port-name" x={textDx} y={0} alignment-baseline="middle" text-anchor={textAnchor}>
        {port.name}
      </text>
      <circle className="port-bump" cx="0" cy="0" r="4" onMouseDown={this.onMouseDown as any}/>
      {highlight && <circle className="port-bump-fill" cx="0" cy="0" r="2" onMouseDown={this.onMouseDown as any}/>}
    </g>;
  }
}
