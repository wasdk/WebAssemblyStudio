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
    importScripts("https://cdn.rawgit.com/AssemblyScript/binaryen.js/v48.0.0-nightly.20180624/index.js");
  }
}

async function loadWabt() {
  if (typeof wabt === "undefined") {
    (self as any).global = self; // Wabt installs itself on the global object.
    importScripts("https://cdn.rawgit.com/AssemblyScript/wabt.js/v1.0.0-nightly.20180421/index.js");
  }
}

let Twiggy: any = null;
declare var wasm_bindgen: any;

async function loadTwiggy() {
  if (!Twiggy) {
    importScripts("../lib/twiggy_wasm_api.js");
    await wasm_bindgen("../lib/twiggy_wasm_api_bg.wasm");
    Twiggy = {
      Items: wasm_bindgen.Items,
      Top: wasm_bindgen.Top,
      Paths: wasm_bindgen.Paths,
      Monos: wasm_bindgen.Monos,
      Dominators: wasm_bindgen.Dominators
    };
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
    [WorkerCommand.AssembleWatWithWabt]: assembleWatWithWabt,
    [WorkerCommand.TwiggyWasm]: twiggyWasm
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

interface IDominator {
  children: IDominator [];
  name: string;
  retained_size: number;
  retained_size_percent: number;
  shallow_size: number;
  shallow_size_percent: number;
}

async function twiggyWasm(data: ArrayBuffer): Promise<string> {
  await loadTwiggy();
  let opts;
  const items = Twiggy.Items.parse(new Uint8Array(data));

  let md = "# Twiggy Analysis\n\nTwiggy is a code size profiler, learn more about it [here](https://github.com/rustwasm/twiggy).\n\n";

  // Top
  opts = Twiggy.Top.new();
  const top: Array<{name: string, shallow_size: number, shallow_size_percent: number}> = JSON.parse(items.top(opts));

  md += "## Top\n\n";
  md += "| Shallow Bytes | Shallow % | Item |\n";
  md += "| ------------: | --------: | :--- |\n";

  let ignoreCount = 0;
  const shallowSizePercentIgnoreThreshold = 0.1;
  top.forEach(entry => {
    if (entry.shallow_size_percent >= shallowSizePercentIgnoreThreshold) {
      md += `| ${entry.shallow_size} | ${entry.shallow_size_percent.toFixed(2)} | \`${entry.name}\` |\n`;
    } else {
      ignoreCount ++;
    }
  });

  if (ignoreCount) {
    md += `\n### Note:\n${ignoreCount} items had a shallow size percent less than ${shallowSizePercentIgnoreThreshold} and were not listed above.\n`;
  }

  // Paths
  // md += "\n\n# Paths\n\n";
  // opts = Twiggy.Paths.new();
  // const paths = JSON.parse(items.paths(opts));

  // Monos
  // md += "\n\n# Monos\n\n";
  // opts = Twiggy.Monos.new();
  // opts.set_max_generics(10);
  // opts.set_max_monos(10);
  // const monos = JSON.parse(items.monos(opts));

  md += "\n\n## Dominators\n\n";
  md += "| Retained Bytes | Retained % | Dominator Tree |\n";
  md += "| ------------: | --------: | :--- |\n";

  // Dominators
  const retainedSizePercentIgnoreThreshold = 0.1;
  ignoreCount = 0;
  opts = Twiggy.Dominators.new();
  const dominator: IDominator = JSON.parse(items.dominators(opts));
  function printDominator(dominator: IDominator, depth: number) {
    let prefix = "";
    for (let i = 0; i < depth - 1; i++) {
      prefix += "   ";
    }
    if (depth) {
      prefix += "⤷ ";
    }
    md += `| ${dominator.retained_size} | ${dominator.retained_size_percent.toFixed(2)} | \`${prefix + dominator.name}\` |\n`;
    if (dominator.children) {
      dominator.children.forEach(child => {
        if (child.retained_size_percent >= retainedSizePercentIgnoreThreshold) {
          printDominator(child, depth + 1);
        } else {
          ignoreCount ++;
        }
      });
    }
  }
  printDominator(dominator, 0);
  if (ignoreCount) {
    md += `\n### Note:\n${ignoreCount} items had a retained size percent less than ${retainedSizePercentIgnoreThreshold} and were not listed above.\n`;
  }
  return Promise.resolve(md);
}
