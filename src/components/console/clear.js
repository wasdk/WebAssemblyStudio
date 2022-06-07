export function register(shell) {
  shell.term.onKey((evt) => {
    // ctrl+l
    if (evt.key === '\f') {
      shell.term.clear();
    }
  });

  shell.command('clear', async (shell, args, opts) => {
    setTimeout(() => {
      shell.shell.term.clear();
    }, 0);
  });
}
