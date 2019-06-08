import * as gulp from "gulp";
import { project } from "@wasm/studio-utils";
import { transpile } from "@iceteachain/sunseed";
import { IceteaWeb3 } from "@iceteachain/web3";

gulp.task("build", async () => {
  const inFile = project.getFile("src/echo.djs");
  const src = await transpile(inFile.getData(), {
    prettier: true,
    project,
    context: "src"
  });

  const outFile = project.newFile("out/echo.js", "javascript", true);
  outFile.setData(src);
});

gulp.task("deploy", async () => {
  const tweb3 = new IceteaWeb3("https://rpc.icetea.io");
  tweb3.wallet.createAccount();
  const outFile = project.getFile("out/echo.js");
  if (!outFile) {
    throw new Error("You need to build the project first.");
  }
  const result = await tweb3.deployJs(outFile.getData());
  logLn("Deploy successfully " + outFile + " to address " + result.address, "info");
  logLn("https://devtools.icetea.io/contract.html?address=" + result.address, "info");
  return result;
});

gulp.task("default", ["build"], async () => {});
