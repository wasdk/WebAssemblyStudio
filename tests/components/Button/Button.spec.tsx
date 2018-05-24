/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import {shallow} from "enzyme";
import {Button} from "../../../src/components/shared/Button";
import {GoFile} from "../../../src/components/shared/Icons";

describe("Tests for button component", () => {
  const setup = (props?) => {
    return shallow(<Button {...props}/>);
  };
  it("should render correctly", () => {
    const wrapper = setup({
      icon: <GoFile />,
      label: "file",
      title: "file",
      customClassName: "file-button"
    });
    const button = wrapper.first();
    expect(button.hasClass("button")).toEqual(true);
    expect(button.hasClass("file-button")).toEqual(true);
    expect(button.hasClass("disabled")).toEqual(false);
    expect(button.prop("title")).toEqual("file");
    expect(button.find(GoFile).exists()).toEqual(true);
    expect(button.childAt(1).text()).toEqual(" ");
    expect(button.childAt(2).text()).toEqual("file");
  });
  it("should render as a link if passing the href prop", () => {
    const href = "https://github.com/wasdk/WebAssemblyStudio";
    const wrapper = setup({
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      icon: <GoFile />,
      label: "link"
    });
    const a = wrapper.first();
    expect(a.prop("href")).toEqual(href);
    expect(a.prop("target")).toEqual("_blank");
    expect(a.prop("rel")).toEqual("noopener noreferrer");
    expect(a.prop("className")).toEqual("button ");
    expect(a.find(GoFile).exists()).toEqual(true);
    expect(a.childAt(1).text()).toEqual(" ");
    expect(a.childAt(2).text()).toEqual("link");
  });
  it("should default target and rel properties to empty strings", () => {
    const wrapper = setup({ href: "https://github.com/wasdk/WebAssemblyStudio" });
    const a = wrapper.first();
    expect(a.prop("target")).toEqual("");
    expect(a.prop("rel")).toEqual("");
  });
  it("should disable the button if passing the isDisabled prop", () => {
    const onClick = jest.fn();
    const wrapper = setup({ onClick, isDisabled: true });
    const button = wrapper.first();
    button.simulate("click");
    expect(button.hasClass("disabled")).toEqual(true);
    expect(onClick).not.toHaveBeenCalled();
  });
  it("should disable the link if passing the isDisabled prop", () => {
    const onClick = jest.fn();
    const wrapper = setup({
      onClick,
      isDisabled: true,
      href: "https://github.com/wasdk/WebAssemblyStudio"
    });
    const button = wrapper.find("div");
    button.simulate("click");
    expect(button.hasClass("disabled")).toEqual(true);
    expect(onClick).not.toHaveBeenCalled();
  });
  it("should invoke onClick when clicking the button", () => {
    const onClick = jest.fn();
    const wrapper = setup({ onClick });
    wrapper.first().simulate("click");
    expect(onClick).toHaveBeenCalled();
  });
});
