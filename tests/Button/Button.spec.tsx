/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import {shallow} from "enzyme";
import {Button} from "../../src/components/shared/Button";

describe("Tests for button component", () => {
  const setup = (value: any) => {
    const props = {
      isDisabled: value,
      // tslint:disable-next-line:no-empty
      onClick: () => {},
      icon: <button/>,
      label: "",
      title: ""
    };
    return shallow(<Button {...props}/>);
  };
  it("Button renders correctly", () => {
    setup(false);
  });
});
