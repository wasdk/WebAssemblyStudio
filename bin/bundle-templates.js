#!/usr/bin/env node

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

const path = require("path");
const fs = require("fs");

const templatesDir = process.argv[2];
const outputPath = process.argv[3];

function walk(base, callback) {
  let files = fs.readdirSync(base);
  files.forEach(file => {
    let path = base + "/" + file;
    if (fs.statSync(path).isDirectory()) {
      walk(path, callback);
    } else {
      callback && callback(path);
    }
  });
}

function bundleTemplate(templateName) {
  let description = "";
  let icon = "";

  let base = templatesDir + "/" + templateName;
  let files = [];
  walk(base, (path) => {
    let name = path.substring(base.length + 1);
    if (name == "package.json") {
      const pkg = JSON.parse(fs.readFileSync(path, "utf8"));
      templateName = pkg.name;
      description = pkg.description;
      if (pkg.wasmStudio) {
        templateName = pkg.wasmStudio.name || name;
        description = pkg.wasmStudio.description || description;
        icon = pkg.wasmStudio.icon || icon;
      }
    }
    files.push({
      name,
    });
  })
  return {
    name: templateName,
    description,
    icon,
    files,
  }
}

let templates = fs.readdirSync(templatesDir);

let output = {};
templates.forEach((file) => {
  if (!fs.statSync(templatesDir + "/" + file).isDirectory()) {
    return;
  }
  let template = bundleTemplate(file);
  output[file] = template;
});

fs.writeFileSync(outputPath + "/index.js", JSON.stringify(output, null, 2));
