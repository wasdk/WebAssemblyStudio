const gulp = require("gulp");
/*
  Runtime variants:

  "--runtime", "full" (default)
    A proper memory manager and reference-counting based garbage collector, with runtime interfaces
    being exported to the host for being able to create managed objects externally.

  "--runtime", "half"
    The same as full but without any exports, i.e. where creating objects externally is not required.
    This allows the optimizer to eliminate parts of the runtime that are not needed.

  "--runtime", "stub"
    A minimalist arena memory manager without any means of freeing up memory again, but the same external
    interface as full. Useful for very short-lived programs or programs with hardly any memory footprint,
    while keeping the option to switch to full without any further changes. No garbage collection.

  "--runtime", "none"
    The same as stub but without any exports, for the same reasons as explained in half. Essentially
    evaporates entirely after optimizations.

    For more information see: https://docs.assemblyscript.org/details/runtime
*/
gulp.task("build", callback => {
  const asc = require("assemblyscript/bin/asc");
  asc.main([
    "main.ts",
    "--baseDir", "assembly",
    "--binaryFile", "../out/main.wasm",
    "--sourceMap",
    "--measure",
    "--runtime", "half",
    "--optimize"
  ], callback);
});

gulp.task("default", ["build"]);

// This task is not required when running the project locally. Its purpose is to set up the
// AssemblyScript compiler when a new project has been loaded in WebAssembly Studio.
gulp.task("project:load", () => {
  const utils = require("@wasm/studio-utils");
  utils.eval(utils.project.getFile("setup.js").getData(), {
    logLn,
    project,
    monaco,
    fileTypeForExtension,
  });
});
