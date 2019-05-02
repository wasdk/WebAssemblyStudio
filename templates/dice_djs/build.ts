import * as gulp from "gulp";
import { project } from "@wasm/studio-utils";
import { transpile } from "sunseed";
import { IceTeaWeb3 } from "icetea-web3";

gulp.task("build", async () => {
  const diceSrc = project.getFile("src/dice.djs");
  const dice = await transpile(diceSrc.getData(), { prettier: true });

  const diceJs = project.newFile("out/dice.js", "javascript", true);
  diceJs.setData(dice);
});

gulp.task("deploy", async () => {
  const tweb3 = new IceTeaWeb3("https://kitchensink.icetea.io/api");
  tweb3.wallet.importAccount("FFEewpqqtnr7ddB1upMMVvTm5dbEJUYWi2iwA4eyshsM");
  const storeSrc = project.getFile("out/dice.js");
  if (!storeSrc) {
    throw new Error("You need to build the project first.");
  }
  const result = await tweb3.deployJs(storeSrc.getData());
  logLn("Deploy successfully to address " + result.address, "info");
  logLn("https://kitchensink.icetea.io/contract.html?address=" + result.address, "info");
  return result;
});

gulp.task("default", ["build"], async () => {});
