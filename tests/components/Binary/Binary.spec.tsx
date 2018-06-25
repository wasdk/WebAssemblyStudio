/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { File, FileType } from "../../../src/models";
import { View, ViewType } from "../../../src/components/editor/View";
import { BinaryView, colors } from "../../../src/components/Binary";

describe("Tests for Binary", () => {
  const setup = (customFile?: File) => {
    const file = customFile || new File("file", FileType.JavaScript);
    const view = new View(file, ViewType.Binary);
    const wrapper = shallow(<BinaryView view={view} />);
    return { file, view, wrapper };
  };
  describe("render", () => {
    it("should render correctly", () => {
      const file = new File("file", FileType.JavaScript);
      const buffer = new ArrayBuffer(8);
      const bufferView = new Int8Array(buffer);
      file.setData(buffer);
      const { wrapper } = setup(file);
      const rows = wrapper.find(".row");
      const address = wrapper.find(".address");
      const bytes = wrapper.find(".byte");
      expect(wrapper.find(".binary")).toExist();
      expect(rows).toHaveLength(1);
      expect(address).toHaveText("0x00000000");
      expect(bytes).toHaveLength(8);
      expect(bytes.at(0)).toHaveStyle({ color: "#ead780" });
      expect(wrapper.find("span").last()).toHaveText("........");
    });
    it("should use the correct colors", () => {
      expect(colors).toEqual([
        "#ead780", "#efb8f6", "#89ee39", "#bbc3fe", "#cbed3a",
        "#d0cdee", "#7aec58", "#f2bcd5", "#35ed72", "#cbd5e7",
        "#e2de49", "#79d8f6", "#f3c63e", "#66e9de", "#bee869",
        "#e6cdc7", "#71ec77", "#f3bea5", "#67eb8f", "#edca95",
        "#53efb6", "#ebe8c8", "#a0eb7f", "#b3e1e0", "#d3e484",
        "#8de6c0", "#bfee98", "#c0e0c5", "#88e99a", "#cee1a8",
        "#8be8ad", "#a6e0a3"
      ]);
    });
  });
  describe("onDidChangeData", () => {
    it("should register for onDidChangeData events on mount", () => {
      const file = new File("file", FileType.JavaScript);
      const register = jest.spyOn(file.onDidChangeData, "register");
      const { wrapper } = setup(file);
      expect(register).toHaveBeenCalled();
    });
    it("should unregister for onDidChangeData events on unmount", () => {
      const file = new File("file", FileType.JavaScript);
      const unregister = jest.spyOn(file.onDidChangeData, "unregister");
      const { wrapper } = setup(file);
      wrapper.unmount();
      expect(unregister).toHaveBeenCalled();
    });
    it("should update the state on onDidChangeData events", () => {
      const { wrapper, file } = setup();
      const data = new ArrayBuffer(8);
      file.setData(data);
      expect(wrapper).toHaveState({ data });
    });
    it("should update the callbacks on new props", () => {
      const { wrapper, file } = setup();
      const newFile = new File("newFile", FileType.JavaScript);
      const newView = new View(newFile, ViewType.Binary);
      const unregister = jest.spyOn(file.onDidChangeData, "unregister");
      const register = jest.spyOn(newFile.onDidChangeData, "register");
      wrapper.setProps({ view: newView });
      expect(unregister).toHaveBeenCalled();
      expect(register).toHaveBeenCalled();
    });
    it("should not update the callbacks on new props (if the view hasn't changed)", () => {
      const { wrapper, view, file } = setup();
      const unregister = jest.spyOn(file.onDidChangeData, "unregister");
      wrapper.setProps({ view });
      expect(unregister).not.toHaveBeenCalled();
    });
  });
});
