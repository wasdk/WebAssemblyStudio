static mut module_instance: *mut ArcModule = 0 as *mut ArcModule;

mod browser;
mod color;
mod arc_module;
mod utils;

use color::Rgb;
use arc_module::ArcModule;

pub use utils::init;
pub use utils::getAnimationBuffer;

// we need to import all functions
use browser::random;

#[no_mangle]
pub extern fn apply() {
  // This calls the random function.
  // As Rust didn't compile this function
  // and has to trust you that it was properly
  // supplied, it's unsafe!
  let rand = unsafe { random() };

}
