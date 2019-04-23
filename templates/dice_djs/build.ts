import * as gulp from "gulp";
import { project } from "@wasm/studio-utils";
import { transpile } from "sunseed";

gulp.task("build", async () => {
  const diceSrc = project.getFile("src/dice.djs");
  const dice = await transpile(diceSrc.getData(), { prettier: true });

  const diceJs = project.newFile("out/dice.js", "javascript", true);
  diceJs.setData(dice);
});

gulp.task("default", ["build"], async () => {});
