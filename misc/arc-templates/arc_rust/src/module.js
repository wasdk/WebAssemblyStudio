const imports = {
  env: {
    sinf(x) { return Math.sin(x); },
    cosf(x) { return Math.cos(x); },
  }
};

export default function () {
  // Loading wasm modules
  return WebAssembly.instantiateStreaming(fetch("../out/module.wasm"), imports).then(({instance}) => {
    return {
      transform(buffer, rows, cols, frameCount, fps, isFirst) {
        const size = rows * cols * frameCount * 3;
        // Allocate memory in the wasm memory (and copy input buffer).
        const p = instance.exports.alloc(size);
        const temp = new Uint8Array(instance.exports.memory.buffer, p, size);
        const out = new Uint8Array(buffer, 0, size);
        if (!isFirst) temp.set(out);
        // Transform
        instance.exports.transform(p, rows, cols, frameCount, fps, isFirst);
        // Transfer data to the output buffer and release wasm memory
        out.set(temp);
        instance.exports.dealloc(p, size);
      },
    };
  })
}
