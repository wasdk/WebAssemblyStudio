import * as React from "react";
import { View } from "./editor";
export interface MarkdownProps {
    src: string;
}
export declare class Markdown extends React.Component<MarkdownProps, {
    html: string;
}> {
    constructor(props: MarkdownProps);
    componentDidMount(): Promise<void>;
    componentWillReceiveProps(props: MarkdownProps): Promise<void>;
    render(): JSX.Element;
}
export interface MarkdownViewProps {
    view: View;
}
export declare class MarkdownView extends React.Component<MarkdownViewProps, {
    markdown: string;
}> {
    constructor(props: MarkdownViewProps);
    onDidChangeBuffer: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(props: MarkdownViewProps): void;
    render(): JSX.Element;
}
