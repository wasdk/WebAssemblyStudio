/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import * as ReactModal from "react-modal";
import { mount } from "enzyme";

jest.mock("../../../src/utils/Logger", () => ({
  Logger: {
    captureException: jest.fn(),
    getLastEventId: jest.fn().mockImplementation(() => "TEST")
  }
}));

import { ErrorBoundary } from "../../../src/components/ErrorBoundary";
import { Button } from "../../../src/components/shared/Button";
import { Logger } from "../../../src/utils/Logger";

class Child extends React.Component<{
  throw?: boolean;
}, {}> {
  constructor(props: any) {
    super(props);
  }
  render() {
    if (this.props.throw) {
      throw new Error("Thrown from child");
    }
    return <span>Rendered from child</span>;
  }
}

describe("Tests for ErrorBoundary", () => {
  beforeAll(() => {
    // tslint:disable-next-line
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.unmock("../../../src/utils/Logger");
  });
  const setup = (props?) => {
    return mount(
      <ErrorBoundary>
        <Child {...props}/>
      </ErrorBoundary>
    );
  };
  it("should render children", () => {
    const wrapper = setup();
    expect(wrapper).toHaveText("Rendered from child");
    wrapper.unmount();
  });
  it("should catch errors thrown from child components", () => {
    const wrapper = setup({ throw: true });
    expect(wrapper.state().error.message).toEqual("Thrown from child");
    wrapper.unmount();
  });
  it("should render a fallback UI", () =>  {
    const reloadButtonIndex = 0;
    const issueButtonIndex = 1;
    const wrapper = setup({ throw: true });
    const expectedUrl = "https://github.com/wasdk/WebAssemblyStudio/issues/new?body=Error%20ID:%20TEST";
    expect(wrapper.find(ReactModal)).toExist();
    expect(wrapper.find(ReactModal)).toHaveProp("contentLabel", "An error occured");
    expect(wrapper.find(ReactModal)).toHaveProp("isOpen", true);
    expect(wrapper.find(".modal-title-bar")).toHaveText("An error occured");
    expect(wrapper.find(".error-dialog-stacktrace-title")).toHaveText("Error: Thrown from child");
    expect(wrapper.find(".error-dialog-stacktrace-line").length).toEqual(4);
    expect(wrapper.find(".error-dialog-error-id")).toHaveText("Error ID: TEST");
    expect(wrapper.find(Button).at(reloadButtonIndex)).toHaveProp("label", "Reload");
    expect(wrapper.find(Button).at(reloadButtonIndex)).toHaveProp("title", "Reload");
    expect(wrapper.find(Button).at(reloadButtonIndex)).toHaveProp("href", "https://webassembly.studio/");
    expect(wrapper.find(Button).at(issueButtonIndex)).toHaveProp("label", "Open Issue on Github");
    expect(wrapper.find(Button).at(issueButtonIndex)).toHaveProp("title", "Open Issue on Github");
    expect(wrapper.find(Button).at(issueButtonIndex)).toHaveProp("href", expectedUrl);
    expect(wrapper.find(Button).at(issueButtonIndex)).toHaveProp("target", "_blank");
    expect(wrapper.find(Button).at(issueButtonIndex)).toHaveProp("rel", "noopener noreferrer");
    wrapper.unmount();
  });
  it("should log catched errors", () => {
    (Logger.captureException as any).mockClear();
    const wrapper = setup({ throw: true });
    expect(Logger.captureException).toHaveBeenCalled();
    wrapper.unmount();
  });
});
