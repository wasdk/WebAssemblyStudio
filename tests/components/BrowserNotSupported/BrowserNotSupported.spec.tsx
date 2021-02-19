/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as ReactModal from "react-modal";
import * as React from "react";
import { shallow } from "enzyme";
import { BrowserNotSupported } from "../../../src/components/BrowserNotSupported";

describe("Tests for BrowserNotSupported", () => {
  it("should render correctly", () => {
    const wrapper = shallow(<BrowserNotSupported />);
    const modal = wrapper.find(ReactModal);
    expect(modal).toHaveProp("isOpen", true);
    expect(modal).toHaveProp("contentLabel", "Browser Not Supported");
    expect(modal).toHaveProp("className", "modal");
    expect(modal).toHaveProp("overlayClassName", "overlay");
    expect(modal).toHaveProp("ariaHideApp", false);
    expect(modal.childAt(0)).toHaveStyle({ display: "flex", flexDirection: "column", height: "100%" });
    expect(modal.find(".modal-title-bar")).toHaveText("Browser Version Not Supported");
    expect(modal.find(".browser-not-supported-description")).toHaveText("WebAssembly is not available in your browser. Please try using the latest version of Edge, Safari, Chrome or Firefox.");
  });
});
