# Hello World in C

Level: *Advanced*

This project prints `"Hello World"` using the well known C `printf` function. This function in turn uses several POSIX APIs that are implemented in JavaScript using DOM APIs.

### Project Overview

* `main.c` - Imports `stdio.h` and calls `printf("Hello World")`.
* `main.js` - Initializes a runtime environment for the WebAssembly module and implements the necessary WebAssembly imports.

### Things to Explore

1. Click Build to compile `main.c` file to `out/main.wasm`.

2. Open the `out/main.wasm` file and notice that there's quite a bit of code. This is somewhat surprising given that our program is so small. The vast majority of this code implements the `printf` function. 

3. Notice the imports section, these are SysCalls. To get this WebAssembly module running you'll have to implement these functions first. However, note that these import names don't actually tell you what SysCalls are used, they are merely function stubs (one for each number of parameters). 

```
  (import "env" "__syscall0" (func $env.__syscall0 (type $t2)))
  (import "env" "__syscall3" (func $env.__syscall3 (type $t5)))
  (import "env" "__syscall1" (func $env.__syscall1 (type $t8)))
  ...
```

4. To figure that out which SysCalls are being used, you'll have to run the module. I ran it and got `45`, `146` and `192`. You can figure out what these numbers mean by looking them up in the [Linux SysCall Reference](https://syscalls.kernelgrok.com/). They are [brk()](http://man7.org/linux/man-pages/man2/brk.2.html), [writev()](http://man7.org/linux/man-pages/man2/writev.2.html) and [mmap()](http://man7.org/linux/man-pages/man2/mmap2.2.html). To make this WebAssembly module run, you'll just have to implement a tiny Linux kernel in JavaScript, no biggie.

5. Take a look at `src/main.js`, this file emulates these basic SysCalls in JavaScript.

6. `brk()` can be stubbed to return `0`, which is the success error code. `brk()` is used to allocate more memory to a process. WebAssembly does handles memory differently, so there's no need to do special here. 

7. `mmap2()` is used to request more memory within the process. In our example, it's implemented as a call to the WebAssembly `memory.grow()` function.

8. `writev()` is used to write data to files. Its signature is `writev(int fd, const struct iovec *iov, int iovcnt)`. We can ignore the `fd` file descriptor parameter, and focus on the `iov` structure. The problem here is that on the JavaScript side we have a hard time pulling the `struct iovec` abart. We could figure it out, but a neat hack is to call back into the WebAssembly module and have some C code unpack it for us.

9. Click Run

```
Hello World
```