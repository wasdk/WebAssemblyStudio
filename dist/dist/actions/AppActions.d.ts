import { File, Directory, Project } from "../models";
import { Template } from "../components/NewProjectDialog";
import { View, ViewType } from "../components/editor/View";
import Group from "../utils/group";
import { RunTaskExternals } from "../utils/taskRunner";
export declare enum AppActionType {
    ADD_FILE_TO = "ADD_FILE_TO",
    LOAD_PROJECT = "LOAD_PROJECT",
    CLEAR_PROJECT_MODIFIED = "CLEAR_PROJECT_MODIFIED",
    INIT_STORE = "INIT_STORE",
    UPDATE_FILE_NAME_AND_DESCRIPTION = "UPDATE_FILE_NAME_AND_DESCRIPTION",
    DELETE_FILE = "DELETE_FILE",
    SPLIT_GROUP = "SPLIT_GROUP",
    SET_VIEW_TYPE = "SET_VIEW_TYPE",
    OPEN_FILE = "OPEN_FILE",
    OPEN_FILES = "OPEN_PROJECT_FILES",
    FOCUS_TAB_GROUP = "FOCUS_TAB_GROUP",
    LOG_LN = "LOG_LN",
    PUSH_STATUS = "PUSH_STATUS",
    POP_STATUS = "POP_STATUS",
    SANDBOX_RUN = "SANDBOX_RUN",
    CLOSE_VIEW = "CLOSE_VIEW",
    CLOSE_TABS = "CLOSE_TABS",
    OPEN_VIEW = "OPEN_VIEW"
}
export interface AppAction {
    type: AppActionType;
}
export interface AddFileToAction extends AppAction {
    type: AppActionType.ADD_FILE_TO;
    file: File;
    parent: Directory;
}
export declare function addFileTo(file: File, parent: Directory): void;
export interface LoadProjectAction extends AppAction {
    type: AppActionType.LOAD_PROJECT;
    project: Project;
}
export declare function loadProject(project: Project): void;
export declare function initStore(): void;
export interface UpdateFileNameAndDescriptionAction extends AppAction {
    type: AppActionType.UPDATE_FILE_NAME_AND_DESCRIPTION;
    file: File;
    name: string;
    description: string;
}
export declare function updateFileNameAndDescription(file: File, name: string, description: string): void;
export interface DeleteFileAction extends AppAction {
    type: AppActionType.DELETE_FILE;
    file: File;
}
export declare function deleteFile(file: File): void;
export interface LogLnAction extends AppAction {
    type: AppActionType.LOG_LN;
    message: string;
    kind: ("" | "info" | "warn" | "error");
}
export declare type logKind = "" | "info" | "warn" | "error";
export declare function logLn(message: string, kind?: logKind): void;
export interface SplitGroupAction extends AppAction {
    type: AppActionType.SPLIT_GROUP;
}
export declare function splitGroup(): void;
export interface OpenViewAction extends AppAction {
    type: AppActionType.OPEN_VIEW;
    view: View;
    preview: boolean;
}
export declare function openView(view: View, preview?: boolean): void;
export interface CloseViewAction extends AppAction {
    type: AppActionType.CLOSE_VIEW;
    view: View;
}
export declare function closeView(view: View): void;
export interface CloseTabsAction extends AppAction {
    type: AppActionType.CLOSE_TABS;
    file: File;
}
export declare function closeTabs(file: File): void;
export interface OpenFileAction extends AppAction {
    type: AppActionType.OPEN_FILE;
    file: File;
    viewType: ViewType;
    preview: boolean;
}
export declare function openFile(file: File, type?: ViewType, preview?: boolean): void;
export declare function openFiles(files: string[][]): void;
export interface OpenFilesAction extends AppAction {
    type: AppActionType.OPEN_FILES;
    files: string[][];
}
export declare function openProjectFiles(template: Template): Promise<void>;
export declare function saveProject(fiddle: string): Promise<string>;
export interface FocusTabGroupAction extends AppAction {
    type: AppActionType.FOCUS_TAB_GROUP;
    group: Group;
}
export declare function focusTabGroup(group: Group): void;
export interface PushStatusAction extends AppAction {
    type: AppActionType.PUSH_STATUS;
    status: string;
}
export interface PopStatusAction extends AppAction {
    type: AppActionType.POP_STATUS;
}
export declare function pushStatus(status: string): void;
export declare function popStatus(): void;
export interface SandboxRunAction extends AppAction {
    type: AppActionType.SANDBOX_RUN;
    src: string;
}
export declare function runTask(name: string, optional?: boolean, externals?: RunTaskExternals): Promise<void>;
export declare function run(): Promise<void>;
export declare function build(): Promise<void>;
export interface SetViewType extends AppAction {
    type: AppActionType.SET_VIEW_TYPE;
    view: View;
    viewType: ViewType;
}
export declare function setViewType(view: View, type: ViewType): void;
