import { EventDispatcher } from "./EventDispatcher";
import { Directory } from "./Directory";
export declare class Project extends Directory {
    onDidChangeStatus: EventDispatcher;
    onChange: EventDispatcher;
    onDirtyFileUsed: EventDispatcher;
    constructor();
    private status;
    hasStatus(): boolean;
    getStatus(): string;
    pushStatus(status: string): void;
    popStatus(): void;
}
