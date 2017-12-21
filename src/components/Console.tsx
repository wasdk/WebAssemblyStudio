import * as React from "react";
import * as XTerm from 'xterm';

(XTerm as any).loadAddon('fit');

export class Console extends React.Component<{}, {}> {
  xterm: XTerm;
  refs: {
    container: HTMLDivElement;
  }
  componentDidMount() {
    this.xterm = new XTerm({
      cursorBlink: true
    });
    this.xterm.open(this.refs.container);
    // this.xterm.fit();
    this.xterm.writeln("Hello World");
    this.xterm.writeln("Hello World");
    setInterval(() => {
      this.xterm.writeln("> " + new Date());
    }, 1000);
    this.xterm.on('data', this.onInput);
  }
  onInput = (data: any) => {
    this.xterm.write(data);
  }
  render() {
    return <div ref="container"></div>;
  }
}