import * as gulp from "gulp";
import { Service, Arc, project, logLn } from "@wasm/studio-utils";

gulp.task("build", async () => {
    const data = await Service.assembleWat(project.getFile("src/module.wat").getData());
    const outWasm = project.newFile("out/module.wasm", "wasm", true);
    outWasm.setData(data);
});

gulp.task("publish", async () => {
    const jsModule = project.getFile("src/module.js").getData();
    const watSource = project.getFile("src/module.wat").getData();
    const wasmModule = project.getFile("out/module.wasm").getData();
    Arc.publish({
        description: "WASM Module Example",
        author: "",
        entry: "src/module.js",
        files: {
            "src/module.js": jsModule,
            "src/module.wat": watSource,
            "out/module.wasm": wasmModule,
        }
    });
    logLn("WASM Module was published.")
});

gulp.task("default", ["build"], async () => {});
