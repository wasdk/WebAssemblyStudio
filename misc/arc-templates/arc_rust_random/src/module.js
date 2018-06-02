class ArcModule {
  constructor(wasm) {
      this.initialized = false;
      // We setup an object mapping
      // names to functions here and
      // then pass it into the WebAssembly
      // instantiation function further down.
      var foreignFunctions = {env: {
        random: Math.random,
      }};

      if (typeof wasm === 'string') {
        if (!WebAssembly.instantiateStreaming) {
          this.wasmPromise = fetchAndInstantiateFallback(wasm, foreignFunctions);
        } else {
          this.wasmPromise = WebAssembly.instantiateStreaming(fetch(wasm), foreignFunctions);
        }
      } else {
          this.wasmPromise = WebAssembly.instantiate(wasm, foreignFunctions);
      }

      this.wasmPromise = this.wasmPromise.then(result => {
          this.wasmInstance = result.instance;
          this.wasmExports = result.instance.exports;
      });
  }

  get ready() {
      return this.wasmPromise;
  }

  init(rows, cols, frameCount, fps, isFirst) {
      if (!this.wasmInstance) {
          throw new Error("Wasm module not loaded");
      }

      try {
        this.bufferSize = rows * cols * frameCount * 3;
        this.wasmExports.init(rows, cols, frameCount, fps, isFirst);
        this.initialized = true;
      } catch (e) {
        console.log(e.stack);
      }
  }

  transform(input) {
      if (!this.initialized) {
          throw new Error("Wasm module not initialized");
      }

      let bufferOffset = this.wasmExports.getAnimationBuffer();
      let animationBuffer = new Uint8Array(this.wasmExports.memory.buffer, bufferOffset, this.bufferSize);

      animationBuffer.set(input);
      this.wasmExports.apply();
      return animationBuffer;
  }
}

async function fetchAndInstantiateFallback(url, imports) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return WebAssembly.instantiate(buffer, imports);
}

export default async function () {
  let module = new ArcModule("../out/lib.wasm");
  await module.ready;

  return {
    transform(buffer, rows, cols, frameCount, fps, isFirst) {
      module.init(rows, cols, frameCount, fps, isFirst);
      let input = new Uint8Array(buffer);
      let output = module.transform(input);
      input.set(output);
    }
  }
}
