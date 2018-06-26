/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import { shallow } from "enzyme";
import { ShareDialog } from "../../../src/components/ShareDialog";
import { Button } from "../../../src/components/shared/Button";

describe("Tests for ShareDialog", () => {
  const setup = (props?) => {
    return shallow(<ShareDialog {...props} />);
  };
  it("should render correctly", () => {
    const wrapper = setup({ isOpen: true, fiddle: "fiddle" });
    expect(wrapper).toMatchSnapshot();
  });
  it("should invoke onCancel when clicking the cancel button", () => {
    const onCancel = jest.fn();
    const wrapper = setup({ onCancel });
    wrapper.find(Button).simulate("click");
    expect(onCancel).toHaveBeenCalled();
  });
});
