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
import { MouseEvent } from "react";
import { EventDispatcher } from "../models";
import { assert } from "../util";
import { assignObject, toCSSPx } from "../utils/splitUtils";

const Cassowary = require("cassowary");

interface CassowaryVar {
  value: number;
}

export enum SplitOrientation {
  Horizontal,
  Vertical
}

export interface SplitInfo {
  min?: number;
  max?: number;
  value?: number;
  resize?: "fixed" | "stretch";
}

export interface SplitProps {
  orientation: SplitOrientation;
  onChange?: (splits: SplitInfo[]) => void;
  splits?: SplitInfo[];
  defaultSplit?: SplitInfo;
  children: React.ReactNode;
  name?: string; // TODO: Remove, for debugging.
}

export class Split extends React.Component<SplitProps, {
  splits: SplitInfo[];
}> {
  container: HTMLDivElement;
  index: number = -1;
  static onResizeBegin = new EventDispatcher("Resize Begin");
  static onResizeEnd = new EventDispatcher("Resize End");
  constructor(props: any) {
    super(props);
    this.state = {
      splits: []
    };
  }

  componentDidMount() {
    document.addEventListener("mousemove", this.onResizerMouseMove as any);
    document.addEventListener("mouseup", this.onResizerMouseUp);
    const splits = this.canonicalizeSplits(this.props);
    this.setupSolver(splits, this.getContainerSize(this.props.orientation));
    this.querySolver(splits);
    this.setState({ splits });
  }

  componentWillReceiveProps(nextProps: SplitProps) {
    this.onResizerMouseUp();
    const splits = this.canonicalizeSplits(nextProps);
    this.setupSolver(splits, this.getContainerSize(nextProps.orientation));
    this.querySolver(splits);
    this.setState({ splits });
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.onResizerMouseMove as any);
    document.removeEventListener("mouseup", this.onResizerMouseUp);
  }

  onResizerMouseDown(i: number) {
    this.index = i;
    this.solver.addEditVar(this.vars[this.index + 1], Cassowary.Strength.strong).beginEdit();
    Split.onResizeBegin.dispatch(this);
    window.document.documentElement.style.pointerEvents = "none";
  }

  /**
   * This fires for all splits, even if the resizer doesn't belong to this split.
   */
  onResizerMouseUp = () => {
    if (this.index < 0) {
      return;
    }
    this.index = -1;
    Split.onResizeEnd.dispatch(this);
    this.solver.endEdit();
    window.document.documentElement.style.pointerEvents = "auto";
    this.querySolver(this.state.splits);
    return this.props.onChange && this.props.onChange(this.state.splits);
  }

  onResizerMouseMove = (e: MouseEvent<any>) => {
    if (this.index < 0) {
      return;
    }
    const vars = this.vars;
    const isVertical = this.props.orientation === SplitOrientation.Vertical;
    const container = this.container;
    const rect = container.getBoundingClientRect();
    const mouseOffset = isVertical ? e.clientX - rect.left : e.clientY - rect.top;
    this.solver.suggestValue(vars[this.index + 1], mouseOffset);
    this.solver.resolve();
    const splits = this.state.splits;
    this.querySolver(splits);
    this.setState({ splits });
    e.preventDefault();
  }

  querySolver(splits: SplitInfo[]) {
    const vars = this.vars;
    for (let i = 0; i < splits.length; i++) {
      splits[i].value = vars[i + 1].value - vars[i].value;
    }
  }

  private getContainerSize(orientation: SplitOrientation): number {
    return orientation === SplitOrientation.Horizontal ? this.container.clientHeight : this.container.clientWidth;
  }

  private canonicalizeSplits(props: SplitProps): SplitInfo[] {
    const count = React.Children.count(props.children);
    const containerSize = this.getContainerSize(props.orientation);
    const splits = [];
    for (let i = 0; i < count; i++) {
      const info = {};
      if (props.splits && i < props.splits.length) {
        assignObject(info, props.splits[i]);
      }
      if (props.defaultSplit) {
        assignObject(info, props.defaultSplit);
      }
      splits.push(assignObject(info, {
        min: 32,
        max: containerSize,
      }) as SplitInfo);
    }
    return splits;
  }

  private solver: any;
  private vars: CassowaryVar[];

  /**
   * Initializes a Cassowary solver and the constraints based on split infos and container size.
   */
  private setupSolver(splits: SplitInfo[], containerSize: number) {
    assert(this.index < 0, "Should not be in a dragging state.");
    const weak = Cassowary.Strength.weak;
    const medium = Cassowary.Strength.medium;
    const strong = Cassowary.Strength.strong;
    const required = Cassowary.Strength.required;

    function eq(a1: any, a2: any, strength: number, weight?: number) {
      return new Cassowary.Equation(a1, a2, strength || weak, weight || 0);
    }

    function geq(a1: any, a2: any, strength: any, weight?: number) {
      return new Cassowary.Inequality(a1, Cassowary.GEQ, a2, strength, weight);
    }

    function leq(a1: any, a2: any, strength: any, weight?: number) {
      return new Cassowary.Inequality(a1, Cassowary.LEQ, a2, strength, weight);
    }

    // f     1               2           3   ...    l
    // |-----|---------------|-----------|----------|

    const vars: CassowaryVar[] = this.vars = [new Cassowary.Variable()];
    const solver = this.solver = new Cassowary.SimplexSolver();

    // Create Cassowary variables, these the dragged position as an offset from the origin.
    for (let i = 0; i < splits.length; i++) {
      vars.push(new Cassowary.Variable());
    }
    vars[0].value = 0;
    vars[vars.length - 1].value = containerSize;
    solver.addStay(vars[0], required);
    solver.addStay(vars[vars.length - 1], required);

    const offset = 0;
    for (let i = 0; i < vars.length - 1; i++) {
      const { min, max } = splits[i];
      const l = vars[i];
      const r = vars[i + 1];
      solver.addConstraint(geq(Cassowary.minus(r, l), min, strong)); // (y - x) >= min
      solver.addConstraint(leq(Cassowary.minus(r, l), max, strong)); // (y - x) <= max
    }

    // Add stays for the variables representing the dragged panes. This causes them to
    // try and remain in their dragged position unless the constraints prevent that.
    for (let i = 1; i < vars.length - 1; i++) {
      solver.addStay(vars[i], weak);
    }

    this.suggestVarValues(splits);
  }

  suggestVarValues(splits: SplitInfo[]) {
    const vars = this.vars;
    for (let i = 0; i < vars.length - 1; i++) {
      const x = vars[i];
      const y = vars[i + 1];
      if (splits[i].value) {
        if (i < vars.length - 2) {
          this.solver.addEditVar(y, Cassowary.Strength.strong).beginEdit();
          this.solver.suggestValue(y, x.value + (splits[i].value as number));
        } else {
          this.solver.addEditVar(x, Cassowary.Strength.strong).beginEdit();
          this.solver.suggestValue(x, y.value - (splits[i].value as number));
        }
        this.solver.endEdit();
        this.solver.resolve();
      }
    }
  }

  render() {
    const { splits } = this.state;
    let resizerClassName = "resizer";
    const isHorizontal = this.props.orientation === SplitOrientation.Horizontal;
    if (isHorizontal) {
      resizerClassName += " horizontal";
    } else {
      resizerClassName += " vertical";
    }
    const count = React.Children.count(this.props.children);
    const children: any[] = [];
    React.Children.forEach(this.props.children, (child, i) => {
      const style: any = {};
      if (i < count - 1 && i < splits.length) {
        style.flexBasis = toCSSPx(Math.round(splits[i].value as number));
      } else {
        style.flex = 1;
      }
      children.push(<div key={i} className="split-pane" style={style}>{child}</div>);
      if (i < count - 1) {
        children.push(<div
          key={"split:" + i}
          className={resizerClassName}
          onMouseDown={this.onResizerMouseDown.bind(this, i)}
        />);
      }
    });
    return <div
      className="split"
      ref={(ref) => { this.container = ref; }}
      style={{ flexDirection: isHorizontal ? "column" : "row" }}
    >
      {children}
    </div>;
  }
}
