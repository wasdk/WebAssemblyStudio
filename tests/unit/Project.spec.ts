/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { Project } from "../../src/models";

describe("Project tests", () => {
  describe("constructor", () => {
    it("should be constructable", () => {
      const project = new Project();
      expect(project.name).toEqual("Project");
    });
  });
  describe("hasStatus", () => {
    it("should return false if the project does not have a status", () => {
      const project = new Project();
      expect(project.hasStatus()).toEqual(false);
    });
    it("should return true if the project has a status", () => {
      const project = new Project();
      project.pushStatus("test");
      expect(project.hasStatus()).toEqual(true);
    });
  });
  describe("getStatus", () => {
    it("should return the projects status", () => {
      const project = new Project();
      project.pushStatus("test");
      expect(project.getStatus()).toEqual("test");
    });
    it("should return an empty string if project does not have a status", () => {
      const project = new Project();
      expect(project.getStatus()).toEqual("");
    });
  });
  describe("pushStatus", () => {
    it("should push new status and dispatch an onDidChangeStatus event", () => {
      const callback = jest.fn();
      const project = new Project();
      project.onDidChangeStatus.register(callback);
      project.pushStatus("test");
      expect(project.getStatus()).toEqual("test");
      expect(callback).toHaveBeenCalled();
    });
  });
  describe("popStatus", () => {
    it("should pop the most recent status and dispatch an onDidChangeStatus event", () => {
      const callback = jest.fn();
      const project = new Project();
      project.onDidChangeStatus.register(callback);
      project.pushStatus("test");
      project.popStatus();
      expect(project.hasStatus()).toEqual(false);
      expect(callback).toHaveBeenCalledTimes(2);
    });
    it("should assert that the project has a status before removal", () => {
      const project = new Project();
      project.popStatus();
      expect(() => project.popStatus()).toThrowError();
    });
  });
  describe("onChange", () => {
    it("should expose an onChange event dispatcher", () => {
      const callback = jest.fn();
      const project = new Project();
      project.onChange.register(callback);
      project.onChange.dispatch();
      expect(callback).toHaveBeenCalled();
    });
  });
  describe("onDirtyFileUsed", () => {
    it("should expose an onDirtyFileUsed event dispatcher", () => {
      const callback = jest.fn();
      const project = new Project();
      project.onDirtyFileUsed.register(callback);
      project.onDirtyFileUsed.dispatch();
      expect(callback).toHaveBeenCalled();
    });
  });
});
