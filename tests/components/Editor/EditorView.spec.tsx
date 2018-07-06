/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import {mount} from "enzyme";
import {EditorView} from "../../../src/components/editor/Editor";
import {View} from "../../../src/components/editor";
import {File, FileType} from "../../../src/models";

describe("Tests for Editor.tsx/EditorView", () => {
  const setup = (description?) => {
    const file = new File("test.js", FileType.JavaScript);
    const view = new View(file);
    if (description) {
      file.description = description;
    }
    return mount(<EditorView view={view} />);
  };
  beforeAll(() => {
    // tslint:disable-next-line
    jest.spyOn(console, "info").mockImplementation(() => {});
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  it("should render a status bar if the open file has a description", () => {
    const wrapper = setup("test");
    expect(wrapper.find(".status-bar-item")).toHaveText("test");
    expect(wrapper.find(".editor-container").length).toEqual(1);
    wrapper.unmount();
  });
  it("should NOT render a status bar if the open file does not have a description", () => {
    const wrapper = setup();
    expect(wrapper.find(".status-bar-item").length).toEqual(0);
    expect(wrapper.find(".editor-container").length).toEqual(0);
    wrapper.unmount();
  });
  it("should reveal the last line of the open file when calling revealLastLine", () => {
    const wrapper = setup();
    const instance = wrapper.instance() as EditorView;
    const getModelSpy = jest.spyOn(monaco.editor, "getModel");
    const getLineCountSpy = jest.spyOn(monaco.editor, "getLineCount");
    const revealLineSpy = jest.spyOn(monaco.editor, "revealLine");
    instance.revealLastLine();
    expect(getModelSpy).toHaveBeenCalled();
    expect(getLineCountSpy).toHaveBeenCalled();
    expect(revealLineSpy).toHaveBeenCalled();
    wrapper.unmount();
    getModelSpy.mockRestore();
    getLineCountSpy.mockRestore();
    revealLineSpy.mockRestore();
  });
});
