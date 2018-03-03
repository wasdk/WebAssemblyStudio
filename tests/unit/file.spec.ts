/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { Directory, FileType } from "../../src/model";

function getDirectoryStructure() {
  const a = new Directory("test");
  const b = a.newFile("b", FileType.JavaScript, false);
  const c = a.newDirectory("c");
  const cd = a.newFile("c/d", FileType.JavaScript, false);
  return { a, b, c, cd };
}

describe("File tests", () => {
  it("check path", () => {
    const { a, b, c, cd } = getDirectoryStructure();
    expect(a.getPath()).toBe("test");
    expect(b.getPath()).toBe("test/b");
    expect(c.getPath()).toBe("test/c");
    expect(cd.getPath()).toBe("test/c/d");
    expect(cd.getPath(c)).toBe("d");
    expect(cd.getPath(a)).toBe("c/d");
  });
});
