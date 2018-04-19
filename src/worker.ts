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

async function processMessage(request: IWorkerRequest, fn: Function) {
  const response: IWorkerResponse = {
    id: request.id,
    payload: null,
    success: true
  };
  try {
    response.payload = await fn(request.payload);
  } catch (e) {
    response.payload = {
      message: e.message
    };
    response.success = false;
  }
  postMessage(response, undefined);
}

async function optimizeWasmWithBinaryen(data: ArrayBuffer): Promise<ArrayBuffer> {
  await loadBinaryen();
  const module = Binaryen.readBinary(new Uint8Array(data));
  module.optimize();
  return Promise.resolve(module.emitBinary());
}

async function validateWasmWithBinaryen(data: ArrayBuffer): Promise<number> {
  await loadBinaryen();
  const module = Binaryen.readBinary(new Uint8Array(data));
  return Promise.resolve(module.validate());
}

async function createWasmCallGraphWithBinaryen(data: ArrayBuffer): Promise<string> {
  await loadBinaryen();
  const module = Binaryen.readBinary(new Uint8Array(data));
  const old = Binaryen.print;
  let ret = "";
  Binaryen.print = (x: string) => { ret += x + "\n"; };
  module.runPasses(["print-call-graph"]);
  Binaryen.print = old;
  return Promise.resolve(ret);
}

async function convertWasmToAsmWithBinaryen(data: ArrayBuffer): Promise<string> {
  await loadBinaryen();
  const module = Binaryen.readBinary(new Uint8Array(data));
  module.optimize();
  return Promise.resolve(module.emitAsmjs());
}

async function disassembleWasmWithBinaryen(data: ArrayBuffer): Promise<string> {
  await loadBinaryen();
  const module = Binaryen.readBinary(new Uint8Array(data));
  return Promise.resolve(module.emitText());
}

async function assembleWatWithBinaryen(data: string): Promise<ArrayBuffer> {
  await loadBinaryen();
  const module = Binaryen.parseText(data);
  return Promise.resolve(module.emitBinary());
}

async function disassembleWasmWithWabt(data: ArrayBuffer): Promise<string> {
  await loadWabt();
  const module = wabt.readWasm(data, { readDebugNames: true });
  module.generateNames();
  module.applyNames();
  return Promise.resolve(module.toText({ foldExprs: false, inlineExport: true }));
}

async function assembleWatWithWabt(data: string): Promise<ArrayBuffer> {
  await loadWabt();
  const module = wabt.parseWat("test.wat", data);
  module.resolveNames();
  module.validate();
  return Promise.resolve(module.toBinary({ log: true, write_debug_names: true }).buffer);
}
