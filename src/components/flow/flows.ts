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

import { assert } from "../../util";

export const PORT_HEIGHT = 24;
export const PORT_HEIGHT_PADDING = 4;

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
  delete() {
    if (this.from) {
      const i = this.from.outs.indexOf(this);
      assert(i >= 0);
      this.from.outs.splice(i, 1);
      this.from = null;
    } else if (this.to) {
        const i = this.to.ins.indexOf(this);
        assert(i >= 0);
        this.to.ins.splice(i, 1);
        this.to = null;
      }
    }
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

export class Point implements IPoint {
  constructor(public x: number, public y: number) {
    // ...
  }
  sub(point: Point): Point {
    return new Point(this.x - point.x, this.y - point.y);
  }
  add(point: Point): Point {
    return new Point(this.x + point.x, this.y + point.y);
  }
  toString() {
    return `(${this.x}, ${this.y})`;
  }
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
  totalEdgeCount() {
    return this.ins.length + this.outs.length;
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
  connectTo(port: Port, disconnectOthers = false) {
    if (this.kind === port.kind) {
      return;
    }
    if (this.kind === PortKind.In) {
      port.connectTo(this, disconnectOthers);
      return;
    }
    const e = new Edge(this, port);
    this.outs.push(e);
    if (disconnectOthers) {
      port.ins.forEach(edge => {
        edge.delete();
      });
    }
    port.ins.push(e);
  }
  getPosition(relative = false, anchor: "inside" | "edge" = "edge"): IPoint {
    let x = relative ? 0 : this.node.x;
    let y = relative ? 0 : this.node.y;
    const headerHeight = 40;
    y += headerHeight;
    let i = 0;
    if (this.kind === PortKind.In) {
      i = this.node.ins.indexOf(this);
    } else {
      i = this.node.outs.indexOf(this);
      x += this.node.width;
    }
    y += (PORT_HEIGHT + PORT_HEIGHT_PADDING) * i;
    if (anchor === "inside") {
      x += this.kind === PortKind.In ? 10 : -10;
    }
    return {x, y};
  }
}

export function serializeGraph(roots: Node []): IGraph {
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

export function deserializeGraph(graph: IGraph) {
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
