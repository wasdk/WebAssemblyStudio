import * as React from "react";
import { Project, File, Directory, FileType, getIconForFileType } from "../model";
import { Menu, MenuItem } from "./Menu";
import { Service } from "../service";
import { GoDelete, GoPencil, GoGear, GoVerified, GoFileCode, GoQuote, GoFileBinary, GoFile, GoDesktopDownload } from "./Icons";
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

    let labelDescriptionContainer = document.createElement("div");
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
    if (container == null) return;
    if (this.container !== container) {
      // ...
    }
    this.container = container;
  }
  private ensureTree() {
    if (this.container.lastChild) {
      this.container.removeChild(this.container.lastChild);
    }
    let self = this;
    class Controller extends (window as any).TreeDefaults.DefaultController {
      onContextMenu(tree: ITree, file: File, event: ContextMenuEvent): boolean {
        tree.setFocus(file);
        const anchor = { x: event.posx, y: event.posy };
        let actions: any[] = [];

        if (file instanceof Directory) {
          actions.push(new (window as any).Action("x", "New File", "", true, () => {
            self.props.onNewFile && self.props.onNewFile(file as Directory);
          }));
          actions.push(new (window as any).Action("x", "New Directory", "", true, () => {
            self.props.onNewDirectory && self.props.onNewDirectory(file as Directory);
          }));
        } else if (file.type === FileType.Wasm) {
          actions.push(new (window as any).Action("x", "Optimize w/ Binaryen", "", true, () => {
            Service.optimizeWasmWithBinaryen(file);
          }));
          actions.push(new (window as any).Action("x", "Validate w/ Binaryen", "", true, () => {
            Service.validateWasmWithBinaryen(file);
          }));
          actions.push(new (window as any).Action("x", "Download", "", true, () => {
            Service.download(file);
          }));
          actions.push(new (window as any).Action("x", "Disassemble w/ Wabt", "", true, () => {
            Service.disassembleWasmWithWabt(file);
          }));
          actions.push(new (window as any).Action("x", "Firefox x86", "", true, () => {
            Service.disassembleX86(file);
          }));
          actions.push(new (window as any).Action("x", "Firefox x86 Baseline", "", true, () => {
            Service.disassembleX86(file, "--wasm-always-baseline");
          }));
        } else if (file.type === FileType.C || file.type === FileType.Cpp) {
          actions.push(new (window as any).Action("x", "Format w/ Clang", "", true, () => {
            Service.clangFormat(file);
          }));
        } else if (file.type === FileType.Wast) {
          actions.push(new (window as any).Action("x", "Assemble w/ Wabt", "", true, () => {
            Service.assembleWastWithWabt(file);
          }));
        }
        actions.push(new (window as any).Action("x", "Edit", "", true, () => {
          self.props.onEditFile && self.props.onEditFile(file as Directory);
        }));
        actions.push(new (window as any).Action("x", "Delete", "", true, () => {
          self.props.onDeleteFile && self.props.onDeleteFile(file as Directory);
        }));

        self.contextMenuService.showContextMenu({
          getAnchor: () => anchor,

          getActions: () => {
            return monaco.Promise.as(actions);
          },

          getActionItem: (action: any): any => {
            // const keybinding = this._keybindingService.lookupKeybinding(action.id);
            // if (keybinding) {
            //   return new ActionItem(action, action, { label: true, keybinding: keybinding.getLabel() });
            // }
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
        getId: function (tree: ITree, element: File): string {
          return element.key;
        },

        /**
         * Returns a boolean value indicating whether the element has children.
         */
        hasChildren: function (tree: ITree, element: File): boolean {
          return element instanceof Directory;
        },

        /**
         * Returns the element's children as an array in a promise.
         */
        getChildren: function (tree: ITree, element: Directory): monaco.Promise<any> {
          return monaco.Promise.as(element.children);
        },

        /**
         * Returns the element's parent in a promise.
         */
        getParent: function (tree: ITree, element: File): monaco.Promise<any> {
          return monaco.Promise.as(element.parent);
        }
      },
      renderer: {
        getHeight: function (tree: ITree, element: File): number {
          return 24;
        },
        renderTemplate: function (tree: ITree, templateId: string, container: any): any {
          return new FileTemplate(container);
        },
        renderElement: function (tree: ITree, element: File, templateId: string, templateData: any): void {
          (templateData as FileTemplate).set(element);
        },
        disposeTemplate: function (tree: ITree, templateId: string, templateData: any): void {
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
    return <div className="fill" ref={(ref) => this.setContainer(ref)}></div>;
  }
}