// This file is not required when running the project locally. Its purpose is to set up the
// AssemblyScript compiler when a new project has been loaded in WebAssembly Studio.
require.config({
  paths: {
    "binaryen": "https://cdn.jsdelivr.net/npm/binaryen@latest/index",
    "assemblyscript": "https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/assemblyscript",
    "assemblyscript/bin/asc": "https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/asc",
  }
});
logLn("Loading AssemblyScript compiler ...");
require(["assemblyscript/bin/asc"], asc => {
  monaco.languages.typescript.typescriptDefaults.addExtraLib(asc.definitionFiles.assembly);
  asc.main = (main => (args, options, fn) => {
    if (typeof options === "function") {
      fn = options;
      options = undefined;
    }
    return main(args, options || {
      stdout: asc.createMemoryStream(),
      stderr: asc.createMemoryStream(logLn),
      readFile: (filename, baseDir) => {
        const file = project.getFile(baseDir + "/" + filename.replace(/^\//, ""));
        return file ? file.data : null;
      },
      writeFile: (filename, contents) => {
        const name = filename.startsWith("../") ? filename.substring(3) : filename;
        const type = fileTypeForExtension(name.substring(name.lastIndexOf(".") + 1));
        project.newFile(name, type, true).setData(contents);
      },
      listFiles: () => []
    }, fn);
  })(asc.main);
  logLn("AssemblyScript compiler is ready!");
});
