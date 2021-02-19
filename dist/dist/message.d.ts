export declare enum WorkerCommand {
    OptimizeWasmWithBinaryen = 0,
    ValidateWasmWithBinaryen = 1,
    CreateWasmCallGraphWithBinaryen = 2,
    ConvertWasmToAsmWithBinaryen = 3,
    DisassembleWasmWithBinaryen = 4,
    AssembleWatWithBinaryen = 5,
    DisassembleWasmWithWabt = 6,
    AssembleWatWithWabt = 7,
    TwiggyWasm = 8
}
/**
 * Worker requests.
 */
export interface IWorkerRequest {
    id: number;
    payload: ArrayBuffer | string;
    command: WorkerCommand;
}
/**
 * Worker response.
 */
export interface IWorkerResponse {
    id: number;
    payload: ArrayBuffer | string | Object;
    success: boolean;
}
