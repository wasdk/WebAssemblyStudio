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
import { Project, File, Directory, FileType, ModelRef, isBinaryFileType, IStatusProvider } from "../models";
import { Service } from "../service";
import { ITree, ContextMenuEvent } from "../monaco-extra";
import { MonacoUtils } from "../monaco-utils";
import { ViewType } from "./editor/View";
import { openFile, pushStatus, popStatus, logLn } from "../actions/AppActions";
import { FileTemplate } from "../utils/Template";
import { createController } from "../monaco-controller";
import { DragAndDrop } from "../monaco-dnd";

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
  onlyUploadActions?: boolean;
}

export class DirectoryTree extends React.Component<DirectoryTreeProps, {
  directory: ModelRef<Directory>;
}> {
  status: IStatusProvider;
  tree: ITree;
  contextViewService: any;
  contextMenuService: any;
  container: HTMLDivElement;
  lastClickedTime = Date.now();
  lastClickedFile: File | null = null;

  constructor(props: DirectoryTreeProps) {
    super(props);
    // tslint:disable-next-line
    this.contextViewService = new MonacoUtils.ContextViewService(document.documentElement, null, {trace: () => {}});
    this.contextMenuService = new MonacoUtils.ContextMenuService(document.documentElement, null, null, this.contextViewService);
    this.state = { directory: this.props.directory };
    this.status = {
      push: pushStatus,
      pop: popStatus,
      logLn: logLn
    };
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
  private setContainer(container: HTMLDivElement) {
    if (container == null) { return; }
    this.container = container;
  }
  private ensureTree() {
    if (this.container.lastChild) {
      this.container.removeChild(this.container.lastChild);
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
      controller: createController(this, (file: File, event: ContextMenuEvent) => this.getActions(file, event), true),
      dnd: new DragAndDrop(this)
    });
  }
  getActions(file: File, event: ContextMenuEvent) {
    const actions: any[] = [];

    // Upload options (Limited to delete & edit)
    if (this.props.onlyUploadActions) {
      if (!file.parent) {
        return actions;
      }
      this.props.onDeleteFile && actions.push(new MonacoUtils.Action("x", "Delete", "octicon-x", true, () => {
        return this.props.onDeleteFile(file as Directory);
      }));
      this.props.onEditFile && actions.push(new MonacoUtils.Action("x", "Edit", "octicon-pencil", true, () => {
        return this.props.onEditFile(file as Directory);
      }));
      return actions;
    }

    // Directory options
    if (file instanceof Directory) {
      this.props.onNewFile && actions.push(new MonacoUtils.Action("x", "New File", "octicon-file-add", true, () => {
        return this.props.onNewFile(file as Directory);
      }));
      this.props.onNewDirectory && actions.push(new MonacoUtils.Action("x", "New Directory", "octicon-file-add", true, () => {
        return this.props.onNewDirectory(file as Directory);
      }));
      this.props.onUploadFile && actions.push(new MonacoUtils.Action("x", "Upload Files", "octicon-cloud-upload", true, () => {
          return this.props.onUploadFile(file as Directory);
      }));
    }

    // Common file options
    if (!(file instanceof Project)) {
      this.props.onEditFile && actions.push(new MonacoUtils.Action("x", "Edit", "octicon-pencil", true, () => {
        return this.props.onEditFile(file as Directory);
      }));
      this.props.onDeleteFile && actions.push(new MonacoUtils.Action("x", "Delete", "octicon-x", true, () => {
        return this.props.onDeleteFile(file as Directory);
      }));
      actions.push(new MonacoUtils.Action("x", "Download", "octicon-cloud-download", true, () => {
        Service.download(file);
      }));
    }

    // Create a gist from everything but binary
    if (!isBinaryFileType(file.type)) {
      this.props.onCreateGist && actions.push(new MonacoUtils.Action("x", "Create Gist", "octicon-gist", true, () => {
        return this.props.onCreateGist(file as Directory);
      }));
    }

    // File-type specific separated with a ruler
    if (file.type === FileType.Wasm) {
      actions.push(new MonacoUtils.Action("x", "Validate", "octicon-check ruler", true, async () => {
        const result = await Service.validateWasmWithBinaryen(file, this.status);
        window.alert(result ? "Module is valid" : "Module is not valid");
      }));
      actions.push(new MonacoUtils.Action("x", "Optimize", "octicon-gear", true, () => {
        Service.optimizeWasmWithBinaryen(file, this.status);
      }));
      actions.push(new MonacoUtils.Action("x", "Disassemble", "octicon-file-code", true, () => {
        Service.disassembleWasmWithWabt(file, this.status);
      }));
      actions.push(new MonacoUtils.Action("x", "Disassemble w/ Binaryen", "octicon-file-code", true, () => {
        Service.disassembleWasmWithBinaryen(file, this.status);
      }));
      actions.push(new MonacoUtils.Action("x", "To asm.js", "octicon-file-code", true, () => {
        Service.convertWasmToAsmWithBinaryen(file, this.status);
      }));
      actions.push(new MonacoUtils.Action("x", "Generate Call Graph", "octicon-gear", true, () => {
        Service.getWasmCallGraphWithBinaryen(file, this.status);
      }));
      actions.push(new MonacoUtils.Action("x", "To Firefox x86", "octicon-file-binary", true, () => {
        Service.disassembleX86(file, this.status);
      }));
      actions.push(new MonacoUtils.Action("x", "To Firefox x86 Baseline", "octicon-file-binary", true, () => {
        Service.disassembleX86(file, this.status, "--wasm-always-baseline");
      }));
      actions.push(new MonacoUtils.Action("x", "Binary Explorer", "octicon-file-binary", true, () => {
        Service.openBinaryExplorer(file);
      }));
      actions.push(new MonacoUtils.Action("x", "View as Binary", "octicon-file-binary", true, () => {
        openFile(file, ViewType.Binary, false);
      }));
      actions.push(new MonacoUtils.Action("x", "Twiggy", "octicon-file-binary", true, () => {
        Service.twiggyWasm(file, this.status);
      }));
    } else if (file.type === FileType.C || file.type === FileType.Cpp) {
      actions.push(new MonacoUtils.Action("x", "Clang-Format", "octicon-quote ruler", true, () => {
        Service.clangFormat(file, this.status);
      }));
    } else if (file.type === FileType.Wat) {
      actions.push(new MonacoUtils.Action("x", "Assemble", "octicon-file-binary ruler", true, () => {
        Service.assembleWatWithWabt(file, this.status);
      }));
      actions.push(new MonacoUtils.Action("x", "Assemble w/ Binaryen", "octicon-file-binary", true, () => {
        Service.assembleWatWithBinaryen(file, this.status);
      }));
    }

    return actions;
  }
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
  render() {
    return <div className="fill" ref={(ref) => this.setContainer(ref)}/>;
  }
}
