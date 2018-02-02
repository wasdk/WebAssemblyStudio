[{
  "name": "C Hello World",
  "description": `# Hello World in C
Creates a C project that prints "Hello World" using a minimal POSIX API.
`,
  "icon": "svg/file_type_c.svg",
  "project": {
    "name": "Project",
    "directory": "hello_world_c",
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
        "data": `gulp.task("build", async () => {
  const data = await Service.compileFile(project.getFile("src/main.c"), "c", "wasm", "-g -O3");
  const outWasm = project.newFile("out/main.wasm", "wasm");
  outWasm.setData(data);
  const result = await Service.disassembleWasm(data);
  outWasm.buffer.setValue(result);
});

gulp.task("default", ["build"], async () => {});`
    }, {
      "name": "README.md",
      "type": "markdown",
      "data": `# Hello World in C
A C project that prints "Hello World" using a minimal POSIX API.
`
    }],
    "openedFiles": [
      ["README.md"]
    ]
  }
}]