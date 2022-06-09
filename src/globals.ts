import { EventEmitter } from "eventemitter3";
import { fs as memfs } from "memfs";

export const fsEvents = new EventEmitter();
export const fs = new Proxy(memfs, {
  get(target, prop, receiver) {
    return (...args: any[]) => {
      // @ts-ignore
      fsEvents.emit(prop, args);
      return Reflect.get(target, prop, receiver).apply(target, args);
    };
  },
});

export const os = require("os-browserify/browser");
export const path = require("path-browserify");
export const util = require("util/");
export const process = require("process/browser");
process.getMaxListeners = () => {
  return 0;
};
process.chdir = function (dir: string) {
  const abspath = path.resolve(dir);
  process.cwd = () => {
    return abspath;
  };
};
process.listenerCount = function (sym: any) {
  return this.listeners ? this.listeners(sym).length : 0;
};
process.hrtime = require("browser-process-hrtime");

process.stderr = {
  write: (...args: any[]) => console.error("stderr", ...args),
};
process.stdout = {
  write: (...args: any[]) => console.log("stdout", ...args),
};

// @ts-ignore
globalThis.fs = fs;
export default {
  fs,
  os,
  path,
  util,
  process,
};
