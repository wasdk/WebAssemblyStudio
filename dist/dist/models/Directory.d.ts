import { File } from "./File";
import { EventDispatcher } from "./EventDispatcher";
import { FileType } from "./types";
export declare class Directory extends File {
    name: string;
    children: File[];
    isOpen: boolean;
    readonly onDidChangeChildren: EventDispatcher;
    constructor(name: string);
    notifyDidChangeChildren(file: File): void;
    forEachFile(fn: (file: File) => void, excludeTransientFiles?: boolean, recurse?: boolean): void;
    mapEachFile<T>(fn: (file: File) => T, excludeTransientFiles?: boolean): T[];
    handleNameCollision(name: string, isDirectory?: boolean): string;
    addFile(file: File): void;
    removeFile(file: File): void;
    newDirectory(path: string | string[]): Directory;
    newFile(path: string | string[], type: FileType, isTransient?: boolean, handleNameCollision?: boolean): File;
    getImmediateChild(name: string): File;
    getFile(path: string | string[]): File;
    list(): string[];
    glob(pattern: string): string[];
    globFiles(pattern: string): File[];
    hasChildren(): boolean;
}
