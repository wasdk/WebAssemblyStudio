WebAssembly.instantiateStreaming(fetch(getFileURL("out/main.wasm")), {})
.then(result => {
  const { module, instance } = result;
  const exports = instance.exports;

  document.getElementById("container").innerText = getString(exports.message()) + ": " + exports.add(19, 23);

  function getString(ptr) {
    const len = new Uint32Array(exports.memory.buffer, ptr)[0];
    const str = new Uint16Array(exports.memory.buffer, ptr + 4).subarray(0, len);
    return String.fromCharCode.apply(String, str);
  }
});
