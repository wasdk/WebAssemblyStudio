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
import { EdgeView } from "./Edge";
import { Node, Port, IPoint, PORT_HEIGHT, PortKind, IGraph, serializeGraph } from "./flows";
import { PortView } from "./Port";
import { Flow, TransformProvider } from "./Flow";

export interface NodeViewProps {
  node: Node;
  transformProvider: TransformProvider;
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

function topRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
  return "M" + x + "," + (y + radius)
          + "a" + radius + "," + -radius + " 0 0 1 " + radius + "," + -radius
          + "h" + (width - 2 * radius)
          + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
          + "v" + (height - 2 * radius)
          + "h" + (-width)
          + "z";
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
    transformProvider: null,
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
    e.stopPropagation();
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
    e.stopPropagation();
    return;
  }

  render() {
    const { node } = this.props;
    const ins = node.ins.map((port) => {
      const { x, y } = port.getPosition(true, "inside");
      return <PortView
        transformProvider={this.props.transformProvider}
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
        transformProvider={this.props.transformProvider}
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

    return <g className="flow-node" transform={`translate(${node.x},${node.y})`}>
      <path className="node-fill" d={topRoundedRect(0, 0, node.width, node.height, 10)} onMouseDown={this.onMouseDown}/>
      <path className="node-header" d={topRoundedRect(0, 0, node.width, 30, 10)}  onMouseDown={this.onMouseDown}/>
      <text x={this.props.node.width / 2} y="6" alignment-baseline="hanging" text-anchor="middle">
        {this.props.node.name}
      </text>
      {outs}
      {ins}
    </g>;
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
    let graph;
    try {
      graph = JSON.parse(this.props.view.file.getBuffer() as string);
    } catch (e) {
      console.error(e);
      graph = {};
    }
    return <Flow
      graph={graph}
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
      "bounds": "2 275 128 200",
      "ins": {
        "1": {
          "name": "buffer 1",
          "type": "boolean",
          "value": true
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
          "type": "number"
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
      "bounds": "340 235 32 40",
      "ins": {
        "5": {}
      },
      "outs": {}
    },
    "22": {
      "name": "A",
      "bounds": "-15 557 128 128",
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
      "bounds": "-49 739 128 128",
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
      "bounds": "488 606 64 128",
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
