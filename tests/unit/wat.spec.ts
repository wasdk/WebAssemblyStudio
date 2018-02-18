/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { watWordAt, getWatCompletionItems } from "../../src/languages/wat";

describe("AppActions component", () => {
  it("output initially is empty", () => {
    expect(watWordAt("(i32.add)", 0).word).toBeFalsy();
    for (let i = 1; i < 8; i++) {
      expect(watWordAt("(i32.add)", i).word).toBe("i32.add");
    }
    expect(watWordAt("(i32.add)", 8).word).toBeFalsy();
    expect(watWordAt("((()()(())))", 2).word).toBeFalsy();
    expect(watWordAt("abc def", 2).word).toBe("abc");
    expect(watWordAt("ab def", 2).word).toBeFalsy();
    expect(watWordAt("", 2).word).toBeFalsy();
    expect(watWordAt("abcdef))", 2).word).toBe("abcdef");
    expect(watWordAt("(i64.reinterpret/f64)", 2).word).toBe("i64.reinterpret/f64");
    getWatCompletionItems().forEach(item => {
      expect(watWordAt(`((${item.label}))`, 2).word).toBe(item.label);
    });
  });
});
