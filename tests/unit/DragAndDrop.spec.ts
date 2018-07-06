/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import { File, FileType, Directory } from "../../src/models";
import { ITree, ContextMenuEvent, DragOverBubble } from "../../src/monaco-extra";
import { DragAndDrop } from "../../src/monaco-dnd";
import * as utils from "../../src/util";

describe("Tests for DragAndDrop", () => {
  describe("constructor", () => {
    it("should be constructable", () => {
      const dnd = new DragAndDrop({});
    });
  });
  describe("getDragURI", () => {
    it("should returns a uri if the given element should be allowed to drag", () => {
      const dnd = new DragAndDrop({});
      const file = new File("file", FileType.JavaScript);
      expect(dnd.getDragURI(null, file)).toEqual("0");
    });
  });
  describe("getDragLabel", () => {
    it("should returns a label to display when dragging the element", () => {
      const dnd = new DragAndDrop({});
      const fileA = new File("fileA", FileType.JavaScript);
      const fileB = new File("fileB", FileType.JavaScript);
      expect(dnd.getDragLabel(null, [fileA, fileB])).toEqual("fileA");
    });
  });
  describe("onDragStart", () => {
    it("should return undefined", () => {
      const dnd = new DragAndDrop({});
      expect(dnd.onDragStart(null, null, null)).toBeUndefined();
    });
  });
  describe("onDragOver", () => {
    it("should handle files with allowed mime type (file upload)", () => {
      const dnd = new DragAndDrop({});
      const isUploadAllowedForMimeType = jest.spyOn(utils, "isUploadAllowedForMimeType");
      const data = {} as any;
      const targetElement = {} as any;
      const originalEvent = { browserEvent: { dataTransfer: { items: [{ type: "text/html" }]}}} as any;
      expect(dnd.onDragOver(null, data, targetElement, originalEvent)).toEqual({
        accept: true,
        bubble: DragOverBubble.BUBBLE_DOWN,
        autoExpand: true
      });
      expect(isUploadAllowedForMimeType).toHaveBeenCalled();
      isUploadAllowedForMimeType.mockRestore();
    });
    it("should handle files with not allowed mime type (file upload)", () => {
      const dnd = new DragAndDrop({});
      const data = {} as any;
      const targetElement = {} as any;
      const originalEvent = { browserEvent: { dataTransfer: { items: [{ type: "video/mp4" }]}}} as any;
      expect(dnd.onDragOver(null, data, targetElement, originalEvent)).toEqual({
        accept: false,
        bubble: DragOverBubble.BUBBLE_DOWN,
        autoExpand: true
      });
    });
    it("should handle items that hasItemsUriListType (file upload)", () => {
      const dnd = new DragAndDrop({});
      const isUploadAllowedForMimeType = jest.spyOn(utils, "isUploadAllowedForMimeType");
      const data = {
        getData: () => [{ name: "test" }]
      } as any;
      const targetElement = {} as any;
      const originalEvent = { browserEvent: { dataTransfer: { items: [{ type: "text/uri-list" }]}}} as any;
      expect(dnd.onDragOver(null, data, targetElement, originalEvent)).toEqual({
        accept: false,
        bubble: DragOverBubble.BUBBLE_DOWN,
        autoExpand: true
      });
      expect(isUploadAllowedForMimeType).not.toHaveBeenCalled();
      isUploadAllowedForMimeType.mockRestore();
    });
    it("should handle empty drags (file upload)", () => {
      const dnd = new DragAndDrop({});
      const isUploadAllowedForMimeType = jest.spyOn(utils, "isUploadAllowedForMimeType");
      const data = {
        getData: () => [{ name: "test" }]
      } as any;
      const targetElement = {} as any;
      const originalEvent = { browserEvent: { dataTransfer: { items: []}}} as any;
      dnd.onDragOver(null, data, targetElement, originalEvent);
      expect(isUploadAllowedForMimeType).not.toHaveBeenCalled();
      isUploadAllowedForMimeType.mockRestore();
    });
    it("should allow files to be moved into a folder", () => {
      const dnd = new DragAndDrop({});
      const file = new File("file", FileType.JavaScript);
      const data = {
        elements: [file],
        getData: () => [file]
      } as any;
      const targetElement = new Directory("src");
      expect(dnd.onDragOver(null, data, targetElement, null)).toEqual({
        accept: true,
        bubble: DragOverBubble.BUBBLE_DOWN,
        autoExpand: true
      });
    });
    it("should disable drop when a folder is being moved into its own child", () => {
      const dnd = new DragAndDrop({});
      const parent = new Directory("parent");
      const data = {
        elements: [parent],
        getData: () => [parent]
      } as any;
      const targetElement = parent.newDirectory("child");
      expect(dnd.onDragOver(null, data, targetElement, null)).toEqual({
        accept: false,
        bubble: DragOverBubble.BUBBLE_DOWN,
        autoExpand: true
      });
    });
    it("should disable drop when a folder is being moved into itself", () => {
      const dnd = new DragAndDrop({});
      const dir = new Directory("dir");
      const data = {
        elements: [dir],
        getData: () => [dir]
      } as any;
      const targetElement = dir;
      expect(dnd.onDragOver(null, data, targetElement, null)).toEqual({
        accept: false,
        bubble: DragOverBubble.BUBBLE_DOWN,
        autoExpand: true
      });
    });
  });
  describe("drop", () => {
    it("should handle file uploads", () => {
      const dnd = new DragAndDrop({});
      const data = {} as any;
      const targetElement = {} as any;
      const items = [{name: "file"}];
      const originalEvent = { browserEvent: { dataTransfer: { items }}} as any;
      const uploadFilesToDirectory = jest.spyOn(utils, "uploadFilesToDirectory");
      // tslint:disable-next-line
      uploadFilesToDirectory.mockImplementation(() => {});
      dnd.drop(null, data, targetElement, originalEvent);
      expect(uploadFilesToDirectory).toHaveBeenCalledWith(items, targetElement);
    });
    it("should handle regular element drops", () => {
      const target = { props: { onMoveFile: jest.fn() }};
      const dnd = new DragAndDrop(target);
      const file = new File("file", FileType.JavaScript);
      const data = { getData: () => [file] } as any;
      const targetElement = {} as any;
      const originalEvent = { browserEvent: { dataTransfer: { items: [] }}} as any;
      dnd.drop(null, data, targetElement, originalEvent);
      expect(target.props.onMoveFile).toHaveBeenCalledWith(file, targetElement);
    });
  });
});
