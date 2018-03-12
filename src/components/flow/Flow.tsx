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
import { Node, Port, IPoint, PORT_HEIGHT, PortKind, IGraph, serializeGraph, deserializeGraph, Point, Line } from "./flows";
import { EdgeView } from "./Edge";
import { NodeView } from "./Node";
import { SliceTool, ZoomTool } from "../shared/Icons";

export class FlowViewDragState {
  constructor(
    public from: Point,
    public translate: Point) {
    // Nop;
  }
}

export class FlowViewPanState {
  constructor(
    public origin: Point,
    public matrix: SVGMatrix) {
    // Nop;
  }
}

export class FlowViewSliceEdgeState {
  constructor(
    public from: Point,
    public to: Point) {
    // Nop;
  }
}

export class FlowViewsSelectNodeState {
  constructor(
    public from: Point,
    public to: Point) {
    // Nop;
  }
}

export interface TransformProvider {
  clientToWorld(p: Point): Point;
}

const tmpSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");

export interface FlowProps {
  graph: IGraph;
  onChange?(graph: IGraph): void;
}

export class Flow extends React.Component<FlowProps, {
  fromPort: Port;
  toPortOrPoint: Port | IPoint;
  matrix: SVGMatrix;
  panState: FlowViewPanState;
  sliceEdgeState: FlowViewSliceEdgeState;
  selectNodeState: FlowViewsSelectNodeState;
}> {
  static defaultProps: FlowProps = {
    graph: null,
    // tslint:disable-next-line:no-empty
    onChange: () => {}
  };

  roots: Node [];

  constructor(props: any) {
    super(props);
    try {
      this.roots = deserializeGraph(this.props.graph);
    } catch (e) {
      console.error(e);
      this.roots = [];
    }
    this.state = {
      fromPort: null,
      toPortOrPoint: {x: 0, y: 0},
      matrix: tmpSVG.createSVGMatrix(),
      panState: null,
      sliceEdgeState: null,
      selectNodeState: null
    };
  }
  componentWillReceiveProps(props: FlowProps) {
    if (this.onChangeTimeout) {
      console.log("TODO: Why am I being re-rendered?");
      return;
    }
    try {
      this.roots = deserializeGraph(props.graph);
    } catch (e) {
      console.error(e);
      this.roots = [];
    }
    this.forceUpdate();
  }
  onChangeTimeout: any = 0;
  throttleOnChange() {
    if (this.onChangeTimeout) {
      clearTimeout(this.onChangeTimeout);
    }
    this.onChangeTimeout = setTimeout(() => {
      this.props.onChange(serializeGraph(this.roots));
      this.onChangeTimeout = 0;
    }, 1000);
  }
  svg: SVGSVGElement = null;
  svgGroup: SVGSVGElement = null;
  svgPoint: SVGPoint = tmpSVG.createSVGPoint();
  onWheel = (e: any) => {
    const scale = e.deltaY < 0 ? 0.98 : 1.02;
    const origin = this.clientToWorld(new Point(e.clientX, e.clientY));
    let matrix = this.state.matrix;
    matrix = matrix.translate(origin.x, origin.y);
    matrix = matrix.scale(scale);
    matrix = matrix.translate(-origin.x, -origin.y);
    this.setState({matrix});
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseMove = (e: MouseEvent) => {
    const { panState, sliceEdgeState, selectNodeState } = this.state;
    if (sliceEdgeState) {
      sliceEdgeState.to = new Point(e.clientX, e.clientY);
      this.forceUpdate();
      return;
    } else if (selectNodeState) {
      selectNodeState.to = new Point(e.clientX, e.clientY);
      this.forceUpdate();
    }

    if (panState) {
      const offset = new Point(e.clientX, e.clientY).sub(panState.origin);
      offset.x /= panState.matrix.a;
      offset.y /= panState.matrix.d;
      this.setState({matrix: panState.matrix.translate(offset.x, offset.y)});
    }
    return;
  }

  onMouseUp = (e: MouseEvent) => {
    const { sliceEdgeState } = this.state;
    if (sliceEdgeState && sliceEdgeState.from && sliceEdgeState.to) {
      const sliceEdgeLine = new Line(
        this.clientToWorld(sliceEdgeState.from),
        this.clientToWorld(sliceEdgeState.to)
      );
      this.roots.forEach((root) => {
        root.visit(null, (edge) => {
          const from = edge.from.getPosition(false, "edge");
          const to = edge.to.getPosition(false, "edge");
          if (sliceEdgeLine.intersects(new Line(from, to))) {
            edge.delete();
          }
        }, null);
      });
    }

    this.setState({
      panState: null
    });
  }

  onMouseDown = (e: MouseEvent) => {
    if (this.state.sliceEdgeState) {
      this.state.sliceEdgeState.from = new Point(e.clientX, e.clientY);
      this.forceUpdate();
      return;
    } else if (this.state.selectNodeState) {
      this.state.selectNodeState.from = new Point(e.clientX, e.clientY);
      this.forceUpdate();
      return;
    }
    this.setState({
      panState: new FlowViewPanState(new Point(e.clientX, e.clientY), this.state.matrix)
    });
    return;
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "c") {
      if (this.state.sliceEdgeState) {
        return;
      }
      this.setState({
        sliceEdgeState: new FlowViewSliceEdgeState(null, null)
      });
    } else if (e.key === "s") {
      if (this.state.selectNodeState) {
        return;
      }
      this.setState({
        selectNodeState: new FlowViewsSelectNodeState(null, null)
      });
    } else {
      this.setState({
        sliceEdgeState: null,
        selectNodeState: null
      });
    }
  }

  onKeyUp  = (e: KeyboardEvent) => {
    this.setState({
      sliceEdgeState: null,
      selectNodeState: null
    });
  }

  setSVGGroup(ref: SVGSVGElement) {
    this.svgGroup = ref;
  }
  setSVG(ref: SVGSVGElement) {
    if (ref) {
      ref.addEventListener("wheel", this.onWheel);
    } else {
      this.svg.removeEventListener("wheel", this.onWheel);
    }
    this.svg = ref;
  }
  /**
   * Client coordinates to world coordinates. Use this to map clientX/Y to world
   * coordinates.
   */
  clientToWorld(p: Point): Point {
    this.svgPoint.x = p.x;
    this.svgPoint.y = p.y;
    const point = this.svgPoint.matrixTransform(this.svgGroup.getScreenCTM().inverse());
    return new Point(point.x, point.y);
  }

  clientToOffset(p: Point): Point {
    const bounds = this.svg.getBoundingClientRect();
    return p.sub(new Point(bounds.left, bounds.top));
  }
  clientToSVGPoint(pt: IPoint): Point {
    this.svgPoint.x = pt.x;
    this.svgPoint.y = pt.y;
    const point = this.svgPoint.matrixTransform(this.svgGroup.getScreenCTM().inverse());
    return new Point(point.x, point.y);
  }
  componentDidMount() {
    document.addEventListener("mousemove", this.onMouseMove as any);
    document.addEventListener("mouseup", this.onMouseUp);

    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }
  componentWillUnmount() {
    document.removeEventListener("mousemove", this.onMouseMove as any);
    document.removeEventListener("mouseup", this.onMouseUp);

    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
  }
  renderSliceEdgeTool() {
    const { sliceEdgeState } = this.state;
    if (sliceEdgeState && sliceEdgeState.from && sliceEdgeState.to) {
      const from = this.clientToOffset(sliceEdgeState.from);
      const to = this.clientToOffset(sliceEdgeState.to);
      const dx = (to.x - from.x) >= 0 ? -20 : 0;
      const dy = -20; // (to.y - from.y) >= 0 ? -20 : 0;
      return <g>
        <g transform={`translate(${from.x + dx}, ${from.y + dy})`}>
          <SliceTool/>
        </g>
        <path
          className="slice-edge-tool"
          d={`M${from.x} ${from.y} L ${to.x} ${to.y}`}
        />;
      </g>;
    }
    return null;
  }
  renderSelectNodeTool() {
    const { selectNodeState } = this.state;
    if (selectNodeState && selectNodeState.from && selectNodeState.to) {
      const from = this.clientToOffset(selectNodeState.from);
      const to = this.clientToOffset(selectNodeState.to);
      console.log(from, to);
      return <g>
        <path
          className="select-node-tool"
          d={`M${from.x} ${from.y} H ${to.x} V ${to.y} H ${from.x} L${from.x} ${from.y}`}
        />
      </g>;
    }
    return null;
  }
  render() {
    const { sliceEdgeState } = this.state;
    let sliceEdgeLine: Line = null;
    if (sliceEdgeState && sliceEdgeState.from && sliceEdgeState.to) {
      sliceEdgeLine = new Line(
        this.clientToWorld(sliceEdgeState.from),
        this.clientToWorld(sliceEdgeState.to)
      );
    }
    const transformProvider: TransformProvider = {
      clientToWorld: this.clientToWorld.bind(this)
    };
    let edge: any = null;
    if (this.state.fromPort) {
      edge = <EdgeView
        forward={this.state.fromPort.kind === PortKind.Out}
        from={this.state.fromPort.getPosition(false, "edge")}
        to={this.state.toPortOrPoint as any}
      />;
    }
    const nodes: any [] = [];
    const edges: any [] = [];
    this.roots.forEach((root) => {
      root.visit(null,
        (edge) => {
          const from = edge.from.getPosition(false, "edge");
          const to = edge.to.getPosition(false, "edge");
          edges.push(<EdgeView
            forward={edge.from.kind === PortKind.Out}
            highlightCut={sliceEdgeLine && sliceEdgeLine.intersects(new Line(from, to))}
            from={from}
            to={to}
          />);
        },
        (node) => {
          nodes.push(<NodeView
            transformProvider={transformProvider}
            node={node}
            onMove={(x, y) => {
              node.x = x;
              node.y = y;
              this.forceUpdate();
              this.throttleOnChange();
            }}
            onChange={() => {
              this.forceUpdate();
              this.throttleOnChange();
            }}
            onBeginEdge={(from: Port, to: Port | IPoint) => {
              this.setState({
                fromPort: from,
                toPortOrPoint: to
              });
            }}
            onMoveEdge={(from: Port, to: Port | IPoint) => {
              this.setState({
                fromPort: from,
                toPortOrPoint: to
              });
            }}
            onEndEdge={(from: Port, to: Port) => {
              if (to) {
                from.connectTo(to, true);
                this.throttleOnChange();
              }
              this.setState({
                fromPort: null, toPortOrPoint: null
              });
            }}
          />);
        }
      );
    });

    const { matrix } = this.state;
    let className = "flow";
    if (this.state.panState) {
      className += " pan";
    }

    return <div className={className} style={{width: "100%", height: "100%"}}>
      <svg ref={(ref) => this.setSVG(ref)} width={"100%"} height={"100%"} onMouseDown={this.onMouseDown as any}>
        <g ref={(ref) => this.setSVGGroup(ref as any)} transform={svgMatrixToString(matrix)}>
          {edges}
          {edge}
          {nodes}
        </g>
        {this.renderSliceEdgeTool()}
        {this.renderSelectNodeTool()}
      </svg>
    </div>;
  }
}

function svgMatrixToString(matrix: SVGMatrix) {
  return `matrix(${matrix.a}, ${matrix.b}, ${matrix.c}, ${matrix.d}, ${matrix.e}, ${matrix.f})`;
}

// <defs>
//   <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
//     <path d="M 8 0 L 0 0 0 8" fill="none" stroke="black" stroke-width="0.5"/>
//   </pattern>
//   <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
//     <rect width="80" height="80" fill="url(#smallGrid)"/>
//     <path d="M 80 0 L 0 0 0 80" fill="none" stroke="black" stroke-width="1"/>
//   </pattern>
// </defs>
// <rect x={-500000} y={-500000} width={1000000} height={1000000} fill="url(#grid)" />
