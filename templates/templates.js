[{
  "name": "Empty Project",
  "description": `# Empty Project
Creates an empty project with a basic build script.
`,
  "icon": "svg/default_file.svg",
  "project": {
    "name": "Project",
    "children": [{
      "name": "build.ts",
      "type": "typescript",
      "data": "gulp.task(\"build\", () =\u003e {\n  return new Promise((resolve, reject) =\u003e {\n    Service.compileFile(project.getFile(\"src/main.c\"), \"c\", \"wasm\", \"-g -O3\").then((x) =\u003e {\n      let outWasm = project.newFile(\"out/main.wasm\", \"wasm\");\n      outWasm.setData(x);\n      Service.disassembleWasm(x).then((result) =\u003e {\n        outWasm.buffer.setValue(result);\n      });\n    });\n  });\n});\n\ngulp.task(\"default\", [\"build\"], () =\u003e {\n  return new Promise((resolve, reject) =\u003e {\n    resolve();\n  });\n});"
    }, {
      "name": "README.md",
      "type": "markdown",
      "data": `# Empty Project`
    }],
    "openedFiles": [
      ["README.md"]
    ]
  }
},
{
  "name": "C Project",
  "description": `# C Project
Creates a simple C project with a basic build script.
`,
  "icon": "svg/file_type_c.svg",
  "project": null
},
{
  "name": "C Hello World",
  "description": `# Hello World in C
Creates a C project that prints "Hello World" using a minimal POSIX API.
`,
  "icon": "svg/file_type_c.svg",
  "project": {
    "name": "Project",
    "children": [{
      "name": "src",
      "children": [{
        "name": "main.c",
        "type": "c",
        "data": "#include \u003csys/uio.h\u003e\n#define WASM_EXPORT __attribute__((visibility(\"default\")))\n\nWASM_EXPORT\nint main(int zz) {\n  return 42;\n}\n"
      }, {
        "name": "main.js",
        "type": "javascript",
        "data": "let x = getFileURL('out/main.wasm');\n\nlet instance = null;\nlet memoryStates = new WeakMap();\n\nfunction syscall(instance, n, args) {\n  switch (n) {\n    default:\n      console.log(\"Syscall \" + n + \" NYI.\");\n      break;\n    case /* brk */ 45: return 0;\n    case /* writev */ 146:\n      return instance.exports.writev(args[0], args[1], args[2]);\n    case /* mmap2 */ 192:\n      debugger;\n      const memory = instance.exports.memory;\n      let memoryState = memoryStates.get(instance);\n      const requested = args[1];\n      if (!memoryState) {\n        memoryState = {\n          object: memory,\n          currentPosition: memory.buffer.byteLength,\n        };\n        memoryStates.set(instance, memoryState);\n      }\n      let cur = memoryState.currentPosition;\n      if (cur + requested \u003e memory.buffer.byteLength) {\n        const need = Math.ceil((cur + requested - memory.buffer.byteLength) / 65536);\n        memory.grow(need);\n      }\n      memoryState.currentPosition += requested;\n      return cur;\n  }\n}\n\nlet s = \"\";\nfetch(x).then(response =\u003e\n  response.arrayBuffer()\n).then(bytes =\u003e\n  WebAssembly.instantiate(bytes, {\n    env: {\n      __syscall0: function __syscall0(n) { return syscall(instance, n, []); },\n      __syscall1: function __syscall1(n, a) { return syscall(instance, n, [a]); },\n      __syscall2: function __syscall2(n, a, b) { return syscall(instance, n, [a, b]); },\n      __syscall3: function __syscall3(n, a, b, c) { return syscall(instance, n, [a, b, c]); },\n      __syscall4: function __syscall4(n, a, b, c, d) { return syscall(instance, n, [a, b, c, d]); },\n      __syscall5: function __syscall5(n, a, b, c, d, e) { return syscall(instance, n, [a, b, c, d, e]); },\n      __syscall6: function __syscall6(n, a, b, c, d, e, f) { return syscall(instance, n, [a, b, c, d, e, f]); },\n      putc2: function (c) {\n        c = String.fromCharCode(c);\n        if (c == \"\\n\") {\n          console.log(s);\n          s = \"\";\n        } else {\n          s += c;\n        }\n      }\n    }\n  })\n  ).then(results =\u003e {\n    instance = results.instance;\n    document.getElementById(\"container\").innerText = instance.exports.main();\n    \n  });\n\n"
      }, {
        "name": "main.html",
        "type": "html",
        "data": "\u003c!DOCTYPE html\u003e\n\u003chtml\u003e\n\n\u003chead\u003e\n\t\u003cmeta charset='utf-8'\u003e\n\u003c/head\u003e\n\n\u003cbody\u003e\n\t\u003cstyle\u003e\n\t\tbody {\n\t\t\tbackground-color: green;\n\t\t}\n\t\u003c/style\u003e\n\t\u003cscript language=\"javascript\"\u003e\n\n\t\u003c/script\u003e\n\t\u003cscript src=\"src/main.js\"\u003e\u003c/script\u003e\n\tHello World \u003cspan id=\"container\"/\u003e\n\u003c/body\u003e\n\n\u003c/html\u003e"
      }]
    }, {
      "name": "build.ts",
      "type": "typescript",
      "data": "gulp.task(\"build\", () =\u003e {\n  return new Promise((resolve, reject) =\u003e {\n    Service.compileFile(project.getFile(\"src/main.c\"), \"c\", \"wasm\", \"-g -O3\").then((x) =\u003e {\n      let outWasm = project.newFile(\"out/main.wasm\", \"wasm\");\n      outWasm.setData(x);\n      Service.disassembleWasm(x).then((result) =\u003e {\n        outWasm.buffer.setValue(result);\n      });\n    });\n  });\n});\n\ngulp.task(\"default\", [\"build\"], () =\u003e {\n  return new Promise((resolve, reject) =\u003e {\n    resolve();\n  });\n});"
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
},
{
  "name": "C++ Project",
  "description": "C++ Project",
  "icon": "svg/file_type_cpp.svg",
  "project": null
},
{
  "name": "Rust Project",
  "description": "Rust Project",
  "icon": "svg/file_type_rust.svg",
  "project": null
}
]