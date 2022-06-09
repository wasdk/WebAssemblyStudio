/**
 * Handles direct filesystem actions taken outside of react and ensures
 * they show up in the explorer / editor.
 */
import { fsEvents, path } from "../globals";
import { Directory, File, FileType, ModelRef } from "../models";
import appStore from "../stores/AppStore";

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

function writeFile(args: any[]) {
  const err = new Error();
  if (!err.stack.match(/at (new )?File/g)) {
    if (args[0] === "project/assembly/main.ts") {
      debugger;
    }
    const file = ensureExplorerFile(args);
    file.data = args[1];
  }
}

fsEvents.on("open", ensureExplorerFile);
fsEvents.on("openSync", ensureExplorerFile);
fsEvents.on("writeFileSync", writeFile);
fsEvents.on("writeFile", writeFile);

export default () => {};
