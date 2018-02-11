gulp.task("build", async () => {
  const asc = require("assemblyscript/bin/asc");
  return new Promise((resolve, reject) => {
    asc.main([
      "main.ts",
      "--baseDir", "src",
      "--binaryFile", "../out/main.wasm",
      "--sourceMap",
      "--measure"
    ], err => {
      if (err) reject(err);
      else resolve();
    });
  });
});

gulp.task("default", ["build"], async () => {});

gulp.task("project:load", async () => eval(project.getFile("setup.js").data));
