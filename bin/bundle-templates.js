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
    let fullpath = path.join(base, file);
    if (fs.statSync(fullpath).isDirectory()) {
      walk(fullpath, callback);
    } else {
      callback && callback(fullpath);
    }
  });
}

function bundleTemplate(templateName) {
  let description = "";
  let icon = "";

  let base = path.join(templatesDir, templateName);
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

/**
 * Remove directory recursively
 * @param {string} dir_path
 * @see https://stackoverflow.com/a/42505874/3027390
 */
function rimraf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}

function mkdirP(dirPath) {
    const pathParts = path.resolve(dirPath).split(path.sep);
    const buildPath = [];
    while( buildPath.length < pathParts.length ) {
        buildPath.push(pathParts[buildPath.length]);
        const to = buildPath.join(path.sep);
        path.resolve(to);
        // if path is not empty and path does not exist.
        if( to.length > 0 && !fs.existsSync(to)) {
            fs.mkdirSync(to);
        }
    }
}

/**
 * Copy files to folder
 * @param from
 * @param to
 * @see https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
 */
function copyFolderSync(from, to) {
    mkdirP(to);
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}

let templates = fs.readdirSync(templatesDir);

let output = {};
templates.forEach((file) => {
  if (!fs.statSync(path.join(templatesDir, file)).isDirectory()) {
    return;
  }
  let template = bundleTemplate(file);
  output[file] = template;
});

rimraf(path.resolve(outputPath));
copyFolderSync(path.resolve(templatesDir), path.resolve(outputPath));
fs.writeFileSync(
  path.resolve(outputPath, "index.js"),
  JSON.stringify(output, null, 2));
