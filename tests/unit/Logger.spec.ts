/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";

const config = jest.fn();
const install = jest.fn();
const lastEventId = jest.fn();
const captureException = jest.fn();
const captureMessage = jest.fn();

jest.mock("raven-js", () => ({
  config: config.mockImplementation(() => ({ install })),
  lastEventId,
  captureException,
  captureMessage
}));

jest.mock("../../config.json", () => ({
  default: {
    sentryDNS: "testDNS"
  }
}), { virtual: true });

import { Logger } from "../../src/utils/Logger";

describe("Tests for Logger", () => {
  const isRunningInProduction = jest.spyOn(Logger, "isRunningInProduction");
  const runIn = state => isRunningInProduction.mockImplementation(() => state === "production");
  afterAll(() => {
    jest.resetAllMocks();
  });
  describe("init", () => {
    it("should configure and install Raven if in production", () => {
      runIn("production");
      config.mockClear();
      install.mockClear();
      Logger.init();
      expect(config).toHaveBeenCalledWith("testDNS");
      expect(install).toHaveBeenCalled();
    });
    it("should NOT configure and install Raven if in development", () => {
      runIn("development");
      config.mockClear();
      install.mockClear();
      Logger.init();
      expect(config).not.toHaveBeenCalled();
      expect(install).not.toHaveBeenCalled();
    });
  });
  describe("captureException", () => {
    it("should log to Sentry if in production", () => {
      runIn("production");
      const e = new Error("test");
      const additionalData = { extra: { a: 1 }};
      captureException.mockClear();
      Logger.captureException(e, additionalData);
      expect(captureException).toHaveBeenCalledWith(e, additionalData);
    });
    it("should NOT log to Sentry if in development", () => {
      runIn("development");
      captureException.mockClear();
      const e = new Error("test");
      Logger.captureException(e);
      expect(captureException).not.toHaveBeenCalled();
    });
  });
  describe("captureMessage", () => {
    it("should log to Sentry if in production", () => {
      runIn("production");
      captureMessage.mockClear();
      const message = "TEST";
      const additionalData = { extra: { a: 1 }};
      Logger.captureMessage(message, additionalData);
      expect(captureMessage).toHaveBeenCalledWith(message, additionalData);
    });
    it("should NOT log to Sentry if in development", () => {
      runIn("development");
      captureMessage.mockClear();
      const message = "TEST";
      Logger.captureMessage(message);
      expect(captureMessage).not.toHaveBeenCalled();
    });
  });
  describe("getLastEventId", () => {
    it("should return the last event id", () => {
      lastEventId.mockClear();
      Logger.getLastEventId();
      expect(lastEventId).toHaveBeenCalled();
    });
  });
  describe("isRunningInProduction", () => {
    it("should return true for hostname: webassembly.studio", () => {
      // "testURL": "https://webassembly.studio/"
      jest.restoreAllMocks();
      expect(Logger.isRunningInProduction()).toEqual(true);
    });
  });
});
