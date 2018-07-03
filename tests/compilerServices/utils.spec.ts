/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

const isZlibData = jest.fn();
const decompressZlib = jest.fn();
const fromByteArray = jest.fn();
const decodeRestrictedBase64ToBytes = jest.fn();

jest.mock("../../src/utils/zlib", () => ({
  isZlibData,
  decompressZlib
}));

jest.mock("../../src/util", () => ({
  decodeRestrictedBase64ToBytes
}));

jest.mock("base64-js", () => ({
  fromByteArray
}));

import { decodeBinary, encodeBinary } from "../../src/compilerServices/utils";

describe("Tests for compilerServices utils", () => {
  afterAll(() => {
    jest.unmock("../../src/utils/zlib");
    jest.unmock("../../src/util");
    jest.unmock("base64-js");
  });
  describe("decodeBinary", () => {
    it("should decode Binary -> ArrayBuffer", async () => {
      const data = { buffer: new ArrayBuffer(8) };
      isZlibData.mockImplementation(() => false);
      decodeRestrictedBase64ToBytes.mockImplementation(() => data);
      await expect(decodeBinary("binary-string")).resolves.toBe(data.buffer);
      expect(decodeRestrictedBase64ToBytes).toHaveBeenCalledWith("binary-string");
      expect(isZlibData).toHaveBeenCalledWith(data);
      expect(decompressZlib).not.toHaveBeenCalled();
      isZlibData.mockClear();
    });
    it("should decode Binary -> ArrayBuffer (zlib)", async () => {
      const data = { buffer: new ArrayBuffer(8) };
      isZlibData.mockImplementation(() => true);
      decodeRestrictedBase64ToBytes.mockImplementation(() => data);
      decompressZlib.mockImplementation((arg) => arg);
      await expect(decodeBinary("binary-string")).resolves.toBe(data.buffer);
      expect(decompressZlib).toHaveBeenCalledWith(data);
    });
  });
  describe("encodeBinary", () => {
    it("should encode ArrayBuffer -> Binary", () => {
      fromByteArray.mockImplementation((args) => args);
      const buffer = new ArrayBuffer(8);
      const encoded = encodeBinary(buffer);
      expect(encoded).toHaveLength(8);
      expect(encoded).toBeInstanceOf(Uint8Array);
    });
  });
});
