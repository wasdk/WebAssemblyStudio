import { EmbeddingParams } from "./components/App";
export declare function forEachUrlParameter(callback: (key: string, value: any) => void): void;
export declare function getUrlParameters(): any;
export declare const appWindowContext: {
    promptWhenClosing: boolean;
};
export declare function unloadPageHandler(e: {
    returnValue: string;
}): any;
export declare function getEmbeddingParams(parameters: any): EmbeddingParams;
export declare function init(environment?: string): Promise<void>;
