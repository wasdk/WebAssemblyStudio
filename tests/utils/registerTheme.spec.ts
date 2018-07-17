/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import registerTheme from "../../src/utils/registerTheme";

declare var monaco: { editor };

describe("Tests for registerTheme", () => {
  it("should register a correct theme", async () => {
    const defineTheme = jest.spyOn(monaco.editor, "defineTheme");
    await registerTheme();
    expect(defineTheme).toHaveBeenCalledWith("fiddle-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "custom-info", foreground: "d4d4d4" },
        { token: "custom-warn", foreground: "ff9900" },
        { token: "custom-error", background: "00ff00", foreground: "ff0000", fontStyle: "bold" }
      ]
    });
  });
});
