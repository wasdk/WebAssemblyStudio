/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import {shallow} from "enzyme";
import {StatusBar} from "../../../src/components/StatusBar";
import {initStore} from '../../../src/actions/AppActions';
import appStore from '../../../src/stores/AppStore';

describe("Tests for StatusBar", () => {
  const setup = () => {
    return shallow(<StatusBar/>);
  };
  beforeAll(() => {
    initStore();
  });
  it("should render empty string if project has no status", () => {
    const wrapper = setup();
    expect(wrapper.text()).toEqual("");
  });
  it("should not apply active className if project has no status", () => {
    const wrapper = setup();
    expect(wrapper.find(".active")).toHaveLength(0);
  });
  it("should update text and className on status change", () => {
    const project = appStore.getProject().getModel();
    const wrapper = setup();
    project.pushStatus("test");
    wrapper.update();
    expect(wrapper.text()).toEqual("test");
    expect(wrapper.find(".active")).toHaveLength(1);
  });
});
