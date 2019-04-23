import * as babel from "@babel/core";
import * as flowPlugin from "@babel/plugin-transform-flow-strip-types";
const prettier = require("prettier/standalone");
const plugins = [require("prettier/parser-babylon")];
import * as Terser from "terser";
import plugin from "./plugin";
import makeWrapper from "./wrapper";

export const transpile = async (
  src: string,
  { minify = false, minifyOpts = {}, prettier = false, prettierOpts = {} }
) => {
  src = babelify(src, [plugin]);
  src = babelify(src, [flowPlugin]);
  src = makeWrapper(src).trim();
  src = prettify(src, { semi: true });
  if (prettier) {
    src = prettify(src, prettierOpts);
  } else if (minify) {
    src = doMinify(src, minifyOpts);
  }
  return src;
};

function babelify(
  src: string,
  plugins: any,
  sourceFilename = "Contract source"
) {
  return babel.transformSync(src, {
    parserOpts: {
      sourceType: "module",
      strictMode: true,
      sourceFilename,
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true,
      plugins: [
        "asyncGenerators",
        "bigInt",
        "classPrivateMethods",
        "classPrivateProperties",
        "classProperties",
        ["decorators", { decoratorsBeforeExport: false }],
        "doExpressions",
        // 'dynamicImport',
        // 'exportDefaultFrom',
        // 'exportNamespaceFrom',
        "flow",
        "flowComments",
        "functionBind",
        "functionSent",
        // 'importMeta',
        "jsx",
        "logicalAssignment",
        "nullishCoalescingOperator",
        "numericSeparator",
        "objectRestSpread",
        "optionalCatchBinding",
        "optionalChaining",
        ["pipelineOperator", { proposal: "minimal" }],
        "throwExpressions"
      ]
    },
    retainLines: false,
    minified: false,
    sourceMaps: false,
    plugins
  }).code;
}

function prettify(src, opts = {}) {
  return prettier.format(src, { parser: "babel", plugins });
}

function doMinify(src, opts = {}) {
  const result = Terser.minify(src, {
    parse: {
      bare_returns: true
    },
    keep_classnames: true,
    keep_fnames: true,
    ...opts
  });
  if (result.error) {
    throw new Error(JSON.stringify(result.error));
  }
  return result.code;
}
