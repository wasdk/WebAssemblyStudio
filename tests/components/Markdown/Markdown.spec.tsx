/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import { shallow } from "enzyme";

jest.mock("../../../src/service.ts", () => ({
  Service: {
    compileMarkdownToHtml: jest.fn().mockImplementation((src) => {
      return Promise.resolve(`<span>${src}</span>`);
    })
  }
}));

declare var monaco: {
  editor
};

import { Markdown, MarkdownView } from "../../../src/components/Markdown";
import { Service } from "../../../src/service";
import { File, FileType } from "../../../src/models";
import { View } from "../../../src/components/editor";
import { ViewType } from "../../../src/components/editor/View";

describe("Tests for Markdown", () =>  {
  describe("Markdown", () => {
    it("should have the correct initial state", () => {
      const wrapper = shallow(<Markdown src="" />);
      expect(wrapper).toHaveState({ html: "Loading ..." });
    });
    it("should compile the provided Markdown to HTML on componentDidMount", async () => {
      const wrapper = await shallow(<Markdown src="test" />);
      wrapper.update();
      expect(wrapper).toHaveClassName("md");
      expect(wrapper).toHaveStyle({padding: "8px", height: "100%", overflow: "scroll"});
      expect(wrapper).toHaveProp("dangerouslySetInnerHTML", {__html: "<span>test</span>"});
    });
    it("should compile the provided Markdown to HTML on componentWillReceiveProps", async () => {
      const wrapper = await shallow(<Markdown src="test" />);
      await wrapper.setProps({ src: "newSrc" });
      wrapper.update();
      expect(wrapper).toHaveProp("dangerouslySetInnerHTML", {__html: "<span>newSrc</span>"});
    });
    it("should do nothing on componentWillReceiveProps if the src prop hasn't changed", async () => {
      const wrapper = await shallow(<Markdown src="test" />);
      (Service.compileMarkdownToHtml as any).mockClear();
      await wrapper.setProps({ src: "test" });
      wrapper.update();
      expect(Service.compileMarkdownToHtml).not.toHaveBeenCalled();
    });
  });
  describe("MarkdownView", () => {
    const setup = (customFile?: File) => {
      const file = customFile || new File("README.md", FileType.Markdown);
      const view = new View(file, ViewType.Markdown);
      const wrapper = shallow(<MarkdownView view={view} />);
      return { file, view, wrapper };
    };
    it("should have the correct initial state", () => {
      const getValue = jest.spyOn(monaco.editor, "getValue");
      getValue.mockImplementation(() => "markdown");
      const { wrapper } = setup();
      expect(wrapper).toHaveState({ markdown: "markdown" });
      getValue.mockRestore();
    });
    it("should register a callback for onDidChangeBuffer on mount", () => {
      const file = new File("README.md", FileType.Markdown);
      const register = jest.spyOn(file.onDidChangeBuffer, "register");
      const { wrapper } = setup(file);
      expect(register).toHaveBeenCalled();
      register.mockRestore();
    });
    it("should unregister the callback for onDidChangeBuffer on unmount", () => {
      const file = new File("README.md", FileType.Markdown);
      const unregister = jest.spyOn(file.onDidChangeBuffer, "unregister");
      const { wrapper } = setup(file);
      wrapper.unmount();
      expect(unregister).toHaveBeenCalled();
      unregister.mockRestore();
    });
    it("should update on onDidChangeBuffer", () => {
      const { wrapper, file } = setup();
      const getValue = jest.spyOn(monaco.editor, "getValue");
      getValue.mockImplementation(() => "markdown");
      file.onDidChangeBuffer.dispatch();
      expect(wrapper).toHaveState({ markdown: "markdown" });
      getValue.mockRestore();
    });
    it("should update the callbacks on new props (containing a new view)", () => {
      const file = new File("README.md", FileType.Markdown);
      const newFile = new File("NEW.md", FileType.Markdown);
      const unregister = jest.spyOn(file.onDidChangeBuffer, "unregister");
      const register = jest.spyOn(newFile.onDidChangeBuffer, "register");
      const { wrapper } = setup(file);
      wrapper.setProps({ view: new View(newFile, ViewType.Markdown) });
      expect(unregister).toHaveBeenCalled();
      expect(register).toHaveBeenCalled();
      unregister.mockRestore();
      register.mockRestore();
    });
    it("should do nothing on new props if the view hasn't changed", () => {
      const file = new File("README.md", FileType.Markdown);
      const newFile = new File("NEW.md", FileType.Markdown);
      const unregister = jest.spyOn(file.onDidChangeBuffer, "unregister");
      const register = jest.spyOn(newFile.onDidChangeBuffer, "register");
      const { wrapper, view } = setup(file);
      wrapper.setProps({ view });
      expect(unregister).not.toHaveBeenCalled();
      expect(register).not.toHaveBeenCalled();
      unregister.mockRestore();
      register.mockRestore();
    });
  });
});
