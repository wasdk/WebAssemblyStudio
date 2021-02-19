export declare class ModelRef<T> {
    obj: T;
    private constructor();
    getModel(): T;
    static getRef<T>(obj: T): ModelRef<T>;
}
