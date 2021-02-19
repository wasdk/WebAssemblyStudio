import { CompilerService, ServiceInput, ServiceOutput, Language } from "./types";
export declare class ClangService implements CompilerService {
    private lang;
    constructor(lang: Language);
    compile(input: ServiceInput): Promise<ServiceOutput>;
}
