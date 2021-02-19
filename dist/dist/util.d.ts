import { FileType, Directory } from "./models";
export declare function toAddress(n: number): string;
export declare function padRight(s: string, n: number, c: string): string;
export declare function padLeft(s: string, n: number, c: string): string;
export declare function isBranch(instr: any): boolean;
/**
 * The concatN() functions concatenate multiple strings in a way that
 * avoids creating intermediate strings, unlike String.prototype.concat().
 *
 * Note that these functions don't have identical behaviour to using '+',
 * because they will ignore any arguments that are |undefined| or |null|.
 * This usually doesn't matter.
 */
export declare function concat3(s0: any, s1: any, s2: any): string;
export declare function concat4(s0: any, s1: any, s2: any, s3: any): string;
export declare function base64EncodeBytes(bytes: Uint8Array): string;
export declare function decodeRestrictedBase64ToBytes(encoded: string): Uint8Array;
export declare function layout(): void;
export declare function resetDOMSelection(): void;
export declare function assert(c: any, message?: string): void;
export declare function clamp(x: number, min: number, max: number): number;
export declare function readUploadedFile(inputFile: File, readAs: "text" | "arrayBuffer"): Promise<string | ArrayBuffer>;
export declare function readUploadedDirectory(inputEntry: any, root: Directory, customRoot?: string): Promise<void>;
export declare function uploadFilesToDirectory(items: any, root: Directory): Promise<void>;
export declare function isUploadAllowedForMimeType(type: string): boolean;
export declare function getNextKey(): number;
export declare function validateFileName(name: string, sourceType: FileType): string;
