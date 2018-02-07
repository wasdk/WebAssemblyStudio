Web Assembly Studio
====
[![Build Status](https://travis-ci.org/wasdk/WebAssemblyStudio.svg?branch=master)](https://travis-ci.org/wasdk/WebAssemblyStudio)

This repository contains the [Web Assembly Studio](https://webassembly.studio) website source code.

Running your own local copy of the website
===

To run a local copy, you will need to install node.js and webpack on your computer, then run the following commands:

```
npm install
npm install --dev
```

To build Web Assembly Studio whenever a file changes run:

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
