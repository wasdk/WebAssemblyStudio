import { Project } from "../models";
export declare enum RunTaskExternals {
    Default = 0,
    Arc = 1,
    Setup = 2
}
export interface RunnerInfo {
    global: any;
    project: Project;
}
export declare function getCurrentRunnerInfo(): RunnerInfo;
export declare function runTask(src: string, name: string, optional: boolean, project: Project, logLn: (...args: any[]) => void, externals: RunTaskExternals): Promise<void>;
