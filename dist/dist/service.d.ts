import { File, Project, IStatusProvider } from "./models";
import { WorkerCommand } from "./message";
import { Language } from "./compilerServices";
export interface IFiddleFile {
    name: string;
    data?: string;
    type?: "binary" | "text";
}
export interface ICreateFiddleRequest {
    files: IFiddleFile[];
}
export interface ILoadFiddleResponse {
    files: IFiddleFile[];
    id: string;
    message: string;
    success: boolean;
}
export { Language } from "./compilerServices";
export declare class ServiceWorker {
    worker: Worker;
    workerCallbacks: Array<{
        fn: (data: any) => void;
        ex: (err: Error) => void;
    }>;
    nextId: number;
    private getNextId;
    constructor();
    setWorkerCallback(id: string, fn: (e: any) => void, ex?: (e: any) => void): void;
    postMessage(command: WorkerCommand, payload: any): Promise<any>;
    optimizeWasmWithBinaryen(data: ArrayBuffer): Promise<ArrayBuffer>;
    validateWasmWithBinaryen(data: ArrayBuffer): Promise<number>;
    createWasmCallGraphWithBinaryen(data: ArrayBuffer): Promise<string>;
    convertWasmToAsmWithBinaryen(data: ArrayBuffer): Promise<string>;
    disassembleWasmWithBinaryen(data: ArrayBuffer): Promise<string>;
    assembleWatWithBinaryen(data: string): Promise<ArrayBuffer>;
    disassembleWasmWithWabt(data: ArrayBuffer): Promise<string>;
    assembleWatWithWabt(data: string): Promise<ArrayBuffer>;
    twiggyWasm(data: ArrayBuffer): Promise<string>;
}
export declare class Service {
    private static worker;
    static getMarkers(response: string): monaco.editor.IMarkerData[];
    static compileFiles(files: File[], from: Language, to: Language, options?: string): Promise<{
        [name: string]: (string | ArrayBuffer);
    }>;
    static compileFile(file: File, from: Language, to: Language, options?: string): Promise<any>;
    static compileFileWithBindings(file: File, from: Language, to: Language, options?: string): Promise<any>;
    static disassembleWasm(buffer: ArrayBuffer, status: IStatusProvider): Promise<string>;
    static disassembleWasmWithWabt(file: File, status?: IStatusProvider): Promise<void>;
    static assembleWat(wat: string, status?: IStatusProvider): Promise<ArrayBuffer>;
    static assembleWatWithWabt(file: File, status?: IStatusProvider): Promise<void>;
    static createGist(json: object): Promise<string>;
    static loadJSON(uri: string): Promise<ILoadFiddleResponse>;
    static saveJSON(json: ICreateFiddleRequest, uri: string): Promise<string>;
    static parseFiddleURI(): string;
    static exportToGist(content: File, uri?: string): Promise<string>;
    static saveProject(project: Project, openedFiles: string[][], uri?: string): Promise<string>;
    static loadFilesIntoProject(files: IFiddleFile[], project: Project, base?: URL): Promise<any>;
    static lazyLoad(uri: string, status?: IStatusProvider): Promise<any>;
    static optimizeWasmWithBinaryen(file: File, status?: IStatusProvider): Promise<void>;
    static validateWasmWithBinaryen(file: File, status?: IStatusProvider): Promise<boolean>;
    static getWasmCallGraphWithBinaryen(file: File, status?: IStatusProvider): Promise<void>;
    static disassembleWasmWithBinaryen(file: File, status?: IStatusProvider): Promise<void>;
    static convertWasmToAsmWithBinaryen(file: File, status?: IStatusProvider): Promise<void>;
    static assembleWatWithBinaryen(file: File, status?: IStatusProvider): Promise<void>;
    static downloadLink: HTMLAnchorElement;
    static download(file: File): void;
    static clangFormatModule: any;
    static clangFormat(file: File, status?: IStatusProvider): Promise<void>;
    static disassembleX86(file: File, status?: IStatusProvider, options?: string): Promise<void>;
    private static binaryExplorerMessageListener;
    static openBinaryExplorer(file: File): void;
    static import(path: string): Promise<any>;
    static compileMarkdownToHtml(src: string): Promise<string>;
    static twiggyWasm(file: File, status: IStatusProvider): Promise<string>;
}
