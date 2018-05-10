import * as gulp from "gulp";
import { Service, project } from "@wasm/studio-utils";

gulp.task("build", async () => {});

gulp.task("publish", async () => {
    const jsModule = project.getFile("src/module.js").getData();
    // TODO
});

gulp.task("default", ["build"], async () => {});
