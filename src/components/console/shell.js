import { createShell } from "shelljs-core";
import stringArgv from "string-argv";
import globals from "../../globals";

export function register(terminal) {
  const ignore = ["exit", "error", "ShellString", "env", "config"];
  const shelljs = createShell({
    fs: globals.fs,
    os: globals.os,
    path: globals.path,
    util: globals.util,
    process: globals.process,
    console,
  });
  Object.keys(shelljs)
    .filter((cmd) => !ignore.includes(cmd))
    .forEach((cmd) => {
      terminal.command(cmd, async (shell, args, orgOpts) => {
        const argv = stringArgv(terminal.currentLine());
        try {
          const res = shelljs[cmd].apply(shell, argv.slice(1));
          shell.printLine(res.stderr || res.stdout);
        } catch (e) {
          console.log(e);
          throw e;
        }
      });
    });
}
