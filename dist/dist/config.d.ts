export interface IConfig {
    serviceUrl: string;
    clang: string;
    rustc: string;
    cargo: string;
    templates: {
        [name: string]: string;
    };
}
export default function getConfig(): Promise<IConfig>;
