import * as React from "react";
export declare type ToastKind = "info" | "error" | "warning";
export declare class ToastContainer extends React.Component<{}, {
    toasts: Array<{
        message: JSX.Element;
        kind: ToastKind;
    }>;
}> {
    constructor(props?: any);
    showToast(message: JSX.Element, kind?: ToastKind): void;
    private onDismiss;
    render(): JSX.Element;
}
export interface ToastProps {
    message: JSX.Element;
    kind?: ToastKind;
    onDismiss: Function;
}
export declare class Toast extends React.Component<ToastProps, {}> {
    static defaultProps: ToastProps;
    render(): JSX.Element;
}
