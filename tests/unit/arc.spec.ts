/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { PublishManifest, notifyAboutFork, Arc } from "../../src/arc";

describe("Arc tests", () => {
  it("should post a message to window.parent on notifyAboutFork", () => {
    const postMessage = jest.spyOn(window.parent, "postMessage");
    const fiddle = "fiddle";
    notifyAboutFork(fiddle);
    expect(postMessage).toHaveBeenCalledWith({
      type: "wasm-studio/fork",
      fiddle,
    }, "*");
    postMessage.mockRestore();
  });
  it("should post a message to window.parent on Arc.publish", () => {
    const postMessage = jest.spyOn(window.parent, "postMessage");
    const manifest = {} as PublishManifest;
    Arc.publish(manifest);
    expect(postMessage).toHaveBeenCalledWith({
      type: "wasm-studio/module-publish",
      manifest,
    }, "*");
    postMessage.mockRestore();
  });
  it("should transform animation buffer to JSON on Arc.animationBufferToJSON", () => {
    const rows = 36;
    const cols = 44;
    const frames = 1050;
    const buffer = new ArrayBuffer(cols * rows * frames * 3);
    const json = Arc.animationBufferToJSON(buffer, rows, cols, frames);
    const frameCount = json.length;
    const rowCount = json[0].length;
    const colCount = json[0][0].length;
    const last = json[1049][35][43];
    expect(frameCount).toEqual(frames);
    expect(rowCount).toEqual(rows);
    expect(colCount).toEqual(cols);
    expect(last).toEqual([0, 0, 0]);
  });
});
