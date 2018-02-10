// Public API

type PromiseMaker = () => Promise<any>;

declare class Gulpy {
  task(name: string, fn: PromiseMaker): void;
  task(name: string, dependencies: string[], fn: PromiseMaker): void;
  task(name: string, a: string [] | PromiseMaker, b?: PromiseMaker): void;
}

/**
 * Task Manager
 */
declare const gulp: Gulpy;

declare enum Language {
  C = "c",
  Cpp = "cpp",
  Wast = "wast",
  Wasm = "wasm",
  x86 = "x86"
}

declare class Service {
  static compileFile(file: File, from: Language | string, to: Language | string, options?: string): Promise<any>;
  /**
   * Disassembles WebAssembly binary into Wast format using Wabt.
   */
  static disassembleWasm(buffer: ArrayBuffer): Promise<string>;
}
declare const project: any;

declare function logLn(message: string, kind?: "" | "info" | "warn" | "error"): void;
