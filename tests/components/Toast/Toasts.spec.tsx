/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import {shallow, mount} from "enzyme";
import {ToastContainer, Toast} from "../../../src/components/Toasts";
import {Button} from "../../../src/components/shared/Button";
import {GoX} from "../../../src/components/shared/Icons";

describe("Tests for Toasts", () => {
  const setup = () => {
    return shallow(<ToastContainer/>);
  };
  const message: JSX.Element = <a href="https://webassembly.studio/">Label</a>;
  it("Default no toast rendered", () => {
    const wrapper = setup();
    expect(wrapper.find(Toast)).toHaveLength(0);
  });
  it("Render Toast with Dismiss Button", () => {
    const props = {
      message: <a href="https://webassembly.studio/">Label</a>,
      onDismiss: Function()
    };
    const toast = shallow(<Toast {...props}/>);
    const button: ReactWrapper = toast.find(Button).last();
    expect(button).toHaveProp("label", "Dismiss");
    expect(button).toHaveProp("title", "Dismiss");
    expect(button).toHaveProp("customClassName", "button-toast");
    expect(button).toHaveProp("icon", <GoX />);
    expect(button).toHaveProp("onClick", props.onDismiss);
  });
  it("Render ToastContainer Component with Toasts", () => {
    const wrapper = setup();
    for (let i = 1; i <= 2; i++) {
      wrapper.instance().showToast(message);
      expect(wrapper.state().toasts.length).toBe(i);
      wrapper.update();
      expect(wrapper.find(Toast)).toHaveLength(i);
      expect(wrapper.find(Toast).at(i - 1)).toHaveProp("message", message);
    }
  });
  it("Toast Dismiss", () => {
    const wrapper = mount(<ToastContainer/>);
    wrapper.instance().showToast(message);
    wrapper.update();
    wrapper.find(Toast).first().find(Button).last().simulate("click");
    expect(wrapper.state().toasts.length).toBe(0);
  });
});
