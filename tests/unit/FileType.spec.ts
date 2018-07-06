/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import {
  FileType,
  isBinaryFileType,
  languageForFileType,
  nameForFileType,
  extensionForFileType,
  fileTypeFromFileName,
  fileTypeForExtension,
  mimeTypeForFileType,
  fileTypeForMimeType,
  getIconForFileType,
} from "../../src/models";

describe("FileType tests", () => {
  describe("isBinaryFileType", () => {
    it("should return true for FileType.Wasm", () => {
      expect(isBinaryFileType(FileType.Wasm)).toEqual(true);
    });
    it("should return false for non binary file types", () => {
      expect(isBinaryFileType(FileType.Markdown)).toEqual(false);
    });
  });
  describe("languageForFileType", () => {
    it("should return the language as a string", () => {
      expect(languageForFileType(FileType.HTML)).toEqual("html");
      expect(languageForFileType(FileType.CSS)).toEqual("css");
      expect(languageForFileType(FileType.JavaScript)).toEqual("javascript");
      expect(languageForFileType(FileType.TypeScript)).toEqual("typescript");
      expect(languageForFileType(FileType.C)).toEqual("cpp");
      expect(languageForFileType(FileType.Cpp)).toEqual("cpp");
      expect(languageForFileType(FileType.Rust)).toEqual("rust");
      expect(languageForFileType(FileType.Wasm)).toEqual("wat");
      expect(languageForFileType(FileType.Wat)).toEqual("wat");
      expect(languageForFileType(FileType.Log)).toEqual("log");
      expect(languageForFileType(FileType.x86)).toEqual("x86");
      expect(languageForFileType(FileType.Markdown)).toEqual("markdown");
      expect(languageForFileType(FileType.Cretonne)).toEqual("cton");
      expect(languageForFileType(FileType.JSON)).toEqual("json");
      expect(languageForFileType(FileType.DOT)).toEqual("dot");
      expect(languageForFileType(FileType.TOML)).toEqual("toml");
      expect(languageForFileType(null)).toEqual("");
    });
  });
  describe("nameForFileType", () => {
    it("should return the name as a string", () => {
      expect(nameForFileType(FileType.HTML)).toEqual("HTML");
      expect(nameForFileType(FileType.CSS)).toEqual("CSS");
      expect(nameForFileType(FileType.JavaScript)).toEqual("JavaScript");
      expect(nameForFileType(FileType.TypeScript)).toEqual("TypeScript");
      expect(nameForFileType(FileType.C)).toEqual("C");
      expect(nameForFileType(FileType.Cpp)).toEqual("C++");
      expect(nameForFileType(FileType.Wat)).toEqual("WebAssembly Text");
      expect(nameForFileType(FileType.Wasm)).toEqual("WebAssembly");
      expect(nameForFileType(FileType.Markdown)).toEqual("Markdown");
      expect(nameForFileType(FileType.Rust)).toEqual("Rust");
      expect(nameForFileType(FileType.Cretonne)).toEqual("Cretonne");
      expect(nameForFileType(FileType.JSON)).toEqual("JSON");
      expect(nameForFileType(FileType.DOT)).toEqual("DOT");
      expect(nameForFileType(FileType.TOML)).toEqual("TOML");
      expect(nameForFileType(null)).toEqual("");
    });
  });
  describe("extensionForFileType", () => {
    it("should return the extension as a string", () => {
      expect(extensionForFileType(FileType.HTML)).toEqual("html");
      expect(extensionForFileType(FileType.CSS)).toEqual("css");
      expect(extensionForFileType(FileType.JavaScript)).toEqual("js");
      expect(extensionForFileType(FileType.TypeScript)).toEqual("ts");
      expect(extensionForFileType(FileType.C)).toEqual("c");
      expect(extensionForFileType(FileType.Cpp)).toEqual("cpp");
      expect(extensionForFileType(FileType.Wat)).toEqual("wat");
      expect(extensionForFileType(FileType.Wasm)).toEqual("wasm");
      expect(extensionForFileType(FileType.Markdown)).toEqual("md");
      expect(extensionForFileType(FileType.Rust)).toEqual("rs");
      expect(extensionForFileType(FileType.Cretonne)).toEqual("cton");
      expect(extensionForFileType(FileType.JSON)).toEqual("json");
      expect(extensionForFileType(FileType.DOT)).toEqual("dot");
      expect(extensionForFileType(FileType.TOML)).toEqual("toml");
      expect(extensionForFileType(null)).toEqual("");
    });
  });
  describe("fileTypeFromFileName", () => {
    it("should return the file type", () => {
      expect(fileTypeFromFileName("index.html")).toEqual(FileType.HTML);
    });
  });
  describe("fileTypeForExtension", () => {
    it("should return the file type", () => {
      expect(fileTypeForExtension("html")).toEqual(FileType.HTML);
      expect(fileTypeForExtension("css")).toEqual(FileType.CSS);
      expect(fileTypeForExtension("js")).toEqual(FileType.JavaScript);
      expect(fileTypeForExtension("ts")).toEqual(FileType.TypeScript);
      expect(fileTypeForExtension("c")).toEqual(FileType.C);
      expect(fileTypeForExtension("cpp")).toEqual(FileType.Cpp);
      expect(fileTypeForExtension("wat")).toEqual(FileType.Wat);
      expect(fileTypeForExtension("wasm")).toEqual(FileType.Wasm);
      expect(fileTypeForExtension("md")).toEqual(FileType.Markdown);
      expect(fileTypeForExtension("rs")).toEqual(FileType.Rust);
      expect(fileTypeForExtension("cton")).toEqual(FileType.Cretonne);
      expect(fileTypeForExtension("map")).toEqual(FileType.JSON);
      expect(fileTypeForExtension("json")).toEqual(FileType.JSON);
      expect(fileTypeForExtension("dot")).toEqual(FileType.DOT);
      expect(fileTypeForExtension("toml")).toEqual(FileType.TOML);
      expect(fileTypeForExtension("")).toBeNull();
    });
  });
  describe("mimeTypeForFileType", () => {
    it("should return the mime type as a string", () => {
      expect(mimeTypeForFileType(FileType.HTML)).toEqual("text/html");
      expect(mimeTypeForFileType(FileType.JavaScript)).toEqual("application/javascript");
      expect(mimeTypeForFileType(FileType.Wasm)).toEqual("application/wasm");
      expect(mimeTypeForFileType(FileType.JSON)).toEqual("application/json");
      expect(mimeTypeForFileType(FileType.DOT)).toEqual("text/plain");
      expect(mimeTypeForFileType(FileType.Markdown)).toEqual("text/markdown");
      expect(mimeTypeForFileType(null)).toEqual("");
    });
  });
  describe("fileTypeForMimeType", () => {
    it("should return the file type", () => {
      expect(fileTypeForMimeType("text/html")).toEqual(FileType.HTML);
      expect(fileTypeForMimeType("application/javascript")).toEqual(FileType.JavaScript);
      expect(fileTypeForMimeType("application/wasm")).toEqual(FileType.Wasm);
      expect(fileTypeForMimeType("application/json")).toEqual(FileType.JSON);
      expect(fileTypeForMimeType("text/markdown")).toEqual(FileType.Markdown);
      expect(fileTypeForMimeType("")).toEqual(FileType.Unknown);
    });
  });
  describe("getIconForFileType", () => {
    it("should return a css class name", () => {
      expect(getIconForFileType(FileType.HTML)).toEqual("html-lang-file-icon");
      expect(getIconForFileType(FileType.CSS)).toEqual("css-lang-file-icon");
      expect(getIconForFileType(FileType.JavaScript)).toEqual("javascript-lang-file-icon");
      expect(getIconForFileType(FileType.TypeScript)).toEqual("typescript-lang-file-icon");
      expect(getIconForFileType(FileType.C)).toEqual("c-lang-file-icon");
      expect(getIconForFileType(FileType.Cpp)).toEqual("cpp-lang-file-icon");
      expect(getIconForFileType(FileType.Wat)).toEqual("wat-lang-file-icon");
      expect(getIconForFileType(FileType.Wasm)).toEqual("wasm-lang-file-icon");
      expect(getIconForFileType(FileType.Markdown)).toEqual("markdown-lang-file-icon");
      expect(getIconForFileType(FileType.Rust)).toEqual("rust-lang-file-icon");
      expect(getIconForFileType(FileType.JSON)).toEqual("json-lang-file-icon");
      expect(getIconForFileType(FileType.Directory)).toEqual("folder-icon");
      expect(getIconForFileType(null)).toEqual("txt-ext-file-icon");
    });
  });
});
