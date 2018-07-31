/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as util from "../../src/util";
import { Project, Directory, FileType } from "../../src/models";

function wait(duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

describe("Tests for util.ts", () => {
  describe("toAddress", () => {
    it("should covert number to adress", () => {
      expect(util.toAddress(1)).toEqual("0x000001");
      expect(util.toAddress(255)).toEqual("0x0000ff");
    });
  });
  describe("padRight", () => {
    it("should pad string to the right", () => {
      expect(util.padRight("test", 6, " ")).toEqual("test  ");
      expect(util.padRight("test", 4, " ")).toEqual("test");
      expect(util.padRight("test", 2, " ")).toEqual("test");
    });
  });
  describe("padLeft", () => {
    it("should pad string to the left", () => {
      expect(util.padLeft("test", 6, " ")).toEqual("  test");
      expect(util.padLeft("test", 4, " ")).toEqual("test");
      expect(util.padLeft("test", 2, " ")).toEqual("test");
    });
  });
  describe("isBranch", () => {
    it("should return true if instruction is branch", () => {
      [ "jmp", "ja", "jae", "jb", "jbe", "jc", "je", "jg", "jge", "jl", "jle", "jna", "jnae",
        "jnb", "jnbe", "jnc", "jne", "jng", "jnge", "jnl", "jnle", "jno", "jnp", "jns", "jnz",
        "jo", "jp", "jpe", "jpo", "js", "jz"
      ].forEach(mnemonic => expect(util.isBranch({mnemonic})).toEqual(true));
    });
    it("should return false if instruction is not branch", () => {
      expect(util.isBranch({mnemonic: "something"})).toEqual(false);
    });
  });
  describe("concat3", () => {
    it("should concat three strings", () => {
      expect(util.concat3("a", "b", "c")).toEqual("abc");
    });
  });
  describe("concat4", () => {
    it("should concat four strings", () => {
      expect(util.concat4("a", "b", "c", "d")).toEqual("abcd");
    });
  });
  describe("base64EncodeBytes", () => {
    it("should encode bytes -> base64", () => {
      expect(util.base64EncodeBytes(new Uint8Array([1, 2, 3]))).toEqual("AQID");
      expect(util.base64EncodeBytes(new Uint8Array([1, 2, 3, 4]))).toEqual("AQIDBA===");
      expect(util.base64EncodeBytes(new Uint8Array([1, 2, 3, 4, 5]))).toEqual("AQIDBAU=");
    });
  });
  describe("decodeRestrictedBase64ToBytes", () => {
    it("should decode base64 -> bytes", () => {
      expect(util.decodeRestrictedBase64ToBytes("AQID")).toEqual(new Uint8Array([1, 2, 3]));
      expect(util.decodeRestrictedBase64ToBytes("AQIDBA===")).toEqual(new Uint8Array([1, 2, 3, 4]));
      expect(util.decodeRestrictedBase64ToBytes("AQIDBAU=")).toEqual(new Uint8Array([1, 2, 3, 4, 5]));
    });
  });
  describe("layout", () => {
    it("should dispatch a layout event", async () => {
      const onLayout = jest.fn();
      document.addEventListener("layout", onLayout);
      util.layout();
      await wait(10);
      expect(onLayout).toHaveBeenCalledTimes(1);
      document.removeEventListener("layout", onLayout);
    });
  });
  describe("resetDOMSelection", () => {
    it("should reset DOM selections", () => {
      const removeAllRanges = jest.fn();
      window.getSelection = jest.fn(() => ({ removeAllRanges }));
      util.resetDOMSelection();
      expect(removeAllRanges).toHaveBeenCalled();
      window.getSelection = undefined;
    });
  });
  describe("assert", () => {
    it("should assert that the given condition is true", () => {
      expect(() => util.assert(true)).not.toThrowError();
      expect(() => util.assert(false)).toThrowError();
      expect(() => util.assert(false, "message")).toThrowError("message");
    });
  });
  describe("clamp", () => {
    it("should clamp the given number", () => {
      expect(util.clamp(0, 1, 10)).toEqual(1);
      expect(util.clamp(1, 1, 10)).toEqual(1);
      expect(util.clamp(5, 1, 10)).toEqual(5);
      expect(util.clamp(10, 1, 10)).toEqual(10);
      expect(util.clamp(11, 1, 10)).toEqual(10);
    });
  });
  describe("readUploadedFile", () => {
    it("should read the file as text", async () => {
      const file = new File(["file-data"], "fileA");
      await expect(util.readUploadedFile(file, "text")).resolves.toEqual("file-data");
    });
    it("should read the file as arrayBuffer", async () => {
      const file = new File(["file-data"], "fileA");
      await expect(util.readUploadedFile(file, "arrayBuffer")).resolves.toEqual(new ArrayBuffer(8));
    });
    it("should throw error if trying to read as something else", async () => {
      const file = new File(["file-data"], "fileA");
      await expect(util.readUploadedFile(file, null)).rejects.toThrowError("NYI");
    });
    it("should handle errors", async () => {
      const file = new File(["file-data"], "fileA");
      const reader = jest.spyOn(FileReader.prototype, "readAsText");
      reader.mockImplementation(function() { this.onerror(); });
      await expect(util.readUploadedFile(file, "text")).rejects.toThrowError("Problem parsing input file.");
      reader.mockRestore();
    });
  });
  describe("isUploadAllowedForMimeType", () => {
    it("should return true for allowed mime types", () => {
      expect(util.isUploadAllowedForMimeType("")).toEqual(true);
      expect(util.isUploadAllowedForMimeType("text/html")).toEqual(true);
    });
    it("should return false for not allowed mime types", () => {
      expect(util.isUploadAllowedForMimeType("unknown")).toEqual(false);
    });
  });
  describe("getNextKey", () => {
    it("should generate keys", () => {
      expect(util.getNextKey()).toEqual(0);
      expect(util.getNextKey()).toEqual(1);
      expect(util.getNextKey()).toEqual(2);
    });
  });
  describe("uploadFilesToDirectory", () => {
    it("should upload a file to the directory (File)", async () => {
      (global as any).DataTransferItem = jest.fn();
      const root = new Directory("root");
      const items = [ new File(["file-data"], "file.js") ];
      await util.uploadFilesToDirectory(items, root);
      await wait(10);
      const newFile = root.getFile("file.js");
      expect(newFile.getData()).toEqual("file-data");
    });
    it("should upload a file to the directory (DataTransferItem)", async () => {
      (global as any).DataTransferItem = File; // Fake that DataTransferItem is File
      const root = new Directory("root");
      const file = new File(["file-data"], "file.js");
      (file as any).getAsFile = () => file;
      const items = [ file ];
      await util.uploadFilesToDirectory(items, root);
      await wait(10);
      const newFile = root.getFile("file.js");
      expect(newFile.getData()).toEqual("file-data");
    });
    it("should upload a file to the directory (webkitGetAsEntry)", async () => {
      (global as any).DataTransferItem = jest.fn();
      const root = new Directory("root");
      const file = new File(["file-data"], "file.js");
      (file as any).getAsFile = () => file;
      (file as any).webkitGetAsEntry = () => file;
      const items = [ file ];
      await util.uploadFilesToDirectory(items, root);
      await wait(10);
      const newFile = root.getFile("file.js");
      expect(newFile.getData()).toEqual("file-data");
    });
    it("should upload a directory to the directory (webkitGetAsEntry && isDirectory)", async () => {
      (global as any).DataTransferItem = undefined;
      const root = new Directory("root");
      const src = new File([], "src");
      const readEntries = jest.fn();
      (src as any).webkitGetAsEntry = () => src;
      (src as any).isDirectory = true; // Fake that the file is a directory
      (src as any).createReader = () => ({ readEntries });
      const items = [ src ];
      await util.uploadFilesToDirectory(items, root);
      await wait(10);
      expect(readEntries).toHaveBeenCalled();
    });
    it("should handle name collisions while uploading files", async () => {
      (global as any).DataTransferItem = jest.fn();
      const root = new Directory("root");
      const file = root.newFile("file.js", FileType.JavaScript);
      file.setData("fileA");
      const items = [ new File(["fileB"], "file.js") ];
      await util.uploadFilesToDirectory(items, root);
      await wait(10);
      const fileA = root.getFile("file.js");
      const fileB = root.getFile("file.2.js");
      expect(fileA.getData()).toEqual("fileA");
      expect(fileB.getData()).toEqual("fileB");
      expect(root.children).toHaveLength(2);
    });
    it("should handle name collisions while uploading directories", async () => {
      (global as any).DataTransferItem = undefined;
      const root = new Directory("root");
      const handleNameCollision = jest.spyOn(root, "handleNameCollision");
      const src1 = root.newDirectory("src");
      const src2 = new File([], "src");
      const readEntries = jest.fn();
      (src2 as any).webkitGetAsEntry = () => src2;
      (src2 as any).isDirectory = true; // Fake that the file is a directory
      (src2 as any).createReader = () => ({ readEntries });
      const items = [ src2 ];
      await util.uploadFilesToDirectory(items, root);
      await wait(10);
      expect(handleNameCollision).toHaveBeenCalledWith("src");
    });
  });
  describe("readUploadedDirectory", () => {
    it("should recursively read an uploaded directory", async () => {
      const root = new Directory("root");
      const fileA = new File(["fileA"], "fileA.js");
      const fileB = new File(["fileB"], "fileB.js");
      (fileA as any).fullPath = "fileA.js";
      (fileB as any).fullPath = "sub/fileB.js";
      (fileA as any).file = async (cb) => await cb(fileA);
      (fileB as any).file = async (cb) => await cb(fileB);
      const subInput = {
        isDirectory: true,
        createReader: () => ({
          readEntries: (cb) => cb([ fileB ])
        })
      };
      const rootInput = {
        createReader: () => ({
          readEntries: (cb) => cb([ fileA, subInput ])
        })
      };
      await util.readUploadedDirectory(rootInput, root);
      await wait(10);
      const createdFileA = root.getFile("fileA.js");
      const createdFileB = root.getFile("sub/fileB.js");
      expect(createdFileA.getData()).toEqual("fileA");
      expect(createdFileB.getData()).toEqual("fileB");
    });
    it("should handle custom roots", async () => {
      const root = new Directory("root");
      const fileA = new File(["fileA"], "fileA.js");
      (fileA as any).fullPath = "sub/fileA.js";
      (fileA as any).file = async (cb) => await cb(fileA);
      const rootInput = {
        createReader: () => ({
          readEntries: (cb) => cb([ fileA ])
        })
      };
      await util.readUploadedDirectory(rootInput, root, "custom-root");
      await wait(10);
      const createdFileA = root.getFile("custom-root/fileA.js");
      expect(createdFileA.getData()).toEqual("fileA");
    });
  });
});
