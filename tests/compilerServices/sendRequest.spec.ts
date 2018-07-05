/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

jest.mock("../../src/config", () => ({
  // @ts-ignore
  default: async () => import("../../config.json")
}));

import {
  getServiceURL,
  parseJSONResponse,
  ServiceTypes,
  sendRequestJSON,
  sendRequest
} from "../../src/compilerServices/sendRequest";

describe("Tests for sendRequest", () => {
  afterAll(() => {
    jest.unmock("../../src/config");
  });
  describe("getServiceURL", () => {
    it("should return the correct URL for: Rustc", async () => {
      const serviceURL = "//webassembly-studio-rust.herokuapp.com/rustc";
      await expect(getServiceURL(ServiceTypes.Rustc)).resolves.toEqual(serviceURL);
    });
    it("should return the correct URL for: Cargo", async () => {
      const serviceURL = "//webassembly-studio-rust.herokuapp.com/cargo";
      await expect(getServiceURL(ServiceTypes.Cargo)).resolves.toEqual(serviceURL);
    });
    it("should return the correct URL for: Clang", async () => {
      const serviceURL = "//webassembly-studio-clang.herokuapp.com/build";
      await expect(getServiceURL(ServiceTypes.Clang)).resolves.toEqual(serviceURL);
    });
    it("should return the correct URL for: Service", async () => {
      const serviceURL = "//wasmexplorer-service.herokuapp.com/service.php";
      await expect(getServiceURL(ServiceTypes.Service)).resolves.toEqual(serviceURL);
    });
    it("should throw an error for invalid ServiceTypes", async () => {
      const expectedMessage = "Invalid ServiceType: 99";
      await expect(getServiceURL(99)).rejects.toEqual(new Error(expectedMessage));
    });
  });
  describe("parseJSONResponse", () => {
    it("should return the parsed JSON response", async () => {
      const data = { a: 1, b: 2 };
      const text = jest.fn(() => Promise.resolve(JSON.stringify(data)));
      const response = { text, status: 200 } as any;
      await expect(parseJSONResponse(response)).resolves.toEqual(data);
    });
    it("should handle errors gracefully", async () => {
      const text = jest.fn(() => Promise.resolve("<pre>Error message</pre>"));
      const response = { text, status: 500 } as any;
      await expect(parseJSONResponse(response)).resolves.toEqual({
        success: false,
        message: "Error message"
      });
    });
  });
  describe("sendRequestJSON", () => {
    it("should make a POST request using fetch", async () => {
      const text = jest.fn(() => Promise.resolve(JSON.stringify("response")));
      (global as any).fetch = jest.fn().mockImplementation(() => Promise.resolve({ text, status: 200 }));
      (global as any).Headers = jest.fn().mockImplementation((arg) => arg);
      const content = { a: 1, b: 2};
      const response = await sendRequestJSON(content, ServiceTypes.Clang);
      expect(window.fetch).toHaveBeenCalledWith("//webassembly-studio-clang.herokuapp.com/build", {
        method: "POST",
        body: JSON.stringify(content),
        headers: { "Content-Type": "application/json" }
      });
      expect(response).toEqual("response");
      (global as any).fetch = undefined;
      (global as any).Headers = undefined;
    });
  });
  describe("sendRequest", () => {
    it("should make a POST request using fetch", async () => {
      const text = jest.fn(() => Promise.resolve(JSON.stringify("response")));
      (global as any).fetch = jest.fn().mockImplementation(() => Promise.resolve({ text, status: 200 }));
      (global as any).Headers = jest.fn().mockImplementation((arg) => arg);
      const content = JSON.stringify({ a: 1, b: 2});
      const response = await sendRequest(content, ServiceTypes.Clang);
      expect(window.fetch).toHaveBeenCalledWith("//webassembly-studio-clang.herokuapp.com/build", {
        method: "POST",
        body: content,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      expect(response).toEqual("response");
      (global as any).fetch = undefined;
      (global as any).Headers = undefined;
    });
  });
});
