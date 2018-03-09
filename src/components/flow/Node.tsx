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
import { assert } from "../../util";
import { ViewTabs, View } from "../editor";
import { File, FileType } from "../../model";
import { ViewType } from "../editor/View";
import { Split, SplitOrientation } from "../Split";
import registerLanguages from "../../utils/registerLanguages";
import { ChangeEvent } from "react";

const PORT_HEIGHT = 24;
const PORT_HEIGHT_PADDING = 4;
// const PORT_WIDTH = 64;

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
}> {
  static toPort: Port;
  constructor(props: PortViewProps) {
    super(props);
    this.state = {
      drawState: null
    };
  }
  onMouseMove = (e: MouseEvent) => {
    const { drawState } = this.state;
    if (!drawState) {
      return;
    }
    this.props.onMoveEdge(this.props.port, {x: e.pageX, y: e.pageY});
    return;
  }

  onMouseEnter = (e: MouseEvent) => {
    PortView.toPort = this.props.port;
  }

  onMouseLeave = (e: MouseEvent) => {
    PortView.toPort = null;
  }

  onMouseUp = (e: MouseEvent) => {
    const { drawState } = this.state;
    if (drawState) {
      this.props.onEndEdge(this.props.port, PortView.toPort);
    }
    this.setState({
      drawState: null
    });
  }

  onMouseDown = (e: any) => {
    this.props.onBeginEdge(this.props.port, {x: e.pageX, y: e.pageY});
    this.setState({
      drawState: new PortViewDrawState()
    });
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
    let dx;
    const margin = 10;
    const dy = -PORT_HEIGHT / 2;
    const w = ((port.node.width - 2 * margin) / 2) | 0;
    if (port.kind === PortKind.In) {
      dx = 10;
    } else {
      dx = -w - 10;
    }
    let nameWidth = measureTextWidth("11px system-ui", port.name || "");
    nameWidth = Math.round((nameWidth + 7) / 8) * 8;
    const name = <div
      className="name"
      style={{
        height: PORT_HEIGHT + "px",
        width: nameWidth + "px",
        lineHeight: PORT_HEIGHT + "px"
      }}
    >
      {port.name}
    </div>;
    let edit;
    if (port.type === "boolean") {
      edit = <div className="edit">
        <select>
          <option>True</option>
          <option>False</option>
        </select>
      </div>;
    } else if (port.type === "number") {
      edit = <div className="edit">
        <input type="text" value={String(port.value)} onChange={this.onChangeValue}/>
      </div>;
    } else {
      // edit = <div className="edit"/>;
    }
    return <g className="flow-port" transform={`translate(${this.props.x},${this.props.y})`}>
      <foreignObject x={dx} y={dy} width={w} height={PORT_HEIGHT}>
        <div className={"name-edit-container " + (port.kind === PortKind.In ? "in" : "out")}>
          {port.kind === PortKind.In ? [name, edit] : [edit, name]}
        </div>
      </foreignObject>
      <circle className="flow-port-bump" cx="0" cy="0" r="5" onMouseDown={this.onMouseDown} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}/>
    </g>;
  }
}

export interface NodeViewProps {
  node: Node;
  onMove(x: number, y: number): void;
  onChange(): void;
  onBeginEdge?(from: Port, to: IPoint): void;
  onMoveEdge?(from: Port, to: IPoint): void;
  onEndEdge?(from: Port, to: Port): void;
}

export class NodeViewDragState {
  constructor(public dx: number, public dy: number) {
    // Nop;
  }
}

export class NodeView extends React.Component<NodeViewProps, {
  dragState: NodeViewDragState
}> {
  constructor(props: NodeViewProps) {
    super(props);
    this.state = {
      dragState: null
    };
  }
  static defaultProps: NodeViewProps = {
    node: null,
    // tslint:disable-next-line:no-empty
    onMove: () => {},
    // tslint:disable-next-line:no-empty
    onChange: () => {},
    // tslint:disable-next-line:no-empty
    onBeginEdge: () => {},
    // tslint:disable-next-line:no-empty
    onMoveEdge: () => {},
    // tslint:disable-next-line:no-empty
    onEndEdge: () => {}
  };

  componentDidMount() {
    document.addEventListener("mousemove", this.onMouseMove as any);
    document.addEventListener("mouseup", this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.onMouseMove as any);
    document.removeEventListener("mouseup", this.onMouseUp);
  }

  onMouseMove = (e: MouseEvent) => {
    const { dragState } = this.state;
    if (!dragState) {
      return;
    }
    const dx = e.pageX - this.props.node.x;
    const dy = e.pageY - this.props.node.y;
    this.props.onMove(this.props.node.x + dx - dragState.dx, this.props.node.y + dy - dragState.dy);
    return;
  }

  onMouseUp = (e: MouseEvent) => {
    this.setState({
      dragState: null
    });
  }

  onMouseDown = (e: any) => {
    const dx = e.pageX - this.props.node.x;
    const dy = e.pageY - this.props.node.y;
    this.setState({
      dragState: new NodeViewDragState(dx, dy)
    });
    return;
  }

  render() {
    const { node } = this.props;
    const ins = node.ins.map((port) => {
      const { x, y } = port.getPosition(true, "inside");
      return <PortView
        key={port.id}
        port={port}
        x={x}
        y={y}
        onChange={this.props.onChange}
        onBeginEdge={this.props.onBeginEdge}
        onMoveEdge={this.props.onMoveEdge}
        onEndEdge={this.props.onEndEdge}
      />;
    });
    const outs = node.outs.map((port) => {
      const { x, y } = port.getPosition(true, "inside");
      return <PortView
        key={port.id}
        port={port}
        x={x}
        y={y}
        onChange={this.props.onChange}
        onBeginEdge={this.props.onBeginEdge}
        onMoveEdge={this.props.onMoveEdge}
        onEndEdge={this.props.onEndEdge}
      />;
    });

    return <g className="flow-node" transform={`translate(${this.props.node.x},${this.props.node.y})`}>
      <rect
        width={this.props.node.width}
        height={this.props.node.height}
        onMouseDown={this.onMouseDown}
        rx="6"
        ry="6"
      />
      <text x="4" y="4" alignment-baseline="hanging">
        {this.props.node.name}
      </text>
      {ins}
      {outs}
    </g>;
  }
}

export interface EdgeViewProps {
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
}

export class EdgeView extends React.Component<EdgeViewProps, {
}> {
  constructor(props: EdgeViewProps) {
    super(props);
  }
  render() {
    const { x0, y0, x1, y1 } = this.props;
    const force = Math.abs(x1 - x0) / 1.6;
    return <path className="flow-edge" d={`M${x0} ${y0} C ${x0 + force} ${y0}, ${x1 - force} ${y1}, ${x1} ${y1}`} stroke="white" fill="transparent"/>;
  }
}

let id = 0;
function nextId() {
  return String(id++);
}

export class Node {
  readonly id: string;
  name: string = "";
  x: number = 0;
  y: number = 0;
  width: number = 32;
  height: number = 32;
  readonly ins: Port [] = [];
  readonly outs: Port [] = [];
  constructor(id: string) {
    this.id = id;
  }
  visit(
    fnPort: (port: Port) => void,
    fnEdge: (edge: Edge) => void,
    fnNode: (node: Node) => void,
    visited: Set<Node> = new Set()
  ) {
    assert(!visited.has(this));
    visited.add(this);
    fnNode && fnNode(this);
    this.outs.forEach((port) => {
      fnPort && fnPort(port);
      port.outs.forEach((edge) => {
        fnEdge && fnEdge(edge);
        if (!visited.has(edge.to.node)) {
          edge.to.node.visit(fnPort, fnEdge, fnNode, visited);
        }
      });
    });
  }
  addPort(port: Port): Port {
    if (port.kind === PortKind.Out) {
      this.outs.push(port);
    } else {
      this.ins.push(port);
    }
    port.setNode(this);
    return port;
  }
  getOutPortById(id: string) {
    return this.outs.find((port) => port.id === id);
  }
  getInPortById(id: string) {
    return this.ins.find((port) => port.id === id);
  }
  isRoot() {
    if (this.ins.length === 0) {
      return true;
    }
    let hasInEdges = false;
    this.ins.forEach((port) => {
      if (port.ins.length) {
        hasInEdges = true;
      }
    });
    return !hasInEdges;
  }
}

export class Edge {
  id: string = nextId();
  constructor(public from: Port, public to?: Port) {
    // Nop.
  }
}

export enum PortKind {
  In,
  Out
}

export interface IPoint {
  x: number;
  y: number;
}

export declare type PortType = "" | "boolean" | "number" | "string";

export class Port {
  readonly id: string;
  readonly ins: Edge [] = [];
  readonly outs: Edge [] = [];
  readonly kind: PortKind;
  readonly name: string;
  type: PortType;
  /**
   * Default value when no edge is attached.
   */
  value: boolean | number = undefined;
  setValue(value: string | boolean | number) {
    switch (this.type) {
      case "boolean":
        assert(typeof value === "boolean");
        this.value = value as boolean;
        break;
      case "number":
        assert(typeof value === "number" || typeof value === "string");
        this.value = Number(value);
        break;
      default:
        assert(false);
    }
  }
  private _node: Node;
  get node(): Node {
    return this._node;
  }
  constructor(id: string, name: string, kind: PortKind, type: PortType) {
    this.id = id;
    this.name = name;
    this.kind = kind;
    this.type = type;
  }
  setNode(node: Node) {
    assert(node);
    this._node = node;
  }
  connectTo(port: Port) {
    const e = new Edge(this, port);
    this.outs.push(e);
    port.ins.push(e);
  }
  getPosition(relative = false, anchor: "inside" | "edge" = "edge"): IPoint {
    let ports: Port [];
    let x = relative ? 0 : this.node.x;
    let y = relative ? 0 : this.node.y;
    const headerHeight = 30;
    const remainingHeight = this.node.height - headerHeight;
    y += headerHeight;
    if (this.kind === PortKind.In) {
      ports = this.node.ins;
    } else {
      ports = this.node.outs;
      x += this.node.width;
    }
    // y += (remainingHeight / (ports.length + 1)) * (ports.indexOf(this) + 1);
    y += (PORT_HEIGHT + PORT_HEIGHT_PADDING) * ports.indexOf(this);
    if (anchor === "inside") {
      // x += this.type === PortType.In ? 10 : -10;
    }
    return {x, y};
  }
}

function serializeGraph(roots: Node []): IGraph {
  const nodes: any = {};
  const edges: any = {};

  function makeBounds(x: number, y: number, width: number, height: number) {
    return `${x} ${y} ${width} ${height}`;
  }

  roots.forEach((root) => {
    root.visit((port) => {
      // Nop.
    }, (edge) => {
      edges[edge.id] = {
        from: edge.from.node.id + ":" + edge.from.id,
        to: edge.to.node.id + ":" + edge.to.id
      };
    }, (node) => {
      // Nop.
      nodes[node.id] = {
        name: node.name,
        bounds: makeBounds(node.x, node.y, node.width, node.height),
        ins: node.ins.reduce((map, port) => {
          map[port.id] = {
            name: port.name,
            type: port.type,
            value: port.value
          };
          return map;
        }, {} as any),
        outs: node.outs.reduce((map, port) => {
          map[port.id] = {
            name: port.name,
            type: port.type,
            value: port.value
          };
          return map;
        }, {} as any)
      };
    });
  });
  return {
    nodes,
    edges
  };
}

export interface IGraph {
  nodes: {[key: string]: INode};
  edges: {[key: string]: IEdge};
}

export interface IPort {
  type: PortType;
  name: string;
  value: number | boolean;
}

export interface INode {
  id: string;
  name?: string;
  bounds: string;
  ins?: {[key: string]: IPort};
  outs?: {[key: string]: IPort};
}

export interface IEdge {
  from: string;
  to: string;
}

export interface FlowProps {
  graph: IGraph;
  onChange?(graph: IGraph): void;
}

export class Flow extends React.Component<FlowProps, {
  fromPort: Port;
  toPortOrPoint: Port | IPoint
}> {
  static defaultProps: FlowProps = {
    graph: null,
    // tslint:disable-next-line:no-empty
    onChange: () => {}
  };

  roots: Node [];

  constructor(props: any) {
    super(props);
    this.roots = this.deserializeGraph(this.props.graph);
    this.state = {
      fromPort: null,
      toPortOrPoint: {x: 0, y: 0}
    };
  }
  deserializeGraph(graph: IGraph) {
    const nodes: {[key: string]: Node} = {};
    // tslint:disable-next-line:forin
    for (const nodeId in graph.nodes) {
      const iNode = graph.nodes[nodeId];
      const node = nodes[nodeId] = new Node(nodeId);
      const [x, y, width, height] = iNode.bounds.split(" ");
      node.x = +x;
      node.y = +y;
      node.width = +width;
      node.height = +height;
      node.name = iNode.name;
      // tslint:disable-next-line:forin
      for (const portId in iNode.ins) {
        const iPort = iNode.ins[portId];
        const port = node.addPort(new Port(portId, iPort.name, PortKind.In, iPort.type));
        port.value = iPort.value;
      }
      // tslint:disable-next-line:forin
      for (const portId in iNode.outs) {
        const iPort = iNode.outs[portId];
        const port = node.addPort(new Port(portId, iPort.name, PortKind.Out, iPort.type));
        port.value = iPort.value;
      }
    }
    // tslint:disable-next-line:forin
    for (const edgeId in graph.edges) {
      const iEdge = graph.edges[edgeId];
      const from = iEdge.from.split(":");
      const fromPort = nodes[from[0]].getOutPortById(from[1]);
      const to = iEdge.to.split(":");
      const toPort = nodes[to[0]].getInPortById(to[1]);
      fromPort.connectTo(toPort);
    }

    const roots: Node [] = [];
    for (const nodeId in nodes) {
      if (nodes[nodeId].isRoot()) {
        roots.push(nodes[nodeId]);
      }
    }
    return roots;
  }
  componentWillReceiveProps(props: FlowProps) {
    if (this.onChangeTimeout) {
      console.log("TODO: Why am I being re-rendered?");
      return;
    }
    this.roots = this.deserializeGraph(props.graph);
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
  svgPoint: SVGPoint = null;
  setSVG(ref: SVGSVGElement) {
    this.svg = ref;
    this.svgPoint = ref ? ref.createSVGPoint() : null;
  }
  clientToSVGPoint(pt: IPoint): IPoint {
    this.svgPoint.x = pt.x;
    this.svgPoint.y = pt.y;
    const point = this.svgPoint.matrixTransform(this.svg.getScreenCTM().inverse());
    return {x: point.x, y: point.y};
  }
  render() {
    let edge: any = null;
    if (this.state.fromPort) {
      const { x: x0, y: y0 } = this.state.fromPort.getPosition(false, "edge");
      const { x: x1, y: y1 } = this.state.toPortOrPoint as any;
      edge = <EdgeView
        x0={x0}
        y0={y0}
        x1={x1}
        y1={y1}
      />;
    }
    const nodes: any [] = [];
    const edges: any [] = [];
    this.roots.forEach((root) => {
      root.visit(null,
        (edge) => {
          const { x: x0, y: y0 } = edge.from.getPosition(false, "edge");
          const { x: x1, y: y1 } = edge.to.getPosition(false, "edge");
          edges.push(<EdgeView
            x0={x0}
            y0={y0}
            x1={x1}
            y1={y1}
          />);
        },
        (node) => {
          nodes.push(<NodeView
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
              to = this.clientToSVGPoint(to as IPoint);
              this.setState({
                fromPort: from,
                toPortOrPoint: to
              });
            }}
            onMoveEdge={(from: Port, to: Port | IPoint) => {
              to = this.clientToSVGPoint(to as IPoint);
              this.setState({
                fromPort: from,
                toPortOrPoint: to
              });
            }}
            onEndEdge={(from: Port, to: Port) => {
              if (to) {
                from.connectTo(to);
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
    return <div style={{width: "100%", height: "100%"}}>
      <svg ref={(ref) => this.setSVG(ref)} width={"100%"} height={"100%"}>
        {edges}
        {edge}
        {nodes}
      </svg>
    </div>;
  }
}

export class FlowView extends React.Component<{
  view: View
}, {
}> {
  componentDidMount() {
    this.props.view.file.onDidChangeData.register(() => {
      this.forceUpdate();
    });
  }
  render() {
    return <Flow
      graph={JSON.parse(this.props.view.file.getBuffer() as string)}
      onChange={(graph: IGraph) => {
        this.props.view.file.setBuffer(JSON.stringify(graph, null, 2), true);
      }}
    />;
  }
}

export class FlowTest extends React.Component<{

}, {
}> {
  file: File;
  left: View;
  right: View;
  constructor(props: any) {
    super(props);

    registerLanguages();
    this.file = new File("X", FileType.JSON);
    this.file.setData(`

    {
      "nodes": {
        "0": {
          "name": "A",
          "bounds": "56 385 400 140",
          "ins": {
            "1": {
              "name": "buffer 1",
              "type": "boolean"
            },
            "2": {
              "name": "buffer 2",
              "type": "number",
              "value": 112
            },
            "3": {
              "name": "buffer 3",
              "type": "number",
              "value": 12
            },
            "4": {
              "name": "buffer 4"
            }
          },
          "outs": {
            "1": {
              "name": "buffer 1",
              "type": "number",
              "value": 12
            },
            "2": {
              "name": "buffer 2",
              "type": "boolean"
            }
          }
        },
        "2": {
          "name": "B",
          "bounds": "246 91 230 40",
          "ins": {
            "3": {}
          },
          "outs": {
            "6": {}
          }
        },
        "4": {
          "name": "C",
          "bounds": "632 129 32 40",
          "ins": {
            "5": {}
          },
          "outs": {}
        },
        "5": {
          "name": "C",
          "bounds": "346 184 32 40",
          "ins": {
            "5": {}
          },
          "outs": {}
        },
        "22": {
          "name": "A",
          "bounds": "127 561 128 128",
          "ins": {},
          "outs": {
            "1": {
              "name": "buffer 1"
            },
            "2": {
              "name": "buffer 2"
            }
          }
        },
        "223": {
          "name": "A",
          "bounds": "91 728 128 128",
          "ins": {},
          "outs": {
            "1": {
              "name": "buffer 1"
            },
            "2": {
              "name": "buffer 2"
            }
          }
        },
        "add": {
          "name": "Add",
          "bounds": "416 708 80 80",
          "ins": {
            "a": {
              "name": "a"
            },
            "b": {
              "name": "b"
            }
          },
          "outs": {
            "out": {
              "name": "+"
            }
          }
        }
      },
      "edges": {
        "0": {
          "from": "2:6",
          "to": "4:5"
        },
        "1": {
          "from": "0:1",
          "to": "2:3"
        },
        "2": {
          "from": "0:2",
          "to": "5:5"
        },
        "3": {
          "from": "22:1",
          "to": "5:5"
        },
        "4": {
          "from": "22:2",
          "to": "4:5"
        },
        "5": {
          "from": "22:1",
          "to": "add:a"
        },
        "6": {
          "from": "22:2",
          "to": "add:b"
        },
        "7": {
          "from": "add:out",
          "to": "4:5"
        }
      }
    }
    `);

    this.left = new View(this.file, ViewType.Editor);
    this.right = new View(this.file, ViewType.Flow);
  }
  render() {
    return <Split orientation={SplitOrientation.Vertical} splits={[{min: 300}]}>
      <ViewTabs views={[this.left]} view={this.left}/>
      <ViewTabs views={[this.right]} view={this.right}/>
    </Split>;
  }
}
