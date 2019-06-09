import * as gulp from "gulp";
import { project } from "@wasm/studio-utils";
import { transpile } from "@iceteachain/sunseed";
import { IceteaWeb3 } from "@iceteachain/web3";

const buildJs = async (file: string) => {

  const inFile = project.getFile("src/" + file + ".djs");
  const compiledSrc = await transpile(inFile.getData(), {
    prettier: true,
    project,
    context: "src"
  });

  const outFileName = "out/" + file + ".js";
  const outFile = project.newFile(outFileName, "javascript", true);
  outFile.setData(compiledSrc);
  logLn("Output file: " + outFileName);
}

const deployJs = async (file: string) => {
  const tweb3 = new IceteaWeb3("https://rpc.icetea.io");

  // Create a new account to deploy
  // To use existing account, use tweb3.wallet.importAccount(privateKey)
  tweb3.wallet.createAccount();

  const inFileName = "out/" + file + ".js"
  logLn("File to deploy: " + inFileName)

  const inFile = project.getFile(inFileName);
  if (!inFile) {
    throw new Error("You need to build the project first.");
  }
  const deployResult = await tweb3.deployJs(inFile.getData());

  logLn("TxHash: " + deployResult.hash);
  logLn("Address: " + deployResult.address)
  logLn("Test URL: https://devtools.icetea.io/contract.html?address=" + deployResult.address);

  return deployResult;
}

gulp.task("build", () => {
  return buildJs('mycontract');
})

gulp.task("deploy", () => {
  return deployJs('mycontract');
})

gulp.task("default", ["build"], async () => { });
