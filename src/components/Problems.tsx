import * as React from "react";
import { Project, File, Directory, FileType, getIconForFileType, Problem } from "../model";
import { Menu, MenuItem } from "./Menu";
import { Service } from "../service";
import { GoDelete, GoPencil, GoGear, GoVerified, GoFileCode, GoQuote, GoFileBinary, GoFile, GoDesktopDownload } from "./Icons";
import { ITree, ContextMenuEvent } from "../monaco-extra";
import { FileTemplate } from "./DirectoryTree";

export interface ProblemsProps {
  project: Project;
}

class ProblemTemplate {
  readonly icon: HTMLDivElement;
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
  set(problem: Problem) {
    let icon = "";
    let marker = problem.marker;
    let position = `(${marker.startLineNumber}, ${marker.startColumn})`;
    this.label.innerHTML = marker.message;
    this.description.innerHTML = position;
  }
}

export class Problems extends React.Component<ProblemsProps, {
}> {
  constructor(props: ProblemsProps) {
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
        hasChildren: function (tree: ITree, element: File | Problem): boolean {
          if (element instanceof Directory && element.children.length) {
            return true;
          } else if (element instanceof File) {
            return element.problems.length > 0;
          }
          return false;
        },

        /**
         * Returns the element's children as an array in a promise.
         */
        getChildren: function (tree: ITree, element: File | Problem): monaco.Promise<any> {
          if (element instanceof Directory && element.children.length) {
            let children: File [] = [];
            element.forEachFile((file: File) => {
              if (file.problems.length) {
                children.push(file);
              }
            }, true);
            return monaco.Promise.as(children);
          } else if (element instanceof File) {
            return monaco.Promise.as(element.problems);
          }
          return null;
        },

        /**
         * Returns the element's parent in a promise.
         */
        getParent: function (tree: ITree, element: File | Problem): monaco.Promise<any> {
          if (element instanceof File) {
            return monaco.Promise.as(element.getProject());
          }
          return monaco.Promise.as(element.file);
        }
      },
      renderer: {
        getHeight: function (tree: ITree, element: File): number {
          return 24;
        },
        getTemplateId(tree: ITree, element: File | Problem): string {
          if (element instanceof File) {
            return "file";
          }
          return "problem";
        },
        renderTemplate: function (tree: ITree, templateId: string, container: any): any {
          return templateId == "problem" ? new ProblemTemplate(container) : new FileTemplate(container);
        },
        renderElement: function (tree: ITree, element: File | Problem, templateId: string, templateData: any): void {
          templateData.set(element);
        },
        disposeTemplate: function (tree: ITree, templateId: string, templateData: any): void {
          templateData.dispose();
        }
      },
      controller: new Controller()
    });
  }
  lastClickedTime = Date.now();
  onClickFile(file: File) {

  }
  componentDidMount() {
    this.ensureTree();
    (this.tree as any).model.setInput(this.props.project);
    this.props.project.onDidChangeProblems.register(() => {
      this.tree.refresh();
    });
  }
  componentWillReceiveProps(props: ProblemsProps) {
    this.tree.refresh();
    this.tree.expandAll();
  }
  render() {
    return <div className="fill" ref={(ref) => this.setContainer(ref)}></div>;
  }
}