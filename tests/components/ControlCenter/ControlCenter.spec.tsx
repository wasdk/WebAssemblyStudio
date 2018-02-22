/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import {shallow} from "enzyme";

import {ControlCenter} from "../../../src/components/ControlCenter";
import dispatcher from "../../../src/dispatcher";
import {AppActionType, logLn} from "../../../src/actions/AppActions";

describe("Tests for ControlCenter component", () => {
  const setup = () => {
    return shallow(<ControlCenter/>);
  };
  beforeEach(() => {
    dispatcher.dispatch({type: AppActionType.INIT_STORE});
  });
  it("ControlCenter initially renders correctly", () => {
    const cc = setup();
    expect(cc.find("EditorView").exists()).toBeTruthy();
    expect(cc.find("Problems").exists()).toBeFalsy();
  });
  it("ControlCenter renders correctly after tabs clicking", () => {
    const cc = setup();
    cc.find("Tab").first().simulate("click");
    expect(cc.find("EditorView").exists()).toBeTruthy();
    expect(cc.find("Problems").exists()).toBeFalsy();
    cc.find("Tab").last().simulate("click");
    expect(cc.find("EditorView").exists()).toBeFalsy();
    expect(cc.find("Problems").exists()).toBeTruthy();
  });
});
