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
  Wat = "wat",
  Wasm = "wasm",
  Rust = "rust",
  Cretonne = "cton",
  x86 = "x86",
  Json = "json",
  JavaScript = "javascript",
  TypeScript = "typescript",
  Text = "text"
}

declare class Service {
  static compileFile(file: File, from: Language | string, to: Language | string, options?: string): Promise<any>;
  /**
   * Disassembles WebAssembly binary into Wat format using Wabt.
   */
  static disassembleWasm(buffer: ArrayBuffer): Promise<string>;
  static assembleWat(wat: string): Promise<ArrayBuffer>;
}
declare const project: any;

declare function logLn(message: string, kind?: "" | "info" | "warn" | "error"): void;

/** Asynchronously requires the specified dependencies.. */
declare function require(deps: string[], fn: (...deps: any[]) => void): void;

/** Synchronously requires the specified (already loaded) dependency. */
declare function require(name: string): any;

declare namespace require {
  /** Configures external module paths etc. */
  export function config(options: {}): void;
}
