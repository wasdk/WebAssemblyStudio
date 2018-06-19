/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import {mount} from "enzyme";
import {Split, SplitOrientation} from "../../../src/components/Split";

describe("Tests for Split", () => {
  const setup = (props?, children?) => {
    return mount(
      <Split {...props}>
        <div className="div0" />
        <div className="div1" />
      </Split>
    );
  };
  it("should render correctly (horizontal)", () => {
    const wrapper = setup({ orientation: SplitOrientation.Horizontal });
    const split = wrapper.find(".split");
    expect(split).toHaveStyle({ flexDirection: "column" });
    expect(split.children().length).toEqual(3);
    expect(split.childAt(0)).toHaveClassName("split-pane");
    expect(split.childAt(0)).toHaveStyle({ flexBasis: "0px" });
    expect(split.childAt(0).childAt(0)).toHaveClassName("div0");
    expect(split.childAt(1)).toHaveProp("className", "resizer horizontal");
    expect(split.childAt(2)).toHaveClassName("split-pane");
    expect(split.childAt(2)).toHaveStyle({ flex: 1 });
    expect(split.childAt(2).childAt(0)).toHaveClassName("div1");
    wrapper.unmount();
  });
  it("should render correctly (vertical)", () => {
    const wrapper = setup({ orientation: SplitOrientation.Vertical });
    const split = wrapper.find(".split");
    expect(split).toHaveStyle({ flexDirection: "row" });
    expect(split.childAt(1)).toHaveProp("className", "resizer vertical");
    wrapper.unmount();
  });
  it("should add event listeners for mousemove and mouseup events on mount", () => {
    const addEventListenerSpy = jest.spyOn(document, "addEventListener");
    const wrapper = setup({ orientation: SplitOrientation.Horizontal });
    expect(addEventListenerSpy.mock.calls[0][0]).toEqual("mousemove");
    expect(addEventListenerSpy.mock.calls[1][0]).toEqual("mouseup");
    wrapper.unmount();
    addEventListenerSpy.mockRestore();
  });
  it("should remove event listeners on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");
    const wrapper = setup({ orientation: SplitOrientation.Horizontal });
    wrapper.unmount();
    expect(removeEventListenerSpy.mock.calls[0][0]).toEqual("mousemove");
    expect(removeEventListenerSpy.mock.calls[1][0]).toEqual("mouseup");
    removeEventListenerSpy.mockRestore();
  });
  it("should react to mousedown events on the resizer", () => {
    const onResizeBegin = jest.fn();
    Split.onResizeBegin.register(onResizeBegin);
    const wrapper = setup({ orientation: SplitOrientation.Horizontal });
    const instance = wrapper.instance() as Split;
    wrapper.find(".resizer").simulate("mousedown");
    expect(instance.index).toEqual(0);
    expect(onResizeBegin).toHaveBeenCalled();
    expect(window.document.documentElement.style.pointerEvents).toEqual("none");
    Split.onResizeBegin.unregister(onResizeBegin);
    wrapper.unmount();
  });
  it("should react to mouseup events if resizing", () => {
    const onChange = jest.fn();
    const onResizeEnd = jest.fn();
    Split.onResizeEnd.register(onResizeEnd);
    const wrapper = setup({ orientation: SplitOrientation.Horizontal, onChange });
    const instance = wrapper.instance() as Split;
    wrapper.find(".resizer").simulate("mousedown");
    document.dispatchEvent(new Event("mouseup"));
    expect(instance.index).toEqual(-1);
    expect(onResizeEnd).toHaveBeenCalled();
    expect(window.document.documentElement.style.pointerEvents).toEqual("auto");
    expect(onChange).toHaveBeenCalled();
    Split.onResizeEnd.unregister(onResizeEnd);
    wrapper.unmount();
  });
  it("should ignore mouseup events if not resizing", () => {
    const onChange = jest.fn();
    const onResizeEnd = jest.fn();
    Split.onResizeEnd.register(onResizeEnd);
    const wrapper = setup({ orientation: SplitOrientation.Horizontal, onChange });
    document.dispatchEvent(new Event("mouseup"));
    expect(onResizeEnd).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    wrapper.unmount();
  });
  it("should react to mousemove events if resizing", () => {
    const preventDefault = jest.fn();
    const wrapper = setup({ orientation: SplitOrientation.Horizontal });
    const event: any = new Event("mousemove");
    event.preventDefault = preventDefault;
    wrapper.find(".resizer").simulate("mousedown");
    document.dispatchEvent(event);
    expect(preventDefault).toHaveBeenCalled();
    wrapper.unmount();
  });
  it("should ignore mousemove events if not resizing", () => {
    const preventDefault = jest.fn();
    const wrapper = setup({ orientation: SplitOrientation.Horizontal });
    const event: any = new Event("mousemove");
    event.preventDefault = preventDefault;
    document.dispatchEvent(event);
    expect(preventDefault).not.toHaveBeenCalled();
    wrapper.unmount();
  });
  it("should abort any ongoing drag when receiving new props", () => {
    const onChange = jest.fn();
    const wrapper = setup({ orientation: SplitOrientation.Horizontal, onChange });
    const instance = wrapper.instance() as Split;
    wrapper.find(".resizer").simulate("mousedown");
    wrapper.setProps({});
    expect(instance.index).toEqual(-1);
    expect(window.document.documentElement.style.pointerEvents).toEqual("auto");
    expect(onChange).toHaveBeenCalled();
    wrapper.unmount();
  });
  /*
    TODO: Add tests to verify the actual solving after #184 is done
  */
});
