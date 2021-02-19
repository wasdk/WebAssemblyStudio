/// This module makes it known to Rust that
/// there is an external (non-Rust) function
/// called `random`. It takes no arguments
/// and returns a float.

extern {
    pub fn random() -> f64;
}