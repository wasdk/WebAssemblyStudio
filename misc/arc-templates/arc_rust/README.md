# Arc project: Rust

Welcome to the Rust Arc project template!


**To create your animation, you'll edit the `apply()` function in the `lib.rs` file.**

There are several other files in the project that have some boilerplate and helper
`Structs` and `functions` to make it easier for you to get up and running:

- `ArcModule` is a struct (sorta like a JS Object!) that represents your module:
  - `rows`: the number of rows, 44
  - `cols`: the number of columns, 36
  - `animation`: a `Vector` (sorta like a JS Array) of `Rgb` structs (frame of color!)

- `Color` is a struct that represents a frame of color
  - `r`: Red (0..255)
  - `g`: Green (0..255)
  - `b`: Blue (0..255)

Rust is a compiled language- so to work with it- you'll need to have the code compile
(this is how it becomes WebAssembly!) To compile your code you can click `Build` - which
runs `cargo build --target wasm32-unknown-unknown`. The Rust compiler helps ensure your
code will run correctly- and catch bugs for you before it runs! You'll need to make the
code compile before it will run! You can look for compiler errors in the interface-
be sure to read the error messages as they are very helpful and often have suggestions
on how to fix your code to make it work!

If you need help, you can join the Mozilla IRC #rust-wasm channel and ask questions!

Here's an easy link for joining IRC: https://kiwiirc.com/client/irc.mozilla.org:+6667/#rust-wasm
