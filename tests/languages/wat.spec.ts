/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

declare var monaco: { languages };

import { Wat, watWordAt, getWatCompletionItems } from "../../src/languages/wat";

describe("Tests for Wat", () => {
  describe("CompletionItemProvider", () => {
    it("should provide a correct provideCompletionItems function", () => {
      const keyword = monaco.languages.CompletionItemKind.Keyword;
      expect(Wat.CompletionItemProvider.provideCompletionItems(null, null)).toEqual([
        { label: "module", documentation: "", kind: keyword, insertText: "module" },
        { label: "func", documentation: "function declaration", kind: keyword, insertText: "func" },
        { label: "param", documentation: "parameter", kind: keyword, insertText: { value: "param ${1:identifier} ${2:type}" } },
        { label: "i32", documentation: "32-bit integer", kind: keyword, insertText: "i32" },
        { label: "i64", documentation: "64-bit integer", kind: keyword, insertText: "i64" },
        { label: "f32", documentation: "32-bit floating point", kind: keyword, insertText: "f32" },
        { label: "f64", documentation: "64-bit floating point", kind: keyword, insertText: "f64" },
        { label: "anyfunc", documentation: "function reference", kind: keyword, insertText: "anyfunc" },
        { label: "i32.load8_s", documentation: "load 1 byte and sign-extend i8 to i32", kind: keyword, insertText: "i32.load8_s" },
        { label: "i32.load8_u", documentation: "load 1 byte and zero-extend i8 to i32", kind: keyword, insertText: "i32.load8_u" },
        { label: "i32.load16_s", documentation: "load 2 bytes and sign-extend i16 to i32", kind: keyword, insertText: "i32.load16_s" },
        { label: "i32.load16_u", documentation: "load 2 bytes and zero-extend i16 to i32", kind: keyword, insertText: "i32.load16_u" },
        { label: "i32.load", documentation: "load 4 bytes as i32", kind: keyword, insertText: "i32.load" },
        { label: "i64.load8_s", documentation: "load 1 byte and sign-extend i8 to i64", kind: keyword, insertText: "i64.load8_s" },
        { label: "i64.load8_u", documentation: "load 1 byte and zero-extend i8 to i64", kind: keyword, insertText: "i64.load8_u" },
        { label: "i64.load16_s", documentation: "load 2 bytes and sign-extend i16 to i64", kind: keyword, insertText: "i64.load16_s" },
        { label: "i64.load16_u", documentation: "load 2 bytes and zero-extend i16 to i64", kind: keyword, insertText: "i64.load16_u" },
        { label: "i64.load32_s", documentation: "load 4 bytes and sign-extend i32 to i64", kind: keyword, insertText: "i64.load32_s" },
        { label: "i64.load32_u", documentation: "load 4 bytes and zero-extend i32 to i64", kind: keyword, insertText: "i64.load32_u" },
        { label: "i64.load", documentation: "load 8 bytes as i64", kind: keyword, insertText: "i64.load" },
        { label: "f32.load", documentation: "load 4 bytes as f32", kind: keyword, insertText: "f32.load" },
        { label: "f64.load", documentation: "load 8 bytes as f64", kind: keyword, insertText: "f64.load" },
        { label: "i32.store8", documentation: "wrap i32 to i8 and store 1 byte", kind: keyword, insertText: "i32.store8" },
        { label: "i32.store16", documentation: "wrap i32 to i16 and store 2 bytes", kind: keyword, insertText: "i32.store16" },
        { label: "i32.store", documentation: "(no conversion) store 4 bytes", kind: keyword, insertText: "i32.store" },
        { label: "i64.store8", documentation: "wrap i64 to i8 and store 1 byte", kind: keyword, insertText: "i64.store8" },
        { label: "i64.store16", documentation: "wrap i64 to i16 and store 2 bytes", kind: keyword, insertText: "i64.store16" },
        { label: "i64.store32", documentation: "wrap i64 to i32 and store 4 bytes", kind: keyword, insertText: "i64.store32" },
        { label: "i64.store", documentation: "(no conversion) store 8 bytes", kind: keyword, insertText: "i64.store" },
        { label: "f32.store", documentation: "(no conversion) store 4 bytes", kind: keyword, insertText: "f32.store" },
        { label: "f64.store", documentation: "(no conversion) store 8 bytes", kind: keyword, insertText: "f64.store" },
        { label: "get_local", documentation: "read the current value of a local variable", kind: keyword, insertText: "get_local" },
        { label: "set_local", documentation: "set the current value of a local variable", kind: keyword, insertText: "set_local" },
        { label: "tee_local", documentation: "like `set_local`, but also returns the set value", kind: keyword, insertText: "tee_local" },
        { label: "get_global", documentation: "get the current value of a global variable", kind: keyword, insertText: "get_global" },
        { label: "set_global", documentation: "set the current value of a global variable", kind: keyword, insertText: "set_global" },
        { label: "nop", documentation: "no operation, no effect", kind: keyword, insertText: "nop" },
        { label: "block", documentation: "the beginning of a block construct, a sequence of instructions with a label at the end", kind: keyword, insertText: "block" },
        { label: "loop", documentation: "a block with a label at the beginning which may be used to form loops", kind: keyword, insertText: "loop" },
        { label: "if", documentation: "the beginning of an if construct with an implicit *then* block", kind: keyword, insertText: "if" },
        { label: "else", documentation: "marks the else block of an if", kind: keyword, insertText: "else" },
        { label: "br", documentation: "branch to a given label in an enclosing construct", kind: keyword, insertText: "br" },
        { label: "br_if", documentation: "conditionally branch to a given label in an enclosing construct", kind: keyword, insertText: "br_if" },
        { label: "br_table", documentation: "a jump table which jumps to a label in an enclosing construct", kind: keyword, insertText: "br_table" },
        { label: "return", documentation: "return zero or more values from this function", kind: keyword, insertText: "return" },
        { label: "end", documentation: "an instruction that marks the end of a block, loop, if, or function", kind: keyword, insertText: "end" },
        { label: "call", documentation: "call function directly", kind: keyword, insertText: "call" },
        { label: "call_indirect", documentation: "call function indirectly", kind: keyword, insertText: "call_indirect" },
        { label: "i64.const", documentation: "produce the value of an i64 immediate", kind: keyword, insertText: { value: "i64.const ${1:constant}" } },
        { label: "i32.const", documentation: "produce the value of an i32 immediate", kind: keyword, insertText: { value: "i32.const ${1:constant}" } },
        { label: "f32.const", documentation: "produce the value of an f32 immediate", kind: keyword, insertText: { value: "f32.const ${1:constant}" } },
        { label: "f64.const", documentation: "produce the value of an f64 immediate", kind: keyword, insertText: { value: "f64.const ${1:constant}" } },
        { label: "i32.add", documentation: "sign-agnostic addition", kind: keyword, insertText: "i32.add" },
        { label: "i32.sub", documentation: "sign-agnostic subtraction", kind: keyword, insertText: "i32.sub" },
        { label: "i32.mul", documentation: "sign-agnostic multiplication (lower 32-bits)", kind: keyword, insertText: "i32.mul" },
        { label: "i32.div_s", documentation: "signed division (result is truncated toward zero)", kind: keyword, insertText: "i32.div_s" },
        { label: "i32.div_u", documentation: "unsigned division (result is [floored](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions))", kind: keyword, insertText: "i32.div_u" },
        { label: "i32.rem_s", documentation: "signed remainder (result has the sign of the dividend)", kind: keyword, insertText: "i32.rem_s" },
        { label: "i32.rem_u", documentation: "unsigned remainder", kind: keyword, insertText: "i32.rem_u" },
        { label: "i32.and", documentation: "sign-agnostic bitwise and", kind: keyword, insertText: "i32.and" },
        { label: "i32.or", documentation: "sign-agnostic bitwise inclusive or", kind: keyword, insertText: "i32.or" },
        { label: "i32.xor", documentation: "sign-agnostic bitwise exclusive or", kind: keyword, insertText: "i32.xor" },
        { label: "i32.shl", documentation: "sign-agnostic shift left", kind: keyword, insertText: "i32.shl" },
        { label: "i32.shr_u", documentation: "zero-replicating (logical) shift right", kind: keyword, insertText: "i32.shr_u" },
        { label: "i32.shr_s", documentation: "sign-replicating (arithmetic) shift right", kind: keyword, insertText: "i32.shr_s" },
        { label: "i32.rotl", documentation: "sign-agnostic rotate left", kind: keyword, insertText: "i32.rotl" },
        { label: "i32.rotr", documentation: "sign-agnostic rotate right", kind: keyword, insertText: "i32.rotr" },
        { label: "i32.eq", documentation: "sign-agnostic compare equal", kind: keyword, insertText: "i32.eq" },
        { label: "i32.ne", documentation: "sign-agnostic compare unequal", kind: keyword, insertText: "i32.ne" },
        { label: "i32.lt_s", documentation: "signed less than", kind: keyword, insertText: "i32.lt_s" },
        { label: "i32.le_s", documentation: "signed less than or equal", kind: keyword, insertText: "i32.le_s" },
        { label: "i32.lt_u", documentation: "unsigned less than", kind: keyword, insertText: "i32.lt_u" },
        { label: "i32.le_u", documentation: "unsigned less than or equal", kind: keyword, insertText: "i32.le_u" },
        { label: "i32.gt_s", documentation: "signed greater than", kind: keyword, insertText: "i32.gt_s" },
        { label: "i32.ge_s", documentation: "signed greater than or equal", kind: keyword, insertText: "i32.ge_s" },
        { label: "i32.gt_u", documentation: "unsigned greater than", kind: keyword, insertText: "i32.gt_u" },
        { label: "i32.ge_u", documentation: "unsigned greater than or equal", kind: keyword, insertText: "i32.ge_u" },
        { label: "i32.clz", documentation: "sign-agnostic count leading zero bits (All zero bits are considered leading if the value is zero)", kind: keyword, insertText: "i32.clz" },
        { label: "i32.ctz", documentation: "sign-agnostic count trailing zero bits (All zero bits are considered trailing if the value is zero)", kind: keyword, insertText: "i32.ctz" },
        { label: "i32.popcnt", documentation: "sign-agnostic count number of one bits", kind: keyword, insertText: "i32.popcnt" },
        { label: "i32.eqz", documentation: "compare equal to zero (return 1 if operand is zero, 0 otherwise)", kind: keyword, insertText: "i32.eqz" },
        { label: "f32.add", documentation: "addition", kind: keyword, insertText: "f32.add" },
        { label: "f32.sub", documentation: "subtraction", kind: keyword, insertText: "f32.sub" },
        { label: "f32.mul", documentation: "multiplication", kind: keyword, insertText: "f32.mul" },
        { label: "f32.div", documentation: "division", kind: keyword, insertText: "f32.div" },
        { label: "f32.abs", documentation: "absolute value", kind: keyword, insertText: "f32.abs" },
        { label: "f32.neg", documentation: "negation", kind: keyword, insertText: "f32.neg" },
        { label: "f32.copysign", documentation: "copysign", kind: keyword, insertText: "f32.copysign" },
        { label: "f32.ceil", documentation: "ceiling operator", kind: keyword, insertText: "f32.ceil" },
        { label: "f32.floor", documentation: "floor operator", kind: keyword, insertText: "f32.floor" },
        { label: "f32.trunc", documentation: "round to nearest integer towards zero", kind: keyword, insertText: "f32.trunc" },
        { label: "f32.nearest", documentation: "round to nearest integer, ties to even", kind: keyword, insertText: "f32.nearest" },
        { label: "f32.eq", documentation: "compare ordered and equal", kind: keyword, insertText: "f32.eq" },
        { label: "f32.ne", documentation: "compare unordered or unequal", kind: keyword, insertText: "f32.ne" },
        { label: "f32.lt", documentation: "compare ordered and less than", kind: keyword, insertText: "f32.lt" },
        { label: "f32.le", documentation: "compare ordered and less than or equal", kind: keyword, insertText: "f32.le" },
        { label: "f32.gt", documentation: "compare ordered and greater than", kind: keyword, insertText: "f32.gt" },
        { label: "f32.ge", documentation: "compare ordered and greater than or equal", kind: keyword, insertText: "f32.ge" },
        { label: "f32.sqrt", documentation: "square root", kind: keyword, insertText: "f32.sqrt" },
        { label: "f32.min", documentation: "minimum (binary operator); if either operand is NaN, returns NaN", kind: keyword, insertText: "f32.min" },
        { label: "f32.max", documentation: "maximum (binary operator); if either operand is NaN, returns NaN", kind: keyword, insertText: "f32.max" },
        { label: "f64.add", documentation: "addition", kind: keyword, insertText: "f64.add" },
        { label: "f64.sub", documentation: "subtraction", kind: keyword, insertText: "f64.sub" },
        { label: "f64.mul", documentation: "multiplication", kind: keyword, insertText: "f64.mul" },
        { label: "f64.div", documentation: "division", kind: keyword, insertText: "f64.div" },
        { label: "f64.abs", documentation: "absolute value", kind: keyword, insertText: "f64.abs" },
        { label: "f64.neg", documentation: "negation", kind: keyword, insertText: "f64.neg" },
        { label: "f64.copysign", documentation: "copysign", kind: keyword, insertText: "f64.copysign" },
        { label: "f64.ceil", documentation: "ceiling operator", kind: keyword, insertText: "f64.ceil" },
        { label: "f64.floor", documentation: "floor operator", kind: keyword, insertText: "f64.floor" },
        { label: "f64.trunc", documentation: "round to nearest integer towards zero", kind: keyword, insertText: "f64.trunc" },
        { label: "f64.nearest", documentation: "round to nearest integer, ties to even", kind: keyword, insertText: "f64.nearest" },
        { label: "f64.eq", documentation: "compare ordered and equal", kind: keyword, insertText: "f64.eq" },
        { label: "f64.ne", documentation: "compare unordered or unequal", kind: keyword, insertText: "f64.ne" },
        { label: "f64.lt", documentation: "compare ordered and less than", kind: keyword, insertText: "f64.lt" },
        { label: "f64.le", documentation: "compare ordered and less than or equal", kind: keyword, insertText: "f64.le" },
        { label: "f64.gt", documentation: "compare ordered and greater than", kind: keyword, insertText: "f64.gt" },
        { label: "f64.ge", documentation: "compare ordered and greater than or equal", kind: keyword, insertText: "f64.ge" },
        { label: "f64.sqrt", documentation: "square root", kind: keyword, insertText: "f64.sqrt" },
        { label: "f64.min", documentation: "minimum (binary operator); if either operand is NaN, returns NaN", kind: keyword, insertText: "f64.min" },
        { label: "f64.max", documentation: "maximum (binary operator); if either operand is NaN, returns NaN", kind: keyword, insertText: "f64.max" },
        { label: "i32.wrap/i64", documentation: "wrap a 64-bit integer to a 32-bit integer", kind: keyword, insertText: "i32.wrap/i64" },
        { label: "i32.trunc_s/f32", documentation: "truncate a 32-bit float to a signed 32-bit integer", kind: keyword, insertText: "i32.trunc_s/f32" },
        { label: "i32.trunc_s/f64", documentation: "truncate a 64-bit float to a signed 32-bit integer", kind: keyword, insertText: "i32.trunc_s/f64" },
        { label: "i32.trunc_u/f32", documentation: "truncate a 32-bit float to an unsigned 32-bit integer", kind: keyword, insertText: "i32.trunc_u/f32" },
        { label: "i32.trunc_u/f64", documentation: "truncate a 64-bit float to an unsigned 32-bit integer", kind: keyword, insertText: "i32.trunc_u/f64" },
        { label: "i32.reinterpret/f32", documentation: "reinterpret the bits of a 32-bit float as a 32-bit integer", kind: keyword, insertText: "i32.reinterpret/f32" },
        { label: "i64.extend_s/i32", documentation: "extend a signed 32-bit integer to a 64-bit integer", kind: keyword, insertText: "i64.extend_s/i32" },
        { label: "i64.extend_u/i32", documentation: "extend an unsigned 32-bit integer to a 64-bit integer", kind: keyword, insertText: "i64.extend_u/i32" },
        { label: "i64.trunc_s/f32", documentation: "truncate a 32-bit float to a signed 64-bit integer", kind: keyword, insertText: "i64.trunc_s/f32" },
        { label: "i64.trunc_s/f64", documentation: "truncate a 64-bit float to a signed 64-bit integer", kind: keyword, insertText: "i64.trunc_s/f64" },
        { label: "i64.trunc_u/f32", documentation: "truncate a 32-bit float to an unsigned 64-bit integer", kind: keyword, insertText: "i64.trunc_u/f32" },
        { label: "i64.trunc_u/f64", documentation: "truncate a 64-bit float to an unsigned 64-bit integer", kind: keyword, insertText: "i64.trunc_u/f64" },
        { label: "i64.reinterpret/f64", documentation: "reinterpret the bits of a 64-bit float as a 64-bit integer", kind: keyword, insertText: "i64.reinterpret/f64" },
        { label: "f32.demote/f64", documentation: "demote a 64-bit float to a 32-bit float", kind: keyword, insertText: "f32.demote/f64" },
        { label: "f32.convert_s/i32", documentation: "convert a signed 32-bit integer to a 32-bit float", kind: keyword, insertText: "f32.convert_s/i32" },
        { label: "f32.convert_s/i64", documentation: "convert a signed 64-bit integer to a 32-bit float", kind: keyword, insertText: "f32.convert_s/i64" },
        { label: "f32.convert_u/i32", documentation: "convert an unsigned 32-bit integer to a 32-bit float", kind: keyword, insertText: "f32.convert_u/i32" },
        { label: "f32.convert_u/i64", documentation: "convert an unsigned 64-bit integer to a 32-bit float", kind: keyword, insertText: "f32.convert_u/i64" },
        { label: "f32.reinterpret/i32", documentation: "reinterpret the bits of a 32-bit integer as a 32-bit float", kind: keyword, insertText: "f32.reinterpret/i32" },
        { label: "f64.promote/f32", documentation: "promote a 32-bit float to a 64-bit float", kind: keyword, insertText: "f64.promote/f32" },
        { label: "f64.convert_s/i32", documentation: "convert a signed 32-bit integer to a 64-bit float", kind: keyword, insertText: "f64.convert_s/i32" },
        { label: "f64.convert_s/i64", documentation: "convert a signed 64-bit integer to a 64-bit float", kind: keyword, insertText: "f64.convert_s/i64" },
        { label: "f64.convert_u/i32", documentation: "convert an unsigned 32-bit integer to a 64-bit float", kind: keyword, insertText: "f64.convert_u/i32" },
        { label: "f64.convert_u/i64", documentation: "convert an unsigned 64-bit integer to a 64-bit float", kind: keyword, insertText: "f64.convert_u/i64" },
        { label: "f64.reinterpret/i64", documentation: "reinterpret the bits of a 64-bit integer as a 64-bit float", kind: keyword, insertText: "f64.reinterpret/i64" },
        { label: "current_memory", documentation: "current memory size in 64k pages", kind: keyword, insertText: "current_memory" },
        { label: "grow_memory", documentation: "grow memory size by the specified amount of 64k pages", kind: keyword, insertText: "grow_memory" }
      ]);
    });
  });
  describe("HoverProvider", () => {
    it("should provide a correct provideHover function", () => {
      const model = { getLineContent: jest.fn(() => "(i64.reinterpret/f64)") };
      const position = { lineNumber: 1, column: 3 };
      expect(Wat.HoverProvider.provideHover(model, position)).toEqual({
        range: { r: [1, 2, 1, 21] },
        contents: [
          "**DETAILS**",
          { language: "html", value: "reinterpret the bits of a 64-bit float as a 64-bit integer" }
        ]
      });
    });
    it("should handle cases of no wat word", () => {
      const model = { getLineContent: jest.fn(() => "") };
      const position = { lineNumber: 1, column: 3 };
      expect(Wat.HoverProvider.provideHover(model, position)).toBeUndefined();
    });
    it("should handle cases of no completion items", () => {
      const model = { getLineContent: jest.fn(() => "abc") };
      const position = { lineNumber: 1, column: 3 };
      expect(Wat.HoverProvider.provideHover(model, position)).toBeUndefined();
    });
  });
  describe("watWordAt", () => {
    it("should provide return the correct word", () => {
      expect(watWordAt("(i32.add)", 0).word).toBeFalsy();
      expect(watWordAt("(i32.add)", 8).word).toBeFalsy();
      expect(watWordAt("((()()(())))", 2).word).toBeFalsy();
      expect(watWordAt("abc def", 2).word).toEqual("abc");
      expect(watWordAt("ab def", 2).word).toBeFalsy();
      expect(watWordAt("", 2).word).toBeFalsy();
      expect(watWordAt("abcdef))", 2).word).toEqual("abcdef");
      expect(watWordAt("(i64.reinterpret/f64)", 2).word).toEqual("i64.reinterpret/f64");
      for (let i = 1; i < 8; i++) {
        expect(watWordAt("(i32.add)", i).word).toEqual("i32.add");
      }
    });
  });
  describe("getWatCompletionItems", () => {
    it("should provide return the correct completion items", () => {
      getWatCompletionItems().forEach(item => {
        expect(watWordAt(`((${item.label}))`, 2).word).toBe(item.label);
      });
    });
  });
  describe("LanguageConfiguration", () => {
    it("should expose the correct wordPattern", () => {
      const pattern = /(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g;
      expect(Wat.LanguageConfiguration.wordPattern).toEqual(pattern);
    });
    it("should expose the correct brackets", () => {
      expect(Wat.LanguageConfiguration.brackets).toEqual([
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
      ]);
    });
    it("should expose the correct autoClosingPairs", () => {
      expect(Wat.LanguageConfiguration.autoClosingPairs).toEqual([
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ]);
    });
    it("should expose the correct surroundingPairs", () => {
      expect(Wat.LanguageConfiguration.surroundingPairs).toEqual([
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
      expect(Wat.MonarchDefinitions.keywords).toEqual([
        "module",
        "table",
        "memory",
        "export",
        "import",
        "func",
        "result",
        "offset",
        "anyfunc",
        "type",
        "data",
        "start",
        "element",
        "global",
        "local",
        "mut",
        "param",
        "result",
        "i32.load8_s",
        "i32.load8_u",
        "i32.load16_s",
        "i32.load16_u",
        "i32.load",
        "i64.load8_s",
        "i64.load8_u",
        "i64.load16_s",
        "i64.load16_u",
        "i64.load32_s",
        "i64.load32_u",
        "i64.load",
        "f32.load",
        "f64.load",
        "i32.store8",
        "i32.store16",
        "i32.store",
        "i64.store8",
        "i64.store16",
        "i64.store32",
        "i64.store",
        "f32.store",
        "f64.store",
        "i32.const",
        "i64.const",
        "f32.const",
        "f64.const",
        "i32.add",
        "i32.sub",
        "i32.mul",
        "i32.div_s",
        "i32.div_u",
        "i32.rem_s",
        "i32.rem_u",
        "i32.and",
        "i32.or",
        "i32.xor",
        "i32.shl",
        "i32.shr_u",
        "i32.shr_s",
        "i32.rotl",
        "i32.rotr",
        "i32.eq",
        "i32.ne",
        "i32.lt_s",
        "i32.le_s",
        "i32.lt_u",
        "i32.le_u",
        "i32.gt_s",
        "i32.ge_s",
        "i32.gt_u",
        "i32.ge_u",
        "i32.clz",
        "i32.ctz",
        "i32.popcnt",
        "i32.eqz",
        "f32.add",
        "f32.sub",
        "f32.mul",
        "f32.div",
        "f32.abs",
        "f32.neg",
        "f32.copysign",
        "f32.ceil",
        "f32.floor",
        "f32.trunc",
        "f32.nearest",
        "f32.eq",
        "f32.ne",
        "f32.lt",
        "f32.le",
        "f32.gt",
        "f32.ge",
        "f32.sqrt",
        "f32.min",
        "f32.max",
        "f64.add",
        "f64.sub",
        "f64.mul",
        "f64.div",
        "f64.abs",
        "f64.neg",
        "f64.copysign",
        "f64.ceil",
        "f64.floor",
        "f64.trunc",
        "f64.nearest",
        "f64.eq",
        "f64.ne",
        "f64.lt",
        "f64.le",
        "f64.gt",
        "f64.ge",
        "f64.sqrt",
        "f64.min",
        "f64.max",
        "i32.wrap/i64",
        "i32.trunc_s/f32",
        "i32.trunc_s/f64",
        "i32.trunc_u/f32",
        "i32.trunc_u/f64",
        "i32.reinterpret/f32",
        "i64.extend_s/i32",
        "i64.extend_u/i32",
        "i64.trunc_s/f32",
        "i64.trunc_s/f64",
        "i64.trunc_u/f32",
        "i64.trunc_u/f64",
        "i64.reinterpret/f64",
        "f32.demote/f64",
        "f32.convert_s/i32",
        "f32.convert_s/i64",
        "f32.convert_u/i32",
        "f32.convert_u/i64",
        "f32.reinterpret/i32",
        "f64.promote/f32",
        "f64.convert_s/i32",
        "f64.convert_s/i64",
        "f64.convert_u/i32",
        "f64.convert_u/i64",
        "f64.reinterpret/i64",
        "get_local",
        "set_local",
        "tee_local",
        "get_global",
        "set_global",
        "current_memory",
        "grow_memory"
      ]);
    });
    it("should expose the correct typeKeywords", () => {
      expect(Wat.MonarchDefinitions.typeKeywords).toEqual([
        "i32",
        "i64",
        "f32",
        "f64",
        "anyfunc"
      ]);
    });
    it("should expose the correct operators", () => {
      expect(Wat.MonarchDefinitions.operators).toEqual([]);
    });
    it("should expose the correct brackets", () => {
      expect(Wat.MonarchDefinitions.brackets).toEqual([
        ["(", ")", "bracket.parenthesis"],
        ["{", "}", "bracket.curly"],
        ["[", "]", "bracket.square"]
      ]);
    });
    it("should expose the correct symbols", () => {
      expect(Wat.MonarchDefinitions.symbols).toEqual(/[=><!~?:&|+\-*\/\^%]+/);
    });
    it("should expose the correct escapes", () => {
      expect(Wat.MonarchDefinitions.escapes).toEqual(/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/);
    });
    it("should expose the correct tokenizer", () => {
      expect(Wat.MonarchDefinitions.tokenizer).toEqual({
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
        comment: [
          [/[^\/*]+/, "comment"],
          [/\/\*/, "comment", "@push"],
          ["\\*/", "comment", "@pop"],
          [/[\/*]/, "comment"]
        ],
        string: [
          [/[^\\"]+/, "string"],
          [/@escapes/, "string.escape"],
          [/\\./, "string.escape.invalid"],
          [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }]
        ],
        whitespace: [
          [/[ \t\r\n]+/, "white"],
          [/\/\*/, "comment", "@comment"],
          [/\/\/.*$/, "comment"],
        ],
      });
    });
  });
});
