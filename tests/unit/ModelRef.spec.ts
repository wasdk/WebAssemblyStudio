/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { ModelRef, File, FileType } from "../../src/models";

describe("ModelRef tests", () => {
  describe("getRef", () => {
    it("should create and return a new reference if it does not already exist", () => {
      const file = new File("file", FileType.JavaScript);
      const ref = ModelRef.getRef(file);
      expect(ref.obj).toBe(file);
    });
    it("should return the reference if it already exist", () => {
      const file = new File("file", FileType.JavaScript);
      const refA = ModelRef.getRef(file);
      const refB = ModelRef.getRef(file);
      expect(refA).toBe(refB);
    });
  });
  describe("getModel", () => {
    it("should return the model", () => {
      const file = new File("file", FileType.JavaScript);
      const ref = ModelRef.getRef(file);
      expect(ref.getModel()).toBe(file);
    });
  });
});
