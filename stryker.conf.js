const path = require("path");

module.exports = function(config) {
  config.set({
    testRunner: "jest",
    mutator: "typescript",
    reporter: ["html", "progress", "clear-text"],
    htmlReporter: {
      baseDir: "mutation/html",
    },
    coverageAnalysis: "off",
    mutate: [
      "src/**/*.ts?(x)",
      "!src/**/**.d.ts"
    ],
    timeoutMs: 60000,
    logLevel: "fatal"
  });
};
