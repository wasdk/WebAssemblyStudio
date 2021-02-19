/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import {shallow} from "enzyme";
import {Tab} from "../../../src/components/editor/Tabs";

describe("Tests for Tabs.tsx/Tab", () => {
  const setup = (props) => {
    return shallow(<Tab {...props}/>);
  };
  it("should render correctly", () => {
    const wrapper = setup({ label: "test", icon: "test" });
    expect(wrapper.find(".tab")).toExist();
    expect(wrapper.find(".monaco-icon-label")).toHaveClassName("test");
    expect(wrapper.find(".label")).toHaveText("test");
    expect(wrapper.find(".close")).toExist();
  });
  it("should apply active classname if passed isActive prop", () => {
    const wrapper = setup({ isActive: true });
    expect(wrapper.find(".active").length).toEqual(1);
  });
  it("should apply marked classname if passed isMarked prop", () => {
    const wrapper = setup({ isMarked: true });
    expect(wrapper.find(".marked").length).toEqual(1);
  });
  it("should apply italic classname if passed isItalic prop", () => {
    const wrapper = setup({ isItalic: true });
    expect(wrapper.find(".italic").length).toEqual(1);
  });
  it("should ONLY apply active/marked/italic classname on props", () => {
    const wrapper = setup({});
    expect(wrapper.find(".active")).not.toExist();
    expect(wrapper.find(".marked")).not.toExist();
    expect(wrapper.find(".italic")).not.toExist();
  });
  it("should invoke onClose with value prop when clicking the close icon", () => {
    const onClose = jest.fn();
    const stopPropagation = jest.fn();
    const value = "test";
    const wrapper = setup({ onClose, value });
    wrapper.find(".close").simulate("click", { stopPropagation });
    expect(onClose).toHaveBeenCalledWith(value);
    expect(stopPropagation).toHaveBeenCalled();
  });
  it("should invoke onClick with value prop when clicking the tab", () => {
    const onClick = jest.fn();
    const stopPropagation = jest.fn();
    const value = "test";
    const wrapper = setup({ onClick, value });
    wrapper.find(".tab").simulate("click", { stopPropagation });
    expect(onClick).toHaveBeenCalledWith(value);
    expect(stopPropagation).toHaveBeenCalled();
  });
  it("should invoke onDoubleClick with value prop when double clicking the tab", () => {
    const onDoubleClick = jest.fn();
    const stopPropagation = jest.fn();
    const value = "test";
    const wrapper = setup({ onDoubleClick, value });
    wrapper.find(".tab").simulate("doubleClick", { stopPropagation });
    expect(onDoubleClick).toHaveBeenCalledWith(value);
    expect(stopPropagation).toHaveBeenCalled();
  });
});
