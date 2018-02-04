import * as React from "react";
import { shallow ,mount} from "enzyme";
import  {
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
} 
from "../../src/components/Icons"

describe("Tests for Icon component",() =>{
    let setup = () => {
        const props = {
            src: ""
        }

        return shallow(<Icon {...props}/>)
    }
it("Icon renders correctly", () => {
let wrapper = setup()
}
)
it("renders correctly", () => {
    shallow(<GoRepoForked />)
})
it("renders correctly", () => {
    shallow(<GoBeaker />)
})
it("renders correctly", () => {
    shallow(<GoGear />)
})
it("renders correctly", () => {
    shallow(<GoRocket />)
})
it("renders correctly", () => {
    shallow(<GoPencil />)
})
it("renders correctly", () => {
    shallow(<GoDelete />)
})
it("renders correctly", () => {
    shallow(<GoVerified />)
})
it("renders correctly", () => {
    shallow(<GoFile />)
})
it("renders correctly", () => {
    shallow(<GoFileBinary />)
})
it("renders correctly", () => {
    shallow(<GoFileCode />)
})
it("renders correctly", () => {
    shallow(<GoQuote />)
})
it("renders correctly", () => {
    shallow(<GoDesktopDownload />)
})
it("renders correctly", () => {
    shallow(<GoX/>)
})
it("renders correctly", () => {
    shallow(<GoKebabHorizontal />)
})
it("renders correctly", () => {
    shallow(<GoThreeBars />)
})
it("renders correctly", () => {
    shallow(<GoBook />)
})
})
