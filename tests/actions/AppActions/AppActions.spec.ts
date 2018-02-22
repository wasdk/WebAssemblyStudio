/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import * as React from "react";

import appStore from "../../../src/stores/AppStore";
import dispatcher from "../../../src/dispatcher";
import {AppActionType, logLn} from "../../../src/actions/AppActions";

describe("AppActions component", () => {
  describe("logLn action", () => {
    beforeEach(() => {
      dispatcher.dispatch({type:AppActionType.INIT_STORE});
    });
    it("output initially is empty", () => {
      const output = appStore.getOutput().getModel();
      expect(output.buffer.toString()).toBe("");
    });
    it("output changes on logLn action", () => {
      logLn("test", "info");
      const output = appStore.getOutput().getModel();
      expect(output.buffer.toString()).toBe("[info]: test\n");
    });
    it("output notifies about change on logLn action", () => {
      let notified = false;
      const handler = () => notified = true;
      appStore.onOutputChanged.register(handler);
      logLn("test", "info");
      appStore.onOutputChanged.unregister(handler);
      expect(notified).toBeTruthy();
    });
  });
});
