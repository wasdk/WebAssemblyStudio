/* Copyright 2018 Mozilla Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import "monaco-editor";

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;
import IModel = monaco.editor.IModel;
import IPosition = monaco.IPosition;

let completionItems: monaco.languages.CompletionItem[] = null;
function getCompletionItems(): monaco.languages.CompletionItem[] {
  const keyword = monaco.languages.CompletionItemKind.Keyword;
  if (completionItems) {
    return completionItems;
  }
  return completionItems = [

  ];
}

const LanguageConfiguration: IRichLanguageConfiguration = {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "<", close: ">" },
  ]
};

const MonarchDefinitions = {
  defaultToken: "invalid",

  keywords: [
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
    "yield"
  ],

  typeKeywords: [
    "array", "bool", "char", "f32", "f64", "i16", "i32", "i64", "i8",
    "isize", "pointer", "slice", "str", "tuple", "u16", "u32", "u64", "u8",
    "usize", "Vec", "String"
  ],

  operators: [
    "=", ">", "<", "!", "~", "?", ":",
    "==", "<=", ">=", "!=", "&&", "||", "++", "--",
    "+", "-", "*", "/", "&", "|", "^", "%", "<<",
    ">>", ">>>", "+=", "-=", "*=", "/=", "&=", "|=",
    "^=", "%=", "<<=", ">>=", ">>>="
  ],

  symbols: /[=><!~?:&|+\-*\/^%]+/,
  escapes: /\\(?:[abfnrtv\\""]|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [/[a-z_$][\w$]*/, {
        cases: {
          "@keywords":     "keyword",
          "@typeKeywords": "keyword.type",
          "@default":      "identifier"
        }
      }],
      [/[A-Z][\w$]*/, "type.identifier"],  // to show class names nicely

      // whitespace
      { include: "@whitespace" },

      // delimiters and operators
      [/[{}()\[\]]/,       "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],

      [/@symbols/, {
        cases: {
          "@operators": "operator",
          "@default": ""
        }
      }],

      [/#!\[[^]*\]/, "annotation"],
      [/#!.*$/,      "annotation.invalid"],

      // numbers
      [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/,    "number.float"],
      [/0[xX][0-9a-fA-F_]*[0-9a-fA-F][Ll]?/, "number.hex"],
      [/0[0-7_]*[0-7][Ll]?/,                 "number.octal"],
      [/0[bB][0-1_]*[0-1][Ll]?/,             "number.binary"],
      [/\d+[lL]?/,                           "number"],

      // delimiter: after number because of .\d floats
      [/[;,.]/, "delimiter"],

      // strings
      [/"([^"\\]|\\.)*$/, "string.invalid"],  // non-teminated string
      [/"/, "string", "@string"],

      // characters
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
  }
};

export const Rust = {
  MonarchDefinitions,
  LanguageConfiguration,
  CompletionItemProvider: {
    provideCompletionItems: (model: IModel, position: IPosition): monaco.languages.CompletionItem[] => {
      return getCompletionItems();
    }
  },
  HoverProvider: {
    provideHover: (model: IModel, position: IPosition): any => {
      return {
        range: new monaco.Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())),
        contents: [
          "**DETAILS**",
          { language: "html", value: "TODO" }
        ]
      };
    }
  }
};
