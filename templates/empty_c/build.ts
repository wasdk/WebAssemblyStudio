gulp.task("build", async () => {
  const data = await Service.compileFile(project.getFile("src/main.c"), "c", "wasm", "-g -O3");
  const outWasm = project.newFile("out/main.wasm", "wasm");
  outWasm.setData(data);
});

gulp.task("default", ["build"], async () => {});