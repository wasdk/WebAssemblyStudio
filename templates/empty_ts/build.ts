const asc = require("asc");

gulp.task("build", async () => {
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
