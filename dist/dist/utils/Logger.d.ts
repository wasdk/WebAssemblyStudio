import * as Raven from "raven-js";
export declare class Logger {
    static init(): void;
    static captureException(e: any, additionalData?: Raven.RavenOptions): void;
    static captureMessage(message: string, additionalData?: Raven.RavenOptions): void;
    static getLastEventId(): string;
    static isRunningInProduction(): boolean;
}
