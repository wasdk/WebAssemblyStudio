/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { Log } from "../../src/languages/log";

describe("Tests for Log", () => {
  describe("MonarchTokensProvider", () => {
    it("should expose the correct MonarchTokensProvider", () => {
      expect(Log.MonarchTokensProvider).toEqual({
        tokenizer: {
          root: [
            [/\[error.*/, "custom-error"],
            [/\[warn.*/, "custom-warn"],
            [/\[notice.*/, "custom-notice"],
            [/\[info.*/, "custom-info"]
          ]
        }
      });
    });
  });
});
