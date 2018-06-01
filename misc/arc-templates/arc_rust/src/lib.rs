static mut module_instance: *mut ArcModule = 0 as *mut ArcModule;

mod color;
mod arc_module;
mod utils;

use color::Rgb;
use arc_module::ArcModule;

pub use utils::init;
pub use utils::getAnimationBuffer;

#[no_mangle]
pub extern fn apply() {
  let mut module = ArcModule::get_instance();
  let rows = module.rows;
  let cols = module.cols;
  let ref mut animation = module.get_animation().as_mut_slice();
  for (index, frame) in animation.chunks_mut(rows * cols).enumerate() {
    for row in 0 .. rows {
      for col in 0 .. cols {
        frame[row * cols + col] = Rgb::new(row as u8 * 5, col as u8 * 5, ((index * 5) % 0xffusize) as u8);
      }
    }
  }
}
