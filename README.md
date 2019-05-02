Icetea Studio
====

This repository contains the [Icetea Studio](https://studio.icetea.io) website source code.

Running your own local copy of the website
===

To run a local copy, you will need to install node.js and webpack on your computer, then run the following commands:

```
npm install
```

To build Icetea Studio whenever a file changes run:

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

### Credits

This projects started as a fork of [WebAssembly Studio](https://github.com/wasdk/WebAssemblyStudio).

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
