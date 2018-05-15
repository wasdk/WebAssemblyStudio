import * as gulp from "gulp";
import { Service, Arc, project, logLn } from "@wasm/studio-utils";

gulp.task("build", async () => {
    const options = { lto: true, opt_level: 's', debug: true };
    const data = await Service.compileFile(project.getFile("src/module.rs"), "rust", "wasm", options);
    const outWasm = project.newFile("out/module.wasm", "wasm", true);
    outWasm.setData(data);
});

gulp.task("publish", async () => {
    const rows = 30, cols = 40, frameCount = 50, fps = 10;
    const { transform } = await (await Service.import('src/module.js')).default();
    const buffer = new ArrayBuffer(cols * rows * frameCount * 3);
    transform(buffer, rows, cols, frameCount, fps, true);
    const animation = Arc.animationBufferToJSON(buffer, rows, cols, frameCount);

    const jsModule = project.getFile("src/module.js").getData();
    const rsSource = project.getFile("src/module.rs").getData();
    const wasmModule = project.getFile("out/module.wasm").getData();
    Arc.publish({
        description: "WASM Module Example",
        author: "",
        animation: {
            rows,
            cols,
            frameCount,
            fps,
            data: animation,
        },
        entry: "src/module.js",
        files: {
            "src/module.js": jsModule,
            "src/module.rs": rsSource,
            "out/module.wasm": wasmModule,
        }
    });
    logLn("Rust Module was published.")
});

gulp.task("default", ["build"], async () => {});
