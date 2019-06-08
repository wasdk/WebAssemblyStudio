extern crate js_sys;
extern crate console_error_panic_hook;
extern crate wasm_bindgen;
extern crate icetea_wasm;
use wasm_bindgen::prelude::*;
use icetea_wasm::*;
use icetea_wasm::safe_math::*;

// Import blockchain info
#[wasm_bindgen]
extern {
  fn log(text: &str);
  fn get_sender() -> String;
  fn load(key: &str) -> Value;
  fn save(key: &str, value: &Value);
  fn json_stringify(value: &Value) -> String;
}

const BALANCE_KEY: &str = "bk";
const TOTAL_SUPPLY_KEY: &str = "tsk";
const ALLOW_KEY: &str = "ak";

// Smart contract entry point
#[wasm_bindgen]
pub fn main(operation: &str, value: &Value) -> Value {
  console_error_panic_hook::set_once();
  log(&format!("[RUST] Hello {}, you call method {}", get_sender(), operation));
  let params = value.as_array();

  match operation {
    "__on_deployed" => {
      let sender = get_sender();
      _mint(&sender, 1000000000);
    },
    "balance_of" => {
      let owner = params[0].as_string().unwrap();
      return balance_of(&owner).to_value();
    },
    "total_supply" => {
      return total_supply().to_value();
    },
    "allowance" => {
      let owner = params[0].as_string().unwrap();
      let spender = params[1].as_string().unwrap();
      return allowance(&owner, &spender).to_value();
    }
    "transfer" => {
      let to = params[0].as_string().unwrap();
      let value = params[1].as_u128().unwrap();
      return transfer(&to, value).to_value();
    },
    "approve" => {
      let spender = params[0].as_string().unwrap();
      let value = params[1].as_u128().unwrap();
      return approve(&spender, value).to_value();
    },
    "transfer_from" => {
      let from = params[0].as_string().unwrap();
      let to = params[1].as_string().unwrap();
      let value = params[2].as_u128().unwrap();
      return transfer_from(&from, &to, value).to_value();
    },
    "increase_allowance" => {
      let spender = params[0].as_string().unwrap();
      let value = params[1].as_u128().unwrap();
      return increase_allowance(&spender, value).to_value();
    },
    "decrease_allowance" => {
      let spender = params[0].as_string().unwrap();
      let value = params[1].as_u128().unwrap();
      return decrease_allowance(&spender, value).to_value();
    },
    &_ => log(&format!("[RUST] Method not found"))
  }

  return true.to_value();
}

fn total_supply() -> u128 {
  let total_supply = load!(u128, TOTAL_SUPPLY_KEY);
  return total_supply;
}

fn balance_of(owner: &str) -> u128 {
  let balance = load!(u128, &get_key!(BALANCE_KEY, owner));
  return balance;
}

fn allowance(owner: &str, spender: &str) -> u128 {
  let allow = load!(u128, &get_key!(ALLOW_KEY, owner, spender));
  return allow;
}

fn transfer(to: &str, value: u128) -> bool {
  let sender = get_sender();
  _transfer(&sender, to, value);
  return true;
}

fn approve(spender: &str, value: u128) -> bool {
  let sender = get_sender();
  _approve(&sender, spender, value);
  return true;
}

fn transfer_from(from: &str, to: &str, value: u128) -> bool {
  let sender = get_sender();
  let allow = allowance(from, &sender);
  _transfer(from, to, value);
  _approve(from, &sender, allow.sub(value));
  return true;
}

fn increase_allowance(spender: &str, add_value: u128) -> bool {
  let sender = get_sender();
  let allow = allowance(&sender, spender);
  _approve(&sender, spender, allow.add(add_value));
  return true;
}

fn decrease_allowance(spender: &str, subtracted_value: u128) -> bool {
  let sender = get_sender();
  let allow = allowance(&sender, spender);
  _approve(&sender, spender, allow.sub(subtracted_value));
  return true;
}

fn _transfer(from: &str, to: &str, value: u128) {
  require!(to != "", "invalid to address!");

  let mut from_balance = load!(u128, &get_key!(BALANCE_KEY, from));
  from_balance = from_balance.sub(value);
  save!(&get_key!(BALANCE_KEY, from), from_balance);

  let mut to_balance = load!(u128, &get_key!(BALANCE_KEY, to));
  to_balance = to_balance.add(value);
  save!(&get_key!(BALANCE_KEY, to), to_balance);
}

fn _approve(owner: &str, spender: &str, value: u128) {
  require!(owner != "" && spender != "", "invalid address!");
  save!(&get_key!(ALLOW_KEY, owner, spender), value);
}

fn _mint(account: &str, value: u128) {
  require!(account != "", "invalid address!");

  let mut total_supply = load!(u128, TOTAL_SUPPLY_KEY);
  let mut balance = load!(u128, &get_key!(BALANCE_KEY, account));
  total_supply = total_supply.add(value);
  balance = balance.add(value);
  save!(TOTAL_SUPPLY_KEY, total_supply);
  save!(&get_key!(BALANCE_KEY, account), balance);
}

fn _burn(account: &str, value: u128) {
  require!(account != "", "invalid address!");

  let mut total_supply = load!(u128, TOTAL_SUPPLY_KEY);
  let mut balance = load!(u128, &get_key!(BALANCE_KEY, account));
  total_supply = total_supply.sub(value);
  balance = balance.sub(value);

  save!(TOTAL_SUPPLY_KEY, total_supply);
  save!(&get_key!(BALANCE_KEY, account), balance);
}

fn _burn_from(account: &str, value: u128) {
  let sender = get_sender();
  let allow = allowance(account, &sender);
  _burn(account, value);
  _approve(account, &sender, allow.sub(value));
}
