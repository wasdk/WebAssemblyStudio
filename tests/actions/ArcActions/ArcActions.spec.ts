/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";
import { RunTaskExternals } from "../../../src/utils/taskRunner";

const pushStatus = jest.fn();
const popStatus = jest.fn();
const runTask = jest.fn();
const notifyAboutFork = jest.fn();

jest.mock("../../../src/actions/AppActions", () => ({ pushStatus, popStatus, runTask }));
jest.mock("../../../src/arc", () => ({ notifyAboutFork }));

import { publishArc, notifyArcAboutFork } from "../../../src/actions/ArcActions";

describe("ArcActions tests", () => {
  afterAll(() => {
    jest.unmock("../../../src/actions/AppActions");
    jest.unmock("../../../src/arc");
  });
  it("should publish arc project on action: publishArc", async () => {
    await publishArc();
    expect(pushStatus).toHaveBeenCalledWith("Previewing Arc Project");
    expect(runTask).toHaveBeenCalledWith("publish", false, RunTaskExternals.Arc);
    expect(popStatus).toHaveBeenCalled();
  });
  it("should notify arc about fork on action: notifyArcAboutFork", () => {
    const fiddle = "fiddle";
    notifyArcAboutFork(fiddle);
    expect(notifyAboutFork).toHaveBeenCalledWith(fiddle);
  });
});
