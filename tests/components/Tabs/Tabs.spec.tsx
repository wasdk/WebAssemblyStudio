/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import {shallow, mount} from "enzyme";
import {Button} from "../../../src/components/shared/Button";

jest.mock("../../../src/util", () => {
  return {
    clamp: (x, min, max) => x + min + max
  };
});

import {Tabs, Tab} from "../../../src/components/editor/Tabs";

describe("Tests for Tabs.tsx/Tabs", () => {
  const setup = (props) => {
    return shallow(<Tabs {...props}>{...props.children}</Tabs>);
  };
  afterAll(() => {
    jest.unmock("../../../src/util");
  });
  it("should render correctly", () => {
    const tabA = <Tab label="tabA" key={1} />;
    const tabB = <Tab label="tabB" key={2} />;
    const button = <Button label="buttonA" />;
    const wrapper = setup({ children: [tabA, tabB], commands: button });
    expect(wrapper.find(".tabs-container")).toExist();
    expect(wrapper.find(".tabs-tab-container").find(Tab).at(0)).toHaveProp("label", "tabA");
    expect(wrapper.find(".tabs-tab-container").find(Tab).at(1)).toHaveProp("label", "tabB");
    expect(wrapper.find(".tabs-command-container").find(Button).at(0)).toHaveProp("label", "buttonA");
  });
  it("should invoke onDoubleClick when double clicking the tabs container", () => {
    const onDoubleClick = jest.fn();
    const wrapper = setup({ onDoubleClick });
    wrapper.find(".tabs-tab-container").simulate("doubleClick");
    expect(onDoubleClick).toHaveBeenCalled();
  });
  it("should react to scrollWheel events and update the container", () => {
    const wrapper = mount(<Tabs />);
    const preventDefault = jest.fn();
    const instance = wrapper.instance() as Tabs;
    wrapper.find(".tabs-tab-container").simulate("wheel", { preventDefault, deltaY: 10 });
    expect(preventDefault).toHaveBeenCalled();
    expect(wrapper.state().scrollLeft).toEqual(10);
    expect(instance.container.scrollLeft).toEqual(10);
    wrapper.unmount();
  });
});
