export interface PublishManifest {
    description?: string;
    author?: string;
    image: {
        rows: number;
        cols: number;
        frameCount: number;
        fps: number;
        data: Uint8Array | number[];
    };
    entry?: string;
    files?: {
        [name: string]: (string | Uint8Array);
    };
}
export declare function notifyAboutFork(fiddle: string): void;
export declare class Arc {
    static publish(manifest: PublishManifest): void;
}
