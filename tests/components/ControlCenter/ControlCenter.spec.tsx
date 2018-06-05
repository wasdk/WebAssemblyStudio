/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import {shallow} from "enzyme";
import {ControlCenter} from "../../../src/components/ControlCenter";
import dispatcher from "../../../src/dispatcher";
import {AppActionType} from "../../../src/actions/AppActions";

describe("Tests for ControlCenter component", () => {
  const setup = () => {
    return shallow(<ControlCenter/>);
  };
  beforeEach(() => {
    dispatcher.dispatch({type: AppActionType.INIT_STORE});
  });
  it("ControlCenter initially renders correctly", () => {
    const cc = setup();
    expect(cc.find("EditorView")).toExist();
    expect(cc.find("Problems")).not.toExist();
  });
  it("ControlCenter renders correctly after tabs clicking", () => {
    const cc = setup();
    cc.find("Tab").first().simulate("click");
    expect(cc.find("EditorView")).toExist();
    expect(cc.find("Problems")).not.toExist();
    cc.find("Tab").last().simulate("click");
    expect(cc.find("EditorView")).not.toExist();
    expect(cc.find("Problems")).toExist();
  });
});
