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

const createButtonIndex = 1;
const cancelButtonIndex = 0;

async function promiseWait(count) {
  return count > 0 && await Promise.resolve(count - 1).then(promiseWait);
}

describe("Tests for NewProjectDialog component", () => {
  const setup = (params: {
    onCreate?: (template: Template) => void;
    onCancel?: () => void;
  }) => {
    // tslint:disable-next-line
    const nop = () => {};
    return shallow(<NewProjectDialog
      isOpen={true}
      onCreate={params.onCreate || nop}
      onCancel={params.onCancel || nop}
    />);
  };
  it("NewProjectDialog renders correctly", () => {
    const dialog = setup({});
    expect(dialog.find("ListBox")).toExist();
    const buttons = dialog.find("Button");
    expect(buttons.length).toBe(2);
    expect(buttons.at(createButtonIndex)).toHaveProp("label", "Create");
    expect(buttons.at(createButtonIndex)).toHaveProp("title", "Create");
    expect(buttons.at(cancelButtonIndex)).toHaveProp("label", "Cancel");
    expect(buttons.at(cancelButtonIndex)).toHaveProp("title", "Cancel");
  });

  it("NewProjectDialog calls back onCreate", async () => {
    let chosenTemplate = null;
    const dialog = setup({
      onCreate(template) { chosenTemplate = template; },
    });

    {
      const createButton = dialog.find("Button").at(createButtonIndex);
      expect(createButton).toHaveProp("isDisabled", true);
    }

    await promiseWait(3); // wait on templates loading and md-to-html
    dialog.update();

    {
      const createButton = dialog.find("Button").at(createButtonIndex);
      expect(createButton).toHaveProp("isDisabled", false);
      createButton.simulate("click");
      expect(chosenTemplate).toBeTruthy();
    }
  });

  it("NewProjectDialog calls back onCancel", () => {
    let cancelCalled = false;
    const dialog = setup({
      onCancel() { cancelCalled = true; },
    });
    dialog.find("Button").at(cancelButtonIndex).simulate("click");
    expect(cancelCalled).toBeTruthy();
  });
});
