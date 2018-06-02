# ARCH project: Rust Hello World

This template renders a Hello World on the Arch!

The text is encoded as a list of 64 base-2 literals in `src/lib.rs`. You can change the text by
changing which bits are set or unset.

**For further changes to the rendering, the `Glow.fill_frame` and `apply` functions in `src/lib.rs` are good starting points.**

## Further information about the file structure

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

## Background on Rust

Rust is a compiled language- so to work with it- you'll need to have the code compile
(this is how it becomes WebAssembly!) To compile your code you can click `Build` - which
runs `cargo build --target wasm32-unknown-unknown`. The Rust compiler helps ensure your
code will run correctly- and catch bugs for you before it runs! You'll need to make the
code compile before it will run! You can look for compiler errors in the interface-
be sure to read the error messages as they are very helpful and often have suggestions
on how to fix your code to make it work!

## How to get more help

If you need help, you can join the Mozilla IRC #rust-wasm channel and ask questions!

Here's an easy link for joining IRC: https://kiwiirc.com/client/irc.mozilla.org:+6667/#rust-wasm
