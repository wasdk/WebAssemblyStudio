/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import {shallow} from "enzyme";
import {Button} from "../../../src/components/shared/Button";

describe("Tests for button component", () => {
  const setup = (props?) => {
    return shallow(<Button {...props}/>);
  };
  it("Button renders correctly", () => {
    setup();
  });
  it("should render as a link if passing the href prop", () => {
    const href = "https://github.com/wasdk/WebAssemblyStudio"
    const wrapper = setup({ href, target: "_blank", rel: "noopener noreferrer" });
    const a = wrapper.find("a");
    expect(a.exists()).toEqual(true);
    expect(a.prop("href")).toEqual(href);
    expect(a.prop("target")).toEqual("_blank");
    expect(a.prop("rel")).toEqual("noopener noreferrer");
  });
});
