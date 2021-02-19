/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import {View, ViewType, defaultViewTypeForFileType, isViewFileDirty} from "../../../src/components/editor/View";
import {File, FileType} from "../../../src/models";

describe("Tests for View", () => {
  it("should be constructable", () => {
    const file = new File("fileA", FileType.Markdown);
    const view = new View(file, ViewType.Markdown);
    expect(view.file).toBe(file);
    expect(view.type).toEqual(ViewType.Markdown);
  });
  it("should use ViewType.Editor as default type", () => {
    const file = new File("fileA", FileType.JavaScript);
    const view = new View(file);
    expect(view.type).toEqual(ViewType.Editor);
  });
  it("should be clonable", () => {
    const file = new File("fileA", FileType.Markdown);
    const view = new View(file, ViewType.Markdown);
    const clone = view.clone();
    expect(view).not.toBe(clone);
    expect(clone.type).toEqual(view.type);
    expect(clone.file).toBe(file);
  });
  describe("defaultViewTypeForFileType", () => {
    it("should return default ViewType for FileType", () => {
      expect(defaultViewTypeForFileType(FileType.Markdown)).toEqual(ViewType.Markdown);
      expect(defaultViewTypeForFileType(FileType.DOT)).toEqual(ViewType.Viz);
      expect(defaultViewTypeForFileType(null)).toEqual(ViewType.Editor);
    });
  });
  describe("isViewFileDirty", () => {
    it("should return true if the views file is dirty", () => {
      const file = new File("file", FileType.JavaScript);
      file.isDirty = true;
      const view = new View(file);
      expect(isViewFileDirty(view)).toEqual(true);
    });
    it("should return false if the views file is not dirty", () => {
      const file = new File("file", FileType.JavaScript);
      const view = new View(file);
      expect(isViewFileDirty(view)).toEqual(false);
    });
    it("should return false if no view is provided", () => {
      expect(isViewFileDirty(null)).toEqual(false);
    });
    it("should return false if the view does not have a file", () => {
      const view = new View(null);
      expect(isViewFileDirty(view)).toEqual(false);
    });
  });
});
