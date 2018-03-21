/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import {shallow} from "enzyme";
import {Button} from '../../../src/components/shared/Button';
import {TextInputBox} from '../../../src/components/Widgets';
import {Directory, ModelRef} from '../../../src/model';
import {NewDirectoryDialog} from '../../../src/components/NewDirectoryDialog';

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
    const textInputBox = wrapper.find(TextInputBox);
    const buttons = wrapper.find(Button);
    expect(textInputBox.exists()).toBe(true);
    expect(buttons.length).toBe(2);
    expect(buttons.at(cancelButtonIndex).prop("label")).toBe("Cancel");
    expect(buttons.at(cancelButtonIndex).prop("title")).toBe("Cancel");
    expect(buttons.at(createButtonIndex).prop("label")).toBe("Create");
    expect(buttons.at(createButtonIndex).prop("title")).toBe("Create New Directory");
    expect(buttons.at(createButtonIndex).prop("isDisabled")).toBe(true);
  });
  it("displays error & disables create button if name already exists", () => {
    const wrapper = setup({});
    const expectedErrorMessage = "Directory 'src' already exists.";
    wrapper.find(TextInputBox).simulate("change", { target: { value: "src" }});
    expect(wrapper.find(TextInputBox).prop("error")).toBe(expectedErrorMessage);
    expect(wrapper.find(Button).at(createButtonIndex).prop("isDisabled")).toBe(true);
  });
  it("displays error & disables create button if name is invalid", () => {
    const wrapper = setup({});
    const expectedErrorMessage = "Illegal characters in directory name.";
    wrapper.find(TextInputBox).simulate("change", { target: { value: "a+b" }});
    expect(wrapper.find(TextInputBox).prop("error")).toBe(expectedErrorMessage);
    expect(wrapper.find(Button).at(createButtonIndex).prop("isDisabled")).toBe(true);
  });
  it("invokes onCancel when clicking cancel button", () => {
    const onCancel = jest.fn();
    const wrapper = setup({ onCancel });
    wrapper.find(Button).at(cancelButtonIndex).simulate('click');
    expect(onCancel.mock.calls.length).toBe(1);
  });
  it("invokes onCreate with created directory when clicking create button", () => {
    const onCreate = jest.fn();
    const wrapper = setup({ onCreate });
    wrapper.find(TextInputBox).simulate("change", { target: { value: "test" }});
    wrapper.find(Button).at(createButtonIndex).simulate('click');
    expect(onCreate.mock.calls.length).toBe(1);
    expect(onCreate.mock.calls[0][0].name).toBe("test");
  });
});
