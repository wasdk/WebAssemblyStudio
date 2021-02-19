import * as React from "react";
export declare class StatusBar extends React.Component<{}, {
    hasStatus: boolean;
    status: string;
}> {
    constructor(props: any);
    onDidChangeStatus: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
