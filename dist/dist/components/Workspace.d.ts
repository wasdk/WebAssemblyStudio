import * as React from "react";
import { DirectoryTree } from "./DirectoryTree";
import { Project, File, Directory, ModelRef } from "../models";
import { SplitInfo } from "./Split";
export interface WorkspaceProps {
    /**
     * Active file.
     */
    file: ModelRef<File>;
    project: ModelRef<Project>;
    onEditFile?: (file: File) => void;
    onDeleteFile?: (file: File) => void;
    onMoveFile?: (file: File, directory: Directory) => void;
    onRenameFile?: (file: File) => void;
    onNewFile?: (directory: Directory) => void;
    onNewDirectory?: (directory: Directory) => void;
    onClickFile: (file: File) => void;
    onDoubleClickFile?: (file: File) => void;
    onUploadFile?: (directory: Directory) => void;
    onCreateGist: (fileOrDirectory: File) => void;
}
export interface WorkSpaceState {
    splits: SplitInfo[];
}
export declare class Workspace extends React.Component<WorkspaceProps, WorkSpaceState> {
    directoryTree: DirectoryTree;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    refreshTree: () => void;
    render(): JSX.Element;
}
