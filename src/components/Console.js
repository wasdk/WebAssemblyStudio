import _ from "lodash";
import React from "react";
import assert from "assert";
import PropTypes from "prop-types";
import { Terminal } from "xterm";
import ReactResizeDetector from "react-resize-detector";
import XtermJSShell from "xterm-js-shell";
import { css } from "@emotion/react";
import * as console from "./console";

import "xterm/css/xterm.css";

const styles = css`
  width: 100%;
  height: 100%;
  display: block;
  background: #000;

  .xterm .xterm-viewport {
    overflow-y: hidden !important;
  }
`;

export default class Console extends React.Component {
  state = {
    /** @type {XtermJSShell} */
    shell: null,
    /** @type {Terminal} */
    terminal: null,
  };

  static propTypes = {
    tabSize: PropTypes.number.isRequired,
    padding: PropTypes.number,
    applications: PropTypes.arrayOf(PropTypes.func),
  };

  static defaultProps = {
    padding: 5,
    applications: [],
  };

  handleConsoleData = (data) => {
    assert.ok(this.state.shell);
    assert.ok(_.isString(data));
    // this api prints into xterm
    this.state.shell.printLine(data);
    this.refit();
  };

  handleConsoleRef = (el) => {
    if (!el) return this.cleanup();
    const terminal = new Terminal({ cursorBlink: true });
    // XtermJSShell uses eventemitter api, here we do a conversion
    terminal.listeners = [];
    terminal.on = (name, ...args) => {
      const listener = terminal[`on${_.capitalize(name)}`](...args);
      terminal.listeners.push(listener);
    };
    terminal.off = () => {
      for (let listener of terminal.listeners) {
        listener.dispose();
      }
      terminal.listeners = [];
    };
    // XtermJSShell is older than our xterm and needs some patches
    const shell = new XtermJSShell(terminal);
    // create applications that listen for specific commands
    console.registerApplications(shell);
    this.props.applications.forEach((application) => application(shell));
    // we hook into where XtermJSShell reads lines and save the last one
    let lastLine = "";
    const read = shell.echo.read.bind(shell.echo);
    shell.echo.read = async (...args) => {
      const line = await read(...args);
      lastLine = line;
      return line;
    };
    // expose the last line as a function of the shell
    shell.currentLine = () => {
      return lastLine;
    };
    // we hook into XtermJSShell and pass stuff it does not recognize to cash-money
    const run = shell.run.bind(shell);
    shell.run = async (command, args, flags) => {
      try {
        // this is everything registered with XtermJSShell's api
        // documented in node_modules/xterm-js-shell/README.md
        return await run(command, args, flags);
        // }
      } catch (err) {
        // if lastLine is empty, user is just hitting enter without commands
        if (lastLine) shell.printLine(`command "${lastLine}" not found: "${err.message}"`);
      }
    };
    shell.repl();
    terminal.open(el);
    console.addons.register(terminal);
    this.setState({ shell, terminal });
    this.refit();
  };

  refit = () => {
    if (this.state.terminal) {
      this.state.terminal.refit();
      this.state.terminal.focus();
    }
  };

  cleanup() {
    if (this.state.shell) {
      delete this.state.shell.currentLine;
      this.state.shell.detach();
      this.setState({ shell: null });
    }
    if (this.state.terminal) {
      this.state.terminal.dispose();
      this.setState({ terminal: null });
    }
  }

  componentWillUnmount() {
    this.cleanup();
  }

  componentDidMount() {
    this.refit();
  }

  render() {
    return (
      <ReactResizeDetector handleWidth handleHeight skipOnMount={true} onResize={this.refit}>
        {({ height, targetRef }) => (
          <div ref={targetRef} css={styles}>
            <div
              ref={this.handleConsoleRef}
              style={{
                width: "100%",
                height: height ? height - this.props.tabSize : "100%",
                padding: this.props.padding,
                boxSizing: "border-box",
              }}
            ></div>
          </div>
        )}
      </ReactResizeDetector>
    );
  }
}
