import * as React from "react";
import { View } from "./editor";
export declare const colors: string[];
export interface BinaryViewProps {
    view: View;
}
export declare class BinaryView extends React.Component<BinaryViewProps, {
    data: ArrayBuffer;
}> {
    constructor(props: BinaryViewProps);
    onDidChangeData: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(props: BinaryViewProps): void;
    render(): JSX.Element;
}
