export function register(shell) {
  shell.command("react-ode", async (shell, args, opts) => {
    if (opts.v || opts.version) shell.printLine(require("../../../package.json").version);
    if (opts.h || Object.keys(opts).length === 1)
      shell.printLine(`Available commands\n${shell.commands.map((cmd) => ` - ${cmd}`).join("\n")}`);
  });
}
