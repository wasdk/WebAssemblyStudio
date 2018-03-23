/* Copyright 2018 Mozilla Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { IWorkerRequest, WorkerCommand, IWorkerResponse } from "./message";

declare var importScripts: Function;

function assert(c: any, message?: string) {
  if (!c) {
    throw new Error(message);
  }
}

declare interface BinaryenModule {
  optimize(): any;
  validate(): any;
  emitBinary(): ArrayBuffer;
  emitText(): string;
  emitAsmjs(): string;
  runPasses(passes: string []): any;
}

declare var Binaryen: {
  readBinary(data: Uint8Array): BinaryenModule;
  parseText(data: string): BinaryenModule;
  print(s: string): void;
  printErr(s: string): void;
};

declare var wabt: {
  ready: Promise<any>
  readWasm: Function;
  parseWat: Function;
};

async function loadBinaryen() {
  if (typeof Binaryen === "undefined") {
    importScripts("../lib/binaryen.js");
  }
}

async function loadWabt() {
  if (typeof wabt === "undefined") {
    (self as any).global = self; // Wabt installs itself on the global object.
    importScripts("../lib/libwabt.js");
  }
}

onmessage = (e: {data: IWorkerRequest}) => {
  const fn = {
    [WorkerCommand.OptimizeWasmWithBinaryen]: optimizeWasmWithBinaryen,
    [WorkerCommand.ValidateWasmWithBinaryen]: validateWasmWithBinaryen,
    [WorkerCommand.CreateWasmCallGraphWithBinaryen]: createWasmCallGraphWithBinaryen,
    [WorkerCommand.ConvertWasmToAsmWithBinaryen]: convertWasmToAsmWithBinaryen,
    [WorkerCommand.DisassembleWasmWithBinaryen]: disassembleWasmWithBinaryen,
    [WorkerCommand.AssembleWatWithBinaryen]: assembleWatWithBinaryen,
    [WorkerCommand.DisassembleWasmWithWabt]: disassembleWasmWithWabt,
    [WorkerCommand.AssembleWatWithWabt]: assembleWatWithWabt
  }[e.data.command];
  assert(fn, `Command ${e.data.command} not found.`);
  processMessage(e.data, fn);
};

function processMessage(request: IWorkerRequest, fn: Function) {
  const response: IWorkerResponse = {
    id: request.id,
    payload: null,
    success: true
  };
  try {
    response.payload = fn(request.payload);
  } catch (e) {
    response.payload = {
      message: e.message
    };
    response.success = false;
  }
  postMessage(response, undefined);
}

function optimizeWasmWithBinaryen(data: ArrayBuffer): ArrayBuffer {
  loadBinaryen();
  const module = Binaryen.readBinary(new Uint8Array(data));
  module.optimize();
  return module.emitBinary();
}

function validateWasmWithBinaryen(data: ArrayBuffer): number {
  loadBinaryen();
  const module = Binaryen.readBinary(new Uint8Array(data));
  return module.validate();
}

function createWasmCallGraphWithBinaryen(data: ArrayBuffer): string {
  loadBinaryen();
  const module = Binaryen.readBinary(new Uint8Array(data));
  const old = Binaryen.print;
  let ret = "";
  Binaryen.print = (x: string) => { ret += x + "\n"; };
  module.runPasses(["print-call-graph"]);
  Binaryen.print = old;
  return ret;
}

function convertWasmToAsmWithBinaryen(data: ArrayBuffer): string {
  loadBinaryen();
  const module = Binaryen.readBinary(new Uint8Array(data));
  module.optimize();
  return module.emitAsmjs();
}

function disassembleWasmWithBinaryen(data: ArrayBuffer): string {
  loadBinaryen();
  const module = Binaryen.readBinary(new Uint8Array(data));
  return module.emitText();
}

function assembleWatWithBinaryen(data: string): ArrayBuffer {
  loadBinaryen();
  const module = Binaryen.parseText(data);
  return module.emitBinary();
}

function disassembleWasmWithWabt(data: ArrayBuffer): string {
  loadWabt();
  const module = wabt.readWasm(data, { readDebugNames: true });
  module.generateNames();
  module.applyNames();
  return module.toText({ foldExprs: false, inlineExport: true });
}

function assembleWatWithWabt(data: string): ArrayBuffer {
  loadWabt();
  const module = wabt.parseWat("test.wat", data);
  module.resolveNames();
  module.validate();
  return module.toBinary({ log: true, write_debug_names: true }).buffer;
}
