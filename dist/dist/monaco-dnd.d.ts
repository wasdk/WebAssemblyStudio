import { IDragAndDrop, ITree, IDragAndDropData, DragMouseEvent, IDragOverReaction } from "./monaco-extra";
import { File } from "./models";
export declare class DragAndDrop implements IDragAndDrop {
    private target;
    constructor(target: any);
    /**
     * Returns a uri if the given element should be allowed to drag.
     * Returns null, otherwise.
     */
    getDragURI(tree: ITree, element: File): string;
    /**
     * Returns a label to display when dragging the element.
     */
    getDragLabel?(tree: ITree, elements: File[]): string;
    /**
     * Sent when the drag operation is starting.
     */
    onDragStart(tree: ITree, data: IDragAndDropData, originalEvent: DragMouseEvent): void;
    /**
     * Returns a DragOverReaction indicating whether sources can be
     * dropped into target or some parent of the target.
     */
    onDragOver(tree: ITree, data: IDragAndDropData, targetElement: File, originalEvent: DragMouseEvent): IDragOverReaction;
    /**
     * Handles the action of dropping sources into target.
     */
    drop(tree: ITree, data: IDragAndDropData, targetElement: File, originalEvent: DragMouseEvent): Promise<any>;
}
