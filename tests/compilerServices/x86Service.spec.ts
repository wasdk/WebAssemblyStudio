/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

const sendRequest = jest.fn();

jest.mock("../../src/compilerServices/sendRequest", () => ({
  sendRequest: sendRequest.mockImplementation(() => "response"),
  ServiceTypes: { Service: 3 }
}));

jest.mock("../../src/compilerServices/utils", () => ({
  encodeBinary: jest.fn().mockImplementation((args) => args)
}));

import { createCompilerService, Language } from "../../src/compilerServices";

describe("Tests for x86Service", () => {
  afterAll(() => {
    jest.unmock("../../src/compilerServices/sendRequest");
    jest.unmock("../../src/compilerServices/utils");
  });
  it("should compile Wasm -> x86", async () => {
    const x86Service = await createCompilerService(Language.Wasm, Language.x86);
    const input = { files: { a: { content: "a" }}, options: "options"};
    const output = await x86Service.compile(input);
    expect(sendRequest).toHaveBeenCalledWith("input=a&action=wasm2assembly&options=options", 3);
    expect(output).toEqual({
      success: true,
      items: { "a.json": { content: "response" }},
    });
  });
  it("should throw an error when trying to compile more than one file", async () => {
    const x86Service = await createCompilerService(Language.Wasm, Language.x86);
    const input = { files: { a: { content: "a" }, b: { content: "b" }}};
    await expect(x86Service.compile(input))
      .rejects
      .toThrow("Supporting compilation of a single file, but 2 file(s) found");
  });
});
