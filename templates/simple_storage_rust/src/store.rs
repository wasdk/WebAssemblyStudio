extern crate icetea_wasm;
extern crate js_sys;
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
use icetea_wasm::*;

#[wasm_bindgen]
extern {
  fn log(text: &str);
  fn get_sender() -> String;
  fn load(key: &str) -> Value;
  fn save(key: &str, value: &Value);
  fn json_stringify(value: &Value) -> String;
  fn emit_event(name: &str, data: &Value, indexes: &Value);
}

// Smart contract entry point
#[wasm_bindgen]
pub fn main(operation: &str, value: &Value) -> Value {
  log(&format!("[RUST] Hello {}, you call method {}", get_sender(), operation));
  let params = value.as_array();
  match operation {
    "__on_deployed" => {
      save("owner", &Value::from_str(&get_sender()));
    },
    "get_value" => {
      return get_value();
    },
    "get_owner" => {
      return get_owner();
    },
    "set_value" => {
      set_value(&params[0]);
    },
    &_ => log(&format!("[RUST] Method not found"))
  }
  return Value::from_bool(true);
}

#[wasm_bindgen]
pub fn get_value() -> Value {
  let v = load("value");
  log(&format!("[RUST] get_value: {}", json_stringify(&v)));
  return v;
}

#[wasm_bindgen]
pub fn get_owner() -> Value {
  return load("owner");
}

#[wasm_bindgen]
pub fn set_value(value: &Value) {
  log(&format!("[RUST] set_value: {}", json_stringify(value)));
  save("value", value);
  let event_value = format!("{{\"value\": {}}}", json_stringify(value));
  let event = js_sys::JSON::parse(&event_value).unwrap();
  emit_event("ValueChanged", &event, &js_sys::Array::new());
}
