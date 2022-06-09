import { fs, path } from "../globals";
import { Directory, File, FileType, ModelRef } from "../models";
import appStore from "../stores/AppStore";
const ignore = [
  "Volume",
  "vol",
  "createFsFromVolume",
  "fs",
  "F_OK",
  "R_OK",
  "W_OK",
  "X_OK",
  "constants",
  "Stats",
  "Dirent",
  "StatWatcher",
  "FSWatcher",
  "WriteStream",
  "ReadStream",
  "promises",
  "_toUnixTimestamp",
  "semantic",
];

function ensureExplorerFile(args: any[]) {
  const abspath = path.resolve(args[0]);
  let file: ModelRef<File> | File = appStore.getFileByName(abspath);
  let directory: ModelRef<File> = appStore.getFileByName(path.dirname(abspath));
  if (!file && directory) {
    const dir = directory.obj as Directory;
    file = new File(abspath, FileType.Unknown);
    dir.addFile(file);
  }
  return file as File;
}

Object.keys(fs).forEach((key: string) => {
  if (ignore.includes(key)) {
    return;
  }
  const org = (fs as any)[key];
  (fs as any)[key] = (...args: any[]) => {
    console.log("[fs spy]", key, args);
    if (key.startsWith("open")) {
      // open, openSync
      ensureExplorerFile(args);
    }
    if (key.startsWith("writeFile")) {
      // writeFile, writeFileSync
      const err = new Error();
      // this call was made from a new File. Don't get caught recursing
      if (!err.stack.includes("at new File")) {
        const file = ensureExplorerFile(args);
        file.data = args[1];
      }
    }
    return org(...args);
  };
});

export default () => {};
