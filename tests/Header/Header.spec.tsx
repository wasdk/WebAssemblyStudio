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
