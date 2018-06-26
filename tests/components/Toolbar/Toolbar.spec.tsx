/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { Toolbar } from "../../../src/components/Toolbar";

describe("Tests for Toolbar", () => {
  it("should render correctly", () => {
    const childA = <div className="childA" />;
    const childB = <div className="childB" />;
    const wrapper = shallow(
      <Toolbar>
        {childA}
        {childB}
      </Toolbar>
    );
    expect(wrapper).toHaveClassName("toolbar");
    expect(wrapper.childAt(0)).toContainReact(childA);
    expect(wrapper.childAt(1)).toContainReact(childB);
  });
});
