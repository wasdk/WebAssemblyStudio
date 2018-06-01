import * as gulp from "gulp";
import { Service, Arc, project, logLn } from "@wasm/studio-utils";

gulp.task("build", async () => {
    const data = await Service.assembleWat(project.getFile("src/module.wat").getData());
    const outWasm = project.newFile("out/module.wasm", "wasm", true);
    outWasm.setData(data);
});

gulp.task("publish", async () => {
    const rows = 44, cols = 36, frameCount = 1050, fps = 35;
    const { transform } = await (await Service.import('src/module.js')).default();
    const buffer = new ArrayBuffer(cols * rows * frameCount * 3);
    transform(buffer, rows, cols, frameCount, fps, true);

    const jsModule = project.getFile("src/module.js").getData();
    const watSource = project.getFile("src/module.wat").getData();
    const wasmModule = project.getFile("out/module.wasm").getData();
    Arc.publish({
        description: "WASM Module Example",
        author: "",
        animation: {
            rows,
            cols,
            frameCount,
            fps,
            data: buffer,
        },
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
