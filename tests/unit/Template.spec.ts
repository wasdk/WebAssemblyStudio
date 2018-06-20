/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import { Template, ProblemTemplate, FileTemplate } from "../../src/utils/Template";
import { File, FileType, Problem, Directory } from "../../src/models";

declare var monaco: { MarkerSeverity };

function generateFileTemplateWithType(type: FileType) {
  const container = document.createElement("div");
  const template = new FileTemplate(container);
  const file = new File("file", type);
  template.set(file);
  return template;
}

describe("Tests for Template", () => {
  describe("Template", () => {
    it("should be constructable", () => {
      const container = document.createElement("div");
      const template = new Template(container);
      const labelDescriptionContainer = template.monacoIconLabel.querySelector(".monaco-icon-label-description-container");
      expect(template.monacoIconLabel).toBeInstanceOf(HTMLDivElement);
      expect(template.monacoIconLabel.classList.contains("monaco-icon-label")).toEqual(true);
      expect(template.monacoIconLabel.style.display).toEqual("flex");
      expect(template.monacoIconLabel.parentNode).toBe(container);
      expect(labelDescriptionContainer).toBeInstanceOf(HTMLDivElement);
      expect(labelDescriptionContainer.parentNode).toBe(template.monacoIconLabel);
      expect(template.label).toBeInstanceOf(HTMLAnchorElement);
      expect(template.label.classList.contains("label-name")).toEqual(true);
      expect(template.label.parentNode).toBe(labelDescriptionContainer);
      expect(template.description).toBeInstanceOf(HTMLSpanElement);
      expect(template.description.classList.contains("label-description")).toEqual(true);
      expect(template.description.parentNode).toBe(labelDescriptionContainer);
    });
  });
  describe("ProblemTemplate", () => {
    it("should be an instance of Template", () => {
      const container = document.createElement("div");
      const template = new ProblemTemplate(container);
      expect(template).toBeInstanceOf(Template);
    });
    it("should set problem info when calling set", () => {
      const container = document.createElement("div");
      const template = new ProblemTemplate(container);
      const file = new File("file", FileType.JavaScript);
      const severity = monaco.MarkerSeverity.Info;
      const marker = { message: "test", startLineNumber: 1, startColumn: 1, severity };
      const problem = Problem.fromMarker(file, marker);
      template.set(problem);
      expect(template.label.classList.contains("info-dark")).toEqual(true);
      expect(template.label.innerHTML).toEqual("test");
      expect(template.description.innerHTML).toEqual("(1, 1)");
    });
  });
  describe("FileTemplate", () => {
    it("should be an instance of Template", () => {
      const container = document.createElement("div");
      const template = new FileTemplate(container);
      expect(template).toBeInstanceOf(Template);
    });
    it("should handle files", () => {
      const container = document.createElement("div");
      const template = new FileTemplate(container);
      const file = new File("file", FileType.JavaScript);
      template.set(file);
      expect(template.monacoIconLabel.classList.contains("file-icon")).toEqual(true);
    });
    it("should handle directories", () => {
      const container = document.createElement("div");
      const template = new FileTemplate(container);
      const directory = new Directory("src");
      template.set(directory);
      expect(template.monacoIconLabel.classList.contains("folder-icon")).toEqual(true);
      expect(template.monacoIconLabel.classList.contains("file-icon")).toEqual(false);
    });
    it("should handle dirty files", () => {
      const container = document.createElement("div");
      const template = new FileTemplate(container);
      const file = new File("file", FileType.JavaScript);
      file.isDirty = true;
      template.set(file);
      expect(template.monacoIconLabel.classList.contains("dirty")).toEqual(true);
      expect(template.monacoIconLabel.title).toEqual("File has been modified.");
    });
    it("should handle transient files", () => {
      const container = document.createElement("div");
      const template = new FileTemplate(container);
      const file = new File("file", FileType.JavaScript);
      file.isTransient = true;
      template.set(file);
      expect(template.monacoIconLabel.classList.contains("transient")).toEqual(true);
      expect(template.monacoIconLabel.title).toEqual("File is transient.");
    });
    it("should handle dirty and transient files", () => {
      const container = document.createElement("div");
      const template = new FileTemplate(container);
      const file = new File("file", FileType.JavaScript);
      file.isDirty = true;
      file.isTransient = true;
      template.set(file);
      expect(template.monacoIconLabel.classList.contains("dirty")).toEqual(true);
      expect(template.monacoIconLabel.classList.contains("transient")).toEqual(true);
      expect(template.monacoIconLabel.title).toEqual("File has been modified and is transient.");
    });
    it("should handle files of type: FileType.C", () => {
      const template = generateFileTemplateWithType(FileType.C);
      expect(template.monacoIconLabel.classList.contains("c-lang-file-icon")).toEqual(true);
    });
    it("should handle files of type: FileType.Cpp", () => {
      const template = generateFileTemplateWithType(FileType.Cpp);
      expect(template.monacoIconLabel.classList.contains("cpp-lang-file-icon")).toEqual(true);
    });
    it("should handle files of type: FileType.JavaScript", () => {
      const template = generateFileTemplateWithType(FileType.JavaScript);
      expect(template.monacoIconLabel.classList.contains("javascript-lang-file-icon")).toEqual(true);
    });
    it("should handle files of type: FileType.HTML", () => {
      const template = generateFileTemplateWithType(FileType.HTML);
      expect(template.monacoIconLabel.classList.contains("html-lang-file-icon")).toEqual(true);
    });
    it("should handle files of type: FileType.TypeScript", () => {
      const template = generateFileTemplateWithType(FileType.TypeScript);
      expect(template.monacoIconLabel.classList.contains("typescript-lang-file-icon")).toEqual(true);
    });
    it("should handle files of type: FileType.Markdown", () => {
      const template = generateFileTemplateWithType(FileType.Markdown);
      expect(template.monacoIconLabel.classList.contains("markdown-lang-file-icon")).toEqual(true);
    });
    it("should handle files of type: FileType.JSON", () => {
      const template = generateFileTemplateWithType(FileType.JSON);
      expect(template.monacoIconLabel.classList.contains("json-lang-file-icon")).toEqual(true);
    });
    it("should handle files of type: FileType.Wasm", () => {
      const template = generateFileTemplateWithType(FileType.Wasm);
      expect(template.monacoIconLabel.classList.contains("wasm-lang-file-icon")).toEqual(true);
    });
    it("should handle files of type: FileType.Wat", () => {
      const template = generateFileTemplateWithType(FileType.Wat);
      expect(template.monacoIconLabel.classList.contains("wat-lang-file-icon")).toEqual(true);
    });
  });
});
