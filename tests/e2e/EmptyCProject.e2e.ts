/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

async function getDirectoryStructure() {
  return await page.evaluate((selector) => {
    const elements = Array.from(document.querySelectorAll(selector));
    return elements.map(element => element.textContent);
  }, "a.label-name");
}

async function getRunResults() {
  return await page.evaluate((selector) => {
    const iframe = document.querySelector(selector);
    return iframe.contentWindow.document.body.querySelector("span#container").textContent;
  }, "iframe");
}

describe("Empty C Project: Create, Build and Run", () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    await page.goto("https://localhost:28443");
  });
  it("should initialy display the Create New Project dialog", async () => {
    await expect(page).toMatch("Empty C Project");
  });
  it("should create an Empty C Project when clicking the Create button", async () => {
    await page.click("div.button[title=\"Create\"]");
    await page.waitForSelector("a.label-name");
    await expect(getDirectoryStructure()).resolves.toEqual([
      "README.md",
      "build.ts",
      "package.json",
      "src",
      "main.c",
      "main.html",
      "main.js"
    ]);
  });
  it("should build the project when clicking the Build button", async () => {
    // Click the build button and wait for the request to finish
    await page.click("div.button[title=\"Build Project: CtrlCmd + B\"]");
    await page.waitFor(3000); // TODO: Remove hardcoded wait duration
    // Build a second time
    await page.click("div.button[title=\"Build Project: CtrlCmd + B\"]");
    await page.waitFor(3000); // TODO: Remove hardcoded wait duration
    await expect(getDirectoryStructure()).resolves.toEqual([
      "README.md",
      "build.ts",
      "package.json",
      "src",
      "main.c",
      "main.html",
      "main.js",
      "out",
      "main.wasm"
    ]);
  });
  it("should run the project when clicking the Run button", async () => {
    // Click the run button and wait for the results
    await page.click("div.button[title=\"Run Project: CtrlCmd + Enter\"]");
    await page.waitFor(1000); // TODO: Remove hardcoded wait duration
    await expect(getRunResults()).resolves.toEqual("42");
  });
});
