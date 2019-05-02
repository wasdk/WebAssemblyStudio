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
  const tweb3 = new IceTeaWeb3("https://kitchensink.icetea.io/api");
  tweb3.wallet.importAccount("FFEewpqqtnr7ddB1upMMVvTm5dbEJUYWi2iwA4eyshsM");
  const storeSrc = project.getFile("out/store.wasm");
  if (!storeSrc) {
    throw new Error("You need to build the project first.")
  }
  const result = await tweb3.deployWasm(base64ArrayBuffer.encode(storeSrc.getData()));
  logLn("Deploy successfully to address " + result.address, "info");
  logLn("https://kitchensink.icetea.io/contract.html?address=" + result.address, "info");
  return result;
});

gulp.task("default", ["build"], async () => {});
