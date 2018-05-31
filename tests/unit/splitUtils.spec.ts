/* Any copyright is dedicated to the Public Domain.
* http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import * as splitUtils from "../../src/utils/splitUtils";

describe("Tests for splitUtils", () => {
  describe("toCSSPx", () => {
    it("should transform a number to CSS px value", () => {
      expect(splitUtils.toCSSPx(10)).toEqual("10px");
    });
    it("should default to 0px", () => {
      expect(splitUtils.toCSSPx(null)).toEqual("0px");
    });
  });
  describe("assignObject", () => {
    it("should assign properties", () => {
      const to = { a: 1 };
      const from =  { b: 2 };
      expect(splitUtils.assignObject(to, from)).toEqual({ a: 1, b: 2});
    });
    it("should only assign non existing properties", () => {
      const to = { a: 1 };
      const from =  { a: 2, b: 3 };
      expect(splitUtils.assignObject(to, from)).toEqual({ a: 1, b: 3});
    });
  });
});
