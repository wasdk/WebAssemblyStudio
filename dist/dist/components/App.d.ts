import * as React from "react";
import { Project, File, Directory, ModelRef } from "../models";
import { SplitInfo } from "./Split";
import { ToastContainer } from "./Toasts";
import Group from "../utils/group";
export interface AppState {
    project: ModelRef<Project>;
    file: ModelRef<File>;
    fiddle: string;
    /**
     * If not null, the the new file dialog is open and files are created in this
     * directory.
     */
    newFileDialogDirectory?: ModelRef<Directory>;
    /**
     * If not null, the the edit file dialog is open.
     */
    editFileDialogFile?: ModelRef<File>;
    /**
     * If true, the share fiddle dialog is open.
     */
    shareDialog: boolean;
    /**
     * If true, the new project dialog is open.
     */
    newProjectDialog: boolean;
    /**
     * Primary workspace split state.
     */
    workspaceSplits: SplitInfo[];
    /**
     * Secondary control center split state.
     */
    controlCenterSplits: SplitInfo[];
    /**
     * Editor split state.
     */
    editorSplits: SplitInfo[];
    /**
     * If not null, the upload file dialog is open.
     */
    uploadFileDialogDirectory: ModelRef<Directory>;
    /**
     * If true, the new directory dialog is open.
     */
    newDirectoryDialog: ModelRef<Directory>;
    showProblems: boolean;
    showSandbox: boolean;
    tabGroups: Group[];
    activeTabGroup: Group;
    hasStatus: boolean;
    isContentModified: boolean;
    windowDimensions: string;
}
export interface AppProps {
    /**
     * If true, the Update button is visible.
     */
    update: boolean;
    fiddle: string;
    embeddingParams: EmbeddingParams;
    windowContext: AppWindowContext;
}
export declare enum EmbeddingType {
    None = 0,
    Default = 1,
    Arc = 2
}
export interface EmbeddingParams {
    type: EmbeddingType;
    templatesName: string;
}
export interface AppWindowContext {
    promptWhenClosing: boolean;
}
export declare class App extends React.Component<AppProps, AppState> {
    fiddle: string;
    toastContainer: ToastContainer;
    constructor(props: AppProps);
    private initializeProject;
    private static getWindowDimensions;
    private loadProjectFromFiddle;
    bindAppStoreEvents(): void;
    loadReleaseNotes(): Promise<void>;
    loadHelp(): Promise<void>;
    private publishArc;
    registerShortcuts(): void;
    logLn(message: string, kind?: "" | "info" | "warn" | "error"): void;
    componentWillMount(): void;
    componentDidMount(): void;
    share(): void;
    update(): Promise<void>;
    fork(): Promise<void>;
    gist(fileOrDirectory?: File): Promise<void>;
    download(): Promise<void>;
    /**
     * Remember workspace split.
     */
    private workspaceSplit;
    toolbarButtonsAreDisabled(): boolean;
    makeToolbarButtons(): JSX.Element[];
    render(): JSX.Element;
}
