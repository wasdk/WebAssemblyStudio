gulp.task("build", async () => require(["asc"], asc => {

  const args = [
    "main.ts",
    "--baseDir", "src",
    "--textFile", "../out/main.wast",
    "--binaryFile", "../out/main.wasm",
    "--asmjsFile", "../out/main.asm.js",
    "--sourceMap",
    "--measure"
  ];

  project.setStatus("Building Project ...");
  logLn(`Executing: asc ${args.join(" ")}\n`, "info");
  asc.main(args, {
    stdout: asc.createMemoryStream(),
    stderr: asc.createMemoryStream(logLn),
    readFile: (filename) => project.getFile(filename.replace(/^\//, "")).data,
    writeFile: (filename, contents) => project.newFile(filename.replace(/^\//, ""), Language.of(filename)).setData(contents),
    listFiles: (dirname) => []
  }, err => err ? logLn(err.message, "error") : logLn("SUCCESS", "info"));

}));

gulp.task("default", ["build"], async () => {});

require.config({ paths: {
  "binaryen": "https://rawgit.com/AssemblyScript/binaryen.js/master/index",
  "assemblyscript": "https://rawgit.com/AssemblyScript/assemblyscript/master/dist/assemblyscript",
  "asc": "https://rawgit.com/AssemblyScript/assemblyscript/master/dist/asc"
}});
