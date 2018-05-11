use std::mem;
use std::os::raw::{c_char, c_void};

#[no_mangle]
pub extern "C" fn transform(buffer: *mut c_char, rows: u32, cols: u32, frameCount: u32, fps: u32, isFirst: bool) {
  unsafe {
    let center_col = cols as f32 / 2.0;
    let center_row = rows as f32 / 2.0;
    let radius = if center_col > center_row { center_row } else { center_col };
    let frameSize = cols * rows * 3;
    for frame in 0..frameCount {
      if isFirst {
        // paint all pink
        let mut p = buffer.offset((frameSize * frame) as isize);
        for row in 0..rows {
          for col in 0..cols {
            *p = 255; *p.offset(1) = 0; *p.offset(2) = 255;
            p = p.offset(3);
          }
        }
      }

      // draw arm
      let arm_angle = 2.0 * std::f32::consts::PI * (frame as f32) / (frameCount as f32);
      for d in 0..(radius as u32) {
        let col = ((d as f32) * arm_angle.cos() + center_col) as isize;
        let row = ((d as f32) * arm_angle.sin() + center_row) as isize;
        let p = buffer.offset((frameSize * frame) as isize + row * cols as isize * 3 + col * 3);
        *p = 0; *p.offset(1) = 255; *p.offset(2) = 0;
      }
    }
  }
}

// In order to work with the memory we expose (de)allocation methods
#[no_mangle]
pub extern "C" fn alloc(size: usize) -> *mut c_void {
  let mut buf = Vec::with_capacity(size);
  let ptr = buf.as_mut_ptr();
  mem::forget(buf);
  return ptr as *mut c_void;
}

#[no_mangle]
pub extern "C" fn dealloc(ptr: *mut c_void, cap: usize) {
  unsafe  {
    let _buf = Vec::from_raw_parts(ptr, 0, cap);
  }
}

