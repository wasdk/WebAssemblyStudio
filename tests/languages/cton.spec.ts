/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { Cton } from "../../src/languages/cton";

describe("Tests for Cton", () => {
  describe("CompletionItemProvider", () => {
    it("should provide a correct provideCompletionItems function", () => {
      expect(Cton.CompletionItemProvider.provideCompletionItems(null, null)).toEqual([]);
    });
  });
  describe("HoverProvider", () => {
    it("should provide a correct provideHover function", () => {
      const model = {
        getLineCount: () => 2,
        getLineMaxColumn: () => 4
      };
      expect(Cton.HoverProvider.provideHover(model, 0)).toEqual({
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
      expect(Cton.LanguageConfiguration.wordPattern).toEqual(pattern);
    });
    it("should expose the correct brackets", () => {
      expect(Cton.LanguageConfiguration.brackets).toEqual([
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
      ]);
    });
    it("should expose the correct autoClosingPairs", () => {
      expect(Cton.LanguageConfiguration.autoClosingPairs).toEqual([
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ]);
    });
    it("should expose the correct surroundingPairs", () => {
      expect(Cton.LanguageConfiguration.surroundingPairs).toEqual([
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
    it("should expose the correct keywords", () => {
      expect(Cton.MonarchDefinitions.keywords).toEqual(["function", "jump"]);
    });
    it("should expose the correct typeKeywords", () => {
      expect(Cton.MonarchDefinitions.typeKeywords).toEqual(["i32", "i64", "f32", "f64"]);
    });
    it("should expose the correct operators", () => {
      expect(Cton.MonarchDefinitions.operators).toEqual([]);
    });
    it("should expose the correct symbols", () => {
      expect(Cton.MonarchDefinitions.symbols).toEqual(/[=><~&|+\-*\/%@#]+/);
    });
    it("should expose the correct escapes", () => {
      expect(Cton.MonarchDefinitions.escapes).toEqual(/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/);
    });
    it("should expose the correct tokenizer", () => {
      expect(Cton.MonarchDefinitions.tokenizer).toEqual({
        root: [
          [/[a-z_$][\w$\.]*/, {
            cases: {
              "@keywords": "keyword",
              "@typeKeywords": "type",
              "@default": "type.identifier"
            }
          }],
          [/\d+/, "number"],
          [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
          [/[{}()\[\]]/, "@brackets"]
        ] as any,
        string: [
          [/[^\\"]+/, "string"],
          [/@escapes/, "string.escape"],
          [/\\./, "string.escape.invalid"],
          [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
        ],
        whitespace: [
          [/[ \t\r\n]+/, "white"],
          [/;.*$/,    "comment"]
        ],
      });
    });
  });
});
