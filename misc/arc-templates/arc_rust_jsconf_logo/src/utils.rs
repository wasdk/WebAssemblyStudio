use arc_module::ArcModule;
use color::Rgb;

#[no_mangle]
pub extern "C" fn init(rows: usize, cols: usize, frame_count: usize, fps: usize, is_first: bool) {
    ArcModule::create_instance(rows, cols, frame_count, fps, is_first);
}

#[no_mangle]
pub extern "C" fn getAnimationBuffer() -> *const Rgb {
    ArcModule::get_instance().get_animation().as_ptr()
}
