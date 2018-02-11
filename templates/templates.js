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
      "name": "build.js",
      "type": "javascript",
    }, {
      "name": "setup.js",
      "type": "javascript",
      "description": "Setup code for convenient use of the AssemblyScript compiler within WebAssemblyStudio."
    }, {
      "name": "README.md",
      "type": "markdown",
    }],
    "openedFiles": [
      ["README.md"]
    ]
  }
}]
