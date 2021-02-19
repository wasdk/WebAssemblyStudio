export declare type PromiseMaker = () => Promise<any>;
export declare class Gulpy {
    private tasks;
    private session;
    task(name: string, fn: PromiseMaker): void;
    task(name: string, dependencies: string[], fn?: PromiseMaker): void;
    series(tasks: string[]): PromiseMaker;
    parallel(tasks: string[]): PromiseMaker;
    hasTask(name: string): boolean;
    run(name: string): Promise<void>;
}
