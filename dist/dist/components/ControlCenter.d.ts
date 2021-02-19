import * as React from "react";
import { SplitInfo } from "./Split";
import { EditorView, View } from "./editor";
export declare class ControlCenter extends React.Component<{
    onToggle?: Function;
    showSandbox: boolean;
}, {
    /**
     * Split state.
     */
    splits: SplitInfo[];
    /**
     * Visible pane.
     */
    visible: "output" | "problems";
    problemCount: number;
    outputLineCount: number;
}> {
    outputView: View;
    refs: {
        container: HTMLDivElement;
    };
    outputViewEditor: EditorView;
    updateOutputViewTimeout: any;
    constructor(props: any);
    onOutputChanged: () => void;
    onDidChangeProblems: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    setOutputViewEditor(editor: EditorView): void;
    updateOutputView(): void;
    createPane(): JSX.Element;
    getOutputLineCount(): number;
    getProblemCount(): number;
    render(): JSX.Element;
}
