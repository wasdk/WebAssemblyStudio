import * as React from "react";
export interface ErrorBoundaryProps {
}
export interface ErrorBoundaryState {
    error: any;
    info: any;
}
export declare class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: any);
    componentDidCatch(error: any, info: any): void;
    getNewIssueUrl(): string;
    getStackTrace(): any;
    render(): {};
}
