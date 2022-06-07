export const fs = require('memfs');
export const os = require('os-browserify/browser');
export const path = require('path-browserify');
export const util = require('util/');
export const process = require('process/browser');

process.chdir = function (dir) {
  this.cwd = () => {
    return path.resolve(dir);
  };
};
process.listenerCount = function (sym) {
  return this.listeners ? this.listeners(sym).length : 0;
};
process.hrtime = require('browser-process-hrtime');

process.stderr = {
  write: (...args) => console.error('stderr', ...args),
};
process.stdout = {
  write: (...args) => console.log('stdout', ...args),
};
const globalState = {
  fs,
  os,
  path,
  util,
  process,
};
export default globalState;
