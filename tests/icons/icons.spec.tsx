import * as React from "react";
import {shallow, mount} from "enzyme";
import {
  Icon,
  GoRepoForked,
  GoBeaker,
  GoGear,
  GoRocket,
  GoPencil,
  GoDelete,
  GoDesktopDownload,
  GoBook,
  GoFile,
  GoFileBinary,
  GoFileCode,
  GoKebabHorizontal,
  GoQuote,
  GoThreeBars,
  GoVerified,
  GoX
} from "../../src/components/Icons"

describe("Tests for Icon component", () => {
  let setup = () => {
    const props = {
      src: ""
    }
    return shallow(<Icon {...props}/>)
  }

  it("Icon renders correctly", () => {
    let wrapper = setup()
  })
  it("GoRepoForked renders correctly", () => {
    shallow(<GoRepoForked/>)
  })
  it("GoBeaker renders correctly", () => {
    shallow(<GoBeaker/>)
  })
  it("GoGear renders correctly", () => {
    shallow(<GoGear/>)
  })
  it("GoRocket renders correctly", () => {
    shallow(<GoRocket/>)
  })
  it("GoPencil renders correctly", () => {
    shallow(<GoPencil/>)
  })
  it("GoDelete renders correctly", () => {
    shallow(<GoDelete/>)
  })
  it("GoVerified renders correctly", () => {
    shallow(<GoVerified/>)
  })
  it("GoFile renders correctly", () => {
    shallow(<GoFile/>)
  })
  it("GoFileBinary renders correctly", () => {
    shallow(<GoFileBinary/>)
  })
  it("GoFileCode renders correctly", () => {
    shallow(<GoFileCode/>)
  })
  it("GoQuote renders correctly", () => {
    shallow(<GoQuote/>)
  })
  it("GoDesktopDownload renders correctly", () => {
    shallow(<GoDesktopDownload/>)
  })
  it("GoX renders correctly", () => {
    shallow(<GoX/>)
  })
  it("GoKebabHorizontal renders correctly", () => {
    shallow(<GoKebabHorizontal/>)
  })
  it("GoThreeBars renders correctly", () => {
    shallow(<GoThreeBars/>)
  })
  it("GoBook renders correctly", () => {
    shallow(<GoBook/>)
  })
})
