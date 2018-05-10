import * as gulp from "gulp";
import { Arc, project, logLn } from "@wasm/studio-utils";

gulp.task("build", async () => {});

gulp.task("publish", async () => {
    const jsModule = project.getFile("src/module.js").getData();
    Arc.publish({
        description: "ES Module Example",
        author: "",
        entry: "src/module.js",
        files: {
            "src/module.js": jsModule,
        }
    });
    // Old version: Arc.publishJSModule(jsModule);
    logLn("ES Module was published.")
});

gulp.task("default", ["build"], async () => {});
