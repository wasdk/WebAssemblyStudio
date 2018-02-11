gulp.task("build", async () => {
  const asc = require("assemblyscript/bin/asc");
  return asc.main([
    "main.ts",
    "--baseDir", "src",
    "--binaryFile", "../out/main.wasm",
    "--sourceMap",
    "--measure"
  ], err => {
    if (err)
      return Promise.reject(err);
    else
      return Promise.resolve();
  });
});

gulp.task("default", ["build"], async () => {});

gulp.task("project:load", async () => eval(project.getFile("setup.ts").data));
