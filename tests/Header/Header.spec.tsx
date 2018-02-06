/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import {shallow} from "enzyme";
import {Header} from "../../src/components/Header";

describe("Tests for Header component", () => {
  const setup = () => {
    return shallow(<Header/>);
  };
  it("Header renders correctly", () => {
    setup();
  });
});
