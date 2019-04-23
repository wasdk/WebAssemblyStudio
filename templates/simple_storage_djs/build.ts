import * as gulp from "gulp";
import { project } from "@wasm/studio-utils";
import { transpile } from "sunseed";

gulp.task("build", async () => {
  const storeSrc = project.getFile("src/simplestore.djs");
  const store = await transpile(storeSrc.getData(), { prettier: true });

  const storeJs = project.newFile("out/simplestore.js", "javascript", true);
  storeJs.setData(store);
});

gulp.task("default", ["build"], async () => {});
