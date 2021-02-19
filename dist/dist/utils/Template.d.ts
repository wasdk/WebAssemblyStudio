import { File, Problem } from "../models";
export declare class Template {
    readonly label: HTMLAnchorElement;
    readonly description: HTMLSpanElement;
    readonly monacoIconLabel: HTMLDivElement;
    constructor(container: HTMLElement);
}
export declare class ProblemTemplate extends Template {
    constructor(container: HTMLElement);
    dispose(): void;
    set(problem: Problem): void;
}
export declare class FileTemplate extends Template {
    constructor(container: HTMLElement);
    dispose(): void;
    set(file: File): void;
}
