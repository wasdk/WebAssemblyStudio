function languageOf(filename) {
  const ext = filename.substring(filename.lastIndexOf(".") + 1);
  switch (ext) {
    case "c": return Language.C;
    case "cpp": return Language.Cpp;
    case "wast": return Language.Wast;
    case "wasm": return Language.Wasm;
    case "rs": return Language.Rust;
    case "cton": return Language.Cretonne;
    case "x86": return Language.x86;
    case "json": case "map": return Language.Json;
    case "js": return Language.JavaScript;
    case "ts": return Language.TypeScript;
    default: return Language.Text;
  }
}

require.config({
  paths: {
    "binaryen": "https://rawgit.com/AssemblyScript/binaryen.js/master/index",
    "assemblyscript": "https://rawgit.com/AssemblyScript/assemblyscript/master/dist/assemblyscript",
    "assemblyscript/bin/asc": "https://rawgit.com/AssemblyScript/assemblyscript/master/dist/asc"
  }
});
require(["assemblyscript/bin/asc"], asc => {
  monaco.languages.typescript.typescriptDefaults.addExtraLib(asc.definitionFiles.assembly);
  asc.main = (main => (args, options, fn) => {
    if (typeof options === "function") {
      fn = options;
      options = undefined;
    }
    main(args, options || {
      stdout: asc.createMemoryStream(),
      stderr: asc.createMemoryStream(logLn),
      readFile: (filename) => project.getFile(filename.replace(/^\//, "")).data,
      writeFile: (filename, contents) => project.newFile(filename.replace(/^\//, ""), languageOf(filename)).setData(contents),
      listFiles: (dirname) => []
    }, fn);
  })(asc.main);
});
