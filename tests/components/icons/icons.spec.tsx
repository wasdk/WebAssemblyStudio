/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

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
  GoCloudUpload
} from "../../../src/components/shared/Icons";

describe("Tests for Icon component", () => {
  const setup = (props?) => {
    return shallow(<Icon {...props}/>);
  };
  it("Icon renders correctly", () => {
    const wrapper = setup({ src: "test" });
    expect(wrapper.first().prop("style")).toEqual({
      width: 16,
      height: 16,
      backgroundImage: `url("test")`
    });
  });
  it("GoRepoForked renders correctly", () => {
    const wrapper = shallow(<GoRepoForked/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-repo-forked")).toEqual(true);
  });
  it("GoBeaker renders correctly", () => {
    const wrapper = shallow(<GoBeaker/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-beaker")).toEqual(true);
  });
  it("GoGear renders correctly", () => {
    const wrapper = shallow(<GoGear/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-gear")).toEqual(true);
  });
  it("GoBeakerGear renders correctly", () => {
    const wrapper = shallow(<GoBeakerGear/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-gear")).toEqual(true);
  });
  it("GoRocket renders correctly", () => {
    const wrapper = shallow(<GoRocket/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-rocket")).toEqual(true);
  });
  it("GoPencil renders correctly", () => {
    const wrapper = shallow(<GoPencil/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-pencil")).toEqual(true);
  });
  it("GoDelete renders correctly", () => {
    const wrapper = shallow(<GoDelete/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-x")).toEqual(true);
  });
  it("GoVerified renders correctly", () => {
    const wrapper = shallow(<GoVerified/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-verified")).toEqual(true);
  });
  it("GoFile renders correctly", () => {
    const wrapper = shallow(<GoFile/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-file")).toEqual(true);
  });
  it("GoFileBinary renders correctly", () => {
    const wrapper = shallow(<GoFileBinary/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-file-binary")).toEqual(true);
  });
  it("GoFileCode renders correctly", () => {
    const wrapper = shallow(<GoFileCode/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-file-code")).toEqual(true);
  });
  it("GoQuote renders correctly", () => {
    const wrapper = shallow(<GoQuote/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-quote")).toEqual(true);
  });
  it("GoDesktopDownload renders correctly", () => {
    const wrapper = shallow(<GoDesktopDownload/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-desktop-download")).toEqual(true);
  });
  it("GoX renders correctly", () => {
    const wrapper = shallow(<GoX/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-x")).toEqual(true);
  });
  it("GoKebabHorizontal renders correctly", () => {
    const wrapper = shallow(<GoKebabHorizontal/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-kebab-horizontal")).toEqual(true);
  });
  it("GoThreeBars renders correctly", () => {
    const wrapper = shallow(<GoThreeBars/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-three-bars")).toEqual(true);
  });
  it("GoBook renders correctly", () => {
    const wrapper = shallow(<GoBook/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-book")).toEqual(true);
  });
  it("GoGist renders correctly", () => {
    const wrapper = shallow(<GoGist/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-gist")).toEqual(true);
  });
  it("GoCheck renders correctly", () => {
    const wrapper = shallow(<GoCheck/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-check")).toEqual(true);
  });
  it("GoOpenIssue renders correctly", () => {
    const wrapper = shallow(<GoOpenIssue/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-issue-opened")).toEqual(true);
  });
  it("GoFileDirectory renders correctly", () => {
    const wrapper = shallow(<GoFileDirectory/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-file-directory")).toEqual(true);
  });
  it("GoQuestion renders correctly", () => {
    const wrapper = shallow(<GoQuestion/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-question")).toEqual(true);
  });
  it("GoClippy renders correctly", () => {
    const wrapper = shallow(<GoClippy/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-clippy")).toEqual(true);
  });
  it("GoEye renders correctly", () => {
    const wrapper = shallow(<GoEye/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-eye")).toEqual(true);
  });
  it("GoCode renders correctly", () => {
    const wrapper = shallow(<GoCode/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-code")).toEqual(true);
  });
  it("GoCloudUpload renders correctly", () => {
    const wrapper = shallow(<GoCloudUpload/>);
    expect(wrapper.first().hasClass("octicon")).toEqual(true);
    expect(wrapper.first().hasClass("octicon-cloud-upload")).toEqual(true);
  });
});
