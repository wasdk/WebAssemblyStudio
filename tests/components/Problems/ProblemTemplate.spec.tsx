/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import { ProblemTemplate } from "../../../src/components/Problems";
import { File, FileType, Problem } from "../../../src/model";

declare var monaco: { MarkerSeverity };

describe("Tests for Problems.tsx/ProblemTemplate", () => {
  it("should be constructable", () => {
    const container = document.createElement("div");
    const template = new ProblemTemplate(container);
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
