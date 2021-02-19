import * as React from "react";
import { Component, PureComponent } from "react";
export interface TabsProps {
    onDoubleClick?: Function;
    commands?: JSX.Element | JSX.Element[];
}
export interface TabsState {
    scrollLeft: number;
}
export declare class Tabs extends Component<TabsProps, TabsState> {
    static defaultProps: TabsProps;
    container: HTMLDivElement;
    state: {
        scrollLeft: number;
    };
    componentDidUpdate(): void;
    onWheel: (e: React.WheelEvent<any>) => void;
    onDoubleClick: (e: React.MouseEvent<any>) => void;
    setContainerRef: (ref: HTMLDivElement) => void;
    render(): JSX.Element;
}
export interface TabProps {
    label?: string;
    value?: any;
    isActive?: boolean;
    isItalic?: boolean;
    onClick?: Function;
    onDoubleClick?: Function;
    onClose?: Function;
    icon?: string;
    isMarked?: boolean;
}
export declare class Tab extends PureComponent<TabProps, {}> {
    static defaultProps: TabProps;
    onMouseHandle: (e: React.MouseEvent<HTMLElement>, handler: Function) => void;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
    onDoubleClick: (e: React.MouseEvent<HTMLElement>) => void;
    onClose: (e: React.MouseEvent<HTMLElement>) => void;
    render(): JSX.Element;
}
