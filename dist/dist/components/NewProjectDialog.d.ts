import * as React from "react";
import { IFiddleFile } from "../service";
export interface Template {
    name: string;
    description: string;
    files: IFiddleFile[];
    baseUrl: URL;
    icon: string;
}
export declare class NewProjectDialog extends React.Component<{
    isOpen: boolean;
    templatesName: string;
    onCreate: (template: Template) => void;
    onCancel: () => void;
}, {
    description: string;
    name: string;
    template: Template;
    templates: Template[];
}> {
    constructor(props: any);
    componentDidMount(): Promise<void>;
    setTemplate(template: Template): Promise<void>;
    render(): JSX.Element;
}
