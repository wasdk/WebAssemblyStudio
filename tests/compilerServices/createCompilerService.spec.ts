/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { createCompilerService, Language } from "../../src/compilerServices";
import { RustService } from "../../src/compilerServices/rustService";
import { ClangService } from "../../src/compilerServices/clangService";
import { X86Service } from "../../src/compilerServices/x86Service";

describe("Tests for createCompilerService", () => {
  it("should be able to create a RustService (Rust -> Wasm)", async () => {
    const service = await createCompilerService(Language.Rust, Language.Wasm);
    expect(service).toBeInstanceOf(RustService);
  });
  it("should be able to create a ClangService (C -> Wasm)", async () => {
    const service = await createCompilerService(Language.C, Language.Wasm);
    expect(service).toBeInstanceOf(ClangService);
  });
  it("should be able to create a ClangService (C++ -> Wasm)", async () => {
    const service = await createCompilerService(Language.Cpp, Language.Wasm);
    expect(service).toBeInstanceOf(ClangService);
  });
  it("should be able to create a X86Service (Wasm -> x86)", async () => {
    const service = await createCompilerService(Language.Wasm, Language.x86);
    expect(service).toBeInstanceOf(X86Service);
  });
  it("should throw an error for non supported from/to languages", async () => {
    await expect(createCompilerService(Language.TypeScript, Language.JavaScript))
      .rejects
      .toThrow("createCompilerService: not supported typescript->javascript");
  });
});
