import * as React from "react";
import { File, Directory, ModelRef, IStatusProvider } from "../models";
import { ITree, ContextMenuEvent } from "../monaco-extra";
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
export declare class DirectoryTree extends React.Component<DirectoryTreeProps, {
    directory: ModelRef<Directory>;
}> {
    status: IStatusProvider;
    tree: ITree;
    contextViewService: any;
    contextMenuService: any;
    container: HTMLDivElement;
    lastClickedTime: number;
    lastClickedFile: File | null;
    constructor(props: DirectoryTreeProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(props: DirectoryTreeProps): void;
    private setContainer;
    private ensureTree;
    getActions(file: File, event: ContextMenuEvent): any[];
    onClickFile(file: File): void;
    onLayout: () => void;
    render(): JSX.Element;
}
