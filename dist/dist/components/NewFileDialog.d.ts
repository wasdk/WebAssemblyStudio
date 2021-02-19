import * as React from "react";
import { File, FileType, Directory, ModelRef } from "../models";
interface NewFileDialogProps {
    isOpen: boolean;
    directory: ModelRef<Directory>;
    onCreate: (file: File) => void;
    onCancel: () => void;
}
interface NewFileDialogState {
    fileType: FileType;
    description: string;
    name: string;
}
export declare class NewFileDialog extends React.Component<NewFileDialogProps, NewFileDialogState> {
    constructor(props: any);
    onChangeName: (event: React.ChangeEvent<any>) => void;
    getNameError(): string;
    fileName(): string;
    createButtonLabel(): string;
    render(): JSX.Element;
}
export {};
