require.config({
  paths: {
    "binaryen": "https://rawgit.com/AssemblyScript/binaryen.js/master/index",
    "assemblyscript": "https://rawgit.com/AssemblyScript/assemblyscript/master/dist/assemblyscript",
    "assemblyscript/bin/asc": "https://rawgit.com/AssemblyScript/assemblyscript/master/dist/asc"
  }
});
require(["assemblyscript/bin/asc"], asc => {
  monaco.languages.typescript.typescriptDefaults.addExtraLib(asc.definitionFiles.assembly);
  const opts = {
    stdout: asc.createMemoryStream(),
    stderr: asc.createMemoryStream(logLn),
    readFile: (filename) => project.getFile(filename.replace(/^\//, "")).data,
    writeFile: (filename, contents) => project.newFile(filename.replace(/^\//, ""), Language.of(filename)).setData(contents),
    listFiles: (dirname) => []
  };
  const main = asc.main;
  asc.main = (args, options, fn) => {
    if (typeof options === "function") {
      fn = options;
      options = undefined;
    }
    main(args, options || opts, fn);
  };
});
