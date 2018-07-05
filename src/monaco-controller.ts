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

import { MonacoUtils } from "./monaco-utils";
import { ITree, ContextMenuEvent } from "./monaco-extra";

export function getController(target: any, getActionsFn?: Function, resolveMenuHeight?: Boolean) {
  return class Controller extends MonacoUtils.TreeDefaults.DefaultController {
    onContextMenu(tree: ITree, file: File, event: ContextMenuEvent): boolean {
      tree.setFocus(file);
      const anchorOffset = { x: -10, y: -3 };
      const anchor = { x: event.posx + anchorOffset.x, y: event.posy + anchorOffset.y };
      const actions = getActionsFn && getActionsFn(file, event);
      if (!actions || !actions.length) {
        return false;
      }
      target.contextMenuService.showContextMenu({
        getAnchor: () => anchor,
        getActions: () => monaco.Promise.as(actions || []),
        getActionItem: (action: any): any => null,
        onHide: (wasCancelled?: boolean) => {
          if (wasCancelled) {
            tree.DOMFocus();
          }
        }
      });
      super.onContextMenu(tree, file, event);
      if (resolveMenuHeight) {
        this.resolveMenuHeight(event);
      }
      return true;
    }
    resolveMenuHeight(event: ContextMenuEvent) {
      // Set the context menus max height to avoid overflow outside window
      const menu: HTMLElement = document.querySelector(".context-view.monaco-menu-container");
      const windowPadding = 10;
      menu.style.maxHeight = Math.min(window.innerHeight - event.posy - windowPadding, 380) + "px";
    }
  };
}

export function createController(target: any, getActionsFn?: Function, resolveMenuHeight?: Boolean) {
  const Controller = getController(target, getActionsFn, resolveMenuHeight);
  return new Controller();
}
