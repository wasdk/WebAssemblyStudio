/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import * as ReactModal from "react-modal";
import { shallow } from "enzyme";
import { UploadFileDialog } from "../../../src/components/UploadFileDialog";
import { Directory, ModelRef, FileType } from "../../../src/models";
import { Button } from "../../../src/components/shared/Button";
import { UploadInput } from "../../../src/components/Widgets";
import { DirectoryTree } from "../../../src/components/DirectoryTree";
import * as utils from "../../../src/util";
import { GoX, GoFile, GoFileDirectory, GoCloudUpload } from "../../../src/components/shared/Icons";
import { EditFileDialog } from "../../../src/components/EditFileDialog";

enum ButtonIndex {
  Cancel,
  Files,
  Directory,
  Upload,
  UploadRootContents
}

describe("Tests for UploadFileDialog", () => {
  const setup = ({
    isOpen = true,
    directory = ModelRef.getRef(new Directory("test-directory")),
    // tslint:disable-next-line
    onUpload = () => {},
    // tslint:disable-next-line
    onCancel = () => {}
  } = {}) => {
    const wrapper = shallow(
      <UploadFileDialog
        isOpen={isOpen}
        directory={directory}
        onUpload={onUpload}
        onCancel={onCancel}
      />
    );
    return {
      wrapper,
      addFiles() {
        const instance = wrapper.instance() as UploadFileDialog;
        const fileA = instance.root.getModel().newFile("fileA", FileType.JavaScript);
        const fileB = instance.root.getModel().newFile("fileB", FileType.JavaScript);
        wrapper.update();
        return [fileA, fileB];
      },
      addDirectory(name) {
        const instance = wrapper.instance() as UploadFileDialog;
        const directory = instance.root.getModel().newDirectory(name);
        const fileA = directory.newFile("fileA", FileType.JavaScript);
        const fileB = directory.newFile("fileB", FileType.JavaScript);
        wrapper.update();
        return { root: instance.root, directory, fileA, fileB };
      }
    };
  };
  it("should render correctly", () => {
    const { wrapper } = setup();
    const modal = wrapper.find(ReactModal);
    const titleBar = wrapper.find(".modal-title-bar");
    const buttons = wrapper.find(Button);
    expect(modal).toHaveProp("isOpen", true);
    expect(modal).toHaveProp("contentLabel", "Upload");
    expect(modal).toHaveProp("className", "modal show-file-icons");
    expect(modal).toHaveProp("overlayClassName", "overlay");
    expect(modal).toHaveProp("ariaHideApp", false);
    expect(buttons.at(ButtonIndex.Cancel)).toHaveProp("icon", <GoX />);
    expect(buttons.at(ButtonIndex.Cancel)).toHaveProp("label", "Cancel");
    expect(buttons.at(ButtonIndex.Cancel)).toHaveProp("title", "Cancel");
    expect(buttons.at(ButtonIndex.Files)).toHaveProp("icon", <GoFile />);
    expect(buttons.at(ButtonIndex.Files)).toHaveProp("label", "Files");
    expect(buttons.at(ButtonIndex.Files)).toHaveProp("title", "Select Files");
    expect(buttons.at(ButtonIndex.Directory)).toHaveProp("icon", <GoFileDirectory />);
    expect(buttons.at(ButtonIndex.Directory)).toHaveProp("label", "Directory");
    expect(buttons.at(ButtonIndex.Directory)).toHaveProp("title", "Select Directory");
    expect(buttons.at(ButtonIndex.Upload)).toHaveProp("icon", <GoCloudUpload/>);
    expect(buttons.at(ButtonIndex.Upload)).toHaveProp("label", "Upload");
    expect(buttons.at(ButtonIndex.Upload)).toHaveProp("title", "Upload");
    expect(buttons.at(ButtonIndex.Upload)).toHaveProp("isDisabled", true);
    expect(buttons.at(ButtonIndex.UploadRootContents)).toBeEmptyRender();
    expect(titleBar).toHaveText(`Upload Files & Directories to test-directory`);
    expect(titleBar.parent()).toHaveStyle({ display: "flex", flexDirection: "column", height: "100%" });
  });
  it("should open a file picker when clicking the files button", () => {
    const { wrapper } = setup();
    const open = jest.fn();
    (wrapper.instance() as UploadFileDialog).uploadInput = { open } as any;
    wrapper.find(Button).at(ButtonIndex.Files).simulate("click");
    expect(open).toHaveBeenCalledWith("files");
  });
  it("should open a file picker when clicking the directory button", () => {
    const { wrapper } = setup();
    const open = jest.fn();
    (wrapper.instance() as UploadFileDialog).uploadInput = { open } as any;
    wrapper.find(Button).at(ButtonIndex.Directory).simulate("click");
    expect(open).toHaveBeenCalledWith("directory");
  });
  it("should invoke onCancel when clicking the cancel button", () => {
    const onCancel = jest.fn();
    const { wrapper } = setup({ onCancel });
    wrapper.find(Button).at(ButtonIndex.Cancel).simulate("click");
    expect(onCancel).toHaveBeenCalled();
  });
  it("should activate the upload button when files have been added", () => {
    const { wrapper, addFiles } = setup();
    addFiles();
    expect(wrapper.find(Button).at(ButtonIndex.Upload)).toHaveProp("isDisabled", false);
  });
  it("should invoke onUpload when clicking the upload button", () => {
    const onUpload = jest.fn();
    const { wrapper, addFiles } = setup({ onUpload });
    const uploadedFiles = addFiles();
    wrapper.find(Button).at(ButtonIndex.Upload).simulate("click");
    expect(onUpload).toHaveBeenCalledWith(uploadedFiles);
  });
  it("should render an additional upload button if a folder has been added", () => {
    const { wrapper, addDirectory } = setup();
    const directoryName = "src";
    addDirectory(directoryName);
    const uploadRootButton = wrapper.find(Button).at(ButtonIndex.UploadRootContents);
    expect(uploadRootButton).toExist();
    expect(uploadRootButton).toHaveProp("label", "Upload Root Contents");
    expect(uploadRootButton).toHaveProp("title", `Upload contents of ${directoryName}`);
    expect(uploadRootButton).toHaveProp("icon", <GoCloudUpload/>);
  });
  it("should invoke onUpload when clicking the additional upload button", () => {
    const onUpload = jest.fn();
    const { wrapper, addDirectory } = setup({ onUpload });
    const { directory } = addDirectory("src");
    wrapper.find(Button).at(ButtonIndex.UploadRootContents).simulate("click");
    expect(onUpload).toHaveBeenCalledWith(directory.children.slice(0));
  });
  it("should render the added files/folders as a DirectoryTree", () => {
    const { wrapper, addDirectory } = setup();
    const { root } = addDirectory("src");
    const directoryTree = wrapper.find(DirectoryTree);
    expect(directoryTree).toHaveProp("directory", root);
    expect(directoryTree).toHaveProp("onlyUploadActions", true);
    expect(directoryTree.parent()).toHaveStyle({ height: "290px" });
  });
  it("should be possible to delete files from the DirectoryTree", () => {
    const { wrapper, addDirectory } = setup();
    const { directory, fileA } = addDirectory("src");
    const onDeleteFile = wrapper.find(DirectoryTree).prop("onDeleteFile");
    onDeleteFile(fileA);
    expect(directory.getFile("fileA")).toBeFalsy();
  });
  it("should be possible to rename files in the DirectoryTree", () => {
    const { wrapper, addDirectory } = setup();
    const { fileA } = addDirectory("src");
    const onEditFile = wrapper.find(DirectoryTree).prop("onEditFile");
    onEditFile(fileA);
    wrapper.update();
    const editFileDialog = wrapper.find(EditFileDialog);
    const onChange = editFileDialog.prop("onChange");
    expect(editFileDialog).toExist();
    expect(editFileDialog).toHaveProp("isOpen", true);
    expect(editFileDialog.prop("file").getModel()).toEqual(fileA);
    onChange("newName", "newDescription");
    wrapper.update();
    expect(fileA.name).toEqual("newName");
    expect(fileA.description).toEqual("newDescription");
    expect(wrapper).toHaveState({ hasFilesToUpload: true, editFileDialogFile: null });
  });
  it("should be possible to cancel an ongoing rename", () => {
    const { wrapper, addDirectory } = setup();
    const { fileA } = addDirectory("src");
    const onEditFile = wrapper.find(DirectoryTree).prop("onEditFile");
    onEditFile(fileA);
    wrapper.update();
    const onCancel = wrapper.find(EditFileDialog).prop("onCancel");
    onCancel();
    wrapper.update();
    expect(wrapper).toHaveState({ hasFilesToUpload: true, editFileDialogFile: null });
  });
  it("should upload files to the root directory when the UploadInput changes", () => {
    const uploadFilesToDirectory = jest.spyOn(utils, "uploadFilesToDirectory");
    const { wrapper, addDirectory } = setup();
    const { root } = addDirectory("src");
    const files = [];
    wrapper.find(UploadInput).simulate("change", { target: { files }});
    expect(uploadFilesToDirectory).toHaveBeenCalledWith(files, root.getModel());
  });
});
