import * as React from "react";
import { IStatusProvider } from "../../models";
import { View } from "./View";
export interface MonacoProps {
    view: View;
    options?: monaco.editor.IEditorConstructionOptions;
}
export declare class Monaco extends React.Component<MonacoProps, {}> {
    editor: monaco.editor.IStandaloneCodeEditor;
    container: HTMLDivElement;
    status: IStatusProvider;
    constructor(props: MonacoProps);
    revealLastLine(): void;
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: EditorViewProps): void;
    shouldComponentUpdate(nextProps: EditorViewProps, nextState: any): boolean;
    componentDidUpdate(): void;
    onLayout: () => void;
    componentWillUnmount(): void;
    registerActions(): void;
    private ensureEditor;
    resolveMenuPosition(e: any): void;
    disableEditorScroll(): void;
    enableEditorScroll(): void;
    private setContainer;
    render(): JSX.Element;
}
export interface EditorViewProps {
    view: View;
    options?: monaco.editor.IEditorConstructionOptions;
}
export declare class EditorView extends React.Component<EditorViewProps, {}> {
    monaco: Monaco;
    setMonaco(monaco: Monaco): void;
    revealLastLine(): void;
    render(): JSX.Element;
}
