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
});
