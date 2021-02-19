import { CompilerService, ServiceInput, ServiceOutput } from "./types";
export declare class RustService implements CompilerService {
    compile(input: ServiceInput): Promise<ServiceOutput>;
}
