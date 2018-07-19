/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { ServiceWorker } from "../../src/service";
import { WorkerCommand } from "../../src/message";

/* tslint:disable:no-empty */

const postMessage = jest.fn();
const addEventListenerMock = jest.fn();

describe("Tests for ServiceWorker class", () => {
  beforeAll(() => {
    (global as any).Worker = jest.fn(() => {
      const listners = [];
      return {
        postMessage: postMessage.mockImplementation((message) => {
          listners.forEach((listener) => {
            const success = message.command === WorkerCommand.TwiggyWasm;
            const payload = success ? message.payload : { message: "error-message" };
            listener.callback({ data: { ...message, success, payload }});
          });
        }),
        addEventListener: addEventListenerMock.mockImplementation((event, callback) => {
          listners.push({ event, callback });
        })
      };
    });
  });
  describe("constructor", () => {
    it("should construct a new worker thread", () => {
      const worker = new ServiceWorker();
      expect((global as any).Worker).toHaveBeenCalledWith("dist/worker.bundle.js");
    });
    it("should add an event listener for message events from the worker thread", () => {
      addEventListenerMock.mockClear();
      const worker = new ServiceWorker();
      expect(addEventListenerMock.mock.calls[0][0]).toEqual("message");
    });
  });
  describe("postMessage", () => {
    it("should post a message to the worker thread", async () => {
      const worker = new ServiceWorker();
      await worker.postMessage(WorkerCommand.TwiggyWasm, "payload");
      expect(postMessage).toHaveBeenCalledWith({
        id: "0",
        command: WorkerCommand.TwiggyWasm,
        payload: "payload"
      }, undefined);
    });
    it("should handle responses from the worker thread", async () => {
      const worker = new ServiceWorker();
      const successResponse = worker.postMessage(WorkerCommand.TwiggyWasm, "payload");
      const errorResponse = worker.postMessage(WorkerCommand.OptimizeWasmWithBinaryen, "payload");
      await expect(successResponse).resolves.toEqual("payload");
      await expect(errorResponse).rejects.toEqual({ message: "error-message" });
      postMessage.mockReset();
    });
  });
  describe("optimizeWasmWithBinaryen", () => {
    it("should post a correct message to the worker thread", () => {
      const worker = new ServiceWorker();
      const postMessage = jest.spyOn(worker, "postMessage");
      postMessage.mockImplementation(() => {});
      const data = [] as any;
      worker.optimizeWasmWithBinaryen(data);
      expect(postMessage).toHaveBeenCalledWith(WorkerCommand.OptimizeWasmWithBinaryen, data);
      postMessage.mockRestore();
    });
  });
  describe("validateWasmWithBinaryen", () => {
    it("should post a correct message to the worker thread", () => {
      const worker = new ServiceWorker();
      const postMessage = jest.spyOn(worker, "postMessage");
      postMessage.mockImplementation(() => {});
      const data = [] as any;
      worker.validateWasmWithBinaryen(data);
      expect(postMessage).toHaveBeenCalledWith(WorkerCommand.ValidateWasmWithBinaryen, data);
      postMessage.mockRestore();
    });
  });
  describe("createWasmCallGraphWithBinaryen", () => {
    it("should post a correct message to the worker thread", () => {
      const worker = new ServiceWorker();
      const postMessage = jest.spyOn(worker, "postMessage");
      postMessage.mockImplementation(() => {});
      const data = [] as any;
      worker.createWasmCallGraphWithBinaryen(data);
      expect(postMessage).toHaveBeenCalledWith(WorkerCommand.CreateWasmCallGraphWithBinaryen, data);
      postMessage.mockRestore();
    });
  });
  describe("convertWasmToAsmWithBinaryen", () => {
    it("should post a correct message to the worker thread", () => {
      const worker = new ServiceWorker();
      const postMessage = jest.spyOn(worker, "postMessage");
      postMessage.mockImplementation(() => {});
      const data = [] as any;
      worker.convertWasmToAsmWithBinaryen(data);
      expect(postMessage).toHaveBeenCalledWith(WorkerCommand.ConvertWasmToAsmWithBinaryen, data);
      postMessage.mockRestore();
    });
  });
  describe("disassembleWasmWithBinaryen", () => {
    it("should post a correct message to the worker thread", () => {
      const worker = new ServiceWorker();
      const postMessage = jest.spyOn(worker, "postMessage");
      postMessage.mockImplementation(() => {});
      const data = [] as any;
      worker.disassembleWasmWithBinaryen(data);
      expect(postMessage).toHaveBeenCalledWith(WorkerCommand.DisassembleWasmWithBinaryen, data);
      postMessage.mockRestore();
    });
  });
  describe("assembleWatWithBinaryen", () => {
    it("should post a correct message to the worker thread", () => {
      const worker = new ServiceWorker();
      const postMessage = jest.spyOn(worker, "postMessage");
      postMessage.mockImplementation(() => {});
      const data = [] as any;
      worker.assembleWatWithBinaryen(data);
      expect(postMessage).toHaveBeenCalledWith(WorkerCommand.AssembleWatWithBinaryen, data);
      postMessage.mockRestore();
    });
  });
  describe("disassembleWasmWithWabt", () => {
    it("should post a correct message to the worker thread", () => {
      const worker = new ServiceWorker();
      const postMessage = jest.spyOn(worker, "postMessage");
      postMessage.mockImplementation(() => {});
      const data = [] as any;
      worker.disassembleWasmWithWabt(data);
      expect(postMessage).toHaveBeenCalledWith(WorkerCommand.DisassembleWasmWithWabt, data);
      postMessage.mockRestore();
    });
  });
  describe("assembleWatWithWabt", () => {
    it("should post a correct message to the worker thread", () => {
      const worker = new ServiceWorker();
      const postMessage = jest.spyOn(worker, "postMessage");
      postMessage.mockImplementation(() => {});
      const data = [] as any;
      worker.assembleWatWithWabt(data);
      expect(postMessage).toHaveBeenCalledWith(WorkerCommand.AssembleWatWithWabt, data);
      postMessage.mockRestore();
    });
  });
  describe("twiggyWasm", () => {
    it("should post a correct message to the worker thread", () => {
      const worker = new ServiceWorker();
      const postMessage = jest.spyOn(worker, "postMessage");
      postMessage.mockImplementation(() => {});
      const data = [] as any;
      worker.twiggyWasm(data);
      expect(postMessage).toHaveBeenCalledWith(WorkerCommand.TwiggyWasm, data);
      postMessage.mockRestore();
    });
  });
});
