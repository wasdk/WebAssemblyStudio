/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import {shallow} from "enzyme";
import {Button} from "../../../src/components/shared/Button";
import {TextInputBox} from "../../../src/components/Widgets";
import {Directory, ModelRef} from "../../../src/models";
import {NewDirectoryDialog} from "../../../src/components/NewDirectoryDialog";

const cancelButtonIndex = 0;
const createButtonIndex = 1;

function getDirectory() {
  const rootDirectory = new Directory("root");
  rootDirectory.newDirectory("src");
  return ModelRef.getRef(rootDirectory);
}

describe("Tests for NewDirectoryDialog", () => {
  const setup = (params: {
    onCreate?: (directory: Directory) => void,
    onCancel?: () => void
  }) => {
    // tslint:disable-next-line
    const nop = () => {};
    return shallow(
      <NewDirectoryDialog
        isOpen={true}
        directory={getDirectory()}
        onCancel={params.onCancel || nop}
        onCreate={params.onCreate || nop}
      />
    );
  };
  it("renders correctly", () => {
    const wrapper = setup({});
    expect(wrapper).toMatchSnapshot();
  });
  it("renders correctly on valid input", () => {
    const wrapper = setup({});
    wrapper.find(TextInputBox).simulate("change", { target: { value: "valid" }});
    expect(wrapper).toMatchSnapshot();
  });
  it("displays error & disables create button if name already exists", () => {
    const wrapper = setup({});
    const expectedErrorMessage = "Directory 'src' already exists.";
    wrapper.find(TextInputBox).simulate("change", { target: { value: "src" }});
    expect(wrapper.find(TextInputBox)).toHaveProp("error", expectedErrorMessage);
    expect(wrapper.find(Button).at(createButtonIndex)).toHaveProp("isDisabled", true);
  });
  it("displays error & disables create button if name is invalid", () => {
    const wrapper = setup({});
    const expectedErrorMessage = "Illegal characters in directory name.";
    wrapper.find(TextInputBox).simulate("change", { target: { value: "a+b" }});
    expect(wrapper.find(TextInputBox)).toHaveProp("error", expectedErrorMessage);
    expect(wrapper.find(Button).at(createButtonIndex)).toHaveProp("isDisabled", true);
  });
  it("displays error & disables create button if directory already exists", () => {
    const wrapper = setup({});
    const expectedErrorMessage = "Directory 'src' already exists.";
    wrapper.find(TextInputBox).simulate("change", { target: { value: "src" }});
    expect(wrapper.find(TextInputBox)).toHaveProp("error", expectedErrorMessage);
    expect(wrapper.find(Button).at(createButtonIndex)).toHaveProp("isDisabled", true);
  });
  it("invokes onCancel when clicking cancel button", () => {
    const onCancel = jest.fn();
    const wrapper = setup({ onCancel });
    wrapper.find(Button).at(cancelButtonIndex).simulate("click");
    expect(onCancel.mock.calls.length).toBe(1);
  });
  it("invokes onCreate with created directory when clicking create button", () => {
    const onCreate = jest.fn();
    const wrapper = setup({ onCreate });
    wrapper.find(TextInputBox).simulate("change", { target: { value: "test" }});
    wrapper.find(Button).at(createButtonIndex).simulate("click");
    expect(onCreate.mock.calls.length).toBe(1);
    expect(onCreate.mock.calls[0][0].name).toBe("test");
  });
});
