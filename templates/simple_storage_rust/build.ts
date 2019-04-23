import * as gulp from "gulp";
import { Service, project } from "@wasm/studio-utils";

gulp.task("build", async () => {
  // Optimize for small builds for now
  const options = { lto: true, opt_level: 's', debug: true };
  const storeSrc = project.getFile("src/store.rs");
  const erc20Src = project.getFile("src/erc20.rs");
  const [store, erc20] = await Promise.all([
    Service.compileFileWithBindings(storeSrc, "rust", "wasm", options),
    Service.compileFileWithBindings(erc20Src, "rust", "wasm", options),
  ]);

  const storeWasm = project.newFile("out/store.wasm", "wasm", true);
  const erc20Wasm = project.newFile("out/erc20.wasm", "wasm", true);
  storeWasm.setData(store.wasm);
  erc20Wasm.setData(erc20.wasm);
});

gulp.task("default", ["build"], async () => {});
