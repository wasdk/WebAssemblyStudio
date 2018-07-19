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

import { fileTypeForExtension, isBinaryFileType, Directory, FileType, fileTypeForMimeType } from "./models";

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

const _concat3array = new Array(3);
const _concat4array = new Array(4);
const _concat9array = new Array(9);

/**
 * The concatN() functions concatenate multiple strings in a way that
 * avoids creating intermediate strings, unlike String.prototype.concat().
 *
 * Note that these functions don't have identical behaviour to using '+',
 * because they will ignore any arguments that are |undefined| or |null|.
 * This usually doesn't matter.
 */

export function concat3(s0: any, s1: any, s2: any) {
    _concat3array[0] = s0;
    _concat3array[1] = s1;
    _concat3array[2] = s2;
    return _concat3array.join("");
}

export function concat4(s0: any, s1: any, s2: any, s3: any) {
    _concat4array[0] = s0;
    _concat4array[1] = s1;
    _concat4array[2] = s2;
    _concat4array[3] = s3;
    return _concat4array.join("");
}

// https://gist.github.com/958841
export function base64EncodeBytes(bytes: Uint8Array) {
  let base64 = "";
  const encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;

  let a;
  let b;
  let c;
  let d;
  let chunk;

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048 = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032 = (2^6 - 1) << 6
    d = chunk & 63; // 63 = 2^6 - 1
    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += concat4(encodings[a], encodings[b], encodings[c],
                      encodings[d]);
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder === 1) {
    chunk = bytes[mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3 = 2^2 - 1
    base64 += concat3(encodings[a], encodings[b], "===");
  } else if (byteRemainder === 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008 = (2^6 - 1) << 4
    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15 = 2^4 - 1
    base64 += concat4(encodings[a], encodings[b], encodings[c], "=");
  }
  return base64;
}

export function decodeRestrictedBase64ToBytes(encoded: string) {
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

const layoutThrottleDuration = 10;
let layoutTimeout = 0;

export function layout() {
  if (layoutTimeout) {
    window.clearTimeout(layoutTimeout);
  }
  window.setTimeout(() => {
    layoutTimeout = 0;
    document.dispatchEvent(new Event("layout"));
  }, layoutThrottleDuration);
}

export function resetDOMSelection() {
  window.getSelection().removeAllRanges();
}

export function assert(c: any, message?: string) {
  if (!c) {
    throw new Error(message);
  }
}

export function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(min, x), max);
}

export async function readUploadedFile(inputFile: File, readAs: "text" | "arrayBuffer"): Promise<string | ArrayBuffer> {
  const temporaryFileReader = new FileReader();
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };
    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result as any);
    };
    if (readAs === "text") {
      temporaryFileReader.readAsText(inputFile);
    } else if (readAs === "arrayBuffer") {
      temporaryFileReader.readAsArrayBuffer(inputFile);
    } else {
      assert(false, "NYI");
    }
  });
}

export async function readUploadedDirectory(inputEntry: any, root: Directory, customRoot?: string) {
  const reader = inputEntry.createReader();
  reader.readEntries(((entries: any) => {
    entries.forEach(async (entry: any) => {
      if (entry.isDirectory) {
        return readUploadedDirectory(entry, root, customRoot);
      }
      entry.file(async (file: File) => {
        try {
          const name: string = file.name;
          let path: string = entry.fullPath.replace(/^\/+/g, "");
          if (customRoot) {
            const pathArray = path.split("/");
            pathArray[0] = customRoot;
            path = pathArray.join("/");
          }
          const fileType = fileTypeForExtension(name.split(".").pop());
          const data = await readUploadedFile(file, isBinaryFileType(fileType) ? "arrayBuffer" : "text");
          const newFile = root.newFile(path, fileType, false, true);
          newFile.setData(data);
        } catch (e) {
          console.log("Unable to read the file!");
        }
      });
    });
  }));
}

export async function uploadFilesToDirectory(items: any, root: Directory) {
  Array.from(items).forEach(async (item: any) => {
    if (typeof item.webkitGetAsEntry === "function") {
      const entry = item.webkitGetAsEntry();
      if (entry.isDirectory) {
        if (root.getImmediateChild(entry.name)) {
          const customRoot = root.handleNameCollision(entry.name);
          return readUploadedDirectory(entry, root, customRoot);
        }
        return readUploadedDirectory(entry, root);
      }
    }
    let file: File;
    if (item instanceof DataTransferItem) {
      file = item.getAsFile();
    } else {
      file = item;
    }
    const name: string = file.name;
    const path: string = file.webkitRelativePath || name; // This works in FF also.
    const fileType = fileTypeForExtension(name.split(".").pop());
    let data: any;
    try {
      data = await readUploadedFile(file, isBinaryFileType(fileType) ? "arrayBuffer" : "text");
      const newFile = root.newFile(path, fileType, false, true);
      newFile.setData(data);
    } catch (e) {
      console.log("Unable to read the file!");
    }
  });
}

export function isUploadAllowedForMimeType(type: string) {
  if (type === "") { // Firefox doesn't show the "application/wasm" mime type.
    return true;
  }
  return fileTypeForMimeType(type) !== FileType.Unknown;
}

let nextKey = 0;

export function getNextKey() {
  return nextKey++;
}
