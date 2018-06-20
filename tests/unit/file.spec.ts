/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { Directory, FileType, File, Problem, Project } from "../../src/models";
import { Service } from "../../src/service";

function getDirectoryStructure() {
  const a = new Directory("test");
  const b = a.newFile("b", FileType.JavaScript, false);
  const c = a.newDirectory("c");
  const cd = a.newFile("c/d", FileType.JavaScript, false);
  return { a, b, c, cd };
}

function wait(duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

declare var monaco: { editor, languages };

describe("File tests", () => {
  describe("constructor", () => {
    it("should be constructable", () => {
      const createModel = jest.spyOn(monaco.editor, "createModel");
      const file = new File("file", FileType.JavaScript);
      expect(file.name).toEqual("file");
      expect(file.type).toEqual(FileType.JavaScript);
      expect(file.data).toBeNull();
      expect(file.isDirty).toEqual(false);
      expect(file.isBufferReadOnly).toEqual(false);
      expect(file.isTransient).toEqual(false);
      expect(file.bufferType).toEqual(FileType.JavaScript);
      expect(file.parent).toBeNull();
      expect(createModel).toHaveBeenCalledWith(null, "javascript");
      createModel.mockRestore();
    });
    it("should be constructable (Binary FileType)", () => {
      const createModel = jest.spyOn(monaco.editor, "createModel");
      const file = new File("file", FileType.Wasm);
      expect(file.bufferType).toEqual(FileType.Unknown);
      expect(createModel).toHaveBeenCalledWith("");
      createModel.mockRestore();
    });
    it("should call updateOptions on the created model", () => {
      const updateOptions = jest.spyOn(monaco.editor, "updateOptions");
      const file = new File("file", FileType.JavaScript);
      expect(updateOptions).toHaveBeenCalledWith({ tabSize: 2, insertSpaces: true });
      updateOptions.mockRestore();
    });
    it("should listen for onDidChangeContent events on the created model", () => {
      const onDidChangeContent = jest.spyOn(monaco.editor, "onDidChangeContent");
      const setModelMarkers = jest.spyOn(monaco.editor, "setModelMarkers");
      const onChangeBuffer = jest.fn();
      const onDirtyChange = jest.fn();
      const file = new File("file", FileType.JavaScript);
      const listener = onDidChangeContent.mock.calls[0][0];
      file.onDidChangeDirty.register(onDirtyChange);
      file.onDidChangeBuffer.register(onChangeBuffer);
      listener({});
      expect(onChangeBuffer).toHaveBeenCalled();
      expect(onDirtyChange).toHaveBeenCalled();
      expect(file.isDirty).toEqual(true);
      expect(setModelMarkers).toHaveBeenCalledWith(file.buffer, "compiler", []);
      onDidChangeContent.mockRestore();
      setModelMarkers.mockRestore();
    });
    it("should handle flush flags when receiving onDidChangeContent events", () => {
      const onDidChangeContent = jest.spyOn(monaco.editor, "onDidChangeContent");
      const setModelMarkers = jest.spyOn(monaco.editor, "setModelMarkers");
      const callback = jest.fn();
      const file = new File("file", FileType.JavaScript);
      const listener = onDidChangeContent.mock.calls[0][0];
      file.onDidChangeBuffer.register(callback);
      listener({ isFlush: true });
      expect(callback).not.toHaveBeenCalled();
      expect(setModelMarkers).not.toHaveBeenCalled();
      onDidChangeContent.mockRestore();
      setModelMarkers.mockRestore();
    });
    it("should not dispatch onDidChangeDirty if file is already dirty", () => {
      const onDidChangeContent = jest.spyOn(monaco.editor, "onDidChangeContent");
      const callback = jest.fn();
      const file = new File("file", FileType.JavaScript);
      const listener = onDidChangeContent.mock.calls[0][0];
      file.onDidChangeDirty.register(callback);
      file.isDirty = true;
      listener({});
      expect(callback).not.toHaveBeenCalled();
      expect(file.isDirty).toEqual(true);
      onDidChangeContent.mockRestore();
    });
  });
  describe("setNameAndDescription", () => {
    it("should set the file's name and description", () => {
      const file = new File("file", FileType.JavaScript);
      const newName = "newName";
      const newDescription = "newDescription";
      file.setNameAndDescription(newName, newDescription);
      expect(file.name).toEqual(newName);
      expect(file.description).toEqual(newDescription);
    });
    it("should dispatch an onDidChangeChildren event", () => {
      const parent = new Directory("parent");
      const file = parent.newFile("file", FileType.JavaScript);
      const callback = jest.fn();
      parent.onDidChangeChildren.register(callback);
      file.setNameAndDescription("newName", "newDescription");
      expect(callback).toHaveBeenCalled();
    });
  });
  describe("notifyDidChangeBuffer", () => {
    it("should dispatch an onDidChangeBuffer event", () => {
      const { a, b, c, cd } = getDirectoryStructure();
      const callbackA = jest.fn();
      const callbackB = jest.fn();
      const callbackC = jest.fn();
      a.onDidChangeBuffer.register(callbackA);
      c.onDidChangeBuffer.register(callbackB);
      cd.onDidChangeBuffer.register(callbackC);
      cd.notifyDidChangeBuffer();
      expect(callbackA).toHaveBeenCalled();
      expect(callbackB).toHaveBeenCalled();
      expect(callbackC).toHaveBeenCalled();
    });
  });
  describe("notifyDidChangeData", () => {
    it("should dispatch an onDidChangeData event", () => {
      const { a, b, c, cd } = getDirectoryStructure();
      const callbackA = jest.fn();
      const callbackB = jest.fn();
      const callbackC = jest.fn();
      a.onDidChangeData.register(callbackA);
      c.onDidChangeData.register(callbackB);
      cd.onDidChangeData.register(callbackC);
      cd.notifyDidChangeData();
      expect(callbackA).toHaveBeenCalled();
      expect(callbackB).toHaveBeenCalled();
      expect(callbackC).toHaveBeenCalled();
    });
  });
  describe("notifyDidChangeDirty", () => {
    it("it should dispatch an onDidChangeDirty event", () => {
      const { a, b, c, cd } = getDirectoryStructure();
      const callbackA = jest.fn();
      const callbackB = jest.fn();
      const callbackC = jest.fn();
      a.onDidChangeDirty.register(callbackA);
      c.onDidChangeDirty.register(callbackB);
      cd.onDidChangeDirty.register(callbackC);
      cd.notifyDidChangeDirty();
      expect(callbackA).toHaveBeenCalled();
      expect(callbackB).toHaveBeenCalled();
      expect(callbackC).toHaveBeenCalled();
    });
  });
  describe("setProblems", () => {
    it("should set the file's problems to the provided array of problems", () => {
      const { cd } = getDirectoryStructure();
      const problems = [new Problem(cd, "", "info")];
      cd.setProblems(problems);
      expect(cd.problems).toBe(problems);
    });
    it("should dispatch an onDidChangeProblems event", () => {
      const { a, c, cd } = getDirectoryStructure();
      const problems = [new Problem(cd, "", "info")];
      const callbackA = jest.fn();
      const callbackB = jest.fn();
      const callbackC = jest.fn();
      a.onDidChangeProblems.register(callbackA);
      c.onDidChangeProblems.register(callbackB);
      cd.onDidChangeProblems.register(callbackC);
      cd.setProblems(problems);
      expect(callbackA).toHaveBeenCalled();
      expect(callbackB).toHaveBeenCalled();
      expect(callbackC).toHaveBeenCalled();
    });
  });
  describe("getEmitOutput", () => {
    it("should compile TypeScript files to JavaScript", async () => {
      const file = new File("file", FileType.TypeScript);
      const client = { getEmitOutput: jest.fn() };
      const worker = jest.fn().mockImplementation(() => Promise.resolve(client));
      const getTypeScriptWorker = jest.spyOn(monaco.languages.typescript, "getTypeScriptWorker");
      getTypeScriptWorker.mockImplementation(() => Promise.resolve(worker));
      const output = await file.getEmitOutput();
      expect(getTypeScriptWorker).toHaveBeenCalled();
      expect(worker).toHaveBeenCalled();
      expect(client.getEmitOutput).toHaveBeenCalledWith("uri");
    });
    it("should resolve with empty string for non TypeScript files", async () => {
      const file = new File("file", FileType.JavaScript);
      const output = await file.getEmitOutput();
      expect(output).toEqual("");
    });
  });
  describe("setData", () => {
    it("should set the file's data to the provided data", () => {
      const file = new File("file", FileType.JavaScript);
      const data = "test";
      file.setData(data);
      expect(file.data).toEqual(data);
    });
    it("should dispatch an onDidChangeData event", () => {
      const file = new File("file", FileType.JavaScript);
      const callback = jest.fn();
      file.onDidChangeData.register(callback);
      file.setData("test");
      expect(callback).toHaveBeenCalled();
    });
    it("should assert that the provided data is not null", () => {
      const file = new File("file", FileType.JavaScript);
      expect(() => file.setData(null)).toThrowError();
    });
    describe("updateBuffer", () => {
      it("should reset dirty files and dispatch an onDidChangeDirty event", () => {
        const callback = jest.fn();
        const file = new File("file", FileType.JavaScript);
        const data = "test";
        file.isDirty = true;
        file.onDidChangeDirty.register(callback);
        file.setData(data);
        expect(file.isDirty).toEqual(false);
        expect(callback).toHaveBeenCalled();
      });
      it("should only dispatch an onDidChangeDirty event if the file is dirty", () => {
        const callback = jest.fn();
        const file = new File("file", FileType.JavaScript);
        const data = "test";
        file.onDidChangeDirty.register(callback);
        file.setData(data);
        expect(file.isDirty).toEqual(false);
        expect(callback).not.toHaveBeenCalled();
      });
      it("should set the buffer value", () => {
        const setValue = jest.spyOn(monaco.editor, "setValue");
        const file = new File("file", FileType.JavaScript);
        const data = "test";
        file.setData(data);
        expect(setValue).toHaveBeenCalledWith(data);
        setValue.mockRestore();
      });
      it("should dispatch an onDidChangeBuffer event", () => {
        const callback = jest.fn();
        const file = new File("file", FileType.JavaScript);
        const data = "test";
        file.onDidChangeBuffer.register(callback);
        file.setData(data);
        expect(callback).toHaveBeenCalled();
      });
      it("should handle updates for files of type FileType.Wasm", async () => {
        const setValue = jest.spyOn(monaco.editor, "setValue");
        const setModelLanguage = jest.spyOn(monaco.editor, "setModelLanguage");
        const disassembleWasm = jest.spyOn(Service, "disassembleWasm");
        disassembleWasm.mockImplementation((data) => Promise.resolve(data));
        const file = new File("file", FileType.Wasm);
        const data = "test";
        file.setData(data, "status" as any);
        await wait(10);
        expect(disassembleWasm).toHaveBeenCalledWith(data, "status");
        expect(setValue).toHaveBeenCalledWith(data);
        expect(setModelLanguage).toHaveBeenCalledWith(file.buffer, "wat");
        expect(file.bufferType).toEqual(FileType.Wat);
        expect(file.description).toEqual("This .wasm file is editable as a .wat file, and is automatically reassembled to .wasm when saved.");
        setValue.mockRestore();
        setModelLanguage.mockRestore();
        disassembleWasm.mockRestore();
      });
    });
  });
  describe("getData", () => {
    it("should return the file's data", () => {
      const file = new File("file", FileType.JavaScript);
      const data = "test";
      file.setData(data);
      expect(file.getData()).toEqual(data);
    });
    it("should dispatch an onDirtyFileUsed event if the file is dirty", () => {
      const callback = jest.fn();
      const project = new Project();
      const file = project.newFile("file", FileType.JavaScript);
      project.onDirtyFileUsed.register(callback);
      file.isDirty = true;
      file.getData();
      expect(callback).toHaveBeenCalled();
    });
    it("should NOT dispatch an onDirtyFileUsed event if the file's buffer is readonly", () => {
      const callback = jest.fn();
      const project = new Project();
      const file = project.newFile("file", FileType.JavaScript);
      project.onDirtyFileUsed.register(callback);
      file.isBufferReadOnly = true;
      file.getData();
      expect(callback).not.toHaveBeenCalled();
    });
  });
  describe("getPath", () => {
    it("should return the path", () => {
      const { a, b, c, cd } = getDirectoryStructure();
      expect(a.getPath()).toBe("test");
      expect(b.getPath()).toBe("test/b");
      expect(c.getPath()).toBe("test/c");
      expect(cd.getPath()).toBe("test/c/d");
      expect(cd.getPath(c)).toBe("d");
      expect(cd.getPath(a)).toBe("c/d");
    });
  });
  describe("getProject", () => {
    it("should return the project that the file belongs to", () => {
      const project = new Project();
      const parent = project.newDirectory("parent");
      const file = parent.newFile("file", FileType.JavaScript);
      expect(file.getProject()).toBe(project);
    });
    it("should return null if file does not have a parent", () => {
      const file = new File("file", FileType.JavaScript);
      expect(file.getProject()).toBeNull();
    });
    it("should return null if file does not belong to a project", () => {
      const directory = new Directory("parent");
      const file = directory.newFile("file", FileType.JavaScript);
      expect(file.getProject()).toBeNull();
    });
  });
  describe("getDepth", () => {
    it("should return the file's depth", () => {
      const project = new Project();
      const parent = project.newDirectory("parent");
      const file = parent.newFile("file", FileType.JavaScript);
      expect(file.getDepth()).toEqual(2);
    });
    it("should return 0 if the file does not have a parent", () => {
      const file = new File("file", FileType.JavaScript);
      expect(file.getDepth()).toEqual(0);
    });
  });
  describe("save", () => {
    it("should abort save if file is not dirty", async () => {
      const callback = jest.fn();
      const file = new File("file", FileType.JavaScript);
      file.onDidChangeData.register(callback);
      await file.save("status" as any);
      expect(callback).not.toHaveBeenCalled();
    });
    it("should set the file's data from the buffer value", async () => {
      const file = new File("file", FileType.JavaScript);
      file.isDirty = true;
      const value = "value";
      const getValue = jest.spyOn(monaco.editor, "getValue");
      getValue.mockImplementation(() => value);
      await file.save("status" as any);
      expect(file.data).toEqual(value);
      getValue.mockRestore();
    });
    it("should dispatch an onDidChangeData event", async () => {
      const callback = jest.fn();
      const file = new File("file", FileType.JavaScript);
      file.isDirty = true;
      file.onDidChangeData.register(callback);
      await file.save("status" as any);
      expect(callback).toHaveBeenCalled();
    });
    it("should reset the file's dirty state and dispatch an onDidChangeDirty event", async () => {
      const callback =  jest.fn();
      const file = new File("file", FileType.JavaScript);
      file.isDirty = true;
      file.onDidChangeDirty.register(callback);
      await file.save("status" as any);
      expect(callback).toHaveBeenCalled();
      expect(file.isDirty).toEqual(false);
    });
    it("should assemble wat (Wat -> Wasm)", async () => {
      const value = "value";
      const status = "status" as any;
      const assembleWat = jest.spyOn(Service, "assembleWat");
      const getValue = jest.spyOn(monaco.editor, "getValue");
      getValue.mockImplementation(() => value);
      assembleWat.mockImplementation((value) => Promise.resolve(value));
      const file = new File("file", FileType.Wasm);
      file.isDirty = true;
      file.bufferType = FileType.Wat;
      await file.save(status);
      expect(assembleWat).toHaveBeenCalledWith(value, status);
      expect(file.data).toEqual(value);
    });
    it("should handle errors when assembling wat (Wat -> Wasm)", async () => {
      const value = "value";
      const status = { logLn: jest.fn() } as any;
      const error = new Error("assemble error");
      const assembleWat = jest.spyOn(Service, "assembleWat");
      const getValue = jest.spyOn(monaco.editor, "getValue");
      getValue.mockImplementation(() => value);
      assembleWat.mockImplementation((value) => { throw error; });
      const file = new File("file", FileType.Wasm);
      file.isDirty = true;
      file.bufferType = FileType.Wat;
      file.save(status);
      expect(status.logLn).toHaveBeenCalledWith(error.message, "error");
    });
  });
  describe("toString", () => {
    it("should return a string representation of the file", () => {
      const file = new File("fileName", FileType.JavaScript);
      expect(file.toString()).toEqual("File [fileName]");
    });
  });
  describe("isDescendantOf", () => {
    it("should return true if the file is a direct child of the given element", () => {
      const { a, b } = getDirectoryStructure();
      expect(b.isDescendantOf(a)).toBe(true);
    });
    it("should return true if the file is a nested child of the given element", () => {
      const { a, cd } = getDirectoryStructure();
      expect(cd.isDescendantOf(a)).toBe(true);
    });
    it("should return false if the file is not a descendant of the given element", () => {
      const { a, b } = getDirectoryStructure();
      expect(a.isDescendantOf(b)).toBe(false);
    });
    it("should return false if called with itself as argument", () => {
      const { a } = getDirectoryStructure();
      expect(a.isDescendantOf(a)).toBe(false);
    });
  });
});
