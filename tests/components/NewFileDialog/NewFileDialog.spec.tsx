/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { ModelRef, FileType } from "../../../src/models";
import appStore from "../../../src/stores/AppStore";
import { NewFileDialog } from "../../../src/components/NewFileDialog";
import { initStore } from "../../../src/actions/AppActions";
import { ListBox, TextInputBox } from "../../../src/components/Widgets";
import { Button } from "../../../src/components/shared/Button";

enum ButtonIndex {
  Cancel,
  Create
}

describe("Tests for NewFileDialog", () => {
  const setup = (props?) => {
    const project = appStore.getProject().getModel();
    const directory = project.newDirectory("directory");
    directory.newFile("fileB.c", FileType.C);
    return shallow(
      <NewFileDialog
        directory={ModelRef.getRef(directory)}
        isOpen={true}
        {...props}
      />
    );
  };
  beforeAll(() => {
    initStore();
  });
  it("should render correctly", () => {
    const wrapper = setup();
    expect(wrapper).toMatchSnapshot();
  });
  it("should update on file type input", () => {
    const wrapper = setup();
    const listBox = wrapper.find(ListBox);
    listBox.props().onSelect(FileType.Cpp);
    expect(wrapper).toHaveState("description", "Creates a file containing C++ source code.");
    listBox.props().onSelect(FileType.C);
    expect(wrapper).toHaveState("description", "Creates a file containing C source code.");
    listBox.props().onSelect(FileType.Cretonne);
    expect(wrapper).toHaveState("description", "Cretonne intermediate language (IL) source code.");
    listBox.props().onSelect(FileType.JavaScript);
    expect(wrapper).toHaveState("description", "Creates a JavaScript file.");
  });
  it("should update on name input", () => {
    const wrapper = setup();
    wrapper.find(TextInputBox).simulate("change", {
      target: { value: "newFileName.c" }
    });
    expect(wrapper).toHaveState("name", "newFileName.c");
  });
  it("should invoke onCancel when clicking the cancel button", () => {
    const onCancel = jest.fn();
    const wrapper = setup({ onCancel });
    wrapper.find(Button).at(ButtonIndex.Cancel).simulate("click");
    expect(onCancel).toHaveBeenCalled();
  });
  it("should invoke onCreate when clicking the create button", () => {
    const onCreate = jest.fn();
    const wrapper = setup({ onCreate });
    wrapper.find(Button).at(ButtonIndex.Create).simulate("click");
    expect(onCreate).toHaveBeenCalled();
  });
  it("should display an error and disable the create button on illegal characters in file name", () => {
    const wrapper = setup();
    wrapper.find(TextInputBox).simulate("change", {
      target: { value: "??.c" }
    });
    expect(wrapper.find(TextInputBox)).toHaveProp("error", "Illegal characters in file name.");
    expect(wrapper.find(Button).at(ButtonIndex.Create)).toHaveProp("isDisabled", true);
  });
  it("should display an error and disable the create button on missing file extension", () => {
    const wrapper = setup();
    wrapper.find(TextInputBox).simulate("change", {
      target: { value: "newFileName" }
    });
    expect(wrapper.find(TextInputBox)).toHaveProp("error", "C file extension is missing.");
    expect(wrapper.find(Button).at(ButtonIndex.Create)).toHaveProp("isDisabled", true);
  });
  it("should display an error and disable the create button on name collisions", () => {
    const wrapper = setup();
    wrapper.find(TextInputBox).simulate("change", {
      target: { value: "fileB.c" }
    });
    expect(wrapper.find(TextInputBox)).toHaveProp("error", "File 'fileB.c' already exists.");
    expect(wrapper.find(Button).at(ButtonIndex.Create)).toHaveProp("isDisabled", true);
  });
});
