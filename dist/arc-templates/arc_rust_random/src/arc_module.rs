use color::Rgb;
use module_instance;

pub struct ArcModule {
  pub rows: usize,
  pub cols: usize,
  pub frame_count: usize,
  fps: usize,
  is_first: bool,
  animation: Vec<Rgb>
}

impl ArcModule {
  pub fn create_instance(rows: usize, cols: usize, frame_count: usize, fps: usize, is_first: bool) -> &'static ArcModule {
    let buffer_size = rows * cols * frame_count;
    let mut module = ArcModule {
      rows,
      cols,
      frame_count,
      fps,
      is_first,
      animation: Vec::with_capacity(buffer_size)
    };
    module.animation.resize(buffer_size, Rgb::new(0, 0, 0));
    module.animation[0] = Rgb {r: 2, g: 4, b: 10};
    unsafe { module_instance = Box::into_raw(Box::new(module)) };
    ArcModule::get_instance()
  }

    pub fn get_instance<'a>() -> &'a mut ArcModule {
    unsafe { &mut *module_instance }
  }

  pub fn get_animation<'a>(&'a mut self) -> &'a mut Vec<Rgb> {
    &mut self.animation
  }
}
