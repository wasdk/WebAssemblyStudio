/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import {
  rewriteHTML, rewriteJS, RewriteSourcesContext
} from "../../src/utils/rewriteSources";

class ProjectMock {
  public files: any;
  constructor() {
    this.files = Object.create(null);
  }
  getFile(name: string) {
    return this.files[name];
  }
  setFile(name: string, data: string) {
    this.files[name] = {
      getData() {
        return data;
      },
    };
  }
  toProject() {
    return this as any;
  }
}

describe("Rewrite sources tests", () => {
  it("html not changed", () => {
    const projectStub = new ProjectMock();
    projectStub.setFile("main.html", "<body>test</body>");

    const context = new RewriteSourcesContext(projectStub.toProject());
    const srcHTML = rewriteHTML(context, "main.html");

    expect(srcHTML).toBe("<body>test</body>");
  });
  it("html changed", () => {
    const projectStub = new ProjectMock();
    projectStub.setFile("main.html",
      "<script src=\"test.js\"></script><body>test</body>");
    projectStub.setFile("test.js", "void 0");

    const context = new RewriteSourcesContext(projectStub.toProject());
    context.createFile = (content: ArrayBuffer|string, type: string): string => {
      expect(content).toBe("void 0");
      return "fake-url:test";
    };
    const srcHTML = rewriteHTML(context, "main.html");

    expect(srcHTML).toBe("<script src=\"fake-url:test\"></script><body>test</body>");
  });
  it("html and js changed", () => {
    const projectStub = new ProjectMock();
    projectStub.setFile("main.html",
      "<script src=\"test.js\"></script><body>test</body>");
    projectStub.setFile("test.js", "import { test } from 'test2.js'; test();");
    projectStub.setFile("test2.js", "void 0");

    const context = new RewriteSourcesContext(projectStub.toProject());
    context.createFile = (content: ArrayBuffer|string, type: string): string => {
      if (content === "void 0") {
        return "fake-url:test2";
      }
      expect(content).toBe("import { test } from \"fake-url:test2\"; test();");
      return "fake-url:test";
    };
    context.logLn = console.error;
    const srcHTML = rewriteHTML(context, "main.html");

    expect(srcHTML).toBe("<script src=\"fake-url:test\"></script><body>test</body>");
  });
});
