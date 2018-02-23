#!/usr/bin/env node

/*
  This file was taken from https://github.com/devtools-html/debugger.html/blob/master/bin/ci/check-file-sizes.js
*/

const path = require("path");
const fs = require("fs");

const fileSizes = {
  "main.bundle.js": 300000
};

const distPath = "./dist";

function checkFileSizes() {
  let success = true;

  Object.keys(fileSizes).forEach(key => {
    const fullDistPath = path.join(process.cwd(), distPath);
    const { size } = fs.statSync(path.join(fullDistPath, key));

    if (size > fileSizes[key]) {
      console.log(`Oh no, ${key} is ${size} bytes, which is greater than ${fileSizes[key]}`);
      success = false;
    } else {
      console.log(`${key} is ${size} bytes, which is not great, but fine...`);
    }
  });

  return success;
}

const success = checkFileSizes();
process.exit(success ? 0 : 1);
