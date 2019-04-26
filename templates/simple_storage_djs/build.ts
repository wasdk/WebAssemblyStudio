import * as gulp from "gulp";
import { project } from "@wasm/studio-utils";
import { transpile } from "sunseed";
import { IceTeaWeb3 } from "icetea-web3";

gulp.task("build", async () => {
  const storeSrc = project.getFile("src/simplestore.djs");
  const store = await transpile(storeSrc.getData(), {
    prettier: true,
    project,
    context: "src"
  });

  const storeJs = project.newFile("out/simplestore.js", "javascript", true);
  storeJs.setData(store);
});

gulp.task("deploy", async () => {
  const tweb3 = new IceTeaWeb3("ws://localhost:26657/websocket");
  tweb3.wallet.importAccount("CJUPdD38vwc2wMC3hDsySB7YQ6AFLGuU6QYQYaiSeBsK");
  const storeSrc = project.getFile("out/simplestore.js");
  return tweb3.deployJs(storeSrc.getData());
});

gulp.task("default", ["build"], async () => {});
