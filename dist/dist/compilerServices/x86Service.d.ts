import { CompilerService, ServiceInput, ServiceOutput } from "./types";
export declare class X86Service implements CompilerService {
    compile(input: ServiceInput): Promise<ServiceOutput>;
}
