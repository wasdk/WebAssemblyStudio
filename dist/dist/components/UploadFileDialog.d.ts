import * as React from "react";
import { File, Directory, ModelRef } from "../models";
import { UploadInput } from "./Widgets";
export interface UploadFileDialogProps {
    isOpen: boolean;
    directory: ModelRef<Directory>;
    onUpload: (file: File[]) => void;
    onCancel: () => void;
}
export interface UploadFileDialogState {
    hasFilesToUpload: boolean;
    editFileDialogFile?: ModelRef<File>;
}
export declare class UploadFileDialog extends React.Component<UploadFileDialogProps, UploadFileDialogState> {
    root: ModelRef<Directory>;
    uploadInput: UploadInput;
    constructor(props: any);
    private handleUpload;
    private onRootChildrenChange;
    render(): JSX.Element;
}
