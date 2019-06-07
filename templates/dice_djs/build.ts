import * as gulp from "gulp";
import { project } from "@wasm/studio-utils";
import { transpile } from "@iceteachain/sunseed";
import { IceteaWeb3 } from "@iceteachain/web3";

gulp.task("build", async () => {
  const diceSrc = project.getFile("src/dice.djs");
  const dice = await transpile(diceSrc.getData(), { prettier: true });

  const diceJs = project.newFile("out/dice.js", "javascript", true);
  diceJs.setData(dice);
});

gulp.task("deploy", async () => {
  const tweb3 = new IceteaWeb3("https://rpc.icetea.io");
  tweb3.wallet.createAccount();
  const storeSrc = project.getFile("out/dice.js");
  if (!storeSrc) {
    throw new Error("You need to build the project first.");
  }
  const result = await tweb3.deployJs(storeSrc.getData());
  logLn("Deploy successfully " + storeSrc + " to address " + result.address, "info");
  logLn("https://devtools.icetea.io/contract.html?address=" + result.address, "info");
  return result;
});

gulp.task("default", ["build"], async () => {});
