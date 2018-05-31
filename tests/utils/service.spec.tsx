/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { Project, Directory, File, FileType } from "../../src/model";
import { Service, Language } from "../../src/service";
import * as compilerServices from "../../src/compilerServices";

class TestService {
  public input;
  async compile(input) {
    this.input = input;
    const items = { "a.txt": { content: "text" } };
    return { success: true, items, };
  }
}

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
  let saveCCS;
  beforeAll(() => {
    saveCCS = (compilerServices as any).createCompilerService;
  });
  afterAll(() => {
    (compilerServices as any).createCompilerService = saveCCS;
  });

  it("should pass full file path", async () => {
    const { a, b, c } = generateFiles();

    const ts = new TestService();
    (compilerServices as any).createCompilerService = jest.fn(async (j, t) => {
      expect(j).toBe(Language.JavaScript);
      expect(t).toBe(Language.Text);
      return ts;
    });
        
    const result = await Service.compileFiles([c, a, b], Language.JavaScript, Language.Text);
    expect(result["a.txt"]).toBeTruthy();
    expect(Object.keys(ts.input.files)).toEqual(["dir/subdir/c.md", "a.js", "dir/main.ts"]);
  });
});