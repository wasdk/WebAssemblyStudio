require.config({ paths: {
  "binaryen": "https://rawgit.com/AssemblyScript/binaryen.js/master/index",
  "assemblyscript": "https://rawgit.com/AssemblyScript/assemblyscript/master/dist/assemblyscript",
  "asc": "https://rawgit.com/AssemblyScript/assemblyscript/master/dist/asc"
}});

gulp.task("build", async () => {
  require(["asc"], asc => {

    const stdout = asc.createMemoryStream();
    const stderr = asc.createMemoryStream();

    const args = [
      "main.ts",
      "--baseDir", "src",
      "--binaryFile", "../out/main.wasm",
      "--sourceMap",
      "--measure"
    ];

    logLn("Executing: asc " + args.join(" ") + "\n");

    asc.main(args, {
      stdout: stdout,
      stderr: stderr,
      readFile: filename => {
        logLn("<< Reading file: " + filename);
        try {
          return project.getFile(filename.substring(1)).data;
        } catch (e) {
          return null;
        }
      },
      writeFile: (filename, contents) => {
        logLn(">> Writing file: " + filename);
        project.newFile(filename.substring(1), "wasm").setData(contents)
      },
      listFiles: dirname => { /* TODO */ }
    }, err => {
      const output = stderr.toString();
      if (output.length)
        logLn("\n" + output);
      if (err)
        logLn("ERROR: " + err + "\n");
      else
        logLn("SUCCESS\n");
    });
  });
});

gulp.task("default", ["build"], async () => {});
