import * as React from "react";
import { Split } from "./Split";
import { Project, mimeTypeForFileType, ILogger } from "../model";

interface SandboxWindow extends Window {
  /**
   * Creates an object URL to a Blob containing the file's data.
   */
  getFileURL(path: string): string;
}

export class Sandbox extends React.Component<{
  logger: ILogger
}, {}> {
  container: HTMLDivElement;
  private setContainer(container: HTMLDivElement) {
    if (container == null) return;
    if (this.container !== container) {
      // ...
    }
    this.container = container;
  }
  onResizeBegin = () => {
    this.container.style.pointerEvents = "none";
  }
  onResizeEnd = () => {
    this.container.style.pointerEvents = "auto";
  }
  componentDidMount() {
    Split.onResizeBegin.register(this.onResizeBegin);
    Split.onResizeEnd.register(this.onResizeEnd);
  }
  componentWillUnmount() {
    Split.onResizeBegin.unregister(this.onResizeBegin);
    Split.onResizeEnd.unregister(this.onResizeEnd);
  }
  run(project: Project, src: string) {
    var iframe = document.createElement('iframe');
    iframe.className = "sandbox";
    iframe.src = URL.createObjectURL(new Blob([src], { type: 'text/html' }));
    if (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(iframe);
    let contentWindow = iframe.contentWindow as SandboxWindow;
    let logger = this.props.logger;
    // Hijack Console
    let log = contentWindow.console.log;
    contentWindow.console.log = function(message: any) {
      logger.logLn(message);
      log.apply(contentWindow.console, arguments);
    }
    contentWindow.getFileURL = (path: string) => {
      let file = project.getFile(path);
      if (!file) {
        this.props.logger.logLn(`Cannot find file ${path}`, "error");
        return;
      }
      let blob = new Blob([file.getData()], { type: mimeTypeForFileType(file.type) });
      return window.URL.createObjectURL(blob);
    };
    let ready = new Promise((resolve: (window: Window) => any) => {
      (iframe as any).onready = () => {
        resolve(contentWindow);
      }
    });
  }
  render() {
    return <div className="fill" ref={(ref) => this.setContainer(ref)}>
    </div>;
  }
}