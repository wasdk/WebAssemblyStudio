import { ITree, ContextMenuEvent } from "./monaco-extra";
export declare function getController(target: any, getActionsFn?: Function, resolveMenuHeight?: Boolean): {
    new (): {
        [x: string]: any;
        onContextMenu(tree: ITree, file: File, event: ContextMenuEvent): boolean;
        resolveMenuHeight(event: ContextMenuEvent): void;
    };
    [x: string]: any;
};
export declare function createController(target: any, getActionsFn?: Function, resolveMenuHeight?: Boolean): {
    [x: string]: any;
    onContextMenu(tree: ITree, file: File, event: ContextMenuEvent): boolean;
    resolveMenuHeight(event: ContextMenuEvent): void;
};
