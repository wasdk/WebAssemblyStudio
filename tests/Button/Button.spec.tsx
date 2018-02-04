import * as React from "react";
import { shallow } from "enzyme";
import  {Button} from "../../src/components/Button"

describe("Tests for button component",() =>{
    let setup = (value) => {
        const props ={
            isDisabled: value,
            onClick: () => {},
            icon: <button></button>,
            label : "",
            title : "",

        }
        return shallow(<Button {...props}/>)
    }
it("Button renders correctly", () => {
let wrapper = setup(false)
}
)
})
