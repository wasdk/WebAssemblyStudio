/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import registerLanguages from "../../src/utils/registerLanguages";
import { Wat } from "../../src/languages/wat";
import { Log } from "../../src/languages/log";
import { Cton } from "../../src/languages/cton";
import { X86 } from "../../src/languages/x86";
import { Rust } from "../../src/languages/rust";

declare var monaco: { languages };

function mockFetch() {
  (global as any).fetch = jest.fn().mockImplementation((arg) => {
    return { text: () => "fetched: " + arg };
  });
  return () => (global as any).fetch = undefined;
}

describe("Tests for registerLanguages", () => {
  it("should correctly register Wat", async () => {
    const restoreFetch = mockFetch();
    const register = jest.spyOn(monaco.languages, "register");
    const onLanguage = jest.spyOn(monaco.languages, "onLanguage");
    const setMonarchTokensProvider = jest.spyOn(monaco.languages, "setMonarchTokensProvider");
    const setLanguageConfiguration = jest.spyOn(monaco.languages, "setLanguageConfiguration");
    const registerCompletionItemProvider = jest.spyOn(monaco.languages, "registerCompletionItemProvider");
    const registerHoverProvider = jest.spyOn(monaco.languages, "registerHoverProvider");
    await registerLanguages();
    const onLanguageCallback = onLanguage.mock.calls.find(([language]) => language === "wat")[1];
    onLanguageCallback();
    expect(register).toHaveBeenCalledWith({ id: "wat" });
    expect(setMonarchTokensProvider).toHaveBeenCalledWith("wat", Wat.MonarchDefinitions);
    expect(setLanguageConfiguration).toHaveBeenCalledWith("wat", Wat.LanguageConfiguration);
    expect(registerCompletionItemProvider).toHaveBeenCalledWith("wat", Wat.CompletionItemProvider);
    expect(registerHoverProvider).toHaveBeenCalledWith("wat", Wat.HoverProvider);
    register.mockRestore();
    onLanguage.mockRestore();
    setMonarchTokensProvider.mockRestore();
    setLanguageConfiguration.mockRestore();
    registerCompletionItemProvider.mockRestore();
    registerHoverProvider.mockRestore();
    restoreFetch();
  });
  it("should correctly register Log", async () => {
    const restoreFetch = mockFetch();
    const register = jest.spyOn(monaco.languages, "register");
    const onLanguage = jest.spyOn(monaco.languages, "onLanguage");
    const setMonarchTokensProvider = jest.spyOn(monaco.languages, "setMonarchTokensProvider");
    await registerLanguages();
    const onLanguageCallback = onLanguage.mock.calls.find(([language]) => language === "log")[1];
    onLanguageCallback();
    expect(register).toHaveBeenCalledWith({ id: "log" });
    expect(setMonarchTokensProvider).toHaveBeenCalledWith("log", Log.MonarchTokensProvider);
    register.mockRestore();
    onLanguage.mockRestore();
    setMonarchTokensProvider.mockRestore();
    restoreFetch();
  });
  it("should correctly register Cretonne", async () => {
    const restoreFetch = mockFetch();
    const register = jest.spyOn(monaco.languages, "register");
    const onLanguage = jest.spyOn(monaco.languages, "onLanguage");
    const setMonarchTokensProvider = jest.spyOn(monaco.languages, "setMonarchTokensProvider");
    await registerLanguages();
    const onLanguageCallback = onLanguage.mock.calls.find(([language]) => language === "cton")[1];
    onLanguageCallback();
    expect(register).toHaveBeenCalledWith({ id: "cton" });
    expect(setMonarchTokensProvider).toHaveBeenCalledWith("cton", Cton.MonarchDefinitions);
    register.mockRestore();
    onLanguage.mockRestore();
    setMonarchTokensProvider.mockRestore();
    restoreFetch();
  });
  it("should correctly register X86", async () => {
    const restoreFetch = mockFetch();
    const register = jest.spyOn(monaco.languages, "register");
    const onLanguage = jest.spyOn(monaco.languages, "onLanguage");
    const setMonarchTokensProvider = jest.spyOn(monaco.languages, "setMonarchTokensProvider");
    await registerLanguages();
    const onLanguageCallback = onLanguage.mock.calls.find(([language]) => language === "x86")[1];
    onLanguageCallback();
    expect(register).toHaveBeenCalledWith({ id: "x86" });
    expect(setMonarchTokensProvider).toHaveBeenCalledWith("x86", X86.MonarchDefinitions);
    register.mockRestore();
    onLanguage.mockRestore();
    setMonarchTokensProvider.mockRestore();
    restoreFetch();
  });
  it("should correctly register Rust", async () => {
    const restoreFetch = mockFetch();
    const register = jest.spyOn(monaco.languages, "register");
    const onLanguage = jest.spyOn(monaco.languages, "onLanguage");
    const setMonarchTokensProvider = jest.spyOn(monaco.languages, "setMonarchTokensProvider");
    await registerLanguages();
    const onLanguageCallback = onLanguage.mock.calls.find(([language]) => language === "rust")[1];
    onLanguageCallback();
    expect(register).toHaveBeenCalledWith({ id: "rust" });
    expect(setMonarchTokensProvider).toHaveBeenCalledWith("rust", Rust.MonarchDefinitions);
    register.mockRestore();
    onLanguage.mockRestore();
    setMonarchTokensProvider.mockRestore();
    restoreFetch();
  });
  it("should correctly configure TypeScript/JavaScript", async () => {
    const restoreFetch = mockFetch();
    const addExtraLib = jest.spyOn(monaco.languages.typescript.typescriptDefaults, "addExtraLib");
    const setTsCompilerOptions = jest.spyOn(monaco.languages.typescript.typescriptDefaults, "setCompilerOptions");
    const setJsCompilerOptions = jest.spyOn(monaco.languages.typescript.javascriptDefaults, "setCompilerOptions");
    await registerLanguages();
    expect(addExtraLib).toHaveBeenCalledWith("fetched: lib/lib.es6.d.ts");
    expect(addExtraLib).toHaveBeenCalledWith("fetched: lib/fiddle.d.ts");
    expect(setTsCompilerOptions).toHaveBeenCalledWith({ noLib: true, allowNonTsExtensions: true });
    expect(setJsCompilerOptions).toHaveBeenCalledWith({ noLib: true, allowNonTsExtensions: true });
    addExtraLib.mockRestore();
    setTsCompilerOptions.mockRestore();
    setJsCompilerOptions.mockRestore();
    restoreFetch();
  });
});
