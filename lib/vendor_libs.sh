#!/bin/bash

# binaryen - https://github.com/WebAssembly/binaryen
curl https://raw.githubusercontent.com/WebAssembly/binaryen/master/LICENSE > binaryen.LICENSE
curl https://raw.githubusercontent.com/AssemblyScript/binaryen.js/v48.0.0-nightly.20180624/index.js > ./binaryen.js

# wabt - https://github.com/WebAssembly/wabt/
curl https://raw.githubusercontent.com/WebAssembly/wabt/master/LICENSE > wabt.LICENSE
curl https://raw.githubusercontent.com/AssemblyScript/wabt.js/v1.0.0-nightly.20180421/index.js > ./wabt.js

# AssemblyScript - https://github.com/AssemblyScript/assemblyscript
curl https://raw.githubusercontent.com/AssemblyScript/assemblyscript/420592e/LICENSE > assemblyscript.LICENSE
curl https://raw.githubusercontent.com/AssemblyScript/binaryen.js/e859254/index.js > ./binaryen.assemblyscript.js
curl https://raw.githubusercontent.com/AssemblyScript/assemblyscript/420592e/dist/asc.js > asc.js
curl https://raw.githubusercontent.com/AssemblyScript/assemblyscript/420592e/dist/assemblyscript.js > assemblyscript.js
