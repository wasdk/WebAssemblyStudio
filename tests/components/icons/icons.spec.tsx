/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import {shallow} from "enzyme";
import {
  Icon,
  GoRepoForked,
  GoBeaker,
  GoGear,
  GoBeakerGear,
  GoRocket,
  GoPencil,
  GoDelete,
  GoDesktopDownload,
  GoBook,
  GoFile,
  GoFileBinary,
  GoFileCode,
  GoKebabHorizontal,
  GoQuote,
  GoThreeBars,
  GoVerified,
  GoX,
  GoGist,
  GoCheck,
  GoOpenIssue,
  GoFileDirectory,
  GoQuestion,
  GoClippy,
  GoEye,
  GoCode,
  GoCloudUpload,
  GoSync
} from "../../../src/components/shared/Icons";

describe("Tests for Icon component", () => {
  const setup = (props?) => {
    return shallow(<Icon {...props}/>);
  };
  it("Icon renders correctly", () => {
    const wrapper = setup({ src: "test" });
    expect(wrapper.first()).toHaveStyle({
      width: 16,
      height: 16,
      backgroundImage: `url("test")`
    });
  });
  it("GoRepoForked renders correctly", () => {
    const wrapper = shallow(<GoRepoForked/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-repo-forked");
  });
  it("GoBeaker renders correctly", () => {
    const wrapper = shallow(<GoBeaker/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-beaker");
  });
  it("GoGear renders correctly", () => {
    const wrapper = shallow(<GoGear/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-gear");
  });
  it("GoBeakerGear renders correctly", () => {
    const wrapper = shallow(<GoBeakerGear/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-gear");
  });
  it("GoRocket renders correctly", () => {
    const wrapper = shallow(<GoRocket/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-rocket");
  });
  it("GoPencil renders correctly", () => {
    const wrapper = shallow(<GoPencil/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-pencil");
  });
  it("GoDelete renders correctly", () => {
    const wrapper = shallow(<GoDelete/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-x");
  });
  it("GoVerified renders correctly", () => {
    const wrapper = shallow(<GoVerified/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-verified");
  });
  it("GoFile renders correctly", () => {
    const wrapper = shallow(<GoFile/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-file");
  });
  it("GoFileBinary renders correctly", () => {
    const wrapper = shallow(<GoFileBinary/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-file-binary");
  });
  it("GoFileCode renders correctly", () => {
    const wrapper = shallow(<GoFileCode/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-file-code");
  });
  it("GoQuote renders correctly", () => {
    const wrapper = shallow(<GoQuote/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-quote");
  });
  it("GoDesktopDownload renders correctly", () => {
    const wrapper = shallow(<GoDesktopDownload/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-desktop-download");
  });
  it("GoX renders correctly", () => {
    const wrapper = shallow(<GoX/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-x");
  });
  it("GoKebabHorizontal renders correctly", () => {
    const wrapper = shallow(<GoKebabHorizontal/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-kebab-horizontal");
  });
  it("GoThreeBars renders correctly", () => {
    const wrapper = shallow(<GoThreeBars/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-three-bars");
  });
  it("GoBook renders correctly", () => {
    const wrapper = shallow(<GoBook/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-book");
  });
  it("GoGist renders correctly", () => {
    const wrapper = shallow(<GoGist/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-gist");
  });
  it("GoCheck renders correctly", () => {
    const wrapper = shallow(<GoCheck/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-check");
  });
  it("GoOpenIssue renders correctly", () => {
    const wrapper = shallow(<GoOpenIssue/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-issue-opened");
  });
  it("GoFileDirectory renders correctly", () => {
    const wrapper = shallow(<GoFileDirectory/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-file-directory");
  });
  it("GoQuestion renders correctly", () => {
    const wrapper = shallow(<GoQuestion/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-question");
  });
  it("GoClippy renders correctly", () => {
    const wrapper = shallow(<GoClippy/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-clippy");
  });
  it("GoEye renders correctly", () => {
    const wrapper = shallow(<GoEye/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-eye");
  });
  it("GoCode renders correctly", () => {
    const wrapper = shallow(<GoCode/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-code");
  });
  it("GoCloudUpload renders correctly", () => {
    const wrapper = shallow(<GoCloudUpload/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-cloud-upload");
  });
  it("GoSync renders correctly", () => {
    const wrapper = shallow(<GoSync/>);
    expect(wrapper.first()).toHaveClassName("octicon");
    expect(wrapper.first()).toHaveClassName("octicon-sync");
  });
});
