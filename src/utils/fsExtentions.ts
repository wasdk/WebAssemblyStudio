import { fs, path } from "../globals";
import { Directory, File, FileType, ModelRef } from "../models";
import appStore from "../stores/AppStore";
import { addFileTo } from "../actions/AppActions";
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
Object.keys(fs).forEach((key: string) => {
  if (ignore.includes(key)) {
    return;
  }

  const org = (fs as any)[key];
  (fs as any)[key] = (...args: any[]) => {
    console.log("[fs spy]", key, args);
    if (key.startsWith("open")) {
      // open, openSync
      const abspath = path.resolve(args[0]);
      let file: ModelRef<File> | File = appStore.getFileByName(abspath);
      let directory: ModelRef<File> = appStore.getFileByName(path.dirname(abspath));
      if (!file && directory) {
        const dir = directory.obj as Directory;
        file = new File(abspath, FileType.Unknown);
        dir.addFile(file);
      }
    }
    return org(...args);
  };
});

export default () => {};
