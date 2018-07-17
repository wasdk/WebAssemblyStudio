/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { X86 } from "../../src/languages/x86";

describe("Tests for X86", () => {
  describe("CompletionItemProvider", () => {
    it("should provide a correct provideCompletionItems function", () => {
      expect(X86.CompletionItemProvider.provideCompletionItems(null, null)).toEqual([]);
    });
  });
  describe("HoverProvider", () => {
    it("should provide a correct provideHover function", () => {
      const model = {
        getLineCount: () => 2,
        getLineMaxColumn: () => 4
      };
      expect(X86.HoverProvider.provideHover(model, 0)).toEqual({
        range: { r: [1, 1, 2, 4] },
        contents: [
          "**DETAILS**",
          { language: "html", value: "TODO" }
        ]
      });
    });
  });
  describe("LanguageConfiguration", () => {
    it("should expose the correct wordPattern", () => {
      const pattern = /(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g;
      expect(X86.LanguageConfiguration.wordPattern).toEqual(pattern);
    });
    it("should expose the correct brackets", () => {
      expect(X86.LanguageConfiguration.brackets).toEqual([
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
      ]);
    });
    it("should expose the correct autoClosingPairs", () => {
      expect(X86.LanguageConfiguration.autoClosingPairs).toEqual([
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ]);
    });
    it("should expose the correct surroundingPairs", () => {
      expect(X86.LanguageConfiguration.surroundingPairs).toEqual([
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: "<", close: ">" },
      ]);
    });
  });
  describe("MonarchDefinitions", () => {
    it("should expose the correct defaultToken", () => {
      expect(X86.MonarchDefinitions.defaultToken).toEqual("invalid");
    });
    it("should ignore case", () => {
      expect(X86.MonarchDefinitions.ignoreCase).toEqual(true);
    });
    it("should expose the correct keywords", () => {
      expect(X86.MonarchDefinitions.keywords).toEqual(["qword", "ptr"]);
    });
    it("should expose the correct typeKeywords", () => {
      expect(X86.MonarchDefinitions.typeKeywords).toEqual(["i32", "i64", "f32", "f64"]);
    });
    it("should expose the correct ops", () => {
      expect(X86.MonarchDefinitions.ops).toEqual([
        "add",
        "sub",
        "mov",
        "jmp",
        "ret",
        "int3",
        "nop",
        "cmp"
      ]);
    });
    it("should expose the correct registers", () => {
      expect(X86.MonarchDefinitions.registers).toEqual([
        "R8", "R9", "R10", "R11", "R12", "R13", "R14", "R15",
        "CS", "DS", "ES", "FS", "GS", "SS", "RAX", "EAX", "RBX", "EBX", "RCX", "ECX", "RDX", "EDX",
        "RCX", "RIP", "EIP", "IP", "RSP", "ESP", "SP", "RSI", "ESI", "SI", "RDI", "EDI", "DI", "RFLAGS", "EFLAGS", "FLAGS"
      ]);
    });
    it("should expose the correct escapes", () => {
      expect(X86.MonarchDefinitions.escapes).toEqual(/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/);
    });
    it("should expose the correct tokenizer", () => {
      expect(X86.MonarchDefinitions.tokenizer).toEqual({
        root: [
          [/[a-z_$][\w$\.]*/, {
            cases: {
              "@ops": "keyword",
              "@registers": "type",
              "@keywords": "keyword",
              "@typeKeywords": "keyword.type",
              "@default": "identifier"
            }
          }],
          { include: "@whitespace" },
          [/0[xX][0-9a-fA-F]+/, "number.hex"],
          [/\d+/, "number"],
          [/[;,.]/, "delimiter"],
          [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
          [/[{}()\[\]]/, "@brackets"]
        ] as any,
        comment: [
          [/;.*/, "comment"]
        ],
        string: [
          [/[^\\"]+/, "string"],
          [/@escapes/, "string.escape"],
          [/\\./, "string.escape.invalid"],
          [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
        ],
        whitespace: [
          [/[ \t\r\n]+/, "white"],
          [/;.*$/, "comment"]
        ],
      });
    });
  });
});
