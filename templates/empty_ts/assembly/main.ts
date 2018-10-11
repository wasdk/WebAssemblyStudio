@external("env", "sayHello")
declare function sayHello(): void;

declare namespace console {
  @external("env", "logi")
  function logi(value: i32): void;

  @external("env", "logf")
  function logf(value: f64): void;
}

sayHello();

export function add(x: i32, y: i32): i32 {
  return x + y;
}

console.logi(add(1, 2));
