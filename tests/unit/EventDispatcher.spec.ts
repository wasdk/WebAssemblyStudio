/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { EventDispatcher } from "../../src/models";

describe("EventDispatcher tests", () => {
  describe("constructor", () => {
    it("should be given a name", () => {
      const dispatcherName = "dispatcher";
      const dispatcher = new EventDispatcher(dispatcherName);
      expect(dispatcher.name).toEqual(dispatcherName);
    });
  });
  describe("register", () => {
    it("should register callback functions", () => {
      const dispatcher = new EventDispatcher("dispatcher");
      const callback = jest.fn();
      dispatcher.register(callback);
      expect((dispatcher as any).callbacks.length).toEqual(1);
    });
    it("should not register existing callback functions", () => {
      const dispatcher = new EventDispatcher("dispatcher");
      const callback = jest.fn();
      dispatcher.register(callback);
      dispatcher.register(callback);
      expect((dispatcher as any).callbacks.length).toEqual(1);
    });
  });
  describe("unregister", () => {
    it("should unregister callback functions", () => {
      const dispatcher = new EventDispatcher("dispatcher");
      const callback = jest.fn();
      dispatcher.register(callback);
      dispatcher.unregister(callback);
      expect((dispatcher as any).callbacks.length).toEqual(0);
    });
    it("should throw error if trying to unregister nonexisting callback functions", () => {
      const dispatcher = new EventDispatcher("dispatcher");
      const callback = jest.fn();
      expect(() => dispatcher.unregister(callback)).toThrowError("Unknown callback.");
    });
  });
  describe("dispatch", () => {
    it("should dispatch event to all registered callbacks", () => {
      const dispatcher = new EventDispatcher("dispatcher");
      const callbackA = jest.fn();
      const callbackB = jest.fn();
      dispatcher.register(callbackA);
      dispatcher.register(callbackB);
      dispatcher.dispatch();
      expect(callbackA).toHaveBeenCalled();
      expect(callbackB).toHaveBeenCalled();
    });
    it("should accept a target", () => {
      const dispatcher = new EventDispatcher("dispatcher");
      const callback = jest.fn();
      const target =  { value: 1 };
      dispatcher.register(callback);
      dispatcher.dispatch(target);
      expect(callback).toHaveBeenCalledWith(target);
    });
  });
});
