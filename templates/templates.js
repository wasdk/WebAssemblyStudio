[{
  "name": "Empty C Project",
  "description": `# Empty C Project
`,
  "icon": "svg/file_type_c.svg",
  "project": {
    "name": "Project",
    "directory": "empty_c",
    "children": [{
      "name": "src",
      "children": [{
        "name": "main.c",
        "type": "c"
      }, {
        "name": "main.js",
        "type": "javascript",
      }, {
        "name": "main.html",
        "type": "html",
      }]
    }, {
      "name": "build.ts",
      "type": "typescript",
    }, {
      "name": "README.md",
      "type": "markdown",
    }],
    "openedFiles": [
      ["README.md"]
    ]
  }
}, {
  "name": "Empty Rust Project",
  "description": `# Empty Rust Project
`,
  "icon": "svg/file_type_rust.svg",
  "project": {
    "name": "Project",
    "directory": "empty_rust",
    "children": [{
      "name": "src",
      "children": [{
        "name": "main.rs",
        "type": "rust"
      }, {
        "name": "main.js",
        "type": "javascript",
      }, {
        "name": "main.html",
        "type": "html",
      }]
    }, {
      "name": "build.ts",
      "type": "typescript",
    }, {
      "name": "README.md",
      "type": "markdown",
    }],
    "openedFiles": [
      ["README.md"]
    ]
  }
}, {
  "name": "Empty AssemblyScript Project",
  "description": `# Empty AssemblyScript Project

[AssemblyScript](https://github.com/AssemblyScript/assemblyscript) compiles strictly typed TypeScript to WebAssembly using Binaryen.

See the [AssemblyScript wiki](https://github.com/AssemblyScript/assemblyscript/wiki) for further instructions and documentation.
`,
  "icon": "svg/file_type_typescript.svg",
  "project": {
    "name": "Project",
    "directory": "empty_ts",
    "children": [{
      "name": "src",
      "children": [{
        "name": "main.ts",
        "type": "typescript"
      }, {
        "name": "main.js",
        "type": "javascript",
      }, {
        "name": "main.html",
        "type": "html",
      }]
    }, {
      "name": "build.ts",
      "type": "typescript",
    }, {
      "name": "README.md",
      "type": "markdown",
    }],
    "openedFiles": [
      ["README.md"]
    ]
  },
  "onload": `
    require.config({ paths: {
      "binaryen": "https://rawgit.com/AssemblyScript/binaryen.js/master/index",
      "assemblyscript": "https://rawgit.com/AssemblyScript/assemblyscript/master/dist/assemblyscript",
      "assemblyscript/bin/asc": "https://rawgit.com/AssemblyScript/assemblyscript/master/dist/asc"
    }});
    require(["assemblyscript/bin/asc"], asc => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(asc.definitionFiles.assembly);
      const main = asc.main;
      asc.main = (args, fn) => main(args, {
        stdout: asc.createMemoryStream(),
        stderr: asc.createMemoryStream(this.logLn.bind(this)),
        readFile: (filename) => project.getFile(filename.replace(/^\\//, "")).data,
        writeFile: (filename, contents) => project.newFile(filename.replace(/^\\//, ""), Language.of(filename)).setData(contents),
        listFiles: (dirname) => [] // TODO
      }, fn);
    });
  `
}]
