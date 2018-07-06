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

import {
  IDragAndDrop,
  ITree,
  IDragAndDropData,
  DragMouseEvent,
  IDragOverReaction,
  DragOverBubble
} from "./monaco-extra";
import { File, Directory } from "./models";
import { uploadFilesToDirectory, isUploadAllowedForMimeType } from "./util";

export class DragAndDrop implements IDragAndDrop {
  private target: any;

  constructor(target: any) {
    this.target = target;
  }

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
    // File being dragged into the browser
    if (!(data as any).elements) {
      const items = Array.from(originalEvent.browserEvent.dataTransfer.items);
      // In Firefox, tree elements get data transfer items with the "text/uri-list" type. This is a
      // workaround to ignore that behavior.
      const hasItemsUriListType = items.some(item => item.type === "text/uri-list");
      if (items.length && !hasItemsUriListType) {
        return {
          accept: items.every(item => isUploadAllowedForMimeType(item.type)),
          bubble: DragOverBubble.BUBBLE_DOWN,
          autoExpand: true
        };
      }
    }
    // Regular drag
    const file: File = (data.getData() as any)[0];
    return {
      accept: targetElement instanceof Directory &&
              targetElement !== file &&
              !targetElement.isDescendantOf(file),
      bubble: DragOverBubble.BUBBLE_DOWN,
      autoExpand: true
    };
  }

  /**
   * Handles the action of dropping sources into target.
   */
  async drop(tree: ITree, data: IDragAndDropData, targetElement: File, originalEvent: DragMouseEvent) {
    const items = originalEvent.browserEvent.dataTransfer.items;
    if (!(data as any).elements && items.length) {
      await uploadFilesToDirectory(items, targetElement as Directory);
      return;
    }
    const file: File = (data.getData() as any)[0];
    return this.target.props.onMoveFile && this.target.props.onMoveFile(file, targetElement as Directory);
  }
}
