import * as React from "react";
import {shallow} from "enzyme";
import {Header} from "../../src/components/Header"

describe("Tests for Header component", () => {
  let setup = () => {
    return shallow(<Header/>)
  }
  it("Header renders correctly", () => {
    let wrapper = setup()
  })
})
