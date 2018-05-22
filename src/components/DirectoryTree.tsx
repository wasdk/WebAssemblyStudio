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
import { Project, File, Directory, FileType, getIconForFileType, ModelRef, isBinaryFileType, IStatusProvider, fileTypeForMimeType } from "../model";
import { Service } from "../service";
import { GoDelete, GoPencil, GoGear, GoVerified, GoFileCode, GoQuote, GoFileBinary, GoFile, GoDesktopDownload } from "./shared/Icons";
import { ITree, ContextMenuEvent, IDragAndDrop, DragMouseEvent, IDragAndDropData, IDragOverReaction, DragOverEffect, DragOverBubble } from "../monaco-extra";
import { MonacoUtils } from "../monaco-utils";
import { ViewTabs } from "./editor";
import { ViewType } from "./editor/View";
import { openFile, pushStatus, popStatus, logLn } from "../actions/AppActions";
import { uploadFilesToDirectory } from "../util";

export interface DirectoryTreeProps {
  directory: ModelRef<Directory>;
  value?: ModelRef<File>;
  onEditFile?: (file: File) => void;
  onDeleteFile?: (file: File) => void;
  onMoveFile?: (file: File, directory: Directory) => void;
  onNewFile?: (directory: Directory) => void;
  onNewDirectory?: (directory: Directory) => void;
  onClickFile?: (file: File) => void;
  onDoubleClickFile?: (file: File) => void;
  onUploadFile?: (directory: Directory) => void;
  onCreateGist?: (fileOrDirectory: File) => void;
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
    // TODO dispose resources?
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
      case FileType.JSON: icon = "json-lang-file-icon"; break;
      case FileType.Wasm: icon = "wasm-lang-file-icon"; break;
      case FileType.Wat: icon = "wat-lang-file-icon"; break;
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
    this.monacoIconLabel.classList.toggle("transient", file.isTransient);
    let title = "";
    if (file.isDirty && file.isTransient) {
      title =  "File has been modified and is transient.";
    } else if (file.isDirty && !file.isTransient) {
      title =  "File has been modified.";
    } else if (!file.isDirty && file.isTransient) {
      title =  "File is transient.";
    }
    this.monacoIconLabel.title = title;
  }
}

export class DirectoryTree extends React.Component<DirectoryTreeProps, {
  directory: ModelRef<Directory>;
}> {
  constructor(props: DirectoryTreeProps) {
    super(props);
    this.contextViewService = new MonacoUtils.ContextViewService(document.documentElement);
    this.contextMenuService = new MonacoUtils.ContextMenuService(document.documentElement, null, null, this.contextViewService);
    this.state = { directory: this.props.directory };
    this.status = {
      push: pushStatus,
      pop: popStatus,
      logLn: logLn
    };
  }

  status: IStatusProvider;
  tree: ITree;
  contextViewService: any;
  contextMenuService: any;

  container: HTMLDivElement;
  private setContainer(container: HTMLDivElement) {
    if (container == null) { return; }
    this.container = container;
  }
  private ensureTree() {
    if (this.container.lastChild) {
      this.container.removeChild(this.container.lastChild);
    }
    const self = this;
    class Controller extends MonacoUtils.TreeDefaults.DefaultController {
      onContextMenu(tree: ITree, file: File, event: ContextMenuEvent): boolean {
        tree.setFocus(file);
        const anchorOffset = { x: -10, y: -3 };
        const anchor = { x: event.posx + anchorOffset.x, y: event.posy + anchorOffset.y };
        const actions: any[] = [];

        // Directory options
        if (file instanceof Directory) {
          self.props.onNewFile && actions.push(new MonacoUtils.Action("x", "New File", "octicon-file-add", true, () => {
            return self.props.onNewFile(file as Directory);
          }));
          self.props.onNewDirectory && actions.push(new MonacoUtils.Action("x", "New Directory", "octicon-file-add", true, () => {
            return self.props.onNewDirectory(file as Directory);
          }));
          self.props.onUploadFile && actions.push(new MonacoUtils.Action("x", "Upload Files", "octicon-cloud-upload", true, () => {
             return self.props.onUploadFile(file as Directory);
          }));
        }

        // Common file options
        if (!(file instanceof Project)) {
          self.props.onEditFile && actions.push(new MonacoUtils.Action("x", "Edit", "octicon-pencil", true, () => {
            return self.props.onEditFile(file as Directory);
          }));
          self.props.onDeleteFile && actions.push(new MonacoUtils.Action("x", "Delete", "octicon-x", true, () => {
            return self.props.onDeleteFile(file as Directory);
          }));
          actions.push(new MonacoUtils.Action("x", "Download", "octicon-cloud-download", true, () => {
            Service.download(file);
          }));
        }

        // Create a gist from everything but binary
        if (!isBinaryFileType(file.type)) {
          self.props.onCreateGist && actions.push(new MonacoUtils.Action("x", "Create Gist", "octicon-gist", true, () => {
            return self.props.onCreateGist(file as Directory);
          }));
        }

        // File-type specific separated with a ruler
        if (file.type === FileType.Wasm) {
          actions.push(new MonacoUtils.Action("x", "Validate", "octicon-check ruler", true, async () => {
            const result = await Service.validateWasmWithBinaryen(file, self.status);
            window.alert(result ? "Module is valid" : "Module is not valid");
          }));
          actions.push(new MonacoUtils.Action("x", "Optimize", "octicon-gear", true, () => {
            Service.optimizeWasmWithBinaryen(file, self.status);
          }));
          actions.push(new MonacoUtils.Action("x", "Disassemble", "octicon-file-code", true, () => {
            Service.disassembleWasmWithWabt(file, self.status);
          }));
          actions.push(new MonacoUtils.Action("x", "Disassemble w/ Binaryen", "octicon-file-code", true, () => {
            Service.disassembleWasmWithBinaryen(file, self.status);
          }));
          actions.push(new MonacoUtils.Action("x", "To asm.js", "octicon-file-code", true, () => {
            Service.convertWasmToAsmWithBinaryen(file, self.status);
          }));
          actions.push(new MonacoUtils.Action("x", "Generate Call Graph", "octicon-gear", true, () => {
            Service.getWasmCallGraphWithBinaryen(file, self.status);
          }));
          actions.push(new MonacoUtils.Action("x", "To Firefox x86", "octicon-file-binary", true, () => {
            Service.disassembleX86(file, self.status);
          }));
          actions.push(new MonacoUtils.Action("x", "To Firefox x86 Baseline", "octicon-file-binary", true, () => {
            Service.disassembleX86(file, self.status, "--wasm-always-baseline");
          }));
          actions.push(new MonacoUtils.Action("x", "Binary Explorer", "octicon-file-binary", true, () => {
            Service.openBinaryExplorer(file);
          }));
          actions.push(new MonacoUtils.Action("x", "View as Binary", "octicon-file-binary", true, () => {
            openFile(file, ViewType.Binary, false);
          }));
          actions.push(new MonacoUtils.Action("x", "Twiggy", "octicon-file-binary", true, () => {
            Service.twiggyWasm(file, self.status);
          }));
        } else if (file.type === FileType.C || file.type === FileType.Cpp) {
          actions.push(new MonacoUtils.Action("x", "Clang-Format", "octicon-quote ruler", true, () => {
            Service.clangFormat(file, self.status);
          }));
        } else if (file.type === FileType.Wat) {
          actions.push(new MonacoUtils.Action("x", "Assemble", "octicon-file-binary ruler", true, () => {
            Service.assembleWatWithWabt(file, self.status);
          }));
          actions.push(new MonacoUtils.Action("x", "Assemble w/ Binaryen", "octicon-file-binary", true, () => {
            Service.assembleWatWithBinaryen(file, self.status);
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

        // Set the context menus max height to avoid overflow outside window
        const menu: HTMLElement = document.querySelector(".context-view.monaco-menu-container");
        const windowPadding = 10;
        menu.style.maxHeight = Math.min(window.innerHeight - event.posy - windowPadding, 380) + "px";

        return true;
      }
    }

    class DragAndDrop implements IDragAndDrop {
      /**
       * Returns a uri if the given element should be allowed to drag.
       * Returns null, otherwise.
       */
      getDragURI(tree: ITree, element: File): string {
        return element.key;
      }

      /**
       * Returns a label to display when dragging the element.
       */
      getDragLabel?(tree: ITree, elements: File[]): string {
        return elements[0].name;
      }

      /**
       * Sent when the drag operation is starting.
       */
      onDragStart(tree: ITree, data: IDragAndDropData, originalEvent: DragMouseEvent): void {
        return;
      }

      /**
       * Returns a DragOverReaction indicating whether sources can be
       * dropped into target or some parent of the target.
       */
      onDragOver(tree: ITree, data: IDragAndDropData, targetElement: File, originalEvent: DragMouseEvent): IDragOverReaction {
        const items = Array.from(originalEvent.browserEvent.dataTransfer.items);
        function mimeTypeUploadIsAllowed(type: string) {
          console.log(type);
          if (type === "") { // Firefox doesn't show the "application/wasm" mime type.
            return true;
          }
          return fileTypeForMimeType(type) !== FileType.Unknown;
        }
        // In Firefox, tree elements get data transfer items with the "text/uri-list" type. This is a
        // workaround to ignore that behavior.
        const firefoxWorkaround = !items.find(item => item.type === "text/uri-list");
        if (items.length && firefoxWorkaround) {
          return {
            accept: items.every(item => mimeTypeUploadIsAllowed(item.type)),
            bubble: DragOverBubble.BUBBLE_DOWN,
            autoExpand: true
          };
        }
        const file: File = (data.getData() as any)[0];
        return {
          accept: targetElement instanceof Directory &&
                  targetElement !== file &&
                  !targetElement.isDescendantOf(file) &&
                  !targetElement.getImmediateChild(file.name),
          bubble: DragOverBubble.BUBBLE_DOWN,
          autoExpand: true
        };
      }

      /**
       * Handles the action of dropping sources into target.
       */
      async drop(tree: ITree, data: IDragAndDropData, targetElement: File, originalEvent: DragMouseEvent) {
        const files = originalEvent.browserEvent.dataTransfer.files;
        if (files.length) {
          await uploadFilesToDirectory(files, targetElement as Directory);
          return;
        }
        const file: File = (data.getData() as any)[0];
        return self.props.onMoveFile && self.props.onMoveFile(file, targetElement as Directory);
      }
    }

    this.tree = new MonacoUtils.Tree(this.container, {
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
      controller: new Controller(),
      dnd: new DragAndDrop()
    });
  }
  lastClickedTime = Date.now();
  lastClickedFile: File | null = null;
  onClickFile(file: File) {
    if (file instanceof Directory) {
      return;
    }
    if (Date.now() - this.lastClickedTime < 500 && this.lastClickedFile === file && this.props.onDoubleClickFile) {
      this.props.onDoubleClickFile(file);
    } else if (this.props.onClickFile) {
      this.props.onClickFile(file);
    }
    this.lastClickedTime = Date.now();
    this.lastClickedFile = file;

  }
  onLayout = () => {
    this.tree.layout();
  }
  componentDidMount() {
    this.ensureTree();
    (this.tree as any).model.setInput(this.props.directory.getModel());
    (this.tree as any).model.onDidSelect((e: any) => {
      if (e.selection.length) {
        this.onClickFile(e.selection[0]);
      }
    });
    document.addEventListener("layout", this.onLayout);
  }
  componentWillUnmount() {
    document.removeEventListener("layout", this.onLayout);
  }
  componentWillReceiveProps(props: DirectoryTreeProps) {
    if (this.state.directory !== props.directory) {
      (this.tree as any).model.setInput(props.directory.getModel());
      this.setState({ directory: props.directory });
    } else {
      this.tree.refresh();
      this.tree.expandAll();
    }
  }
  render() {
    return <div className="fill" ref={(ref) => this.setContainer(ref)}/>;
  }
}
