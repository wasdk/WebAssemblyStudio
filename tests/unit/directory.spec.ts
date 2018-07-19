/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { Directory, FileType, File } from "../../src/models";

function getDirectoryStructure() {
  const a = new Directory("test");
  const b = a.newFile("b", FileType.JavaScript, false);
  const c = a.newDirectory("c");
  const cd = a.newFile("c/d", FileType.JavaScript, false);
  return { a, b, c, cd };
}

declare var monaco: { editor };

describe("Directory tests", () => {
  describe("constructor", () => {
    it("should be constructable", () => {
      const createModel = jest.spyOn(monaco.editor, "createModel");
      const directory = new Directory("src");
      expect(directory.name).toEqual("src");
      expect(directory.type).toEqual(FileType.Directory);
      createModel.mockRestore();
    });
  });
  describe("notifyDidChangeChildren", () => {
    it("should dispatch an onDidChangeChildren event", () => {
      const { a, c, cd } = getDirectoryStructure();
      const callbackA = jest.fn();
      const callbackB = jest.fn();
      a.onDidChangeChildren.register(callbackA);
      c.onDidChangeChildren.register(callbackB);
      c.notifyDidChangeChildren(cd);
      expect(callbackA).toHaveBeenCalled();
      expect(callbackB).toHaveBeenCalled();
    });
  });
  describe("forEachFile", () => {
    it("should loop through each file", () => {
      const { a, b, c } = getDirectoryStructure();
      const callback = jest.fn();
      b.isTransient = true;
      a.forEachFile(callback);
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback.mock.calls[0][0]).toBe(b);
      expect(callback.mock.calls[1][0]).toBe(c);
    });
    it("should recurse if specified", () => {
      const { a, b, c, cd } = getDirectoryStructure();
      const callback = jest.fn();
      a.forEachFile(callback, false, true);
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback.mock.calls[0][0]).toBe(b);
      expect(callback.mock.calls[1][0]).toBe(cd);
    });
    it("should exclude transient files if specified (while recursing)", () => {
      const { a, b, c, cd } = getDirectoryStructure();
      const callback = jest.fn();
      b.isTransient = true;
      a.forEachFile(callback, true, true);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback.mock.calls[0][0]).toBe(cd);
    });
  });
  describe("mapEachFile", () => {
    it("should map each file", () => {
      const { a, b, c } = getDirectoryStructure();
      const callback = jest.fn();
      b.isTransient = true;
      a.mapEachFile(callback);
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback.mock.calls[0][0]).toBe(b);
      expect(callback.mock.calls[1][0]).toBe(c);
    });
    it("should exclude transient files if specified", () => {
      const { a, b, c } = getDirectoryStructure();
      const callback = jest.fn();
      b.isTransient = true;
      a.mapEachFile(callback, true);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback.mock.calls[0][0]).toBe(c);
    });
  });
  describe("handleNameCollision", () => {
    it("should handle name collisions for file names", () => {
      const directory = new Directory("src");
      const fileA = directory.newFile("file.js", FileType.JavaScript);
      const fileB = directory.newFile("file.js", FileType.JavaScript, false, true);
      const fileC = new File("file.js", FileType.JavaScript);
      expect(fileB.name).toEqual("file.2.js");
      expect(directory.handleNameCollision(fileC.name)).toEqual("file.3.js");
    });
    it("should handle name collisions for directory names", () => {
      const root = new Directory("src");
      const dirA = root.newDirectory("dir");
      const dirB = new Directory("dir");
      expect(root.handleNameCollision(dirB.name, true)).toEqual("dir2");
    });
    it("should throw an error if name collision was not handled", () => {
      const root = new Directory("src");
      expect(() => root.handleNameCollision("test")).toThrowError("Name collision not handled");
    });
  });
  describe("addFile", () => {
    it("should add the file", () => {
      const file = new File("file", FileType.JavaScript);
      const directory = new Directory("src");
      directory.addFile(file);
      expect(file.parent).toBe(directory);
      expect(directory.children[0]).toBe(file);
    });
    it("should assert that the file does not already have a parent", () => {
      const file = new File("file", FileType.JavaScript);
      const directoryA = new Directory("a");
      const directoryB = new Directory("a");
      directoryA.addFile(file);
      expect(() => directoryB.addFile(file)).toThrowError();
    });
    it("should dispatch an onDidChangeChildren event", () => {
      const file = new File("file", FileType.JavaScript);
      const directory = new Directory("src");
      const callback = jest.fn();
      directory.onDidChangeChildren.register(callback);
      directory.addFile(file);
      expect(callback).toHaveBeenCalled();
    });
    it("should handle name collisions", () => {
      const directory = new Directory("src");
      const fileA = new File("file.js", FileType.JavaScript);
      const fileB = new File("file.js", FileType.JavaScript);
      directory.addFile(fileA);
      directory.addFile(fileB);
      expect(fileA.parent).toBe(directory);
      expect(fileB.parent).toBe(directory);
      expect(fileA.name).toEqual("file.js");
      expect(fileB.name).toEqual("file.2.js");
    });
  });
  describe("removeFile", () => {
    it("should remove the file", () => {
      const directory = new Directory("src");
      const file = directory.newFile("file", FileType.JavaScript);
      directory.removeFile(file);
      expect(directory.children).toEqual([]);
      expect(file.parent).toBeNull();
    });
    it("should assert that the file's parent is this directory", () => {
      const directory = new Directory("src");
      const file = new File("file", FileType.JavaScript);
      expect(() => directory.removeFile(file)).toThrowError();
    });
    it("should assert that the file belongs to this directory", () => {
      const directory = new Directory("src");
      const file = new File("file", FileType.JavaScript);
      file.parent = directory;
      expect(() => directory.removeFile(file)).toThrowError();
    });
    it("should dispatch an onDidChangeChildren event", () => {
      const directory = new Directory("src");
      const file = directory.newFile("file", FileType.JavaScript);
      const callback = jest.fn();
      directory.onDidChangeChildren.register(callback);
      directory.removeFile(file);
      expect(callback).toHaveBeenCalled();
    });
  });
  describe("newDirectory", () => {
    it("should create a new directory from a string path", () => {
      const directory = new Directory("parent");
      const child = directory.newDirectory("child");
      expect(child.name).toEqual("child");
      expect(child.parent).toBe(directory);
    });
    it("should create a new directory from an array path", () => {
      const directory = new Directory("parent");
      const child = directory.newDirectory(["child"]);
      expect(child.name).toEqual("child");
      expect(child.parent).toBe(directory);
    });
    it("should create directories recursively", () => {
      const directory = new Directory("parent");
      const child = directory.newDirectory("a/b/c");
      expect(child.name).toEqual("c");
      expect(child.parent.name).toEqual("b");
      expect(child.parent.parent.name).toEqual("a");
      expect(child.parent.parent.parent).toBe(directory);
    });
  });
  describe("newFile", () => {
    it("should create a new file from a string path", () => {
      const directory = new Directory("parent");
      const file = directory.newFile("file", FileType.JavaScript);
      expect(file.name).toEqual("file");
      expect(file.isTransient).toEqual(false);
      expect(file.parent).toBe(directory);
      expect(directory.children[0]).toBe(file);
    });
    it("should create a new file from an array path", () => {
      const directory = new Directory("parent");
      const file = directory.newFile(["file"], FileType.JavaScript);
      expect(file.parent).toBe(directory);
      expect(directory.children[0]).toBe(file);
    });
    it("should recursively create directories specified in the path", () => {
      const directory = new Directory("parent");
      const file = directory.newFile("a/b/c", FileType.JavaScript);
      expect(file.name).toEqual("c");
      expect(file.parent.name).toEqual("b");
      expect(file.parent.parent.name).toEqual("a");
      expect(file.parent.parent.parent).toBe(directory);
    });
    it("should mark the file as transient if specified", () => {
      const directory = new Directory("parent");
      const file = directory.newFile("file", FileType.JavaScript, true);
      expect(file.isTransient).toEqual(true);
    });
    it("should handle name collisions if specified", () => {
      const directory = new Directory("src");
      const fileA = directory.newFile("file.js", FileType.JavaScript, false, true);
      const fileB = directory.newFile("file.js", FileType.JavaScript, false, true);
      expect(fileA.parent).toBe(directory);
      expect(fileB.parent).toBe(directory);
      expect(fileA.name).toEqual("file.js");
      expect(fileB.name).toEqual("file.2.js");
    });
    it("should not handle name collisions by default", () => {
      const directory = new Directory("src");
      const fileA = directory.newFile("file.js", FileType.JavaScript);
      const fileB = directory.newFile("file.js", FileType.JavaScript);
      expect(fileA).toBe(fileB);
    });
  });
  describe("getImmediateChild", () => {
    it("should return the immediate child", () => {
      const directory = new Directory("src");
      const file = directory.newFile("file", FileType.JavaScript);
      expect(directory.getImmediateChild("file")).toBe(file);
    });
    it("should return undefined if no matching immediate child found", () => {
      const directory = new Directory("src");
      const file = directory.newFile("file", FileType.JavaScript);
      expect(directory.getImmediateChild("non-existing")).toBeUndefined();
    });
  });
  describe("getFile", () => {
    it("should get the file from a string path", () => {
      const directory = new Directory("src");
      const file = directory.newFile("file", FileType.JavaScript);
      expect(directory.getFile("file")).toBe(file);
    });
    it("should get the file from a string path (subdirectory)", () => {
      const directory = new Directory("src");
      const file = directory.newFile("a/file", FileType.JavaScript);
      expect(directory.getFile("a/file")).toBe(file);
    });
    it("should get the file from an array path", () => {
      const directory = new Directory("src");
      const file = directory.newFile("file", FileType.JavaScript);
      expect(directory.getFile(["file"])).toBe(file);
    });
    it("should return undefined if file is not found", () => {
      const directory = new Directory("src");
      const file = directory.newFile("file", FileType.JavaScript);
      expect(directory.getFile("non-existing")).toBeUndefined();
    });
    it("should return null if file is not found (nonexisting subdirectory)", () => {
      const directory = new Directory("src");
      const file = directory.newFile("file", FileType.JavaScript);
      expect(directory.getFile("non/existing")).toBeNull();
    });
  });
  describe("list", () => {
    it("should return an array of paths to all files", () => {
      const { a } = getDirectoryStructure();
      expect(a.list()).toEqual(["b", "c/d"]);
    });
  });
  describe("glob", () => {
    it("should return an array of paths to all files matching the glob", () => {
      const { a } = getDirectoryStructure();
      expect(a.glob("*b*")).toEqual(["b"]);
    });
  });
  describe("globFiles", () => {
    it("should return an array of files matching the glob", () => {
      const { a, b } = getDirectoryStructure();
      expect(a.globFiles("*b*")).toEqual([b]);
    });
  });
  describe("hasChildren", () => {
    it("should return true if directory has children", () => {
      const directory = new Directory("test");
      directory.newFile("fileA", FileType.JavaScript);
      expect(directory.hasChildren()).toEqual(true);
    });
    it("should return false if directory has no children", () => {
      const directory = new Directory("test");
      expect(directory.hasChildren()).toEqual(false);
    });
  });
});
