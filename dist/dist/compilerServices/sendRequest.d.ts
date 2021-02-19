export declare enum ServiceTypes {
    Rustc = 0,
    Cargo = 1,
    Clang = 2,
    Service = 3
}
export interface IServiceRequestTask {
    file: string;
    name: string;
    output: string;
    console: string;
    success: boolean;
}
export interface IServiceRequest {
    success: boolean;
    message?: string;
    tasks?: IServiceRequestTask[];
    output?: string;
    wasmBindgenJs?: string;
}
export declare function getServiceURL(to: ServiceTypes): Promise<string>;
export declare function parseJSONResponse(response: Response): Promise<IServiceRequest>;
export declare function sendRequestJSON(content: Object, to: ServiceTypes): Promise<IServiceRequest>;
export declare function sendRequest(content: string, to: ServiceTypes): Promise<IServiceRequest>;
