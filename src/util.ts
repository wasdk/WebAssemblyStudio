/* Copyright 2018 Mozilla Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export function toAddress(n: number) {
  let s = n.toString(16);
  while (s.length < 6) {
    s = "0" + s;
  }
  return "0x" + s;
}

export function padRight(s: string, n: number, c: string) {
  s = String(s);
  while (s.length < n) {
    s = s + c;
  }
  return s;
}

export function padLeft(s: string, n: number, c: string) {
  s = String(s);
  while (s.length < n) {
    s = c + s;
  }
  return s;
}

const x86JumpInstructions = [
  "jmp", "ja", "jae", "jb", "jbe", "jc", "je", "jg", "jge", "jl", "jle", "jna", "jnae",
  "jnb", "jnbe", "jnc", "jne", "jng", "jnge", "jnl", "jnle", "jno", "jnp", "jns", "jnz",
  "jo", "jp", "jpe", "jpo", "js", "jz"
];

export function isBranch(instr: any) {
  return x86JumpInstructions.indexOf(instr.mnemonic) >= 0;
}

const base64DecodeMap = [ // starts at 0x2B
  62, 0, 0, 0, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
  0, 0, 0, 0, 0, 0, 0, // 0x3A-0x40
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25, 0, 0, 0, 0, 0, 0, // 0x5B-0x0x60
  26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
  44, 45, 46, 47, 48, 49, 50, 51
];

const base64DecodeMapOffset = 0x2B;
const base64EOF = 0x3D;

export function decodeRestrictedBase64ToBytes(encoded: any) {
  let ch: any;
  let code: any;
  let code2: any;

  const len = encoded.length;
  const padding = encoded.charAt(len - 2) === "=" ? 2 : encoded.charAt(len - 1) === "=" ? 1 : 0;
  const decoded = new Uint8Array((encoded.length >> 2) * 3 - padding);

  for (let i = 0, j = 0; i < encoded.length;) {
    ch = encoded.charCodeAt(i++);
    code = base64DecodeMap[ch - base64DecodeMapOffset];
    ch = encoded.charCodeAt(i++);
    code2 = base64DecodeMap[ch - base64DecodeMapOffset];
    decoded[j++] = (code << 2) | ((code2 & 0x30) >> 4);

    ch = encoded.charCodeAt(i++);
    if (ch === base64EOF) {
      return decoded;
    }
    code = base64DecodeMap[ch - base64DecodeMapOffset];
    decoded[j++] = ((code2 & 0x0f) << 4) | ((code & 0x3c) >> 2);

    ch = encoded.charCodeAt(i++);
    if (ch === base64EOF) {
      return decoded;
    }
    code2 = base64DecodeMap[ch - base64DecodeMapOffset];
    decoded[j++] = ((code & 0x03) << 6) | code2;
  }
  return decoded;
}
