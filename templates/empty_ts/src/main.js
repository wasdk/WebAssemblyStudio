WebAssembly.instantiateStreaming(fetch("../out/main.wasm"), {
  env: {
    sayHello: function () {
      console.log("Hello from WebAssembly!");
    },
    abort: function (msg, file, line, column) {
      console.error("abort called at main.ts:" + line + ":" + column);
    }
  },
  console: {
    logi: function (value) { console.log('logi: ' + value); },
    logf: function (value) { console.log('logf: ' + value); }
  }
}).then(result => {
  const exports = result.instance.exports;
  document.getElementById("container").innerText = "Result: " + exports.add(19, 23);
}).catch(console.error);
