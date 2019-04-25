import * as gulp from "gulp";
import { Service, project } from "@wasm/studio-utils";
import { IceTeaWeb3 } from "icetea-web3";
import * as base64ArrayBuffer from "base64-arraybuffer";

gulp.task("build", async () => {
  // Optimize for small builds for now
  const options = { lto: true, opt_level: "s", debug: true };
  const storeSrc = project.getFile("src/store.rs");
  const erc20Src = project.getFile("src/erc20.rs");
  const [store, erc20] = await Promise.all([
    Service.compileFileWithBindings(storeSrc, "rust", "wasm", options),
    Service.compileFileWithBindings(erc20Src, "rust", "wasm", options)
  ]);

  const storeWasm = project.newFile("out/store.wasm", "wasm", true);
  const erc20Wasm = project.newFile("out/erc20.wasm", "wasm", true);
  storeWasm.setData(store.wasm);
  erc20Wasm.setData(erc20.wasm);
});

gulp.task("deploy", async () => {
  const tweb3 = new IceTeaWeb3("ws://localhost:26657/websocket");
  tweb3.wallet.importAccount("CJUPdD38vwc2wMC3hDsySB7YQ6AFLGuU6QYQYaiSeBsK");
  const storeSrc = project.getFile("out/store.wasm");
  return tweb3.deployWasm(base64ArrayBuffer.encode(storeSrc.getData()));
});

gulp.task("default", ["build"], async () => {});
