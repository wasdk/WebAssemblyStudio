import { fs } from "memfs";
// import { Directory, File } from "./models";
import appStore from "./stores/AppStore";
// import { spy } from "spyfs";

// const fs = spy(memfs);

// fs.subscribe(async (action: { method: string; isAsync: boolean; args: any[]; exec: () => {} }) => {
//   console.log(action.method);
//   console.log(action.args);
//   const result = action.exec();
// });

// const fs: typeof memfs = {
//   ...memfs,
//   realpathSync(fileOrFolderPath: string, options: any) {
//     if (path.resolve(fileOrFolderPath) === "/") {
//       return "/";
//     }
//     return memfs.realpathSync(fileOrFolderPath, options);
//   },
//   chmodSync(..._args: []) {
//     // no-op
//   },
// };

// const ignore = [
//   "Volume",
//   "vol",
//   "createFsFromVolume",
//   "fs",
//   "F_OK",
//   "R_OK",
//   "W_OK",
//   "X_OK",
//   "constants",
//   "Stats",
//   "Dirent",
//   "StatWatcher",
//   "FSWatcher",
//   "WriteStream",
//   "ReadStream",
//   "promises",
//   "_toUnixTimestamp",
//   "semantic",
// ];
// Object.keys(fs).forEach((key: string) => {
//   if (ignore.includes(key)) {
//     return;
//   }

//   const org = (fs as any)[key];
//   (fs as any)[key] = (...args: any[]) => {
//     console.log("[fs spy]", key, args);
//     if (key.startsWith("open")) {
//       // open, openSync
//       const file = appStore.getFileByName(args[0]);
//       try {
//         fs.readFileSync(args[0]);
//       } catch (e) {
//         if (e.code === "ENOENT") {
//           fs.writeFileSync(args[0], "");
//         }
//         // TODO: Track errors?
//       }
//     }
//     return org(...args);
//   };
// });

export const os = require("os-browserify/browser");
export const path = require("path-browserify");
export const util = require("util/");
export const process = require("process/browser");
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
export { fs } from "memfs";
export default {
  fs,
  os,
  path,
  util,
  process,
};
