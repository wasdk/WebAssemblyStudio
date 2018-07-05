/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import { File, FileType } from "../../src/models";
import { ITree, ContextMenuEvent } from "../../src/monaco-extra";

const superOnContextMenu = jest.fn();

class DefaultController {
  onContextMenu(tree: ITree, file: File, event: ContextMenuEvent) {
    superOnContextMenu(tree, file, event);
  }
}

jest.mock("../../src/monaco-utils.ts", () => ({
  MonacoUtils: {
    TreeDefaults: {
      DefaultController
    }
  }
}));

import { createController } from "../../src/monaco-controller";

describe("Tests for Controller", () => {
  const setup = (resolveMenuPosition?, customEvent?) => {
    (window as any).innerHeight = 1200;
    const target = { contextMenuService: { showContextMenu: jest.fn() }};
    const getActionsFn = jest.fn().mockImplementation(() => ["action1"]);
    const tree = { setFocus: jest.fn(), DOMFocus: jest.fn() } as any;
    const file = new File("fileA", FileType.JavaScript);
    const event = customEvent || { posx: 10, posy: 10} as any;
    const controller = createController(target, getActionsFn, resolveMenuPosition);
    return { target, getActionsFn, tree, file, event, controller };
  };
  afterAll(() => {
    jest.unmock("../../src/monaco-utils.ts");
  });
  describe("createController", () => {
    it("should create a controller instance", () => {
      const { controller } = setup();
      expect(controller).toHaveProperty("onContextMenu");
      expect(controller).toHaveProperty("resolveMenuHeight");
    });
  });
  describe("onContextMenu", () => {
    it("should return true", () => {
      const { controller, tree, file, event } = setup();
      expect(controller.onContextMenu(tree, file, event)).toEqual(true);
    });
    it("should set focus on the provided file", () => {
      const { controller, tree, file, event } = setup();
      controller.onContextMenu(tree, file, event);
      expect(tree.setFocus).toHaveBeenCalledWith(file);
    });
    it("should get actions using the getActionsFn argument", () => {
      const { controller, tree, file, event, getActionsFn } = setup();
      controller.onContextMenu(tree, file, event);
      expect(getActionsFn).toHaveBeenCalledWith(file, event);
    });
    it("should hide the context menu if no actions are provided", () => {
      superOnContextMenu.mockClear();
      const { controller, target, tree, file, event, getActionsFn } = setup();
      getActionsFn.mockImplementation(() => undefined);
      expect(controller.onContextMenu(tree, file, event)).toEqual(false);
      expect(target.contextMenuService.showContextMenu).not.toHaveBeenCalled();
      expect(superOnContextMenu).not.toHaveBeenCalled();
    });
    it("should hide the context menu if an empty array of actions are provided", () => {
      superOnContextMenu.mockClear();
      const { controller, target, tree, file, event, getActionsFn } = setup();
      getActionsFn.mockImplementation(() => []);
      expect(controller.onContextMenu(tree, file, event)).toEqual(false);
      expect(target.contextMenuService.showContextMenu).not.toHaveBeenCalled();
      expect(superOnContextMenu).not.toHaveBeenCalled();
    });
    it("should call the contextMenuService", async () => {
      const { controller, target, tree, file, event } = setup();
      tree.DOMFocus.mockClear();
      controller.onContextMenu(tree, file, event);
      const options = target.contextMenuService.showContextMenu.mock.calls[0][0];
      expect(options.getAnchor()).toEqual({ x: 0, y: 7 });
      expect(options.getActionItem()).toBeNull();
      expect(options.onHide()).toBeUndefined();
      expect(options.onHide(true)).toBeUndefined();
      expect(tree.DOMFocus).toHaveBeenCalledTimes(1);
      await expect(options.getActions()).resolves.toEqual(["action1"]);
    });
    it("should call super.onContextMenu", () => {
      superOnContextMenu.mockClear();
      const { controller, tree, file, event } = setup();
      controller.onContextMenu(tree, file, event);
      expect(superOnContextMenu).toHaveBeenCalledWith(tree, file, event);
    });
  });
  describe("resolveMenuHeight", () => {
    it("should resolve the menu max height", () => {
      const event  = { posx: 10, posy: 1000 } as any;
      const { controller, tree, file  } = setup(true, event);
      const element = document.createElement("div");
      const querySelector = jest.spyOn(document, "querySelector");
      querySelector.mockImplementation(() => element);
      controller.onContextMenu(tree, file, event);
      expect(querySelector).toHaveBeenCalledWith(".context-view.monaco-menu-container");
      expect(element.style.maxHeight).toEqual("190px");
      querySelector.mockRestore();
    });
    it("should make sure that the menu max height never exceeds 380px", () => {
      const { controller, tree, file, event } = setup(true);
      const element = document.createElement("div");
      const querySelector = jest.spyOn(document, "querySelector");
      querySelector.mockImplementation(() => element);
      controller.onContextMenu(tree, file, event);
      expect(querySelector).toHaveBeenCalledWith(".context-view.monaco-menu-container");
      expect(element.style.maxHeight).toEqual("380px");
      querySelector.mockRestore();
    });
    it("should NOT resolve the menu max height by default", () => {
      const { controller, tree, file, event } = setup();
      const querySelector = jest.spyOn(document, "querySelector");
      controller.onContextMenu(tree, file, event);
      expect(querySelector).not.toHaveBeenCalled();
      querySelector.mockRestore();
    });
  });
});
