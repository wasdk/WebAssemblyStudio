/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { Problem, File, FileType } from "../../src/models";

declare var monaco: { MarkerSeverity };

describe("Problem tests", () => {
  it("should be constructable", () => {
    const file = new File("file", FileType.JavaScript);
    const description = "problem";
    const severity = "warning";
    const problem = new Problem(file, description, severity);
    expect(problem.file).toBe(file);
    expect(problem.description).toEqual(description);
    expect(problem.severity).toEqual(severity);
  });
  it("should be constructable from marker", () => {
    const file = new File("file", FileType.JavaScript);
    const severity = monaco.MarkerSeverity.Info;
    const marker = { message: "test", startLineNumber: 1, startColumn: 1, severity };
    const problem = Problem.fromMarker(file, marker);
    expect(problem.file).toBe(file);
    expect(problem.description).toEqual("test (1, 1)");
    expect(problem.severity).toEqual("info");
    expect(problem.marker).toBe(marker);
  });
  it("should generate a unique key for each problem", () => {
    const problemA = new Problem(new File("file", FileType.JavaScript), "", "info");
    const problemB = new Problem(new File("file", FileType.JavaScript), "", "info");
    expect(Number(problemB.key)).toBeGreaterThan(Number(problemA.key));
  });
  it("should convert marker severity (monaco.MarkerSeverity) to string", () => {
    const file = new File("file", FileType.JavaScript);
    const problemA = Problem.fromMarker(file, { severity: monaco.MarkerSeverity.Info });
    const problemB = Problem.fromMarker(file, { severity: monaco.MarkerSeverity.Warning });
    const problemC = Problem.fromMarker(file, { severity: monaco.MarkerSeverity.Error });
    expect(problemA.severity).toEqual("info");
    expect(problemB.severity).toEqual("warning");
    expect(problemC.severity).toEqual("error");
  });
});
