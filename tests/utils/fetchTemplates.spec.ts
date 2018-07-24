/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import fetchTemplates from "../../src/utils/fetchTemplates";

function mockFetch() {
  (global as any).fetch = jest.fn().mockImplementation((arg) => {
    return { text: () => JSON.stringify({ a: 1, b: 2 }) };
  });
  return () => (global as any).fetch = undefined;
}

describe("Tests for fetchTemplates", () => {
  it("should fetch a template and parse the JSON response", async () => {
    const restoreFetch = mockFetch();
    const response = await fetchTemplates("/dist/templates/index.js");
    expect(response).toEqual({ a: 1, b: 2 });
    expect(window.fetch).toHaveBeenCalledWith("/dist/templates/index.js");
    restoreFetch();
  });
});
