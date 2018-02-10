require.config({ paths: {
  "binaryen": "https://rawgit.com/AssemblyScript/binaryen.js/master/index",
  "assemblyscript": "https://rawgit.com/AssemblyScript/assemblyscript/master/dist/assemblyscript",
  "asc": "https://rawgit.com/AssemblyScript/assemblyscript/master/dist/asc"
}});

gulp.task("build", async () => {
  require(["asc"], asc => {

    const stdout = asc.createMemoryStream();
    const stderr = asc.createMemoryStream();

    asc.main([
      "src/main.ts",
      "--binaryFile", "out/main.wasm"
    ], {
      stdout: stdout,
      stderr: stderr,
      readFile: filename => {
        try {
          return project.getFile(filename.substring(1)).data;
        } catch (e) {
          return null;
        }
      },
      writeFile: (filename, contents) => project.newFile(filename.substring(1), "wasm").setData(contents),
      listFiles: dirname => { /* TODO */ }
    });
  });
});

gulp.task("default", ["build"], async () => {});
