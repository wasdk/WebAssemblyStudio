#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

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

function bundleTemplate(base) {
  let files = [];
  walk(base, (path) => {
    let data = fs.readFileSync(path, "utf8");
    let name = path.substring(base.length + 1)
    files.push({
      name: name,
      data: data
    });
  })
  return files;
}

let templateDir = "templates"
let templates = fs.readdirSync(templateDir);

let output = {};
templates.forEach((file) => {
  if (!fs.statSync(templateDir + "/" + file).isDirectory()) {
    return;
  }
  let files = bundleTemplate(templateDir + "/" + file);
  output[file] = {
    files
  }
});

process.stdout.write(JSON.stringify(output, null, 2));