/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import { shallow, mount } from "enzyme";
import { Spacer, Divider, TextInputBox, UploadInput, ListItem, ListBox } from "../../../src/components/Widgets";

describe("Tests for Widgets", () => {
  describe("Spacer", () => {
    it("should render correctly", () => {
      const wrapper = shallow(<Spacer height={10} />);
      expect(wrapper).toHaveStyle({ height: 10 });
    });
  });
  describe("Divider", () => {
    it("should render correctly", () => {
      const wrapper = shallow(<Divider height={10} />);
      expect(wrapper).toHaveClassName("divider");
      expect(wrapper).toHaveStyle({ marginTop: 5, marginBottom: 5 });
    });
  });
  describe("TextInputBox", () => {
    it("should render correctly when passing a label prop", () => {
      const wrapper = shallow(<TextInputBox label="test" value="value" />);
      expect(wrapper).toHaveStyle({ display: "flex", flexDirection: "row" });
      expect(wrapper.find(".text-input-box-label")).toHaveText("test");
      expect(wrapper.find(".text-input-box")).toHaveProp("type", "text");
      expect(wrapper.find(".text-input-box")).toHaveProp("value", "value");
      expect(wrapper.find(".text-input-box").parent()).toHaveStyle({ flex: 1 });
    });
    it("should render correctly without a label", () => {
      const wrapper = shallow(<TextInputBox value="value" />);
      expect(wrapper).toHaveProp("value", "value");
      expect(wrapper.find(".text-input-box-label")).not.toExist();
    });
    it("should render render correctly if passing the error prop", () => {
      const wrapper = shallow(<TextInputBox label="test" value="value" error="error" />);
      expect(wrapper.find(".text-input-box-error")).toHaveText("error");
    });
    it("should invoke onChange when the input changes", () => {
      const onChange = jest.fn();
      const wrapper = shallow(<TextInputBox label="test" value="value" onChange={onChange} />);
      wrapper.find(".text-input-box").simulate("change");
      expect(onChange).toHaveBeenCalled();
    });
  });
  describe("UploadInput", () => {
    it("should render correctly", () => {
      const wrapper = shallow(<UploadInput />);
      expect(wrapper).toHaveProp("id", "file-upload-input");
      expect(wrapper).toHaveProp("multiple", true);
      expect(wrapper).toHaveProp("hidden", true);
    });
    it("should be able to open an upload dialog for files/directories", () => {
      const wrapper = mount(<UploadInput />);
      const inputElement = document.createElement("input");
      const click = jest.spyOn(inputElement, "click");
      (wrapper.instance() as UploadInput).inputElement = inputElement;
      (wrapper.instance() as UploadInput).open("directory");
      expect(inputElement.hasAttribute("directory")).toEqual(true);
      expect(inputElement.hasAttribute("webkitdirectory")).toEqual(true);
      expect(inputElement.hasAttribute("allowdirs")).toEqual(true);
      (wrapper.instance() as UploadInput).open("files");
      expect(inputElement.hasAttribute("directory")).toEqual(false);
      expect(inputElement.hasAttribute("webkitdirectory")).toEqual(false);
      expect(inputElement.hasAttribute("allowdirs")).toEqual(false);
      expect(click).toHaveBeenCalled();
      wrapper.unmount();
    });
    it("should invoke onChange when the input changes", () => {
      const onChange = jest.fn();
      const wrapper = mount(<UploadInput onChange={onChange} />);
      wrapper.find("#file-upload-input").simulate("change");
      expect(onChange).toHaveBeenCalled();
      wrapper.unmount();
    });
  });
  describe("ListItem", () => {
    it("should render correctly", () => {
      const wrapper = shallow(<ListItem label="test-label" value="test-value" />);
      expect(wrapper).toHaveClassName("list-item");
      expect(wrapper).not.toHaveClassName("selected");
      expect(wrapper.childAt(0)).toHaveClassName("monaco-icon-label");
      expect(wrapper.childAt(0)).toHaveClassName("file-icon");
      expect(wrapper.find(".label")).toHaveText("test-label");
    });
    it("should render correctly if passing the selected prop", () => {
      const wrapper = shallow(<ListItem label="test-label" value="test-value" selected={true} />);
      expect(wrapper).toHaveClassName("list-item");
      expect(wrapper).toHaveClassName("selected");
    });
    it("should render correctly if passing the icon prop", () => {
      const wrapper = shallow(<ListItem label="test-label" value="test-value" icon="custom-icon-class" />);
      expect(wrapper.childAt(0)).toHaveClassName("custom-icon-class");
    });
    it("should render correctly if passing the error prop", () => {
      const wrapper = shallow(<ListItem label="test-label" value="test-value" error="error-msg" />);
      expect(wrapper.childAt(1)).toHaveClassName("list-item-flex");
      expect(wrapper.childAt(1).find(".label")).toHaveText("test-label");
      expect(wrapper.childAt(1).find(".error")).toHaveText("error-msg");
    });
    it("should invoke onClick when clicking the list item", () => {
      const onClick = jest.fn();
      const wrapper = shallow(<ListItem label="test-label" value="test-value" onClick={onClick} />);
      wrapper.simulate("click");
      expect(onClick).toHaveBeenCalled();
    });
  });
  describe("ListBox", () => {
    it("should render correctly", () => {
      const wrapper = shallow(<ListBox height={10} />);
      expect(wrapper).toHaveStyle({ height: 10 });
      expect(wrapper).toHaveClassName("list-box");
    });
    it("should handle selections", () => {
      const onSelect = jest.fn();
      const wrapper = shallow(
        <ListBox height={10} onSelect={onSelect} >
          <ListItem label="test-label" value="1" />
          <ListItem label="test-label" value="2" />
        </ListBox>
      );
      wrapper.childAt(0).simulate("click");
      expect(onSelect).toHaveBeenCalledWith("1");
      wrapper.childAt(1).simulate("click");
      expect(onSelect).toHaveBeenCalledWith("2");
    });
  });
});
