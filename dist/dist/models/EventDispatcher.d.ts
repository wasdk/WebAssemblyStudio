export declare class EventDispatcher {
    readonly name: string;
    private callbacks;
    constructor(name: string);
    register(callback: Function): void;
    unregister(callback: Function): void;
    dispatch(target?: any): void;
}
