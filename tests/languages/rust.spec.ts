/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

import { Rust } from "../../src/languages/rust";

describe("Tests for Rust", () => {
  describe("CompletionItemProvider", () => {
    it("should provide a correct provideCompletionItems function", () => {
      expect(Rust.CompletionItemProvider.provideCompletionItems(null, null)).toEqual([]);
    });
  });
  describe("HoverProvider", () => {
    it("should provide a correct provideHover function", () => {
      const model = {
        getLineCount: () => 2,
        getLineMaxColumn: () => 4
      };
      expect(Rust.HoverProvider.provideHover(model, 0)).toEqual({
        range: { r: [1, 1, 2, 4] },
        contents: [
          "**DETAILS**",
          { language: "html", value: "TODO" }
        ]
      });
    });
  });
  describe("LanguageConfiguration", () => {
    it("should expose the correct comments", () => {
      expect(Rust.LanguageConfiguration.comments).toEqual({
        lineComment: "//",
        blockComment: ["/*", "*/"],
      });
    });
    it("should expose the correct brackets", () => {
      expect(Rust.LanguageConfiguration.brackets).toEqual([
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
      ]);
    });
    it("should expose the correct autoClosingPairs", () => {
      expect(Rust.LanguageConfiguration.autoClosingPairs).toEqual([
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ]);
    });
    it("should expose the correct surroundingPairs", () => {
      expect(Rust.LanguageConfiguration.surroundingPairs).toEqual([
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
      expect(Rust.MonarchDefinitions.defaultToken).toEqual("invalid");
    });
    it("should expose the correct keywords", () => {
      expect(Rust.MonarchDefinitions.keywords).toEqual([
        "abstract",
        "alignof",
        "as",
        "become",
        "box",
        "break",
        "const",
        "continue",
        "crate",
        "do",
        "else",
        "enum",
        "extern",
        "false",
        "final",
        "fn",
        "for",
        "if",
        "impl",
        "in",
        "let",
        "loop",
        "macro",
        "match",
        "mod",
        "move",
        "mut",
        "offsetof",
        "override",
        "priv",
        "proc",
        "pub",
        "pure",
        "ref",
        "return",
        "Self",
        "self",
        "sizeof",
        "static",
        "struct",
        "super",
        "trait",
        "true",
        "type",
        "typeof",
        "unsafe",
        "unsized",
        "use",
        "virtual",
        "where",
        "while",
        "yield",
        "macro_rules",
        "block",
        "expr",
        "ident",
        "item",
        "pat",
        "path",
        "stmt",
        "meta",
        "tt",
        "ty"
      ]);
    });
    it("should expose the correct typeKeywords", () => {
      expect(Rust.MonarchDefinitions.typeKeywords).toEqual([
        "array", "bool", "char", "f32", "f64", "i16", "i32", "i64", "i8",
        "isize", "pointer", "slice", "str", "tuple", "u16", "u32", "u64", "u8",
        "usize", "Vec", "String"
      ]);
    });
    it("should expose the correct operators", () => {
      expect(Rust.MonarchDefinitions.operators).toEqual([
        "=", ">", "<", "!", "~", "?", ":",
        "==", "<=", ">=", "!=", "&&", "||", "++", "--",
        "+", "-", "*", "/", "&", "|", "^", "%", "<<",
        ">>", ">>>", "+=", "-=", "*=", "/=", "&=", "|=",
        "^=", "%=", "<<=", ">>=", ">>>="
      ]);
    });
    it("should expose the correct symbols", () => {
      expect(Rust.MonarchDefinitions.symbols).toEqual(/[=><!~?:&|+\-*\/^%]+/);
    });
    it("should expose the correct escapes", () => {
      expect(Rust.MonarchDefinitions.escapes).toEqual(/\\(?:[abfnrtv\\""]|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/);
    });
    it("should expose the correct tokenizer", () => {
      expect(Rust.MonarchDefinitions.tokenizer).toEqual({
        root: [
          [/[a-z_$][\w$]*/, {
            cases: {
              "@keywords":     "keyword",
              "@typeKeywords": "keyword.type",
              "@default":      "identifier"
            }
          }],
          [/[A-Z][\w$]*/, "type.identifier"],
          { include: "@whitespace" },
          [/[{}()\[\]]/,       "@brackets"],
          [/[<>](?!@symbols)/, "@brackets"],
          [/@symbols/, {
            cases: {
              "@operators": "operator",
              "@default": ""
            }
          }],
          [/#!?\[[^]*\]/, "annotation"],
          [/#!?.*$/,      "annotation.invalid"],
          [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/,    "number.float"],
          [/0[xX][0-9a-fA-F_]*[0-9a-fA-F][Ll]?/, "number.hex"],
          [/0[0-7_]*[0-7][Ll]?/,                 "number.octal"],
          [/0[bB][0-1_]*[0-1][Ll]?/,             "number.binary"],
          [/\d+[lL]?/,                           "number"],
          [/[;,.]/, "delimiter"],
          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/"/, "string", "@string"],
          [/"[^\\"]"/, "string"],
          [/(")(@escapes)(")/, ["string", "string.escape", "string"]],
          [/"/, "string.invalid"]
        ],
        whitespace: [
          [/[ \t\r\n]+/, "white"],
          [/\/\*/,       "comment", "@comment"],
          [/\/\/.*$/,    "comment"]
        ],
        comment: [
          [/[^\/*]+/, "comment"],
          [/\/\*/,    "comment", "@push"],
          [/\/\*/,    "comment.invalid"],
          ["\\*/",    "comment", "@pop"],
          [/[\/*]/,   "comment"]
        ],
        string: [
          [/[^\\"]+/,  "string"],
          [/@escapes/, "string.escape"],
          [/\\./,      "string.escape.invalid"],
          [/"/,        "string", "@pop"]
        ]
      });
    });
  });
});
