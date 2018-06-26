/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import * as ReactModal from "react-modal";
import { shallow } from "enzyme";
import { EditFileDialog } from "../../../src/components/EditFileDialog";
import { File, FileType, Directory, ModelRef, fileTypeFromFileName } from "../../../src/models";
import { TextInputBox, Spacer } from "../../../src/components/Widgets";
import { Button } from "../../../src/components/shared/Button";
import { GoX, GoPencil } from "../../../src/components/shared/Icons";

enum TextInputIndex {
  Name,
  Description
}

enum ButtonIndex {
  Cancel,
  Edit
}

describe("Tests for EditFileDialog", () =>  {
  const setup = (fileA, props?) => {
    const parent = new Directory("parent");
    const fileB = new File("fileB.js", FileType.JavaScript);
    parent.addFile(fileA);
    parent.addFile(fileB);
    return shallow(<EditFileDialog file={ModelRef.getRef(fileA)} {...props} />);
  };
  it("should render correctly for files", () => {
    const file = new File("fileName.js", FileType.JavaScript);
    const wrapper = setup(file, { isOpen: true });
    const modal = wrapper.find(ReactModal);
    expect(modal).toHaveProp("isOpen", true);
    expect(modal).toHaveProp("contentLabel", "Edit File");
    expect(modal).toHaveProp("className", "modal");
    expect(modal).toHaveProp("overlayClassName", "overlay");
    expect(modal).toHaveProp("ariaHideApp", false);
    expect(modal.childAt(0)).toHaveStyle({ display: "flex", flexDirection: "column", height: "100%" });
    expect(modal.find(".modal-title-bar")).toHaveText("Edit File fileName.js");
    expect(modal.find(TextInputBox).at(TextInputIndex.Name)).toHaveProp("label", "Name:");
    expect(modal.find(TextInputBox).at(TextInputIndex.Name)).toHaveProp("error", "");
    expect(modal.find(TextInputBox).at(TextInputIndex.Name)).toHaveProp("value", "fileName.js");
    expect(modal.find(Spacer)).toHaveProp("height", 8);
    expect(modal.find(TextInputBox).at(TextInputIndex.Description)).toHaveProp("label", "Description:");
    expect(modal.find(TextInputBox).at(TextInputIndex.Description)).toHaveProp("value", undefined);
    expect(modal.find(Button).at(ButtonIndex.Cancel)).toHaveProp("label", "Cancel");
    expect(modal.find(Button).at(ButtonIndex.Cancel)).toHaveProp("title", "Cancel");
    expect(modal.find(Button).at(ButtonIndex.Cancel)).toHaveProp("icon", <GoX />);
    expect(modal.find(Button).at(ButtonIndex.Edit)).toHaveProp("label", "Edit");
    expect(modal.find(Button).at(ButtonIndex.Edit)).toHaveProp("title", "Edit");
    expect(modal.find(Button).at(ButtonIndex.Edit)).toHaveProp("icon", <GoPencil />);
    expect(modal.find(Button).at(ButtonIndex.Edit)).toHaveProp("isDisabled", false);
  });
  it("should render correctly for directories", () => {
    const directory = new Directory("directoryName");
    const wrapper = setup(directory, { isOpen: true });
    const modal = wrapper.find(ReactModal);
    expect(modal).toHaveProp("contentLabel", "Edit Directory");
    expect(modal.find(".modal-title-bar")).toHaveText("Edit Directory directoryName");
  });
  it("should update on input (name change)", () => {
    const file = new File("fileName.js", FileType.JavaScript);
    const wrapper = setup(file, { isOpen: true });
    wrapper.find(TextInputBox).at(TextInputIndex.Name).simulate("change", {
      target: { value: "newName.js" }
    });
    expect(wrapper).toHaveState("name", "newName.js");
  });
  it("should update on input (description change)", () => {
    const file = new File("fileName.js", FileType.JavaScript);
    const wrapper = setup(file, { isOpen: true });
    wrapper.find(TextInputBox).at(TextInputIndex.Description).simulate("change", {
      target: { value: "description" }
    });
    expect(wrapper).toHaveState("description", "description");
  });
  it("should display an error and disable the edit button on illegal characters in file name", () => {
    const file = new File("fileName.js", FileType.JavaScript);
    const wrapper = setup(file, { isOpen: true });
    wrapper.find(TextInputBox).at(TextInputIndex.Name).simulate("change", {
      target: { value: "??.js" }
    });
    const expectedErrorMsg = "Illegal characters in file name.";
    expect(wrapper.find(TextInputBox).at(TextInputIndex.Name)).toHaveProp("error", expectedErrorMsg);
    expect(wrapper.find(Button).at(ButtonIndex.Edit)).toHaveProp("isDisabled", true);
  });
  it("should display an error and disable the edit button on missing file extension", () => {
    const file = new File("fileName.js", FileType.JavaScript);
    const wrapper = setup(file, { isOpen: true });
    wrapper.find(TextInputBox).at(TextInputIndex.Name).simulate("change", {
      target: { value: "fileName" }
    });
    const expectedErrorMsg = "JavaScript file extension is missing.";
    expect(wrapper.find(TextInputBox).at(TextInputIndex.Name)).toHaveProp("error", expectedErrorMsg);
    expect(wrapper.find(Button).at(ButtonIndex.Edit)).toHaveProp("isDisabled", true);
  });
  it("should display an error and disable the edit button on name collisions", () => {
    const file = new File("fileName.js", FileType.JavaScript);
    const wrapper = setup(file, { isOpen: true });
    wrapper.find(TextInputBox).at(TextInputIndex.Name).simulate("change", {
      target: { value: "fileB.js" }
    });
    const expectedErrorMsg = "File 'fileB.js' already exists.";
    expect(wrapper.find(TextInputBox).at(TextInputIndex.Name)).toHaveProp("error", expectedErrorMsg);
    expect(wrapper.find(Button).at(ButtonIndex.Edit)).toHaveProp("isDisabled", true);
  });
  it("should invoke onCancel when clicking the cancel button", () => {
    const onCancel = jest.fn();
    const file = new File("fileName.js", FileType.JavaScript);
    const wrapper = setup(file, { isOpen: true, onCancel });
    wrapper.find(Button).at(ButtonIndex.Cancel).simulate("click");
    expect(onCancel).toHaveBeenCalled();
  });
  it("should invoke onChange when clicking the edit button", () => {
    const onChange = jest.fn();
    const file = new File("fileName.js", FileType.JavaScript);
    const wrapper = setup(file, { isOpen: true, onChange });
    wrapper.find(Button).at(ButtonIndex.Edit).simulate("click");
    expect(onChange).toHaveBeenCalled();
  });
});
