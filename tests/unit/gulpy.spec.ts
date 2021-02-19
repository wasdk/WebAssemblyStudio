/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { Gulpy } from "../../src/gulpy";

describe("Gulpy tests", () => {
  it("check gulp dependencies", async () => {
    const gulp = new Gulpy();
    let results = "";

    gulp.task("b", async () => {
      await Promise.resolve();
      results += "B";
    });

    gulp.task("c", [], async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      results += "C";
    });

    gulp.task("a", ["b", "c"], async () => {
      results += "A";
    });

    await gulp.run("a");

    expect(results).toBe("BCA");
  });
});
