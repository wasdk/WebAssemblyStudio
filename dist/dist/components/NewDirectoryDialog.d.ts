import * as React from "react";
import { Directory, ModelRef } from "../models";
export declare class NewDirectoryDialog extends React.Component<{
    isOpen: boolean;
    directory: ModelRef<Directory>;
    onCreate: (directory: Directory) => void;
    onCancel: () => void;
}, {
    name: string;
}> {
    constructor(props: any);
    onChangeName: (event: React.ChangeEvent<any>) => void;
    nameError(): string;
    createButtonLabel(): string;
    render(): JSX.Element;
}
