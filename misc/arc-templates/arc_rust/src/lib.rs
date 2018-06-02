static mut module_instance: *mut ArcModule = 0 as *mut ArcModule;

mod arc_module;
mod color;
mod utils;

use arc_module::ArcModule;
use color::Rgb;

pub use utils::getAnimationBuffer;
pub use utils::init;

#[no_mangle]
pub extern "C" fn apply() {
    let mut module = ArcModule::get_instance();
    let rows = module.rows;
    let cols = module.cols;

    let animation = module.get_animation().as_mut_slice();
    for (index, frame) in animation.chunks_mut(rows * cols).enumerate() {
        for row in 0..rows {
            for col in 0..cols {
                frame[row * cols + col] = Rgb::new(
                    row as u8 * 5,
                    col as u8 * 5,
                    ((index * 5) % 0xffusize) as u8,
                );
            }
        }
    }
}
