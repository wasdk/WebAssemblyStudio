# Arc project: Rust with external functions

This is an example for using browser functions from WASM. Rust supplies no `random` function, so we are going to use the browsers.

Have a look at `src/browser.rs` for the necessary definitions on the Rust side,`src/lib.rs` for calling and `src/module.js` for the necessary JavaScript setup.

The example implements Conway's Game of Life.
