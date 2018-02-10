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
import { Project, File, Directory, FileType, getIconForFileType } from "../model";
import { Service } from "../service";
import { GoDelete, GoPencil, GoGear, GoVerified, GoFileCode, GoQuote, GoFileBinary, GoFile, GoDesktopDownload } from "./shared/Icons";
import { ITree, ContextMenuEvent } from "../monaco-extra";

export interface DirectoryTreeProps {
  directory: Directory;
  value?: File;
  onEditFile?: (file: File) => void;
  onDeleteFile?: (file: File) => void;
  onNewFile?: (directory: Directory) => void;
  onNewDirectory?: (directory: Directory) => void;
  onClickFile?: (file: File) => void;
  onDoubleClickFile?: (file: File) => void;
  onUploadFile?: (directory: Directory) => void;
}

export class FileTemplate {
  readonly label: HTMLAnchorElement;
  readonly description: HTMLSpanElement;
  readonly monacoIconLabel: HTMLDivElement;
  constructor(container: HTMLElement) {
    this.monacoIconLabel = document.createElement("div");
    this.monacoIconLabel.className = "monaco-icon-label";
    this.monacoIconLabel.style.display = "flex";
    container.appendChild(this.monacoIconLabel);

    const labelDescriptionContainer = document.createElement("div");
    labelDescriptionContainer.className = "monaco-icon-label-description-container";
    this.monacoIconLabel.appendChild(labelDescriptionContainer);

    this.label = document.createElement("a");
    this.label.className = "label-name";
    labelDescriptionContainer.appendChild(this.label);

    this.description = document.createElement("span");
    this.description.className = "label-description";
    labelDescriptionContainer.appendChild(this.description);
  }
  dispose() {
    // TODO
  }
  set(file: File) {
    let icon = "";
    switch (file.type) {
      case FileType.C: icon = "c-lang-file-icon"; break;
      case FileType.Cpp: icon = "cpp-lang-file-icon"; break;
      case FileType.JavaScript: icon = "javascript-lang-file-icon"; break;
      case FileType.HTML: icon = "html-lang-file-icon"; break;
      case FileType.TypeScript: icon = "typescript-lang-file-icon"; break;
      case FileType.Markdown: icon = "markdown-lang-file-icon"; break;
    }
    if (file instanceof Directory) {
      this.monacoIconLabel.classList.add("folder-icon");
    } else {
      this.monacoIconLabel.classList.add("file-icon");
    }
    if (icon) {
      this.monacoIconLabel.classList.add(icon);
    }
    this.label.innerHTML = file.name;
    this.monacoIconLabel.classList.toggle("dirty", file.isDirty);
  }
}

export class DirectoryTree extends React.Component<DirectoryTreeProps, {
}> {
  constructor(props: DirectoryTreeProps) {
    super(props);
    this.contextViewService = new (window as any).ContextViewService(document.documentElement);
    this.contextMenuService = new (window as any).ContextMenuService(document.documentElement, null, null, this.contextViewService);
  }

  tree: ITree;
  contextViewService: any;
  contextMenuService: any;

  container: HTMLDivElement;
  private setContainer(container: HTMLDivElement) {
    if (container == null) { return; }
    if (this.container !== container) {
      // ...
    }
    this.container = container;
  }
  private ensureTree() {
    if (this.container.lastChild) {
      this.container.removeChild(this.container.lastChild);
    }
    const self = this;
    class Controller extends (window as any).TreeDefaults.DefaultController {
      onContextMenu(tree: ITree, file: File, event: ContextMenuEvent): boolean {
        tree.setFocus(file);
        const anchorOffset = { x: -10, y: -3 };
        const anchor = { x: event.posx + anchorOffset.x, y: event.posy + anchorOffset.y };
        const actions: any[] = [];

        if (file instanceof Directory) {
          actions.push(new (window as any).Action("x", "New File", "octicon-file-add", true, () => {
            return self.props.onNewFile && self.props.onNewFile(file as Directory);
          }));
          actions.push(new (window as any).Action("x", "New Directory", "octicon-file-add", true, () => {
            return self.props.onNewDirectory && self.props.onNewDirectory(file as Directory);
          }));
          actions.push(new (window as any).Action("x", "Upload File", "octicon-cloud-upload", true, () => {
             return self.props.onUploadFile && self.props.onUploadFile(file as Directory);
          }));
        } else if (file.type === FileType.Wasm) {
          actions.push(new (window as any).Action("x", "Optimize w/ Binaryen", "octicon-gear", true, () => {
            Service.optimizeWasmWithBinaryen(file);
          }));
          actions.push(new (window as any).Action("x", "Validate w/ Binaryen", "octicon-check", true, () => {
            Service.validateWasmWithBinaryen(file);
          }));
          actions.push(new (window as any).Action("x", "Download", "octicon-cloud-download", true, () => {
            Service.download(file);
          }));
          actions.push(new (window as any).Action("x", "Disassemble w/ Wabt", "octicon-file-code", true, () => {
            Service.disassembleWasmWithWabt(file);
          }));
          actions.push(new (window as any).Action("x", "Firefox x86", "octicon-file-binary", true, () => {
            Service.disassembleX86(file);
          }));
          actions.push(new (window as any).Action("x", "Firefox x86 Baseline", "octicon-file-binary", true, () => {
            Service.disassembleX86(file, "--wasm-always-baseline");
          }));
        } else if (file.type === FileType.C || file.type === FileType.Cpp) {
          actions.push(new (window as any).Action("x", "Format w/ Clang", "octicon-quote", true, () => {
            Service.clangFormat(file);
          }));
        } else if (file.type === FileType.Wast) {
          actions.push(new (window as any).Action("x", "Assemble w/ Wabt", "octicon-file-binary", true, () => {
            Service.assembleWastWithWabt(file);
          }));
        }
        if (!(file instanceof Project)) {
          actions.push(new (window as any).Action("x", "Edit", "octicon-pencil", true, () => {
            return self.props.onEditFile && self.props.onEditFile(file as Directory);
          }));
          actions.push(new (window as any).Action("x", "Delete", "octicon-x", true, () => {
            return self.props.onDeleteFile && self.props.onDeleteFile(file as Directory);
          }));
        }
        self.contextMenuService.showContextMenu({
          getAnchor: () => anchor,

          getActions: () => {
            return monaco.Promise.as(actions);
          },

          getActionItem: (action: any): any => {
            return null;
          },

          onHide: (wasCancelled?: boolean) => {
            if (wasCancelled) {
              tree.DOMFocus();
            }
          }
        });

        super.onContextMenu(tree, file, event);
        return true;
      }
    }

    this.tree = new (window as any).Tree(this.container, {
      dataSource: {
        /**
         * Returns the unique identifier of the given element.
         * No more than one element may use a given identifier.
         */
        getId: function(tree: ITree, element: File): string {
          return element.key;
        },

        /**
         * Returns a boolean value indicating whether the element has children.
         */
        hasChildren: function(tree: ITree, element: File): boolean {
          return element instanceof Directory;
        },

        /**
         * Returns the element's children as an array in a promise.
         */
        getChildren: function(tree: ITree, element: Directory): monaco.Promise<any> {
          return monaco.Promise.as(element.children);
        },

        /**
         * Returns the element's parent in a promise.
         */
        getParent: function(tree: ITree, element: File): monaco.Promise<any> {
          return monaco.Promise.as(element.parent);
        }
      },
      renderer: {
        getHeight: function(tree: ITree, element: File): number {
          return 24;
        },
        renderTemplate: function(tree: ITree, templateId: string, container: any): any {
          return new FileTemplate(container);
        },
        renderElement: function(tree: ITree, element: File, templateId: string, templateData: any): void {
          (templateData as FileTemplate).set(element);
        },
        disposeTemplate: function(tree: ITree, templateId: string, templateData: any): void {
          (templateData as FileTemplate).dispose();
        }
      },
      controller: new Controller()
    });
  }
  lastClickedTime = Date.now();
  onClickFile(file: File) {
    if (file instanceof Directory) {
      return;
    }
    if (Date.now() - this.lastClickedTime < 1000 && this.props.onDoubleClickFile) {
      this.props.onDoubleClickFile(file);
    } else if (this.props.onClickFile) {
      this.props.onClickFile(file);
    }
    this.lastClickedTime = Date.now();

  }
  componentDidMount() {
    this.ensureTree();
    (this.tree as any).model.setInput(this.props.directory);
    (this.tree as any).model.onDidSelect((e: any) => {
      if (e.selection.length) {
        this.onClickFile(e.selection[0]);
      }
    });
  }
  componentWillReceiveProps(props: DirectoryTreeProps) {
    this.tree.refresh();
    this.tree.expandAll();
  }
  render() {
    return <div className="fill" ref={(ref) => this.setContainer(ref)}/>;
  }
}
