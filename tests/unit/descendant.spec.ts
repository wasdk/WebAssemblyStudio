/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { Directory } from "../../src/model";

function getDirectoryStructure() {
  const a = new Directory("test");
  const b = a.newDirectory("b");
  const c = b.newDirectory("c");
  return { a, b, c };
}

describe("File.isDescendantOf tests", () => {
  it("should return true if file is direct child of given element", () => {
    const { a, b } = getDirectoryStructure();
    expect(b.isDescendantOf(a)).toBe(true);
  });
  it("should return true if file is nested child of given element", () => {
    const { a, c } = getDirectoryStructure();
    expect(c.isDescendantOf(a)).toBe(true);
  });
  it("should return false if file is not a descendant of given element", () => {
    const { a, b } = getDirectoryStructure();
    expect(a.isDescendantOf(b)).toBe(false);
  });
  it("should return false if called with itself as argument", () => {
    const { a } = getDirectoryStructure();
    expect(a.isDescendantOf(a)).toBe(false);
  });
});