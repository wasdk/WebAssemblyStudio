import { CompilerService, Language } from "./types";
export { ServiceInput, ServiceOutput, CompilerService, InputFile, OutputItem, Language, } from "./types";
export declare function createCompilerService(from: Language, to: Language): Promise<CompilerService>;
