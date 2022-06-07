import { FitAddon } from 'xterm-addon-fit';
import { WebglAddon } from 'xterm-addon-webgl';
import { WebLinksAddon } from 'xterm-addon-web-links';

export function register(terminal) {
  terminal.loadAddon(new WebLinksAddon());
  const webglAddon = new WebglAddon();
  terminal.loadAddon(webglAddon);
  webglAddon.onContextLoss((e) => {
    webglAddon.dispose();
  });
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  fitAddon.activate(terminal);
  terminal.refit = () => fitAddon.fit();

  // fix issue where resize is going too far on initial render
  fitAddon.fit();
  const dims = fitAddon.proposeDimensions();
  terminal.resize(dims.cols, dims.rows - 2);
}
