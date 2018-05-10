import * as gulp from "gulp";
import { Service, project } from "@wasm/studio-utils";

gulp.task("build", async () => {
    const data = await Service.assembleWat(project.getFile("src/module.wat").getData());
    const outWasm = project.newFile("out/module.wasm", "wasm", true);
    outWasm.setData(data);
});

gulp.task("publish", async () => {
    const jsModule = project.getFile("src/module.js").getData();
    const watModule = project.getFile("src/module.wat").getData();
    // TODO
});

gulp.task("default", ["build"], async () => {});
