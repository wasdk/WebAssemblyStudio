/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

const pako = { inflate: jest.fn(() => "inflated") };
jest.mock("pako", () => pako);

import { isZlibData, decompressZlib } from "../../src/utils/zlib";

describe("Tests for zlib", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  describe("isZlibData", () => {
    it("should tell if the given data is zlib compressed", () => {
      const dataA = new Uint8Array([0x78, 0x01]);
      const dataB = new Uint8Array([0x78, 0x9C]);
      const dataC = new Uint8Array([0x78, 0xDA]);
      const dataD = new Uint8Array([0x78, 0]);
      const dataE = new Uint8Array([0x01, 0x01]);
      expect(isZlibData(dataA)).toEqual(true);
      expect(isZlibData(dataB)).toEqual(true);
      expect(isZlibData(dataC)).toEqual(true);
      expect(isZlibData(dataD)).toEqual(false);
      expect(isZlibData(dataE)).toEqual(false);
    });
  });
  describe("decompressZlib", () => {
    it("should decompress the given data", async () => {
      const data = new Uint8Array([0x78, 0x01]);
      const decompressed = await decompressZlib(data);
      expect(decompressed).toEqual("inflated");
      expect(pako.inflate).toHaveBeenCalledWith(data);
    });
  });
});
