import * as React from "react";
import { Project, SandboxRun } from "../models";
export declare class Sandbox extends React.Component<{}, {}> {
    container: HTMLDivElement;
    private setContainer;
    onResizeBegin: () => void;
    onResizeEnd: () => void;
    onSandboxRun: (e: SandboxRun) => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    run(project: Project, src: string): void;
    render(): JSX.Element;
}
