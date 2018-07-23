/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

/* tslint:disable:no-empty */

import { Project, FileType } from "../../src/models";

const mockZip = {
  folder: jest.fn(),
  file: jest.fn(),
  generateAsync: jest.fn(() => Promise.resolve("blob"))
};

jest.mock("jszip", () => {
  return function() {
    return mockZip;
  };
});

function createProject() {
  const project = new Project();
  const src = project.newDirectory("src");
  const fileA = src.newFile("fileA", FileType.JavaScript);
  const fileB = project.newFile("fileB", FileType.JavaScript);
  fileA.setData("fileA-data");
  fileB.setData("fileB-data");
  return { project, fileA, fileB };
}

function createMockContext() {
  const link = document.createElement("a");
  const createElement = jest.spyOn(document, "createElement");
  const appendChild = jest.spyOn(document.body, "appendChild");
  const removeChild = jest.spyOn(document.body, "removeChild");
  createElement.mockImplementation(() => link);
  appendChild.mockImplementation(() => {});
  removeChild.mockImplementation(() => {});
  window.URL.createObjectURL = jest.fn((() => "blob"));
  return {
    link,
    appendChild,
    removeChild,
    restore() {
      window.URL.createObjectURL = undefined;
      createElement.mockRestore();
      appendChild.mockRestore();
      removeChild.mockRestore();
    }
  };
}

import { downloadProject } from "../../src/utils/download";

describe("Tests for download", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  describe("downloadProject", () => {
    it("should create and download a zip-file containing the provided project", async () => {
      const { project } = createProject();
      const { link, appendChild, removeChild, restore } = createMockContext();
      const click = jest.spyOn(link, "click");
      await downloadProject(project);
      expect(mockZip.file).toHaveBeenCalledTimes(2);
      expect(mockZip.folder).toHaveBeenCalledTimes(1);
      expect(mockZip.file).toHaveBeenCalledWith("src/fileA", "fileA-data");
      expect(mockZip.file).toHaveBeenCalledWith("fileB", "fileB-data");
      expect(mockZip.folder).toHaveBeenCalledWith("src");
      expect(mockZip.generateAsync).toHaveBeenCalledWith({type: "blob", mimeType: "application/zip"});
      expect(link.download).toEqual("wasm-project.zip");
      expect(link.href).toEqual("https://webassembly.studio/blob");
      expect(appendChild).toHaveBeenCalledWith(link);
      expect(click).toHaveBeenCalled();
      expect(removeChild).toHaveBeenCalledWith(link);
      restore();
    });
    it("should be possible to provide a custom uri", async () => {
      const { project } = createProject();
      const { link, restore } = createMockContext();
      const uri = "custom-uri";
      await downloadProject(project, uri);
      expect(link.download).toEqual("wasm-project-custom-uri.zip");
      restore();
    });
  });
});
