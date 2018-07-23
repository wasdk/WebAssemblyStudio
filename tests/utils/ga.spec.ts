/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { gaEvent } from "../../src/utils/ga";

describe("Tests for ga (google analytics)", () => {
  it("should generate an event", () => {
    const gtag = jest.fn();
    (window as any).gtag = gtag;
    gaEvent("action", "category", "label", 1);
    expect(gtag).toHaveBeenCalledWith("event", "action", {
      event_category: "category",
      event_label: "label",
      value: 1,
    });
  });
  it("should not generate an event if window.gtag is not a function", () => {
    (window as any).gtag = undefined;
    expect(gaEvent("action", "category", "label", 1)).toEqual(undefined);
  });
});
