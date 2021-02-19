use color::Rgb;
use arc_module::ArcModule;

#[no_mangle]
pub extern fn init(rows: usize, cols: usize, frame_count: usize, fps: usize, is_first: bool) {
  ArcModule::create_instance(rows, cols, frame_count, fps, is_first);
}

#[no_mangle]
pub extern fn getAnimationBuffer() -> *const Rgb {
  ArcModule::get_instance().get_animation().as_ptr()
}
