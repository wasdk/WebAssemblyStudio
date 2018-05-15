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

export interface PublishManifest {
  description?: string;
  author?: string;
  image: {
    rows: number;
    cols: number;
    frameCount: number;
    fps: number;
    data: Uint8Array|number[];
  };
  entry?: string;
  files?: { [name: string]: (string | Uint8Array); };
}

export function notifyAboutFork(fiddle: string) {
  window.parent.postMessage({
    type: "wasm-studio/fork",
    fiddle,
  }, "*");
}

export class Arc {
  public static publish(manifest: PublishManifest) {
    window.parent.postMessage({
      type: "wasm-studio/module-publish",
      manifest,
    }, "*");
  }
  public static animationBufferToJSON(animation: ArrayBuffer, rows: number, cols: number,
                                      frameCount: number): number[][][][] {
    const json = [];
    const frameSize = rows * cols * 3;
    for (let i = 0; i < frameCount; i++) {
      const buffer = new Uint8Array(animation, frameSize * i, frameSize);
      const frame: number[][][] = [];
      json.push(frame);

      let pos = 0;
      for (let y = 0; y < rows; y++) {
        const row: number[][] = [];
        frame.push(row);
        for (let x = 0; x < cols; x++) {
          row.push([buffer[pos++], buffer[pos++], buffer[pos++]]);
        }
      }
    }
    return json;
  }
}
