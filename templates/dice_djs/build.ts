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
  const tweb3 = new IceTeaWeb3("ws://localhost:26657/websocket");
  tweb3.wallet.importAccount("CJUPdD38vwc2wMC3hDsySB7YQ6AFLGuU6QYQYaiSeBsK");
  const storeSrc = project.getFile("out/dice.js");
  return tweb3.deployJs(storeSrc.getData());
});

gulp.task("default", ["build"], async () => {});
