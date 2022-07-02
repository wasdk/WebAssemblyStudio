#include <stdio.h>
#include <sys/uio.h>
#include "header.h"

#define WASM_EXPORT __attribute__((visibility("default")))

WASM_EXPORT
int main(void) {
  int c= hello(3,2);//you can define any function in headerfile and use it here.It is just an example.
  printf("%d",c);
  printf("Hello World\n");
}

/* External function that is implemented in JavaScript. */
extern void putc_js(char c);

/* Basic implementation of the writev sys call. */ 
WASM_EXPORT
size_t writev_c(int fd, const struct iovec *iov, int iovcnt) {
  size_t cnt = 0;
  for (int i = 0; i < iovcnt; i++) {
    for (int j = 0; j < iov[i].iov_len; j++) {
      putc_js(((char *)iov[i].iov_base)[j]);
    }
    cnt += iov[i].iov_len;
  }
  return cnt;
}
