/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import {shallow, mount} from "enzyme";
import {ToastContainer, Toast } from "../../../src/components/Toasts";
import {Button} from "../../../src/components/shared/Button";

describe("Tests for Toasts", () => {
  describe("ToastContainer", () => {
    it("should render correctly", () => {
      const toasts = [
        { message: <a href="https://webassembly.studio/">ToastA</a>, kind: "info" },
        { message: <a href="https://webassembly.studio/">ToastB</a>, kind: "warning" },
        { message: <a href="https://webassembly.studio/">ToastC</a>, kind: "error" },
      ];
      const wrapper = shallow(<ToastContainer/>);
      toasts.forEach(toast => (wrapper.instance() as any).showToast(toast.message, toast.kind));
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });
    it("should render null if no toasts are provided", () => {
      const wrapper = shallow(<ToastContainer/>);
      expect(wrapper).toBeEmptyRender();
    });
    it("should be possible to dismiss a Toast", () => {
      const wrapper = mount(<ToastContainer/>);
      const message = <a href="https://webassembly.studio/">ToastA</a>;
      (wrapper.instance() as any).showToast(message);
      wrapper.update();
      wrapper.find(Toast).first().find(Button).last().simulate("click");
      expect(wrapper).toHaveState({ toasts: [] });
    });
  });
  describe("Toast", () => {
    it("should render correctly", () => {
      const message = <a href="https://webassembly.studio/">Label</a>;
      const onDismiss = jest.fn();
      const wrapper = shallow(<Toast message={message} onDismiss={onDismiss} />);
      expect(wrapper).toMatchSnapshot();
    });
    it("should render correctly when passing the kind prop", () => {
      const message = <a href="https://webassembly.studio/">Label</a>;
      const onDismiss = jest.fn();
      const wrapper = shallow(<Toast message={message} onDismiss={onDismiss} kind="error" />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
