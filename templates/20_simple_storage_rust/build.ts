import * as gulp from "gulp";
import { Service, project } from "@wasm/studio-utils";
import { IceteaWeb3 } from "@iceteachain/web3";
import * as base64ArrayBuffer from "base64-arraybuffer";

const buildWasm = async (file : string) => {
    // opt_level: "s": optimize for small build
    const options = { lto: true, opt_level: "s", debug: true };
    const src = project.getFile("src/" + file + ".rs");
    const result = await Service.compileFileWithBindings(src, "rust", "wasm", options)
  
    const wasm = project.newFile("out/" + file + ".wasm", "wasm", true);
    wasm.setData(result.wasm);
}

const deployWasm = async (file: string) => {
  const tweb3 = new IceteaWeb3("https://rpc.icetea.io");

  // Create a new account to deploy
  // To use existing account, use tweb3.wallet.importAccount(privateKey)
  tweb3.wallet.createAccount()

  const wasm = project.getFile("out/" + file + ".wasm");
  if (!wasm) {
    throw new Error("You need to build the project first.")
  }
  const result = await tweb3.deployWasm(base64ArrayBuffer.encode(wasm.getData()));
  logLn("Deploy successfully " + wasm + " to address " + result.address, "info");
  logLn("https://devtools.icetea.io/contract.html?address=" + result.address, "info");
  return result;
}

gulp.task("build", () => {
  return buildWasm('store')
})

gulp.task("deploy", () => {
  return deployWasm('store')
})

gulp.task("default", ["build"], async () => {});
