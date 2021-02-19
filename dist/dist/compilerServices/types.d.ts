export declare enum Language {
    C = "c",
    Cpp = "cpp",
    Wat = "wat",
    Wasm = "wasm",
    Rust = "rust",
    Cretonne = "cton",
    x86 = "x86",
    Json = "json",
    JavaScript = "javascript",
    TypeScript = "typescript",
    Toml = "toml",
    Text = "text"
}
export interface InputFile {
    content: string | ArrayBuffer;
    options?: any;
}
export interface ServiceInput {
    files: {
        [name: string]: InputFile;
    };
    options?: any;
}
export interface OutputItem {
    content?: string | ArrayBuffer;
    fileRef?: string;
    console?: string;
}
export interface ServiceOutput {
    success: boolean;
    items: {
        [name: string]: OutputItem;
    };
    console?: string;
}
export interface CompilerService {
    compile(input: ServiceInput): Promise<ServiceOutput>;
}
