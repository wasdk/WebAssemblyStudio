/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

const compile = jest.fn();
const createCompilerServices = jest.fn();

jest.mock("../../src/compilerServices", () => ({
  createCompilerService: createCompilerServices.mockImplementation(async () => ({
    compile: compile.mockImplementation(async () => ({
      success: true,
      items: { "a.txt": { content: "text" } }
    }))
  })),
  Language: {
    JavaScript: "javascript",
    Text: "text",
  }
}));

import { Project, Directory, File, FileType } from "../../src/models";
import { Service, Language } from "../../src/service";

function generateFiles() {
    const project = new Project();
    const dir = new Directory("dir");
    project.addFile(dir);
    const subdir = new Directory("subdir");
    dir.addFile(subdir);
    const a = new File("a.js", FileType.JavaScript);
    project.addFile(a);
    const b = new File("main.ts", FileType.HTML);
    dir.addFile(b);
    const c = new File("c.md", FileType.Markdown);
    subdir.addFile(c);
    return { a, b, c, };
}

describe("Service.compileFiles tests", () => {
  afterAll(() => {
    jest.unmock("../../src/compilerServices");
  });

  it("should pass full file path", async () => {
    const { a, b, c } = generateFiles();

    const result = await Service.compileFiles([c, a, b], Language.JavaScript, Language.Text);
    expect(result["a.txt"]).toBeTruthy();
    expect(createCompilerServices).toHaveBeenCalledTimes(1);
    expect(createCompilerServices).toHaveBeenCalledWith(Language.JavaScript, Language.Text);
    expect(compile).toHaveBeenCalledTimes(1);
    const compileInput = compile.mock.calls[0][0];
    expect(Object.keys(compileInput.files)).toEqual(["dir/subdir/c.md", "a.js", "dir/main.ts"]);

    createCompilerServices.mockReset();
    compile.mockReset();
  });
});
