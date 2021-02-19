import { logKind } from "../actions/AppActions";
import { Project } from "./Project";
export declare enum FileType {
    JavaScript = "javascript",
    TypeScript = "typescript",
    HTML = "html",
    CSS = "css",
    C = "c",
    Cpp = "cpp",
    Rust = "rust",
    Wat = "wat",
    Wasm = "wasm",
    Directory = "directory",
    Log = "log",
    x86 = "x86",
    Markdown = "markdown",
    Cretonne = "cretonne",
    JSON = "json",
    DOT = "dot",
    TOML = "toml",
    Unknown = "unknown"
}
export interface SandboxRun {
    project: Project;
    src: string;
}
export interface IStatusProvider {
    push(status: string): void;
    pop(): void;
    logLn(message: string, kind?: logKind): void;
}
export declare function isBinaryFileType(type: FileType): boolean;
export declare function languageForFileType(type: FileType): string;
export declare function nameForFileType(type: FileType): string;
export declare function extensionForFileType(type: FileType): string;
export declare function fileTypeFromFileName(name: string): FileType;
export declare function fileTypeForExtension(extension: string): FileType;
export declare function mimeTypeForFileType(type: FileType): string;
export declare function fileTypeForMimeType(type: string): FileType;
export declare function getIconForFileType(fileType: FileType): string;
