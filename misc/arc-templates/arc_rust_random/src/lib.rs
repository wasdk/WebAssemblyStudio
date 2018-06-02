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
  // let's implement a game of life!
  // https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
  // Contributed by @finnpauls

  let mut module = ArcModule::get_instance();
  let rows = module.rows;
  let cols = module.cols;
  let frame_count = module.frame_count;
  let frame_size = rows * cols;
  let mut animation = module.get_animation().as_mut_slice();

  for row in 0 .. rows {
    for col in 0 .. cols {
      // This calls the random function.
      // As Rust didn't compile this function
      // and has to trust you that it was properly
      // supplied, it's unsafe!
      let rand = unsafe { random() };
      // We randomly place cells
      animation[row * cols + col] = if rand > 0.4 { Rgb::new(0, 0 ,0) } else { Rgb::new(255, 255 ,255) }
    }
  }

  // this implements
  for frame in 1 .. frame_count {
    for row in 0 .. rows {
      for col in 0 .. cols {
        let current_cell_position = frame * frame_size + row * cols + col;
        let last_cell_position = (frame - 1) * frame_size + row * cols + col;
        if frame % 5 == 0 {
          if col == 0 || col == cols - 1 || row == 0  || row == rows - 1 {
            animation[current_cell_position] = Rgb::new(255, 255, 255);
          } else {
            let mut neighbour_count = 0;
            for dx in 0..=2 {
              for dy in 0..=2 {
                  let neighbour = animation[(frame - 1) * frame_size + ((row + dy - 1) * cols + col + dx - 1)];
                  if neighbour.r == 0 && (dx != 1 || dy != 1) {
                    neighbour_count += 1
                  }
              }
            }
            let current_cell = animation[last_cell_position];
            let current_cell_alive = current_cell.r == 0;
            let is_alive = if current_cell_alive {
              neighbour_count == 2 || neighbour_count == 3
            } else {
              neighbour_count == 3
            };
            animation[current_cell_position] = if is_alive { Rgb::new(0, 0, 0) } else { Rgb::new(255, 255, 255) };
          }
        } else {
            animation[current_cell_position] = animation[last_cell_position];
        }
      }
    }
  }
}
