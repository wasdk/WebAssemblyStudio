import * as gulp from "gulp";
import { Service, project, activeTab } from "@wasm/studio-utils";
import { IceteaWeb3 } from "@iceteachain/web3";
import * as base64ArrayBuffer from "base64-arraybuffer";

const buildWasm = async (file: string) => {
  // opt_level: "s": optimize for small build
  const options = { lto: true, opt_level: "s", debug: true };
  const inFile = project.getFile("src/" + file + ".rs");
  const compileResult = await Service.compileFileWithBindings(inFile, "rust", "wasm", options);
  const outFileName = "out/" + file + ".wasm"
  const outFile = project.newFile(outFileName, "wasm", true);
  outFile.setData(compileResult.wasm);
  logLn("Output file: " + outFileName);
  return outFile;
}

const deployWasm = async (file: string) => {
  const tweb3 = new IceteaWeb3("https://rpc.icetea.io");

  // Create a new account to deploy
  // To use existing account, use tweb3.wallet.importAccount(privateKey)
  tweb3.wallet.createAccount();

  const inFileName = "out/" + file + ".wasm"
  logLn("File to deploy: " + inFileName)

  const inFile = project.getFile(inFileName);
  if (!inFile) {
    throw new Error("You need to build the project first.");
  }
  const deployResult = await tweb3.deployWasm(base64ArrayBuffer.encode(inFile.getData()));

  logLn("TxHash: " + deployResult.hash);
  logLn("Address: " + deployResult.address);
  logLn("Test URL: https://devtools.icetea.io/contract.html?address=" + deployResult.address);

  return deployResult;
}

gulp.task("build", () => {
  return buildWasm(activeTab);
})

gulp.task("deploy", () => {
  return deployWasm(activeTab);
})

gulp.task("default", ["build"], async () => { });
