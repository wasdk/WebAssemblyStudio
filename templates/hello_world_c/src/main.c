#include <sys/uio.h>
#include <stdio.h>
#define WASM_EXPORT __attribute__((visibility("default")))

WASM_EXPORT
int main(int zz) {
  printf("Hello\n");
}
