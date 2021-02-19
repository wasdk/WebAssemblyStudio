/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import getConfig from "../../src/config";

function mockFetchToReturnConfig() {
  const config = require("../../config.json");
  (global as any).fetch = jest.fn().mockImplementation(() => Promise.resolve({
    json: () => config
  }));
  return () => (global as any).fetch = undefined;
}

describe("Tests for getConfig", () => {
  it("should load the config from config.json", async () => {
    const restoreFetch = mockFetchToReturnConfig();
    await expect(getConfig()).resolves.toEqual({
      cargo: "//webassembly-studio-rust.herokuapp.com/cargo",
      clang: "//webassembly-studio-clang.herokuapp.com/build",
      rustc: "//webassembly-studio-rust.herokuapp.com/rustc",
      sentryDNS: "https://756ae32005ed49cf9d4dd2aa106ccd4a@sentry.io/1229949",
      serviceUrl: "//wasmexplorer-service.herokuapp.com/service.php",
      templates: {
        arc: "/dist/arc-templates/index.js",
        default: "/dist/templates/index.js"
      }
    });
    expect((global as any).fetch).toHaveBeenCalledWith("./config.json");
    restoreFetch();
  });
  it("should return the config if it is already loaded", async () => {
    const restoreFetch = mockFetchToReturnConfig();
    await getConfig();
    expect((global as any).fetch).not.toHaveBeenCalled();
    restoreFetch();
  });
});
