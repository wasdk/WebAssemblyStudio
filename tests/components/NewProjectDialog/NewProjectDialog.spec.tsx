/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import "jest-enzyme";
import * as React from "react";
import { shallow } from "enzyme";

jest.mock("../../../src/utils/fetchTemplates", () => {
  return {
    default: async () =>
      JSON.parse(require("fs").readFileSync(__dirname + "/templates.json").toString()),
  };
});

jest.mock("../../../src/service", () => {
  return {
    Service: {
      compileMarkdownToHtml(md) { return `<pre>${md}</pre>`; },
    },
  };
});

jest.mock("../../../src/config", () => {
  return {
    default: async () => {
      return {
        serviceUrl: "",
        clang: "",
        rustc: "",
        templates: ""
      };
    },
  };
});

import { NewProjectDialog, Template } from "../../../src/components/NewProjectDialog";
import { ListBox } from "../../../src/components/Widgets";

const createButtonIndex = 1;
const cancelButtonIndex = 0;

async function promiseWait(count) {
  return count > 0 && await Promise.resolve(count - 1).then(promiseWait);
}

describe("Tests for NewProjectDialog component", () => {
  const setup = (params: {
    templatesName?: string;
    onCreate?: (template: Template) => void;
    onCancel?: () => void;
  }) => {
    // tslint:disable-next-line
    const nop = () => {};
    return shallow(<NewProjectDialog
      isOpen={true}
      templatesName={params.templatesName || ""}
      onCreate={params.onCreate || nop}
      onCancel={params.onCancel || nop}
    />);
  };
  it("should render correctly", async () => {
    const wrapper = setup({});
    expect(wrapper).toMatchSnapshot();
  });
  it("should handle template selection", async () => {
    const onCreate = jest.fn();
    const wrapper = setup({ onCreate });
    expect(wrapper).toHaveState({ template: null });
    await promiseWait(3); // wait on templates loading and md-to-html
    wrapper.update();
    expect((wrapper.state() as any).template.files[0].data).toEqual("# Empty C Project\n");
    wrapper.find(ListBox).prop("onSelect")({ description: "abc" });
    await promiseWait(3); // wait on templates loading and md-to-html
    wrapper.update();
    expect(wrapper).toHaveState({ description: "<pre>abc</pre>", template: { description: "abc" }});
  });
  it("should invoke onCreate when clicking the Create button", async () => {
    const onCreate = jest.fn();
    const wrapper = setup({ onCreate });
    await promiseWait(3); // wait on templates loading and md-to-html
    wrapper.update();
    const createButton = wrapper.find("Button").at(createButtonIndex);
    expect(createButton).toHaveProp("isDisabled", false);
    createButton.simulate("click");
    expect(onCreate).toHaveBeenCalled();
  });
  it("should invoke onCancel when clicking the Cancel button", () => {
    const onCancel = jest.fn();
    const wrapper = setup({ onCancel });
    wrapper.find("Button").at(cancelButtonIndex).simulate("click");
    expect(onCancel).toHaveBeenCalledWith();
  });
});
