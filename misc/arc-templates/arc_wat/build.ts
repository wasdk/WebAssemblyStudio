import * as gulp from "gulp";
import { Service, Arc, project, logLn } from "@wasm/studio-utils";

gulp.task("build", async () => {
    const data = await Service.assembleWat(project.getFile("src/module.wat").getData());
    const outWasm = project.newFile("out/module.wasm", "wasm", true);
    outWasm.setData(data);
});

gulp.task("publish", async () => {
    // Executing the module to get the frames data.
    const rows = 30, cols = 40, frameCount = 50, fps = 10;
    const { transform } = await (await Service.import('src/module.js')).default();
    const buffer = new ArrayBuffer(cols * rows * frameCount * 3);
    transform(buffer, rows, cols, frameCount, fps, true);

    const jsModule = project.getFile("src/module.js").getData();
    const watSource = project.getFile("src/module.wat").getData();
    const wasmModule = project.getFile("out/module.wasm").getData();
    Arc.publish({
        description: "WASM Module Example",
        author: "",
        image: {
            rows,
            cols,
            frameCount,
            fps,
            data: new Uint8Array(buffer),
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
