/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { Directory, FileType } from "../../src/model";

describe("Directory tests", () => {
  describe("hasChildren", () => {
    it("should return true if directory has children", () => {
      const directory = new Directory("test");
      directory.newFile("fileA", FileType.JavaScript);
      expect(directory.hasChildren()).toEqual(true);
    });
    it("should return false if directory has no children", () => {
      const directory = new Directory("test");
      expect(directory.hasChildren()).toEqual(false);
    });
  });
});
