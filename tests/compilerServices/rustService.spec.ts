/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

const sendRequestJSON = jest.fn();
const decodeBinary = jest.fn();

jest.mock("../../src/compilerServices/sendRequest", () => ({
  sendRequestJSON,
  ServiceTypes: { Rustc: 0, Cargo: 1 }
}));

jest.mock("../../src/compilerServices/utils", () => ({
  decodeBinary: decodeBinary.mockImplementation((args) => args)
}));

jest.mock("tar-js", () => {
  return function() {
    const out = [];
    const append = (name, content, context) => out.push({ name, content, context });
    return { out, append };
  };
});

jest.mock("../../src/util", () => ({
  base64EncodeBytes: jest.fn().mockImplementation((args) => args)
}));

import { createCompilerService, Language } from "../../src/compilerServices";

describe("Tests for rustService", () => {
  afterAll(() => {
    jest.unmock("../../src/compilerServices/sendRequest");
    jest.unmock("../../src/compilerServices/utils");
    jest.unmock("../../src/util");
    jest.unmock("tar-js");
  });
  it("should compile Rust -> Wasm", async () => {
    const console = { log: jest.fn() };
    sendRequestJSON.mockImplementation(() => ({
      success: true,
      output: "out",
      tasks: [{ console }],
      message: "response-message"
    }));
    const rustService = await createCompilerService(Language.Rust, Language.Wasm);
    const input = { files: { "a.rs": { content: "a" }}, options: { cargo: true }};
    const output = await rustService.compile(input);
    expect(sendRequestJSON).toHaveBeenCalledWith({
      tar: [{ name: "a.rs", content: "a", context: {} }],
      options: { cargo: true }
    }, 1);
    expect(decodeBinary).toHaveBeenCalledWith("out");
    expect(output).toEqual({
      success: true,
      items: { "a.wasm": { content: "out", fileRef: "a.rs", console, }},
      console: "response-message"
    });
    decodeBinary.mockClear();
  });
  it("should compile Rust -> Wasm (cargo)", async () => {
    const console = { log: jest.fn() };
    sendRequestJSON.mockImplementation(() => ({
      success: true,
      output: "out",
      tasks: [{ console }],
      message: "response-message",
      wasmBindgenJs: "bindgen"
    }));
    const rustService = await createCompilerService(Language.Rust, Language.Wasm);
    const input = { files: { "a.rs": { content: "a" }}, options: {}};
    const output = await rustService.compile(input);
    expect(sendRequestJSON).toHaveBeenCalledWith({
      code: "a",
      options: {}
    }, 0);
    expect(output).toEqual({
      success: true,
      items: {
        "a.wasm": { content: "out", fileRef: "a.rs", console, },
        "wasm_bindgen.js": { content: "bindgen" }
      },
      console: "response-message"
    });
  });
  it("should handle errors during compilation", async () => {
    decodeBinary.mockClear();
    sendRequestJSON.mockImplementation(() => ({ success: false, message: "error", tasks: [] }));
    const rustService = await createCompilerService(Language.Rust, Language.Wasm);
    const input = { files: { "a.rs": { content: "a" }}, options: {}};
    const output = await rustService.compile(input);
    expect(decodeBinary).not.toHaveBeenCalled();
    expect(output).toEqual({
      success: false,
      items: { "a.wasm": { content: undefined, fileRef: "a.rs", console: undefined, }},
      console: "error"
    });
  });
  it("should throw an error when trying to compile more than one file", async () => {
    const rustService = await createCompilerService(Language.Rust, Language.Wasm);
    const input = { files: { "a.rs": { content: "a" },  "b.rs": { content: "b" }}, options: {}};
    await expect(rustService.compile(input))
      .rejects
      .toThrow("Supporting compilation of a single file, but 2 file(s) found");
  });
});
