/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

const sendRequestJSON = jest.fn();
const decodeBinary = jest.fn();

jest.mock("../../src/compilerServices/sendRequest", () => ({
  sendRequestJSON,
  ServiceTypes: { Clang: 2 }
}));

jest.mock("../../src/compilerServices/utils", () => ({
  decodeBinary: decodeBinary.mockImplementation((args) => args)
}));

import { createCompilerService, Language } from "../../src/compilerServices";

describe("Tests for clangService", () => {
  afterAll(() => {
    jest.unmock("../../src/compilerServices/sendRequest");
    jest.unmock("../../src/compilerServices/utils");
  });
  it("should compile C/Cpp -> Wasm", async () => {
    const console = { log: jest.fn() };
    sendRequestJSON.mockImplementation(() => ({
      success: true,
      output: "out",
      tasks: [{ console }],
      message: "response-message"
    }));
    const clangService = await createCompilerService(Language.C, Language.Wasm);
    const input = { files: { "a.c": { content: "a" }}, options: "options"};
    const output = await clangService.compile(input);
    expect(sendRequestJSON).toHaveBeenCalledWith({
      output: "wasm",
      compress: true,
      files: [{ type: "c", name: "file.c", options: "options", src: "a" }]
    }, 2);
    expect(decodeBinary).toHaveBeenCalledWith("out");
    expect(output).toEqual({
      success: true,
      items: { "a.wasm": { content: "out", fileRef: "a.c", console, }},
      console: "response-message"
    });
    decodeBinary.mockClear();
  });
  it("should handle errors during compilation", async () => {
    sendRequestJSON.mockImplementation(() => ({ success: false, message: "error", tasks: [] }));
    const clangService = await createCompilerService(Language.C, Language.Wasm);
    const input = { files: { "a.c": { content: "a" }}, options: "options"};
    const output = await clangService.compile(input);
    expect(decodeBinary).not.toHaveBeenCalled();
    expect(output).toEqual({
      success: false,
      items: { "a.wasm": { content: undefined, fileRef: "a.c", console: undefined, }},
      console: "error"
    });
  });
  it("should throw an error when trying to compile more than one file", async () => {
    const clangService = await createCompilerService(Language.C, Language.Wasm);
    const input = { files: { "a.c": { content: "a" },  "b.c": { content: "b" }}};
    await expect(clangService.compile(input))
      .rejects
      .toThrow("Supporting compilation of a single file, but 2 file(s) found");
  });
});
