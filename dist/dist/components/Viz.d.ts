import * as React from "react";
import { View } from "./editor";
export interface VizViewProps {
    view: View;
}
export declare class VizView extends React.Component<VizViewProps, {
    isVizLoaded: boolean;
    content: string;
}> {
    constructor(props: VizViewProps);
    updateThrottleDuration: number;
    updateTimeout: number;
    onDidChangeBuffer: () => void;
    componentWillMount(): Promise<void>;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(props: VizViewProps): void;
    render(): JSX.Element;
}
