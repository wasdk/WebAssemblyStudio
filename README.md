WebAssembly Studio
====
[![Build Status](https://travis-ci.org/wasdk/WebAssemblyStudio.svg?branch=master)](https://travis-ci.org/wasdk/WebAssemblyStudio) [![Coverage Status](https://coveralls.io/repos/github/wasdk/WebAssemblyStudio/badge.svg)](https://coveralls.io/github/wasdk/WebAssemblyStudio)

This repository contains the [WebAssembly Studio](https://webassembly.studio) website source code.

Running your own local copy of the website
===

To run a local copy, you will need to install node.js and webpack on your computer, then run the following commands:

```
npm install
```

To build WebAssembly Studio whenever a file changes run:

```
npm run build-watch
```

To start a dev web server run:

```
npm run dev-server
```

Before submitting a pull request run:

```
npm test
```

### Contributing

Please get familiar with the [contributing guide](https://github.com/wasdk/WebAssemblyStudio/wiki/Contributing).

Any doubts or questions? You can always find us on slack at http://wasm-studio.slack.com

Need a slack invite? https://wasm-studio-invite.herokuapp.com/

### Credits

This project depends on several excellent libraries and tools:

* [Monaco Editor](https://github.com/Microsoft/monaco-editor) is used for rich text editing, tree views and context menus.

* [WebAssembly Binary Toolkit](https://github.com/WebAssembly/wabt) is used to assemble and disassemble `.wasm` files.

* [Binaryen](https://github.com/WebAssembly/binaryen/) is used to validate and optimize `.wasm` files.

* [Clang Format](https://github.com/tbfleming/cib) is used to format C/C++ files.

* [Cassowary.js](https://github.com/slightlyoff/cassowary.js/) is used to make split panes work.

* [Showdown](https://github.com/showdownjs/showdown) is used to automatically preview `.md` files.

* [Capstone.js](https://alexaltea.github.io/capstone.js/) is used to disassemble `x86` code.

* LLVM, Rust, Emscripten running server side.

* And of course: React, WebPack, TypeScript and TSLint.
