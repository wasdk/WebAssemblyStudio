import * as React from "react";
import { File, FileType, ModelRef } from "../models";
export interface EditFileDialogProps {
    isOpen: boolean;
    file: ModelRef<File>;
    onChange: (name: string, description: string) => void;
    onCancel: () => void;
}
interface EditFileDialogState {
    description: string;
    name: string;
    fileType: FileType;
}
export declare class EditFileDialog extends React.Component<EditFileDialogProps, EditFileDialogState> {
    constructor(props: EditFileDialogProps);
    onChangeName: (event: React.ChangeEvent<any>) => void;
    onChangeDescription: (event: React.ChangeEvent<any>) => void;
    getNameError(): string;
    render(): JSX.Element;
}
export {};
