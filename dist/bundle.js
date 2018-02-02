/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(5);
const index_1 = __webpack_require__(3);
__webpack_require__(27);
const minimatch_1 = __webpack_require__(27);
function shallowCompare(a, b) {
    if (a === b)
        return true;
    if (a.length != b.length)
        return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i])
            return false;
    }
    return true;
}
exports.shallowCompare = shallowCompare;
var FileType;
(function (FileType) {
    FileType["JavaScript"] = "javascript";
    FileType["TypeScript"] = "typescript";
    FileType["HTML"] = "html";
    FileType["CSS"] = "css";
    FileType["C"] = "c";
    FileType["Cpp"] = "cpp";
    FileType["Rust"] = "rust";
    FileType["Wast"] = "wast";
    FileType["Wasm"] = "wasm";
    FileType["Directory"] = "directory";
    FileType["Log"] = "log";
    FileType["x86"] = "x86";
    FileType["Markdown"] = "markdown";
    FileType["Cretonne"] = "cretonne";
})(FileType = exports.FileType || (exports.FileType = {}));
function languageForFileType(type) {
    if (type == FileType.HTML) {
        return "html";
    }
    else if (type == FileType.CSS) {
        return "css";
    }
    else if (type == FileType.JavaScript) {
        return "javascript";
    }
    else if (type == FileType.TypeScript) {
        return "typescript";
    }
    else if (type == FileType.C || type == FileType.Cpp) {
        return "cpp";
    }
    else if (type == FileType.Wast || type == FileType.Wasm) {
        return "wast";
    }
    else if (type === FileType.Log) {
        return "log";
    }
    else if (type === FileType.x86) {
        return "x86";
    }
    else if (type === FileType.Markdown) {
        return "markdown";
    }
    else if (type === FileType.Cretonne) {
        return "cton";
    }
    return "";
}
exports.languageForFileType = languageForFileType;
function nameForFileType(type) {
    if (type == FileType.HTML) {
        return "HTML";
    }
    else if (type == FileType.CSS) {
        return "CSS";
    }
    else if (type == FileType.JavaScript) {
        return "JavaScript";
    }
    else if (type == FileType.TypeScript) {
        return "TypeScript";
    }
    else if (type == FileType.C) {
        return "C";
    }
    else if (type == FileType.Cpp) {
        return "C++";
    }
    else if (type == FileType.Wast) {
        return "Wast";
    }
    else if (type == FileType.Wasm) {
        return "Wasm";
    }
    else if (type === FileType.Markdown) {
        return "Markdown";
    }
    else if (type === FileType.Rust) {
        return "Rust";
    }
    else if (type === FileType.Cretonne) {
        return "Cretonne";
    }
    return "";
}
exports.nameForFileType = nameForFileType;
function extensionForFileType(type) {
    if (type == FileType.HTML) {
        return "html";
    }
    else if (type == FileType.CSS) {
        return "css";
    }
    else if (type == FileType.JavaScript) {
        return "js";
    }
    else if (type == FileType.TypeScript) {
        return "ts";
    }
    else if (type == FileType.C) {
        return "c";
    }
    else if (type == FileType.Cpp) {
        return "cpp";
    }
    else if (type == FileType.Wast) {
        return "wast";
    }
    else if (type == FileType.Wasm) {
        return "wasm";
    }
    else if (type === FileType.Markdown) {
        return "md";
    }
    else if (type === FileType.Rust) {
        return "rs";
    }
    else if (type === FileType.Cretonne) {
        return "cton";
    }
    return "";
}
exports.extensionForFileType = extensionForFileType;
function mimeTypeForFileType(type) {
    if (type == FileType.HTML) {
        return "text/html";
    }
    else if (type == FileType.JavaScript) {
        return "application/javascript";
    }
    else if (type == FileType.Wasm) {
        return "application/wasm";
    }
    return "";
}
exports.mimeTypeForFileType = mimeTypeForFileType;
function getIconForFileType(fileType) {
    if (fileType === FileType.JavaScript) {
        return "file_type_js";
    }
    else if (fileType === FileType.TypeScript) {
        return "file_type_typescript";
    }
    else if (fileType === FileType.C) {
        return "file_type_c";
    }
    else if (fileType === FileType.Cpp) {
        return "file_type_cpp";
    }
    else if (fileType === FileType.Directory) {
        return "default_folder";
    }
    return "default_file";
}
exports.getIconForFileType = getIconForFileType;
class EventDispatcher {
    constructor(name) {
        this.callbacks = [];
        this.name = name;
    }
    register(callback) {
        if (this.callbacks.indexOf(callback) >= 0) {
            return;
        }
        this.callbacks.push(callback);
    }
    unregister(callback) {
        let i = this.callbacks.indexOf(callback);
        if (i < 0) {
            throw new Error("Unknown callback.");
        }
        this.callbacks.splice(i, 1);
    }
    dispatch(target) {
        // console.log("Dispatching " + this.name);
        this.callbacks.forEach(callback => {
            callback(target);
        });
    }
}
exports.EventDispatcher = EventDispatcher;
function monacoSeverityToString(severity) {
    switch (severity) {
        case monaco.Severity.Info: return "info";
        case monaco.Severity.Warning: return "warning";
        case monaco.Severity.Error: return "error";
        case monaco.Severity.Ignore: return "ignore";
    }
}
let nextKey = 0;
function getNextKey() {
    return nextKey++;
}
class Problem {
    constructor(file, description, severity, marker) {
        this.file = file;
        this.description = description;
        this.severity = severity;
        this.marker = marker;
        this.key = String(getNextKey());
    }
    static fromMarker(file, marker) {
        return new Problem(file, `${marker.message} (${marker.startLineNumber}, ${marker.startColumn})`, monacoSeverityToString(marker.severity), marker);
    }
}
exports.Problem = Problem;
class File {
    constructor(name, type) {
        this.isDirty = false;
        this.isBufferReadOnly = false;
        this.onDidChangeData = new EventDispatcher("File Data Change");
        this.onDidChangeBuffer = new EventDispatcher("File Buffer Change");
        this.onDidChangeProblems = new EventDispatcher("File Problems Change");
        this.key = String(getNextKey());
        this.problems = [];
        this.name = name;
        this.type = type;
        this.data = null; // localStorage.getItem(this.name);
        this.buffer = monaco.editor.createModel(this.data, languageForFileType(type));
        this.buffer.updateOptions({ tabSize: 2, insertSpaces: true });
        this.buffer.onDidChangeContent((e) => {
            let dispatch = !this.isDirty;
            this.isDirty = true;
            if (dispatch) {
                let file = this;
                while (file) {
                    file.onDidChangeBuffer.dispatch();
                    file = file.parent;
                }
            }
            monaco.editor.setModelMarkers(this.buffer, "compiler", []);
        });
        this.isBufferReadOnly = type === FileType.Wasm;
        if (this.isBufferReadOnly) {
            this.description = "Read Only";
        }
        this.parent = null;
    }
    setProblems(problems) {
        this.problems = problems;
        let file = this;
        while (file) {
            file.onDidChangeProblems.dispatch();
            file = file.parent;
        }
    }
    getEmitOutput() {
        return __awaiter(this, void 0, void 0, function* () {
            let model = this.buffer;
            if (this.type !== FileType.TypeScript) {
                return Promise.resolve("");
            }
            const worker = yield monaco.languages.typescript.getTypeScriptWorker();
            const client = yield worker(model.uri);
            return client.getEmitOutput(model.uri.toString());
        });
    }
    setData(data, setBuffer = true) {
        this.data = data;
        let file = this;
        if (typeof data === "string") {
            if (setBuffer) {
                this.buffer.setValue(data);
            }
            this.isDirty = false;
        }
        while (file) {
            file.onDidChangeData.dispatch();
            file = file.parent;
        }
    }
    getData() {
        if (this.isDirty && !this.isBufferReadOnly) {
            let project = this.getProject();
            if (project) {
                project.onDirtyFileUsed.dispatch(this);
            }
        }
        return this.data;
    }
    getProject() {
        let parent = this.parent;
        if (parent) {
            while (parent.parent) {
                parent = parent.parent;
            }
            if (parent instanceof Project) {
                return parent;
            }
        }
        return null;
    }
    getDepth() {
        let depth = 0;
        let parent = this.parent;
        while (parent) {
            parent = parent.parent;
            depth++;
        }
        return depth;
    }
    getPath() {
        let path = [];
        let parent = this.parent;
        if (!parent) {
            return "";
        }
        while (parent.parent) {
            path.unshift(parent.name);
            parent = parent.parent;
        }
        path.push(this.name);
        return path.join("/");
    }
    save() {
        if (!this.isDirty) {
            return;
        }
        this.isDirty = false;
        this.setData(this.buffer.getValue(), false);
    }
    toString() {
        return "File [" + this.name + "]";
    }
}
exports.File = File;
class Directory extends File {
    constructor(name) {
        super(name, FileType.Directory);
        this.children = [];
        this.isOpen = true;
        this.onDidChangeChildren = new EventDispatcher("Directory Changed ");
    }
    notifyDidChangeChildren() {
        let directory = this;
        while (directory) {
            directory.onDidChangeChildren.dispatch();
            directory = directory.parent;
        }
    }
    forEachFile(fn, recurse = false) {
        if (recurse) {
            this.children.forEach((file) => {
                if (file instanceof Directory) {
                    file.forEachFile(fn, recurse);
                }
                fn(file);
            });
        }
        else {
            this.children.forEach(fn);
        }
    }
    //     function go(directory: Directory) {
    //       directory.forEachFile((file) => {
    //         if (file instanceof Directory) {
    //           go(file);
    //         } else {
    //           // let depth = file.getDepth();
    //           if (file.problems.length) {
    //             treeViewItems.push(<TreeViewItem depth={0} icon={getIconForFileType(file.type)} label={file.name}></TreeViewItem>);
    //             file.problems.forEach((problem) => {
    //               treeViewItems.push(<TreeViewProblemItem depth={1} problem={problem} />);
    //             });
    //           }
    //         }
    //       });
    //     }
    //     go(this.props.project);
    mapEachFile(fn) {
        return this.children.map(fn);
    }
    addFile(file) {
        index_1.assert(file.parent === null);
        this.children.push(file);
        file.parent = this;
        this.notifyDidChangeChildren();
    }
    removeFile(file) {
        index_1.assert(file.parent === this);
        let i = this.children.indexOf(file);
        index_1.assert(i >= 0);
        this.children.splice(i, 1);
        this.notifyDidChangeChildren();
    }
    newDirectory(path) {
        if (typeof path === "string") {
            path = path.split("/");
        }
        let directory = this;
        while (path.length) {
            let name = path.shift();
            let file = directory.getImmediateChild(name);
            if (file) {
                directory = file;
            }
            else {
                file = new Directory(name);
                directory.addFile(file);
                directory = file;
            }
        }
        index_1.assert(directory instanceof Directory);
        return directory;
    }
    newFile(path, type) {
        if (typeof path === "string") {
            path = path.split("/");
        }
        let directory = this;
        if (path.length > 1) {
            directory = this.newDirectory(path.slice(0, path.length - 1));
        }
        let name = path[path.length - 1];
        let file = directory.getFile(name);
        if (file) {
            index_1.assert(file.type == type);
        }
        else {
            file = new File(path[path.length - 1], type);
            directory.addFile(file);
        }
        return file;
    }
    getImmediateChild(name) {
        return this.children.find((file) => {
            return file.name === name;
        });
    }
    getFile(path) {
        if (typeof path === "string") {
            path = path.split("/");
        }
        let file = this.getImmediateChild(path[0]);
        if (path.length > 1) {
            if (file && file.type == FileType.Directory) {
                return file.getFile(path.slice(1));
            }
            else {
                return null;
            }
        }
        return file;
    }
    list() {
        let list = [];
        function recurse(prefix, x) {
            if (prefix) {
                prefix += "/";
            }
            x.forEachFile(file => {
                const path = prefix + file.name;
                if (file instanceof Directory) {
                    recurse(path, file);
                }
                else {
                    list.push(path);
                }
            });
        }
        recurse("", this);
        return list;
    }
    glob(pattern) {
        let mm = new minimatch_1.Minimatch(pattern);
        return this.list().filter(path => mm.match(path));
    }
    globFiles(pattern) {
        return this.glob(pattern).map(path => this.getFile(path));
    }
}
exports.Directory = Directory;
class Project extends Directory {
    constructor() {
        super("Project");
        this.onChange = new EventDispatcher("Project Change");
        this.onDirtyFileUsed = new EventDispatcher("Dirty File Used");
    }
    static run() {
        Project.onRun.dispatch();
    }
    static build() {
        Project.onBuild.dispatch();
    }
}
Project.onRun = new EventDispatcher("Project Run");
Project.onBuild = new EventDispatcher("Project Build");
exports.Project = Project;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const ReactDOM = __webpack_require__(26);
const App_1 = __webpack_require__(65);
const Test_1 = __webpack_require__(90);
function layout() {
    var event = new Event("layout");
    document.dispatchEvent(event);
}
exports.layout = layout;
function assert(c, message) {
    if (!c) {
        throw new Error(message);
    }
}
exports.assert = assert;
let nextObjectId = 0;
function objectId(o) {
    if (!o)
        return o;
    assert(typeof o === "object");
    if ("__id__" in o)
        return o.__id__;
    return o.__id__ = nextObjectId++;
}
exports.objectId = objectId;
function clamp(x, min, max) {
    return Math.min(Math.max(min, x), max);
}
exports.clamp = clamp;
window.addEventListener("resize", layout, false);
window.addEventListener("resize", () => {
    // Split.onGlobalResize.dispatch();
}, false);
function forEachUrlParameter(callback) {
    let url = window.location.search.substring(1);
    url = url.replace(/\/$/, ""); // Replace / at the end that gets inserted by browsers.
    let params = {};
    url.split('&').forEach(function (s) {
        let t = s.split('=');
        if (t.length == 2) {
            callback(t[0], decodeURIComponent(t[1]));
        }
        else {
            callback(t[0], true);
        }
    });
}
exports.forEachUrlParameter = forEachUrlParameter;
function getUrlParameters() {
    let params = {};
    forEachUrlParameter((key, value) => {
        params[key] = value;
    });
    return params;
}
exports.getUrlParameters = getUrlParameters;
;
let parameters = getUrlParameters();
let embed = parameters["embed"] === true ? true : !!parseInt(parameters["embed"]);
let fiddle = parameters["fiddle"] || parameters["f"];
(window['require'])(['vs/editor/editor.main', 'require'], (_, require) => {
    window.Tree = require("vs/base/parts/tree/browser/treeImpl").Tree;
    window.ContextMenuService = require("vs/platform/contextview/browser/contextMenuService").ContextMenuService;
    window.ContextViewService = require("vs/platform/contextview/browser/contextViewService").ContextViewService;
    window.TreeDefaults = require("vs/base/parts/tree/browser/treeDefaults");
    window.Action = require("vs/base/common/actions").Action;
    ReactDOM.render(parameters["test"] ? React.createElement(Test_1.Test, null) : React.createElement(App_1.App, { embed: embed, fiddle: fiddle }), document.getElementById("app"));
});


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.



/*<replacement>*/

var processNextTick = __webpack_require__(11);
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(6);
/*</replacement>*/

var Readable = __webpack_require__(29);
var Writable = __webpack_require__(17);

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  processNextTick(cb, err);
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = undefined;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* Copyright 2016 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// See https://github.com/WebAssembly/design/blob/master/BinaryEncoding.md
var WASM_MAGIC_NUMBER = 0x6d736100;
var WASM_SUPPORTED_EXPERIMENTAL_VERSION = 0xd;
var WASM_SUPPORTED_VERSION = 0x1;
var SectionCode;
(function (SectionCode) {
    SectionCode[SectionCode["Unknown"] = -1] = "Unknown";
    SectionCode[SectionCode["Custom"] = 0] = "Custom";
    SectionCode[SectionCode["Type"] = 1] = "Type";
    SectionCode[SectionCode["Import"] = 2] = "Import";
    SectionCode[SectionCode["Function"] = 3] = "Function";
    SectionCode[SectionCode["Table"] = 4] = "Table";
    SectionCode[SectionCode["Memory"] = 5] = "Memory";
    SectionCode[SectionCode["Global"] = 6] = "Global";
    SectionCode[SectionCode["Export"] = 7] = "Export";
    SectionCode[SectionCode["Start"] = 8] = "Start";
    SectionCode[SectionCode["Element"] = 9] = "Element";
    SectionCode[SectionCode["Code"] = 10] = "Code";
    SectionCode[SectionCode["Data"] = 11] = "Data";
})(SectionCode = exports.SectionCode || (exports.SectionCode = {}));
var OperatorCode;
(function (OperatorCode) {
    OperatorCode[OperatorCode["unreachable"] = 0] = "unreachable";
    OperatorCode[OperatorCode["nop"] = 1] = "nop";
    OperatorCode[OperatorCode["block"] = 2] = "block";
    OperatorCode[OperatorCode["loop"] = 3] = "loop";
    OperatorCode[OperatorCode["if"] = 4] = "if";
    OperatorCode[OperatorCode["else"] = 5] = "else";
    OperatorCode[OperatorCode["end"] = 11] = "end";
    OperatorCode[OperatorCode["br"] = 12] = "br";
    OperatorCode[OperatorCode["br_if"] = 13] = "br_if";
    OperatorCode[OperatorCode["br_table"] = 14] = "br_table";
    OperatorCode[OperatorCode["return"] = 15] = "return";
    OperatorCode[OperatorCode["call"] = 16] = "call";
    OperatorCode[OperatorCode["call_indirect"] = 17] = "call_indirect";
    OperatorCode[OperatorCode["drop"] = 26] = "drop";
    OperatorCode[OperatorCode["select"] = 27] = "select";
    OperatorCode[OperatorCode["get_local"] = 32] = "get_local";
    OperatorCode[OperatorCode["set_local"] = 33] = "set_local";
    OperatorCode[OperatorCode["tee_local"] = 34] = "tee_local";
    OperatorCode[OperatorCode["get_global"] = 35] = "get_global";
    OperatorCode[OperatorCode["set_global"] = 36] = "set_global";
    OperatorCode[OperatorCode["i32_load"] = 40] = "i32_load";
    OperatorCode[OperatorCode["i64_load"] = 41] = "i64_load";
    OperatorCode[OperatorCode["f32_load"] = 42] = "f32_load";
    OperatorCode[OperatorCode["f64_load"] = 43] = "f64_load";
    OperatorCode[OperatorCode["i32_load8_s"] = 44] = "i32_load8_s";
    OperatorCode[OperatorCode["i32_load8_u"] = 45] = "i32_load8_u";
    OperatorCode[OperatorCode["i32_load16_s"] = 46] = "i32_load16_s";
    OperatorCode[OperatorCode["i32_load16_u"] = 47] = "i32_load16_u";
    OperatorCode[OperatorCode["i64_load8_s"] = 48] = "i64_load8_s";
    OperatorCode[OperatorCode["i64_load8_u"] = 49] = "i64_load8_u";
    OperatorCode[OperatorCode["i64_load16_s"] = 50] = "i64_load16_s";
    OperatorCode[OperatorCode["i64_load16_u"] = 51] = "i64_load16_u";
    OperatorCode[OperatorCode["i64_load32_s"] = 52] = "i64_load32_s";
    OperatorCode[OperatorCode["i64_load32_u"] = 53] = "i64_load32_u";
    OperatorCode[OperatorCode["i32_store"] = 54] = "i32_store";
    OperatorCode[OperatorCode["i64_store"] = 55] = "i64_store";
    OperatorCode[OperatorCode["f32_store"] = 56] = "f32_store";
    OperatorCode[OperatorCode["f64_store"] = 57] = "f64_store";
    OperatorCode[OperatorCode["i32_store8"] = 58] = "i32_store8";
    OperatorCode[OperatorCode["i32_store16"] = 59] = "i32_store16";
    OperatorCode[OperatorCode["i64_store8"] = 60] = "i64_store8";
    OperatorCode[OperatorCode["i64_store16"] = 61] = "i64_store16";
    OperatorCode[OperatorCode["i64_store32"] = 62] = "i64_store32";
    OperatorCode[OperatorCode["current_memory"] = 63] = "current_memory";
    OperatorCode[OperatorCode["grow_memory"] = 64] = "grow_memory";
    OperatorCode[OperatorCode["i32_const"] = 65] = "i32_const";
    OperatorCode[OperatorCode["i64_const"] = 66] = "i64_const";
    OperatorCode[OperatorCode["f32_const"] = 67] = "f32_const";
    OperatorCode[OperatorCode["f64_const"] = 68] = "f64_const";
    OperatorCode[OperatorCode["i32_eqz"] = 69] = "i32_eqz";
    OperatorCode[OperatorCode["i32_eq"] = 70] = "i32_eq";
    OperatorCode[OperatorCode["i32_ne"] = 71] = "i32_ne";
    OperatorCode[OperatorCode["i32_lt_s"] = 72] = "i32_lt_s";
    OperatorCode[OperatorCode["i32_lt_u"] = 73] = "i32_lt_u";
    OperatorCode[OperatorCode["i32_gt_s"] = 74] = "i32_gt_s";
    OperatorCode[OperatorCode["i32_gt_u"] = 75] = "i32_gt_u";
    OperatorCode[OperatorCode["i32_le_s"] = 76] = "i32_le_s";
    OperatorCode[OperatorCode["i32_le_u"] = 77] = "i32_le_u";
    OperatorCode[OperatorCode["i32_ge_s"] = 78] = "i32_ge_s";
    OperatorCode[OperatorCode["i32_ge_u"] = 79] = "i32_ge_u";
    OperatorCode[OperatorCode["i64_eqz"] = 80] = "i64_eqz";
    OperatorCode[OperatorCode["i64_eq"] = 81] = "i64_eq";
    OperatorCode[OperatorCode["i64_ne"] = 82] = "i64_ne";
    OperatorCode[OperatorCode["i64_lt_s"] = 83] = "i64_lt_s";
    OperatorCode[OperatorCode["i64_lt_u"] = 84] = "i64_lt_u";
    OperatorCode[OperatorCode["i64_gt_s"] = 85] = "i64_gt_s";
    OperatorCode[OperatorCode["i64_gt_u"] = 86] = "i64_gt_u";
    OperatorCode[OperatorCode["i64_le_s"] = 87] = "i64_le_s";
    OperatorCode[OperatorCode["i64_le_u"] = 88] = "i64_le_u";
    OperatorCode[OperatorCode["i64_ge_s"] = 89] = "i64_ge_s";
    OperatorCode[OperatorCode["i64_ge_u"] = 90] = "i64_ge_u";
    OperatorCode[OperatorCode["f32_eq"] = 91] = "f32_eq";
    OperatorCode[OperatorCode["f32_ne"] = 92] = "f32_ne";
    OperatorCode[OperatorCode["f32_lt"] = 93] = "f32_lt";
    OperatorCode[OperatorCode["f32_gt"] = 94] = "f32_gt";
    OperatorCode[OperatorCode["f32_le"] = 95] = "f32_le";
    OperatorCode[OperatorCode["f32_ge"] = 96] = "f32_ge";
    OperatorCode[OperatorCode["f64_eq"] = 97] = "f64_eq";
    OperatorCode[OperatorCode["f64_ne"] = 98] = "f64_ne";
    OperatorCode[OperatorCode["f64_lt"] = 99] = "f64_lt";
    OperatorCode[OperatorCode["f64_gt"] = 100] = "f64_gt";
    OperatorCode[OperatorCode["f64_le"] = 101] = "f64_le";
    OperatorCode[OperatorCode["f64_ge"] = 102] = "f64_ge";
    OperatorCode[OperatorCode["i32_clz"] = 103] = "i32_clz";
    OperatorCode[OperatorCode["i32_ctz"] = 104] = "i32_ctz";
    OperatorCode[OperatorCode["i32_popcnt"] = 105] = "i32_popcnt";
    OperatorCode[OperatorCode["i32_add"] = 106] = "i32_add";
    OperatorCode[OperatorCode["i32_sub"] = 107] = "i32_sub";
    OperatorCode[OperatorCode["i32_mul"] = 108] = "i32_mul";
    OperatorCode[OperatorCode["i32_div_s"] = 109] = "i32_div_s";
    OperatorCode[OperatorCode["i32_div_u"] = 110] = "i32_div_u";
    OperatorCode[OperatorCode["i32_rem_s"] = 111] = "i32_rem_s";
    OperatorCode[OperatorCode["i32_rem_u"] = 112] = "i32_rem_u";
    OperatorCode[OperatorCode["i32_and"] = 113] = "i32_and";
    OperatorCode[OperatorCode["i32_or"] = 114] = "i32_or";
    OperatorCode[OperatorCode["i32_xor"] = 115] = "i32_xor";
    OperatorCode[OperatorCode["i32_shl"] = 116] = "i32_shl";
    OperatorCode[OperatorCode["i32_shr_s"] = 117] = "i32_shr_s";
    OperatorCode[OperatorCode["i32_shr_u"] = 118] = "i32_shr_u";
    OperatorCode[OperatorCode["i32_rotl"] = 119] = "i32_rotl";
    OperatorCode[OperatorCode["i32_rotr"] = 120] = "i32_rotr";
    OperatorCode[OperatorCode["i64_clz"] = 121] = "i64_clz";
    OperatorCode[OperatorCode["i64_ctz"] = 122] = "i64_ctz";
    OperatorCode[OperatorCode["i64_popcnt"] = 123] = "i64_popcnt";
    OperatorCode[OperatorCode["i64_add"] = 124] = "i64_add";
    OperatorCode[OperatorCode["i64_sub"] = 125] = "i64_sub";
    OperatorCode[OperatorCode["i64_mul"] = 126] = "i64_mul";
    OperatorCode[OperatorCode["i64_div_s"] = 127] = "i64_div_s";
    OperatorCode[OperatorCode["i64_div_u"] = 128] = "i64_div_u";
    OperatorCode[OperatorCode["i64_rem_s"] = 129] = "i64_rem_s";
    OperatorCode[OperatorCode["i64_rem_u"] = 130] = "i64_rem_u";
    OperatorCode[OperatorCode["i64_and"] = 131] = "i64_and";
    OperatorCode[OperatorCode["i64_or"] = 132] = "i64_or";
    OperatorCode[OperatorCode["i64_xor"] = 133] = "i64_xor";
    OperatorCode[OperatorCode["i64_shl"] = 134] = "i64_shl";
    OperatorCode[OperatorCode["i64_shr_s"] = 135] = "i64_shr_s";
    OperatorCode[OperatorCode["i64_shr_u"] = 136] = "i64_shr_u";
    OperatorCode[OperatorCode["i64_rotl"] = 137] = "i64_rotl";
    OperatorCode[OperatorCode["i64_rotr"] = 138] = "i64_rotr";
    OperatorCode[OperatorCode["f32_abs"] = 139] = "f32_abs";
    OperatorCode[OperatorCode["f32_neg"] = 140] = "f32_neg";
    OperatorCode[OperatorCode["f32_ceil"] = 141] = "f32_ceil";
    OperatorCode[OperatorCode["f32_floor"] = 142] = "f32_floor";
    OperatorCode[OperatorCode["f32_trunc"] = 143] = "f32_trunc";
    OperatorCode[OperatorCode["f32_nearest"] = 144] = "f32_nearest";
    OperatorCode[OperatorCode["f32_sqrt"] = 145] = "f32_sqrt";
    OperatorCode[OperatorCode["f32_add"] = 146] = "f32_add";
    OperatorCode[OperatorCode["f32_sub"] = 147] = "f32_sub";
    OperatorCode[OperatorCode["f32_mul"] = 148] = "f32_mul";
    OperatorCode[OperatorCode["f32_div"] = 149] = "f32_div";
    OperatorCode[OperatorCode["f32_min"] = 150] = "f32_min";
    OperatorCode[OperatorCode["f32_max"] = 151] = "f32_max";
    OperatorCode[OperatorCode["f32_copysign"] = 152] = "f32_copysign";
    OperatorCode[OperatorCode["f64_abs"] = 153] = "f64_abs";
    OperatorCode[OperatorCode["f64_neg"] = 154] = "f64_neg";
    OperatorCode[OperatorCode["f64_ceil"] = 155] = "f64_ceil";
    OperatorCode[OperatorCode["f64_floor"] = 156] = "f64_floor";
    OperatorCode[OperatorCode["f64_trunc"] = 157] = "f64_trunc";
    OperatorCode[OperatorCode["f64_nearest"] = 158] = "f64_nearest";
    OperatorCode[OperatorCode["f64_sqrt"] = 159] = "f64_sqrt";
    OperatorCode[OperatorCode["f64_add"] = 160] = "f64_add";
    OperatorCode[OperatorCode["f64_sub"] = 161] = "f64_sub";
    OperatorCode[OperatorCode["f64_mul"] = 162] = "f64_mul";
    OperatorCode[OperatorCode["f64_div"] = 163] = "f64_div";
    OperatorCode[OperatorCode["f64_min"] = 164] = "f64_min";
    OperatorCode[OperatorCode["f64_max"] = 165] = "f64_max";
    OperatorCode[OperatorCode["f64_copysign"] = 166] = "f64_copysign";
    OperatorCode[OperatorCode["i32_wrap_i64"] = 167] = "i32_wrap_i64";
    OperatorCode[OperatorCode["i32_trunc_s_f32"] = 168] = "i32_trunc_s_f32";
    OperatorCode[OperatorCode["i32_trunc_u_f32"] = 169] = "i32_trunc_u_f32";
    OperatorCode[OperatorCode["i32_trunc_s_f64"] = 170] = "i32_trunc_s_f64";
    OperatorCode[OperatorCode["i32_trunc_u_f64"] = 171] = "i32_trunc_u_f64";
    OperatorCode[OperatorCode["i64_extend_s_i32"] = 172] = "i64_extend_s_i32";
    OperatorCode[OperatorCode["i64_extend_u_i32"] = 173] = "i64_extend_u_i32";
    OperatorCode[OperatorCode["i64_trunc_s_f32"] = 174] = "i64_trunc_s_f32";
    OperatorCode[OperatorCode["i64_trunc_u_f32"] = 175] = "i64_trunc_u_f32";
    OperatorCode[OperatorCode["i64_trunc_s_f64"] = 176] = "i64_trunc_s_f64";
    OperatorCode[OperatorCode["i64_trunc_u_f64"] = 177] = "i64_trunc_u_f64";
    OperatorCode[OperatorCode["f32_convert_s_i32"] = 178] = "f32_convert_s_i32";
    OperatorCode[OperatorCode["f32_convert_u_i32"] = 179] = "f32_convert_u_i32";
    OperatorCode[OperatorCode["f32_convert_s_i64"] = 180] = "f32_convert_s_i64";
    OperatorCode[OperatorCode["f32_convert_u_i64"] = 181] = "f32_convert_u_i64";
    OperatorCode[OperatorCode["f32_demote_f64"] = 182] = "f32_demote_f64";
    OperatorCode[OperatorCode["f64_convert_s_i32"] = 183] = "f64_convert_s_i32";
    OperatorCode[OperatorCode["f64_convert_u_i32"] = 184] = "f64_convert_u_i32";
    OperatorCode[OperatorCode["f64_convert_s_i64"] = 185] = "f64_convert_s_i64";
    OperatorCode[OperatorCode["f64_convert_u_i64"] = 186] = "f64_convert_u_i64";
    OperatorCode[OperatorCode["f64_promote_f32"] = 187] = "f64_promote_f32";
    OperatorCode[OperatorCode["i32_reinterpret_f32"] = 188] = "i32_reinterpret_f32";
    OperatorCode[OperatorCode["i64_reinterpret_f64"] = 189] = "i64_reinterpret_f64";
    OperatorCode[OperatorCode["f32_reinterpret_i32"] = 190] = "f32_reinterpret_i32";
    OperatorCode[OperatorCode["f64_reinterpret_i64"] = 191] = "f64_reinterpret_i64";
    OperatorCode[OperatorCode["i32_extend8_s"] = 192] = "i32_extend8_s";
    OperatorCode[OperatorCode["i32_extend16_s"] = 193] = "i32_extend16_s";
    OperatorCode[OperatorCode["i64_extend8_s"] = 194] = "i64_extend8_s";
    OperatorCode[OperatorCode["i64_extend16_s"] = 195] = "i64_extend16_s";
    OperatorCode[OperatorCode["i64_extend32_s"] = 196] = "i64_extend32_s";
    OperatorCode[OperatorCode["prefix_0xfc"] = 252] = "prefix_0xfc";
    OperatorCode[OperatorCode["prefix_0xfe"] = 254] = "prefix_0xfe";
    OperatorCode[OperatorCode["i32_trunc_s_sat_f32"] = 64512] = "i32_trunc_s_sat_f32";
    OperatorCode[OperatorCode["i32_trunc_u_sat_f32"] = 64513] = "i32_trunc_u_sat_f32";
    OperatorCode[OperatorCode["i32_trunc_s_sat_f64"] = 64514] = "i32_trunc_s_sat_f64";
    OperatorCode[OperatorCode["i32_trunc_u_sat_f64"] = 64515] = "i32_trunc_u_sat_f64";
    OperatorCode[OperatorCode["i64_trunc_s_sat_f32"] = 64516] = "i64_trunc_s_sat_f32";
    OperatorCode[OperatorCode["i64_trunc_u_sat_f32"] = 64517] = "i64_trunc_u_sat_f32";
    OperatorCode[OperatorCode["i64_trunc_s_sat_f64"] = 64518] = "i64_trunc_s_sat_f64";
    OperatorCode[OperatorCode["i64_trunc_u_sat_f64"] = 64519] = "i64_trunc_u_sat_f64";
    OperatorCode[OperatorCode["atomic_wake"] = 65024] = "atomic_wake";
    OperatorCode[OperatorCode["i32_atomic_wait"] = 65025] = "i32_atomic_wait";
    OperatorCode[OperatorCode["i64_atomic_wait"] = 65026] = "i64_atomic_wait";
    OperatorCode[OperatorCode["i32_atomic_load"] = 65040] = "i32_atomic_load";
    OperatorCode[OperatorCode["i64_atomic_load"] = 65041] = "i64_atomic_load";
    OperatorCode[OperatorCode["i32_atomic_load8_u"] = 65042] = "i32_atomic_load8_u";
    OperatorCode[OperatorCode["i32_atomic_load16_u"] = 65043] = "i32_atomic_load16_u";
    OperatorCode[OperatorCode["i64_atomic_load8_u"] = 65044] = "i64_atomic_load8_u";
    OperatorCode[OperatorCode["i64_atomic_load16_u"] = 65045] = "i64_atomic_load16_u";
    OperatorCode[OperatorCode["i64_atomic_load32_u"] = 65046] = "i64_atomic_load32_u";
    OperatorCode[OperatorCode["i32_atomic_store"] = 65047] = "i32_atomic_store";
    OperatorCode[OperatorCode["i64_atomic_store"] = 65048] = "i64_atomic_store";
    OperatorCode[OperatorCode["i32_atomic_store8"] = 65049] = "i32_atomic_store8";
    OperatorCode[OperatorCode["i32_atomic_store16"] = 65050] = "i32_atomic_store16";
    OperatorCode[OperatorCode["i64_atomic_store8"] = 65051] = "i64_atomic_store8";
    OperatorCode[OperatorCode["i64_atomic_store16"] = 65052] = "i64_atomic_store16";
    OperatorCode[OperatorCode["i64_atomic_store32"] = 65053] = "i64_atomic_store32";
    OperatorCode[OperatorCode["i32_atomic_rmw_add"] = 65054] = "i32_atomic_rmw_add";
    OperatorCode[OperatorCode["i64_atomic_rmw_add"] = 65055] = "i64_atomic_rmw_add";
    OperatorCode[OperatorCode["i32_atomic_rmw8_u_add"] = 65056] = "i32_atomic_rmw8_u_add";
    OperatorCode[OperatorCode["i32_atomic_rmw16_u_add"] = 65057] = "i32_atomic_rmw16_u_add";
    OperatorCode[OperatorCode["i64_atomic_rmw8_u_add"] = 65058] = "i64_atomic_rmw8_u_add";
    OperatorCode[OperatorCode["i64_atomic_rmw16_u_add"] = 65059] = "i64_atomic_rmw16_u_add";
    OperatorCode[OperatorCode["i64_atomic_rmw32_u_add"] = 65060] = "i64_atomic_rmw32_u_add";
    OperatorCode[OperatorCode["i32_atomic_rmw_sub"] = 65061] = "i32_atomic_rmw_sub";
    OperatorCode[OperatorCode["i64_atomic_rmw_sub"] = 65062] = "i64_atomic_rmw_sub";
    OperatorCode[OperatorCode["i32_atomic_rmw8_u_sub"] = 65063] = "i32_atomic_rmw8_u_sub";
    OperatorCode[OperatorCode["i32_atomic_rmw16_u_sub"] = 65064] = "i32_atomic_rmw16_u_sub";
    OperatorCode[OperatorCode["i64_atomic_rmw8_u_sub"] = 65065] = "i64_atomic_rmw8_u_sub";
    OperatorCode[OperatorCode["i64_atomic_rmw16_u_sub"] = 65066] = "i64_atomic_rmw16_u_sub";
    OperatorCode[OperatorCode["i64_atomic_rmw32_u_sub"] = 65067] = "i64_atomic_rmw32_u_sub";
    OperatorCode[OperatorCode["i32_atomic_rmw_and"] = 65068] = "i32_atomic_rmw_and";
    OperatorCode[OperatorCode["i64_atomic_rmw_and"] = 65069] = "i64_atomic_rmw_and";
    OperatorCode[OperatorCode["i32_atomic_rmw8_u_and"] = 65070] = "i32_atomic_rmw8_u_and";
    OperatorCode[OperatorCode["i32_atomic_rmw16_u_and"] = 65071] = "i32_atomic_rmw16_u_and";
    OperatorCode[OperatorCode["i64_atomic_rmw8_u_and"] = 65072] = "i64_atomic_rmw8_u_and";
    OperatorCode[OperatorCode["i64_atomic_rmw16_u_and"] = 65073] = "i64_atomic_rmw16_u_and";
    OperatorCode[OperatorCode["i64_atomic_rmw32_u_and"] = 65074] = "i64_atomic_rmw32_u_and";
    OperatorCode[OperatorCode["i32_atomic_rmw_or"] = 65075] = "i32_atomic_rmw_or";
    OperatorCode[OperatorCode["i64_atomic_rmw_or"] = 65076] = "i64_atomic_rmw_or";
    OperatorCode[OperatorCode["i32_atomic_rmw8_u_or"] = 65077] = "i32_atomic_rmw8_u_or";
    OperatorCode[OperatorCode["i32_atomic_rmw16_u_or"] = 65078] = "i32_atomic_rmw16_u_or";
    OperatorCode[OperatorCode["i64_atomic_rmw8_u_or"] = 65079] = "i64_atomic_rmw8_u_or";
    OperatorCode[OperatorCode["i64_atomic_rmw16_u_or"] = 65080] = "i64_atomic_rmw16_u_or";
    OperatorCode[OperatorCode["i64_atomic_rmw32_u_or"] = 65081] = "i64_atomic_rmw32_u_or";
    OperatorCode[OperatorCode["i32_atomic_rmw_xor"] = 65082] = "i32_atomic_rmw_xor";
    OperatorCode[OperatorCode["i64_atomic_rmw_xor"] = 65083] = "i64_atomic_rmw_xor";
    OperatorCode[OperatorCode["i32_atomic_rmw8_u_xor"] = 65084] = "i32_atomic_rmw8_u_xor";
    OperatorCode[OperatorCode["i32_atomic_rmw16_u_xor"] = 65085] = "i32_atomic_rmw16_u_xor";
    OperatorCode[OperatorCode["i64_atomic_rmw8_u_xor"] = 65086] = "i64_atomic_rmw8_u_xor";
    OperatorCode[OperatorCode["i64_atomic_rmw16_u_xor"] = 65087] = "i64_atomic_rmw16_u_xor";
    OperatorCode[OperatorCode["i64_atomic_rmw32_u_xor"] = 65088] = "i64_atomic_rmw32_u_xor";
    OperatorCode[OperatorCode["i32_atomic_rmw_xchg"] = 65089] = "i32_atomic_rmw_xchg";
    OperatorCode[OperatorCode["i64_atomic_rmw_xchg"] = 65090] = "i64_atomic_rmw_xchg";
    OperatorCode[OperatorCode["i32_atomic_rmw8_u_xchg"] = 65091] = "i32_atomic_rmw8_u_xchg";
    OperatorCode[OperatorCode["i32_atomic_rmw16_u_xchg"] = 65092] = "i32_atomic_rmw16_u_xchg";
    OperatorCode[OperatorCode["i64_atomic_rmw8_u_xchg"] = 65093] = "i64_atomic_rmw8_u_xchg";
    OperatorCode[OperatorCode["i64_atomic_rmw16_u_xchg"] = 65094] = "i64_atomic_rmw16_u_xchg";
    OperatorCode[OperatorCode["i64_atomic_rmw32_u_xchg"] = 65095] = "i64_atomic_rmw32_u_xchg";
    OperatorCode[OperatorCode["i32_atomic_rmw_cmpxchg"] = 65096] = "i32_atomic_rmw_cmpxchg";
    OperatorCode[OperatorCode["i64_atomic_rmw_cmpxchg"] = 65097] = "i64_atomic_rmw_cmpxchg";
    OperatorCode[OperatorCode["i32_atomic_rmw8_u_cmpxchg"] = 65098] = "i32_atomic_rmw8_u_cmpxchg";
    OperatorCode[OperatorCode["i32_atomic_rmw16_u_cmpxchg"] = 65099] = "i32_atomic_rmw16_u_cmpxchg";
    OperatorCode[OperatorCode["i64_atomic_rmw8_u_cmpxchg"] = 65100] = "i64_atomic_rmw8_u_cmpxchg";
    OperatorCode[OperatorCode["i64_atomic_rmw16_u_cmpxchg"] = 65101] = "i64_atomic_rmw16_u_cmpxchg";
    OperatorCode[OperatorCode["i64_atomic_rmw32_u_cmpxchg"] = 65102] = "i64_atomic_rmw32_u_cmpxchg";
})(OperatorCode = exports.OperatorCode || (exports.OperatorCode = {}));
;
exports.OperatorCodeNames = [
    "unreachable", "nop", "block", "loop", "if", "else", undefined, undefined, undefined, undefined, undefined, "end", "br", "br_if", "br_table", "return", "call", "call_indirect", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "drop", "select", undefined, undefined, undefined, undefined, "get_local", "set_local", "tee_local", "get_global", "set_global", undefined, undefined, undefined, "i32.load", "i64.load", "f32.load", "f64.load", "i32.load8_s", "i32.load8_u", "i32.load16_s", "i32.load16_u", "i64.load8_s", "i64.load8_u", "i64.load16_s", "i64.load16_u", "i64.load32_s", "i64.load32_u", "i32.store", "i64.store", "f32.store", "f64.store", "i32.store8", "i32.store16", "i64.store8", "i64.store16", "i64.store32", "current_memory", "grow_memory", "i32.const", "i64.const", "f32.const", "f64.const", "i32.eqz", "i32.eq", "i32.ne", "i32.lt_s", "i32.lt_u", "i32.gt_s", "i32.gt_u", "i32.le_s", "i32.le_u", "i32.ge_s", "i32.ge_u", "i64.eqz", "i64.eq", "i64.ne", "i64.lt_s", "i64.lt_u", "i64.gt_s", "i64.gt_u", "i64.le_s", "i64.le_u", "i64.ge_s", "i64.ge_u", "f32.eq", "f32.ne", "f32.lt", "f32.gt", "f32.le", "f32.ge", "f64.eq", "f64.ne", "f64.lt", "f64.gt", "f64.le", "f64.ge", "i32.clz", "i32.ctz", "i32.popcnt", "i32.add", "i32.sub", "i32.mul", "i32.div_s", "i32.div_u", "i32.rem_s", "i32.rem_u", "i32.and", "i32.or", "i32.xor", "i32.shl", "i32.shr_s", "i32.shr_u", "i32.rotl", "i32.rotr", "i64.clz", "i64.ctz", "i64.popcnt", "i64.add", "i64.sub", "i64.mul", "i64.div_s", "i64.div_u", "i64.rem_s", "i64.rem_u", "i64.and", "i64.or", "i64.xor", "i64.shl", "i64.shr_s", "i64.shr_u", "i64.rotl", "i64.rotr", "f32.abs", "f32.neg", "f32.ceil", "f32.floor", "f32.trunc", "f32.nearest", "f32.sqrt", "f32.add", "f32.sub", "f32.mul", "f32.div", "f32.min", "f32.max", "f32.copysign", "f64.abs", "f64.neg", "f64.ceil", "f64.floor", "f64.trunc", "f64.nearest", "f64.sqrt", "f64.add", "f64.sub", "f64.mul", "f64.div", "f64.min", "f64.max", "f64.copysign", "i32.wrap/i64", "i32.trunc_s/f32", "i32.trunc_u/f32", "i32.trunc_s/f64", "i32.trunc_u/f64", "i64.extend_s/i32", "i64.extend_u/i32", "i64.trunc_s/f32", "i64.trunc_u/f32", "i64.trunc_s/f64", "i64.trunc_u/f64", "f32.convert_s/i32", "f32.convert_u/i32", "f32.convert_s/i64", "f32.convert_u/i64", "f32.demote/f64", "f64.convert_s/i32", "f64.convert_u/i32", "f64.convert_s/i64", "f64.convert_u/i64", "f64.promote/f32", "i32.reinterpret/f32", "i64.reinterpret/f64", "f32.reinterpret/i32", "f64.reinterpret/i64", "i32.extend8_s", "i32.extend16_s", "i64.extend8_s", "i64.extend16_s", "i64.extend32_s", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined
];
["i32.trunc_s:sat/f32", "i32.trunc_u:sat/f32", "i32.trunc_s:sat/f64", "i32.trunc_u:sat/f64", "i64.trunc_s:sat/f32", "i64.trunc_u:sat/f32", "i64.trunc_s:sat/f64", "i64.trunc_u:sat/f64"].forEach(function (s, i) {
    exports.OperatorCodeNames[0xfc00 | i] = s;
});
["atomic.wake", "i32.atomic.wait", "i64.atomic.wait", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "i32.atomic.load", "i64.atomic.load", "i32.atomic.load8_u", "i32.atomic.load16_u", "i64.atomic.load8_u", "i64.atomic.load16_u", "i64.atomic.load32_u", "i32.atomic.store", "i64.atomic.store", "i32.atomic.store8", "i32.atomic.store16", "i64.atomic.store8", "i64.atomic.store16", "i64.atomic.store32", "i32.atomic.rmw.add", "i64.atomic.rmw.add", "i32.atomic.rmw8_u.add", "i32.atomic.rmw16_u.add", "i64.atomic.rmw8_u.add", "i64.atomic.rmw16_u.add", "i64.atomic.rmw32_u.add", "i32.atomic.rmw.sub", "i64.atomic.rmw.sub", "i32.atomic.rmw8_u.sub", "i32.atomic.rmw16_u.sub", "i64.atomic.rmw8_u.sub", "i64.atomic.rmw16_u.sub", "i64.atomic.rmw32_u.sub", "i32.atomic.rmw.and", "i64.atomic.rmw.and", "i32.atomic.rmw8_u.and", "i32.atomic.rmw16_u.and", "i64.atomic.rmw8_u.and", "i64.atomic.rmw16_u.and", "i64.atomic.rmw32_u.and", "i32.atomic.rmw.or", "i64.atomic.rmw.or", "i32.atomic.rmw8_u.or", "i32.atomic.rmw16_u.or", "i64.atomic.rmw8_u.or", "i64.atomic.rmw16_u.or", "i64.atomic.rmw32_u.or", "i32.atomic.rmw.xor", "i64.atomic.rmw.xor", "i32.atomic.rmw8_u.xor", "i32.atomic.rmw16_u.xor", "i64.atomic.rmw8_u.xor", "i64.atomic.rmw16_u.xor", "i64.atomic.rmw32_u.xor", "i32.atomic.rmw.xchg", "i64.atomic.rmw.xchg", "i32.atomic.rmw8_u.xchg", "i32.atomic.rmw16_u.xchg", "i64.atomic.rmw8_u.xchg", "i64.atomic.rmw16_u.xchg", "i64.atomic.rmw32_u.xchg", "i32.atomic.rmw.cmpxchg", "i64.atomic.rmw.cmpxchg", "i32.atomic.rmw8_u.cmpxchg", "i32.atomic.rmw16_u.cmpxchg", "i64.atomic.rmw8_u.cmpxchg", "i64.atomic.rmw16_u.cmpxchg", "i64.atomic.rmw32_u.cmpxchg"].forEach(function (s, i) {
    exports.OperatorCodeNames[0xfe00 | i] = s;
});
var ExternalKind;
(function (ExternalKind) {
    ExternalKind[ExternalKind["Function"] = 0] = "Function";
    ExternalKind[ExternalKind["Table"] = 1] = "Table";
    ExternalKind[ExternalKind["Memory"] = 2] = "Memory";
    ExternalKind[ExternalKind["Global"] = 3] = "Global";
})(ExternalKind = exports.ExternalKind || (exports.ExternalKind = {}));
var Type;
(function (Type) {
    Type[Type["i32"] = -1] = "i32";
    Type[Type["i64"] = -2] = "i64";
    Type[Type["f32"] = -3] = "f32";
    Type[Type["f64"] = -4] = "f64";
    Type[Type["anyfunc"] = -16] = "anyfunc";
    Type[Type["func"] = -32] = "func";
    Type[Type["empty_block_type"] = -64] = "empty_block_type";
})(Type = exports.Type || (exports.Type = {}));
var RelocType;
(function (RelocType) {
    RelocType[RelocType["FunctionIndex_LEB"] = 0] = "FunctionIndex_LEB";
    RelocType[RelocType["TableIndex_SLEB"] = 1] = "TableIndex_SLEB";
    RelocType[RelocType["TableIndex_I32"] = 2] = "TableIndex_I32";
    RelocType[RelocType["GlobalAddr_LEB"] = 3] = "GlobalAddr_LEB";
    RelocType[RelocType["GlobalAddr_SLEB"] = 4] = "GlobalAddr_SLEB";
    RelocType[RelocType["GlobalAddr_I32"] = 5] = "GlobalAddr_I32";
    RelocType[RelocType["TypeIndex_LEB"] = 6] = "TypeIndex_LEB";
    RelocType[RelocType["GlobalIndex_LEB"] = 7] = "GlobalIndex_LEB";
})(RelocType = exports.RelocType || (exports.RelocType = {}));
var LinkingType;
(function (LinkingType) {
    LinkingType[LinkingType["StackPointer"] = 1] = "StackPointer";
})(LinkingType = exports.LinkingType || (exports.LinkingType = {}));
var NameType;
(function (NameType) {
    NameType[NameType["Module"] = 0] = "Module";
    NameType[NameType["Function"] = 1] = "Function";
    NameType[NameType["Local"] = 2] = "Local";
})(NameType = exports.NameType || (exports.NameType = {}));
var BinaryReaderState;
(function (BinaryReaderState) {
    BinaryReaderState[BinaryReaderState["ERROR"] = -1] = "ERROR";
    BinaryReaderState[BinaryReaderState["INITIAL"] = 0] = "INITIAL";
    BinaryReaderState[BinaryReaderState["BEGIN_WASM"] = 1] = "BEGIN_WASM";
    BinaryReaderState[BinaryReaderState["END_WASM"] = 2] = "END_WASM";
    BinaryReaderState[BinaryReaderState["BEGIN_SECTION"] = 3] = "BEGIN_SECTION";
    BinaryReaderState[BinaryReaderState["END_SECTION"] = 4] = "END_SECTION";
    BinaryReaderState[BinaryReaderState["SKIPPING_SECTION"] = 5] = "SKIPPING_SECTION";
    BinaryReaderState[BinaryReaderState["READING_SECTION_RAW_DATA"] = 6] = "READING_SECTION_RAW_DATA";
    BinaryReaderState[BinaryReaderState["SECTION_RAW_DATA"] = 7] = "SECTION_RAW_DATA";
    BinaryReaderState[BinaryReaderState["TYPE_SECTION_ENTRY"] = 11] = "TYPE_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["IMPORT_SECTION_ENTRY"] = 12] = "IMPORT_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["FUNCTION_SECTION_ENTRY"] = 13] = "FUNCTION_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["TABLE_SECTION_ENTRY"] = 14] = "TABLE_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["MEMORY_SECTION_ENTRY"] = 15] = "MEMORY_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["GLOBAL_SECTION_ENTRY"] = 16] = "GLOBAL_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["EXPORT_SECTION_ENTRY"] = 17] = "EXPORT_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["DATA_SECTION_ENTRY"] = 18] = "DATA_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["NAME_SECTION_ENTRY"] = 19] = "NAME_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["ELEMENT_SECTION_ENTRY"] = 20] = "ELEMENT_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["LINKING_SECTION_ENTRY"] = 21] = "LINKING_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["START_SECTION_ENTRY"] = 22] = "START_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["BEGIN_INIT_EXPRESSION_BODY"] = 25] = "BEGIN_INIT_EXPRESSION_BODY";
    BinaryReaderState[BinaryReaderState["INIT_EXPRESSION_OPERATOR"] = 26] = "INIT_EXPRESSION_OPERATOR";
    BinaryReaderState[BinaryReaderState["END_INIT_EXPRESSION_BODY"] = 27] = "END_INIT_EXPRESSION_BODY";
    BinaryReaderState[BinaryReaderState["BEGIN_FUNCTION_BODY"] = 28] = "BEGIN_FUNCTION_BODY";
    BinaryReaderState[BinaryReaderState["READING_FUNCTION_HEADER"] = 29] = "READING_FUNCTION_HEADER";
    BinaryReaderState[BinaryReaderState["CODE_OPERATOR"] = 30] = "CODE_OPERATOR";
    BinaryReaderState[BinaryReaderState["END_FUNCTION_BODY"] = 31] = "END_FUNCTION_BODY";
    BinaryReaderState[BinaryReaderState["SKIPPING_FUNCTION_BODY"] = 32] = "SKIPPING_FUNCTION_BODY";
    BinaryReaderState[BinaryReaderState["BEGIN_ELEMENT_SECTION_ENTRY"] = 33] = "BEGIN_ELEMENT_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["ELEMENT_SECTION_ENTRY_BODY"] = 34] = "ELEMENT_SECTION_ENTRY_BODY";
    BinaryReaderState[BinaryReaderState["END_ELEMENT_SECTION_ENTRY"] = 35] = "END_ELEMENT_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["BEGIN_DATA_SECTION_ENTRY"] = 36] = "BEGIN_DATA_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["DATA_SECTION_ENTRY_BODY"] = 37] = "DATA_SECTION_ENTRY_BODY";
    BinaryReaderState[BinaryReaderState["END_DATA_SECTION_ENTRY"] = 38] = "END_DATA_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["BEGIN_GLOBAL_SECTION_ENTRY"] = 39] = "BEGIN_GLOBAL_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["END_GLOBAL_SECTION_ENTRY"] = 40] = "END_GLOBAL_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["RELOC_SECTION_HEADER"] = 41] = "RELOC_SECTION_HEADER";
    BinaryReaderState[BinaryReaderState["RELOC_SECTION_ENTRY"] = 42] = "RELOC_SECTION_ENTRY";
    BinaryReaderState[BinaryReaderState["SOURCE_MAPPING_URL"] = 43] = "SOURCE_MAPPING_URL";
})(BinaryReaderState = exports.BinaryReaderState || (exports.BinaryReaderState = {}));
var DataRange = (function () {
    function DataRange(start, end) {
        this.start = start;
        this.end = end;
    }
    DataRange.prototype.offset = function (delta) {
        this.start += delta;
        this.end += delta;
    };
    return DataRange;
}());
var Int64 = (function () {
    function Int64(data) {
        this._data = data || new Uint8Array(8);
    }
    Int64.prototype.toInt32 = function () {
        return this._data[0] | (this._data[1] << 8) | (this._data[2] << 16) | (this._data[3] << 24);
    };
    Int64.prototype.toDouble = function () {
        var power = 1;
        var sum;
        if (this._data[7] & 0x80) {
            sum = -1;
            for (var i = 0; i < 8; i++, power *= 256)
                sum -= power * (0xFF ^ this._data[i]);
        }
        else {
            sum = 0;
            for (var i = 0; i < 8; i++, power *= 256)
                sum += power * this._data[i];
        }
        return sum;
    };
    Object.defineProperty(Int64.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    return Int64;
}());
exports.Int64 = Int64;
var BinaryReader = (function () {
    function BinaryReader() {
        this._data = null;
        this._pos = 0;
        this._length = 0;
        this._eof = false;
        this.state = 0 /* INITIAL */;
        this.result = null;
        this.error = null;
        this._sectionEntriesLeft = 0;
        this._sectionId = -1 /* Unknown */;
        this._sectionRange = null;
        this._functionRange = null;
    }
    Object.defineProperty(BinaryReader.prototype, "currentSection", {
        get: function () {
            return this.result; // TODO remove currentSection()
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BinaryReader.prototype, "currentFunction", {
        get: function () {
            return this.result; // TODO remove currentFunction()
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BinaryReader.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BinaryReader.prototype, "position", {
        get: function () {
            return this._pos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BinaryReader.prototype, "length", {
        get: function () {
            return this._length;
        },
        enumerable: true,
        configurable: true
    });
    BinaryReader.prototype.setData = function (buffer, pos, length, eof) {
        var posDelta = pos - this._pos;
        this._data = new Uint8Array(buffer);
        this._pos = pos;
        this._length = length;
        this._eof = eof === undefined ? true : eof;
        if (this._sectionRange)
            this._sectionRange.offset(posDelta);
        if (this._functionRange)
            this._functionRange.offset(posDelta);
    };
    BinaryReader.prototype.hasBytes = function (n) {
        return this._pos + n <= this._length;
    };
    BinaryReader.prototype.hasMoreBytes = function () {
        return this.hasBytes(1);
    };
    BinaryReader.prototype.readUint8 = function () {
        return this._data[this._pos++];
    };
    BinaryReader.prototype.readUint16 = function () {
        var b1 = this._data[this._pos++];
        var b2 = this._data[this._pos++];
        return b1 | (b2 << 8);
    };
    BinaryReader.prototype.readInt32 = function () {
        var b1 = this._data[this._pos++];
        var b2 = this._data[this._pos++];
        var b3 = this._data[this._pos++];
        var b4 = this._data[this._pos++];
        return b1 | (b2 << 8) | (b3 << 16) | (b4 << 24);
    };
    BinaryReader.prototype.readUint32 = function () {
        return this.readInt32();
    };
    BinaryReader.prototype.peekInt32 = function () {
        var b1 = this._data[this._pos];
        var b2 = this._data[this._pos + 1];
        var b3 = this._data[this._pos + 2];
        var b4 = this._data[this._pos + 3];
        return b1 | (b2 << 8) | (b3 << 16) | (b4 << 24);
    };
    BinaryReader.prototype.peekUint32 = function () {
        return this.peekInt32();
    };
    BinaryReader.prototype.hasVarIntBytes = function () {
        var pos = this._pos;
        while (pos < this._length) {
            if ((this._data[pos++] & 0x80) == 0)
                return true;
        }
        return false;
    };
    BinaryReader.prototype.readVarUint1 = function () {
        return this.readUint8();
    };
    BinaryReader.prototype.readVarInt7 = function () {
        return (this.readUint8() << 25) >> 25;
    };
    BinaryReader.prototype.readVarUint7 = function () {
        return this.readUint8();
    };
    BinaryReader.prototype.readVarInt32 = function () {
        var result = 0;
        var shift = 0;
        while (true) {
            var byte = this.readUint8();
            result |= (byte & 0x7F) << shift;
            shift += 7;
            if ((byte & 0x80) === 0)
                break;
        }
        if (shift >= 32)
            return result;
        var ashift = (32 - shift);
        return (result << ashift) >> ashift;
    };
    BinaryReader.prototype.readVarUint32 = function () {
        var result = 0;
        var shift = 0;
        while (true) {
            var byte = this.readUint8();
            result |= (byte & 0x7F) << shift;
            shift += 7;
            if ((byte & 0x80) === 0)
                break;
        }
        return result;
    };
    BinaryReader.prototype.readVarInt64 = function () {
        var result = new Uint8Array(8);
        var i = 0;
        var c = 0;
        var shift = 0;
        while (true) {
            var byte = this.readUint8();
            c |= (byte & 0x7F) << shift;
            shift += 7;
            if (shift > 8) {
                result[i++] = c & 0xFF;
                c >>= 8;
                shift -= 8;
            }
            if ((byte & 0x80) === 0)
                break;
        }
        var ashift = (32 - shift);
        c = (c << ashift) >> ashift;
        while (i < 8) {
            result[i++] = c & 0xFF;
            c >>= 8;
        }
        return new Int64(result);
    };
    BinaryReader.prototype.readStringBytes = function () {
        var length = this.readVarUint32() >>> 0;
        return this.readBytes(length);
    };
    BinaryReader.prototype.readBytes = function (length) {
        var result = this._data.subarray(this._pos, this._pos + length);
        this._pos += length;
        return new Uint8Array(result); // making a clone of the data
    };
    BinaryReader.prototype.hasStringBytes = function () {
        if (!this.hasVarIntBytes())
            return false;
        var pos = this._pos;
        var length = this.readVarUint32() >>> 0;
        var result = this.hasBytes(length);
        this._pos = pos;
        return result;
    };
    BinaryReader.prototype.hasSectionPayload = function () {
        return this.hasBytes(this._sectionRange.end - this._pos);
    };
    BinaryReader.prototype.readFuncType = function () {
        var form = this.readVarInt7();
        var paramCount = this.readVarUint32() >>> 0;
        var paramTypes = new Int8Array(paramCount);
        for (var i = 0; i < paramCount; i++)
            paramTypes[i] = this.readVarInt7();
        var returnCount = this.readVarUint1();
        var returnTypes = new Int8Array(returnCount);
        for (var i = 0; i < returnCount; i++)
            returnTypes[i] = this.readVarInt7();
        return {
            form: form,
            params: paramTypes,
            returns: returnTypes
        };
    };
    BinaryReader.prototype.readResizableLimits = function (maxPresent) {
        var initial = this.readVarUint32() >>> 0;
        var maximum;
        if (maxPresent) {
            maximum = this.readVarUint32() >>> 0;
        }
        return { initial: initial, maximum: maximum };
    };
    BinaryReader.prototype.readTableType = function () {
        var elementType = this.readVarInt7();
        var flags = this.readVarUint32() >>> 0;
        var limits = this.readResizableLimits(!!(flags & 0x01));
        return { elementType: elementType, limits: limits };
    };
    BinaryReader.prototype.readMemoryType = function () {
        var flags = this.readVarUint32() >>> 0;
        var shared = !!(flags & 0x02);
        return { limits: this.readResizableLimits(!!(flags & 0x01)), shared: shared };
    };
    BinaryReader.prototype.readGlobalType = function () {
        if (!this.hasVarIntBytes()) {
            return null;
        }
        var pos = this._pos;
        var contentType = this.readVarInt7();
        if (!this.hasVarIntBytes()) {
            this._pos = pos;
            return null;
        }
        var mutability = this.readVarUint1();
        return { contentType: contentType, mutability: mutability };
    };
    BinaryReader.prototype.readTypeEntry = function () {
        if (this._sectionEntriesLeft === 0) {
            this.skipSection();
            return this.read();
        }
        this.state = 11 /* TYPE_SECTION_ENTRY */;
        this.result = this.readFuncType();
        this._sectionEntriesLeft--;
        return true;
    };
    BinaryReader.prototype.readImportEntry = function () {
        if (this._sectionEntriesLeft === 0) {
            this.skipSection();
            return this.read();
        }
        this.state = 12 /* IMPORT_SECTION_ENTRY */;
        var module = this.readStringBytes();
        var field = this.readStringBytes();
        var kind = this.readUint8();
        var funcTypeIndex;
        var type;
        switch (kind) {
            case 0 /* Function */:
                funcTypeIndex = this.readVarUint32() >>> 0;
                break;
            case 1 /* Table */:
                type = this.readTableType();
                break;
            case 2 /* Memory */:
                type = this.readMemoryType();
                break;
            case 3 /* Global */:
                type = this.readGlobalType();
                break;
        }
        this.result = {
            module: module,
            field: field,
            kind: kind,
            funcTypeIndex: funcTypeIndex,
            type: type
        };
        this._sectionEntriesLeft--;
        return true;
    };
    BinaryReader.prototype.readExportEntry = function () {
        if (this._sectionEntriesLeft === 0) {
            this.skipSection();
            return this.read();
        }
        var field = this.readStringBytes();
        var kind = this.readUint8();
        var index = this.readVarUint32() >>> 0;
        this.state = 17 /* EXPORT_SECTION_ENTRY */;
        this.result = { field: field, kind: kind, index: index };
        this._sectionEntriesLeft--;
        return true;
    };
    BinaryReader.prototype.readFunctionEntry = function () {
        if (this._sectionEntriesLeft === 0) {
            this.skipSection();
            return this.read();
        }
        var typeIndex = this.readVarUint32() >>> 0;
        this.state = 13 /* FUNCTION_SECTION_ENTRY */;
        this.result = { typeIndex: typeIndex };
        this._sectionEntriesLeft--;
        return true;
    };
    BinaryReader.prototype.readTableEntry = function () {
        if (this._sectionEntriesLeft === 0) {
            this.skipSection();
            return this.read();
        }
        this.state = 14 /* TABLE_SECTION_ENTRY */;
        this.result = this.readTableType();
        this._sectionEntriesLeft--;
        return true;
    };
    BinaryReader.prototype.readMemoryEntry = function () {
        if (this._sectionEntriesLeft === 0) {
            this.skipSection();
            return this.read();
        }
        this.state = 15 /* MEMORY_SECTION_ENTRY */;
        this.result = this.readMemoryType();
        this._sectionEntriesLeft--;
        return true;
    };
    BinaryReader.prototype.readGlobalEntry = function () {
        if (this._sectionEntriesLeft === 0) {
            this.skipSection();
            return this.read();
        }
        var globalType = this.readGlobalType();
        if (!globalType) {
            this.state = 16 /* GLOBAL_SECTION_ENTRY */;
            return false;
        }
        this.state = 39 /* BEGIN_GLOBAL_SECTION_ENTRY */;
        this.result = {
            type: globalType
        };
        this._sectionEntriesLeft--;
        return true;
    };
    BinaryReader.prototype.readElementEntry = function () {
        if (this._sectionEntriesLeft === 0) {
            this.skipSection();
            return this.read();
        }
        if (!this.hasVarIntBytes()) {
            this.state = 20 /* ELEMENT_SECTION_ENTRY */;
            return false;
        }
        var tableIndex = this.readVarUint32();
        this.state = 33 /* BEGIN_ELEMENT_SECTION_ENTRY */;
        this.result = { index: tableIndex };
        this._sectionEntriesLeft--;
        return true;
    };
    BinaryReader.prototype.readElementEntryBody = function () {
        if (!this.hasVarIntBytes())
            return false;
        var pos = this._pos;
        var numElemements = this.readVarUint32();
        if (!this.hasBytes(numElemements)) {
            // Shall have at least the numElemements amount of bytes.
            this._pos = pos;
            return false;
        }
        var elements = new Uint32Array(numElemements);
        for (var i = 0; i < numElemements; i++) {
            if (!this.hasVarIntBytes()) {
                this._pos = pos;
                return false;
            }
            elements[i] = this.readVarUint32();
        }
        this.state = 34 /* ELEMENT_SECTION_ENTRY_BODY */;
        this.result = { elements: elements };
        return true;
    };
    BinaryReader.prototype.readDataEntry = function () {
        if (this._sectionEntriesLeft === 0) {
            this.skipSection();
            return this.read();
        }
        if (!this.hasVarIntBytes()) {
            return false;
        }
        this.state = 36 /* BEGIN_DATA_SECTION_ENTRY */;
        this.result = {
            index: this.readVarUint32()
        };
        this._sectionEntriesLeft--;
        return true;
    };
    BinaryReader.prototype.readDataEntryBody = function () {
        if (!this.hasStringBytes()) {
            return false;
        }
        this.state = 37 /* DATA_SECTION_ENTRY_BODY */;
        this.result = {
            data: this.readStringBytes()
        };
        return true;
    };
    BinaryReader.prototype.readInitExpressionBody = function () {
        this.state = 25 /* BEGIN_INIT_EXPRESSION_BODY */;
        this.result = null;
        return true;
    };
    BinaryReader.prototype.readMemoryImmediate = function () {
        var flags = this.readVarUint32() >>> 0;
        var offset = this.readVarUint32() >>> 0;
        return { flags: flags, offset: offset };
    };
    BinaryReader.prototype.readNameMap = function () {
        var count = this.readVarUint32();
        var result = [];
        for (var i = 0; i < count; i++) {
            var index = this.readVarUint32();
            var name = this.readStringBytes();
            result.push({ index: index, name: name });
        }
        return result;
    };
    BinaryReader.prototype.readNameEntry = function () {
        var pos = this._pos;
        if (pos >= this._sectionRange.end) {
            this.skipSection();
            return this.read();
        }
        if (!this.hasVarIntBytes())
            return false;
        var type = this.readVarUint7();
        if (!this.hasVarIntBytes()) {
            this._pos = pos;
            return false;
        }
        var payloadLength = this.readVarUint32();
        if (!this.hasBytes(payloadLength)) {
            this._pos = pos;
            return false;
        }
        var result;
        switch (type) {
            case 0 /* Module */:
                result = {
                    type: type,
                    moduleName: this.readStringBytes()
                };
                break;
            case 1 /* Function */:
                result = {
                    type: type,
                    names: this.readNameMap()
                };
                break;
            case 2 /* Local */:
                var funcsLength = this.readVarUint32();
                var funcs = [];
                for (var i = 0; i < funcsLength; i++) {
                    var funcIndex = this.readVarUint32();
                    funcs.push({
                        index: funcIndex,
                        locals: this.readNameMap()
                    });
                }
                result = {
                    type: type,
                    funcs: funcs
                };
                break;
            default:
                this.error = new Error("Bad name entry type: " + type);
                this.state = -1 /* ERROR */;
                return true;
        }
        this.state = 19 /* NAME_SECTION_ENTRY */;
        this.result = result;
        return true;
    };
    BinaryReader.prototype.readRelocHeader = function () {
        // See https://github.com/WebAssembly/tool-conventions/blob/master/Linking.md
        if (!this.hasVarIntBytes()) {
            return false;
        }
        var pos = this._pos;
        var sectionId = this.readVarUint7();
        var sectionName;
        if (sectionId === 0 /* Custom */) {
            if (!this.hasStringBytes()) {
                this._pos = pos;
                return false;
            }
            sectionName = this.readStringBytes();
        }
        this.state = 41 /* RELOC_SECTION_HEADER */;
        this.result = {
            id: sectionId,
            name: sectionName,
        };
        return true;
    };
    BinaryReader.prototype.readLinkingEntry = function () {
        if (this._sectionEntriesLeft === 0) {
            this.skipSection();
            return this.read();
        }
        if (!this.hasVarIntBytes())
            return false;
        var pos = this._pos;
        var type = this.readVarUint32() >>> 0;
        var index;
        switch (type) {
            case 1 /* StackPointer */:
                if (!this.hasVarIntBytes()) {
                    this._pos = pos;
                    return false;
                }
                index = this.readVarUint32();
                break;
            default:
                this.error = new Error("Bad linking type: " + type);
                this.state = -1 /* ERROR */;
                return true;
        }
        this.state = 21 /* LINKING_SECTION_ENTRY */;
        this.result = { type: type, index: index };
        this._sectionEntriesLeft--;
        return true;
    };
    BinaryReader.prototype.readSourceMappingURL = function () {
        if (!this.hasStringBytes())
            return false;
        var url = this.readStringBytes();
        this.state = 43 /* SOURCE_MAPPING_URL */;
        this.result = { url: url };
        return true;
    };
    BinaryReader.prototype.readRelocEntry = function () {
        if (this._sectionEntriesLeft === 0) {
            this.skipSection();
            return this.read();
        }
        if (!this.hasVarIntBytes())
            return false;
        var pos = this._pos;
        var type = this.readVarUint7();
        if (!this.hasVarIntBytes()) {
            this._pos = pos;
            return false;
        }
        var offset = this.readVarUint32();
        if (!this.hasVarIntBytes()) {
            this._pos = pos;
            return false;
        }
        var index = this.readVarUint32();
        var addend;
        switch (type) {
            case 0 /* FunctionIndex_LEB */:
            case 1 /* TableIndex_SLEB */:
            case 2 /* TableIndex_I32 */:
            case 6 /* TypeIndex_LEB */:
            case 7 /* GlobalIndex_LEB */:
                break;
            case 3 /* GlobalAddr_LEB */:
            case 4 /* GlobalAddr_SLEB */:
            case 5 /* GlobalAddr_I32 */:
                if (!this.hasVarIntBytes()) {
                    this._pos = pos;
                    return false;
                }
                addend = this.readVarUint32();
                break;
            default:
                this.error = new Error("Bad relocation type: " + type);
                this.state = -1 /* ERROR */;
                return true;
        }
        this.state = 42 /* RELOC_SECTION_ENTRY */;
        this.result = {
            type: type,
            offset: offset,
            index: index,
            addend: addend
        };
        this._sectionEntriesLeft--;
        return true;
    };
    BinaryReader.prototype.readCodeOperator_0xfc = function () {
        var code = this._data[this._pos++] | 0xfc00;
        switch (code) {
            case 64512 /* i32_trunc_s_sat_f32 */:
            case 64513 /* i32_trunc_u_sat_f32 */:
            case 64514 /* i32_trunc_s_sat_f64 */:
            case 64515 /* i32_trunc_u_sat_f64 */:
            case 64516 /* i64_trunc_s_sat_f32 */:
            case 64517 /* i64_trunc_u_sat_f32 */:
            case 64518 /* i64_trunc_s_sat_f64 */:
            case 64519 /* i64_trunc_u_sat_f64 */:
                break;
            default:
                this.error = new Error("Unknown operator: " + code);
                this.state = -1 /* ERROR */;
                return true;
        }
        this.result = { code: code,
            blockType: undefined, brDepth: undefined, brTable: undefined,
            funcIndex: undefined, typeIndex: undefined, localIndex: undefined,
            globalIndex: undefined, memoryAddress: undefined, literal: undefined };
        return true;
    };
    BinaryReader.prototype.readCodeOperator_0xfe = function () {
        var MAX_CODE_OPERATOR_0XFE_SIZE = 11;
        var pos = this._pos;
        if (!this._eof && pos + MAX_CODE_OPERATOR_0XFE_SIZE > this._length) {
            return false;
        }
        var code = this._data[this._pos++] | 0xfe00;
        var memoryAddress;
        switch (code) {
            case 65024 /* atomic_wake */:
            case 65025 /* i32_atomic_wait */:
            case 65026 /* i64_atomic_wait */:
            case 65040 /* i32_atomic_load */:
            case 65041 /* i64_atomic_load */:
            case 65042 /* i32_atomic_load8_u */:
            case 65043 /* i32_atomic_load16_u */:
            case 65044 /* i64_atomic_load8_u */:
            case 65045 /* i64_atomic_load16_u */:
            case 65046 /* i64_atomic_load32_u */:
            case 65047 /* i32_atomic_store */:
            case 65048 /* i64_atomic_store */:
            case 65049 /* i32_atomic_store8 */:
            case 65050 /* i32_atomic_store16 */:
            case 65051 /* i64_atomic_store8 */:
            case 65052 /* i64_atomic_store16 */:
            case 65053 /* i64_atomic_store32 */:
            case 65054 /* i32_atomic_rmw_add */:
            case 65055 /* i64_atomic_rmw_add */:
            case 65056 /* i32_atomic_rmw8_u_add */:
            case 65057 /* i32_atomic_rmw16_u_add */:
            case 65058 /* i64_atomic_rmw8_u_add */:
            case 65059 /* i64_atomic_rmw16_u_add */:
            case 65060 /* i64_atomic_rmw32_u_add */:
            case 65061 /* i32_atomic_rmw_sub */:
            case 65062 /* i64_atomic_rmw_sub */:
            case 65063 /* i32_atomic_rmw8_u_sub */:
            case 65064 /* i32_atomic_rmw16_u_sub */:
            case 65065 /* i64_atomic_rmw8_u_sub */:
            case 65066 /* i64_atomic_rmw16_u_sub */:
            case 65067 /* i64_atomic_rmw32_u_sub */:
            case 65068 /* i32_atomic_rmw_and */:
            case 65069 /* i64_atomic_rmw_and */:
            case 65070 /* i32_atomic_rmw8_u_and */:
            case 65071 /* i32_atomic_rmw16_u_and */:
            case 65072 /* i64_atomic_rmw8_u_and */:
            case 65073 /* i64_atomic_rmw16_u_and */:
            case 65074 /* i64_atomic_rmw32_u_and */:
            case 65075 /* i32_atomic_rmw_or */:
            case 65076 /* i64_atomic_rmw_or */:
            case 65077 /* i32_atomic_rmw8_u_or */:
            case 65078 /* i32_atomic_rmw16_u_or */:
            case 65079 /* i64_atomic_rmw8_u_or */:
            case 65080 /* i64_atomic_rmw16_u_or */:
            case 65081 /* i64_atomic_rmw32_u_or */:
            case 65082 /* i32_atomic_rmw_xor */:
            case 65083 /* i64_atomic_rmw_xor */:
            case 65084 /* i32_atomic_rmw8_u_xor */:
            case 65085 /* i32_atomic_rmw16_u_xor */:
            case 65086 /* i64_atomic_rmw8_u_xor */:
            case 65087 /* i64_atomic_rmw16_u_xor */:
            case 65088 /* i64_atomic_rmw32_u_xor */:
            case 65089 /* i32_atomic_rmw_xchg */:
            case 65090 /* i64_atomic_rmw_xchg */:
            case 65091 /* i32_atomic_rmw8_u_xchg */:
            case 65092 /* i32_atomic_rmw16_u_xchg */:
            case 65093 /* i64_atomic_rmw8_u_xchg */:
            case 65094 /* i64_atomic_rmw16_u_xchg */:
            case 65095 /* i64_atomic_rmw32_u_xchg */:
            case 65096 /* i32_atomic_rmw_cmpxchg */:
            case 65097 /* i64_atomic_rmw_cmpxchg */:
            case 65098 /* i32_atomic_rmw8_u_cmpxchg */:
            case 65099 /* i32_atomic_rmw16_u_cmpxchg */:
            case 65100 /* i64_atomic_rmw8_u_cmpxchg */:
            case 65101 /* i64_atomic_rmw16_u_cmpxchg */:
            case 65102 /* i64_atomic_rmw32_u_cmpxchg */:
                memoryAddress = this.readMemoryImmediate();
                break;
            default:
                this.error = new Error("Unknown operator: " + code);
                this.state = -1 /* ERROR */;
                return true;
        }
        this.result = { code: code,
            blockType: undefined, brDepth: undefined, brTable: undefined,
            funcIndex: undefined, typeIndex: undefined, localIndex: undefined,
            globalIndex: undefined, memoryAddress: memoryAddress, literal: undefined };
        return true;
    };
    BinaryReader.prototype.readCodeOperator = function () {
        if (this.state === 30 /* CODE_OPERATOR */ &&
            this._pos >= this._functionRange.end) {
            this.skipFunctionBody();
            return this.read();
        }
        else if (this.state === 26 /* INIT_EXPRESSION_OPERATOR */ &&
            this.result &&
            this.result.code === 11 /* end */) {
            this.state = 27 /* END_INIT_EXPRESSION_BODY */;
            this.result = null;
            return true;
        }
        var MAX_CODE_OPERATOR_SIZE = 11; // i64.const or load/store
        var pos = this._pos;
        if (!this._eof && pos + MAX_CODE_OPERATOR_SIZE > this._length) {
            return false;
        }
        var code = this._data[this._pos++] | 0;
        var blockType, brDepth, brTable, funcIndex, typeIndex, localIndex, globalIndex, memoryAddress, literal, reserved;
        switch (code) {
            case 2 /* block */:
            case 3 /* loop */:
            case 4 /* if */:
                blockType = this.readVarInt7();
                break;
            case 12 /* br */:
            case 13 /* br_if */:
                brDepth = this.readVarUint32() >>> 0;
                break;
            case 14 /* br_table */:
                var tableCount = this.readVarUint32() >>> 0;
                if (!this.hasBytes(tableCount + 1)) {
                    // We need at least (tableCount + 1) bytes
                    this._pos = pos;
                    return false;
                }
                brTable = [];
                for (var i = 0; i <= tableCount; i++) {
                    if (!this.hasVarIntBytes()) {
                        this._pos = pos;
                        return false;
                    }
                    brTable.push(this.readVarUint32() >>> 0);
                }
                break;
            case 16 /* call */:
                funcIndex = this.readVarUint32() >>> 0;
                break;
            case 17 /* call_indirect */:
                typeIndex = this.readVarUint32() >>> 0;
                reserved = this.readVarUint1();
                break;
            case 32 /* get_local */:
            case 33 /* set_local */:
            case 34 /* tee_local */:
                localIndex = this.readVarUint32() >>> 0;
                break;
            case 35 /* get_global */:
            case 36 /* set_global */:
                globalIndex = this.readVarUint32() >>> 0;
                break;
            case 40 /* i32_load */:
            case 41 /* i64_load */:
            case 42 /* f32_load */:
            case 43 /* f64_load */:
            case 44 /* i32_load8_s */:
            case 45 /* i32_load8_u */:
            case 46 /* i32_load16_s */:
            case 47 /* i32_load16_u */:
            case 48 /* i64_load8_s */:
            case 49 /* i64_load8_u */:
            case 50 /* i64_load16_s */:
            case 51 /* i64_load16_u */:
            case 52 /* i64_load32_s */:
            case 53 /* i64_load32_u */:
            case 54 /* i32_store */:
            case 55 /* i64_store */:
            case 56 /* f32_store */:
            case 57 /* f64_store */:
            case 58 /* i32_store8 */:
            case 59 /* i32_store16 */:
            case 60 /* i64_store8 */:
            case 61 /* i64_store16 */:
            case 62 /* i64_store32 */:
                memoryAddress = this.readMemoryImmediate();
                break;
            case 63 /* current_memory */:
            case 64 /* grow_memory */:
                reserved = this.readVarUint1();
                break;
            case 65 /* i32_const */:
                literal = this.readVarInt32();
                break;
            case 66 /* i64_const */:
                literal = this.readVarInt64();
                break;
            case 67 /* f32_const */:
                literal = new DataView(this._data.buffer, this._data.byteOffset).getFloat32(this._pos, true);
                this._pos += 4;
                break;
            case 68 /* f64_const */:
                literal = new DataView(this._data.buffer, this._data.byteOffset).getFloat64(this._pos, true);
                this._pos += 8;
                break;
            case 252 /* prefix_0xfc */:
                if (this.readCodeOperator_0xfc()) {
                    return true;
                }
                this._pos = pos;
                return false;
            case 254 /* prefix_0xfe */:
                if (this.readCodeOperator_0xfe()) {
                    return true;
                }
                this._pos = pos;
                return false;
            case 0 /* unreachable */:
            case 1 /* nop */:
            case 5 /* else */:
            case 11 /* end */:
            case 15 /* return */:
            case 26 /* drop */:
            case 27 /* select */:
            case 69 /* i32_eqz */:
            case 70 /* i32_eq */:
            case 71 /* i32_ne */:
            case 72 /* i32_lt_s */:
            case 73 /* i32_lt_u */:
            case 74 /* i32_gt_s */:
            case 75 /* i32_gt_u */:
            case 76 /* i32_le_s */:
            case 77 /* i32_le_u */:
            case 78 /* i32_ge_s */:
            case 79 /* i32_ge_u */:
            case 80 /* i64_eqz */:
            case 81 /* i64_eq */:
            case 82 /* i64_ne */:
            case 83 /* i64_lt_s */:
            case 84 /* i64_lt_u */:
            case 85 /* i64_gt_s */:
            case 86 /* i64_gt_u */:
            case 87 /* i64_le_s */:
            case 88 /* i64_le_u */:
            case 89 /* i64_ge_s */:
            case 90 /* i64_ge_u */:
            case 91 /* f32_eq */:
            case 92 /* f32_ne */:
            case 93 /* f32_lt */:
            case 94 /* f32_gt */:
            case 95 /* f32_le */:
            case 96 /* f32_ge */:
            case 97 /* f64_eq */:
            case 98 /* f64_ne */:
            case 99 /* f64_lt */:
            case 100 /* f64_gt */:
            case 101 /* f64_le */:
            case 102 /* f64_ge */:
            case 103 /* i32_clz */:
            case 104 /* i32_ctz */:
            case 105 /* i32_popcnt */:
            case 106 /* i32_add */:
            case 107 /* i32_sub */:
            case 108 /* i32_mul */:
            case 109 /* i32_div_s */:
            case 110 /* i32_div_u */:
            case 111 /* i32_rem_s */:
            case 112 /* i32_rem_u */:
            case 113 /* i32_and */:
            case 114 /* i32_or */:
            case 115 /* i32_xor */:
            case 116 /* i32_shl */:
            case 117 /* i32_shr_s */:
            case 118 /* i32_shr_u */:
            case 119 /* i32_rotl */:
            case 120 /* i32_rotr */:
            case 121 /* i64_clz */:
            case 122 /* i64_ctz */:
            case 123 /* i64_popcnt */:
            case 124 /* i64_add */:
            case 125 /* i64_sub */:
            case 126 /* i64_mul */:
            case 127 /* i64_div_s */:
            case 128 /* i64_div_u */:
            case 129 /* i64_rem_s */:
            case 130 /* i64_rem_u */:
            case 131 /* i64_and */:
            case 132 /* i64_or */:
            case 133 /* i64_xor */:
            case 134 /* i64_shl */:
            case 135 /* i64_shr_s */:
            case 136 /* i64_shr_u */:
            case 137 /* i64_rotl */:
            case 138 /* i64_rotr */:
            case 139 /* f32_abs */:
            case 140 /* f32_neg */:
            case 141 /* f32_ceil */:
            case 142 /* f32_floor */:
            case 143 /* f32_trunc */:
            case 144 /* f32_nearest */:
            case 145 /* f32_sqrt */:
            case 146 /* f32_add */:
            case 147 /* f32_sub */:
            case 148 /* f32_mul */:
            case 149 /* f32_div */:
            case 150 /* f32_min */:
            case 151 /* f32_max */:
            case 152 /* f32_copysign */:
            case 153 /* f64_abs */:
            case 154 /* f64_neg */:
            case 155 /* f64_ceil */:
            case 156 /* f64_floor */:
            case 157 /* f64_trunc */:
            case 158 /* f64_nearest */:
            case 159 /* f64_sqrt */:
            case 160 /* f64_add */:
            case 161 /* f64_sub */:
            case 162 /* f64_mul */:
            case 163 /* f64_div */:
            case 164 /* f64_min */:
            case 165 /* f64_max */:
            case 166 /* f64_copysign */:
            case 167 /* i32_wrap_i64 */:
            case 168 /* i32_trunc_s_f32 */:
            case 169 /* i32_trunc_u_f32 */:
            case 170 /* i32_trunc_s_f64 */:
            case 171 /* i32_trunc_u_f64 */:
            case 172 /* i64_extend_s_i32 */:
            case 173 /* i64_extend_u_i32 */:
            case 174 /* i64_trunc_s_f32 */:
            case 175 /* i64_trunc_u_f32 */:
            case 176 /* i64_trunc_s_f64 */:
            case 177 /* i64_trunc_u_f64 */:
            case 178 /* f32_convert_s_i32 */:
            case 179 /* f32_convert_u_i32 */:
            case 180 /* f32_convert_s_i64 */:
            case 181 /* f32_convert_u_i64 */:
            case 182 /* f32_demote_f64 */:
            case 183 /* f64_convert_s_i32 */:
            case 184 /* f64_convert_u_i32 */:
            case 185 /* f64_convert_s_i64 */:
            case 186 /* f64_convert_u_i64 */:
            case 187 /* f64_promote_f32 */:
            case 188 /* i32_reinterpret_f32 */:
            case 189 /* i64_reinterpret_f64 */:
            case 190 /* f32_reinterpret_i32 */:
            case 191 /* f64_reinterpret_i64 */:
            case 192 /* i32_extend8_s */:
            case 193 /* i32_extend16_s */:
            case 194 /* i64_extend8_s */:
            case 195 /* i64_extend16_s */:
            case 196 /* i64_extend32_s */:
                break;
            default:
                this.error = new Error("Unknown operator: " + code);
                this.state = -1 /* ERROR */;
                return true;
        }
        this.result = { code: code,
            blockType: blockType, brDepth: brDepth, brTable: brTable,
            funcIndex: funcIndex, typeIndex: typeIndex, localIndex: localIndex,
            globalIndex: globalIndex, memoryAddress: memoryAddress, literal: literal };
        return true;
    };
    BinaryReader.prototype.readFunctionBody = function () {
        if (this._sectionEntriesLeft === 0) {
            this.skipSection();
            return this.read();
        }
        if (!this.hasVarIntBytes())
            return false;
        var pos = this._pos;
        var size = this.readVarUint32() >>> 0;
        var bodyEnd = this._pos + size;
        if (!this.hasVarIntBytes()) {
            this._pos = pos;
            return false;
        }
        var localCount = this.readVarUint32() >>> 0;
        var locals = [];
        for (var i = 0; i < localCount; i++) {
            if (!this.hasVarIntBytes()) {
                this._pos = pos;
                return false;
            }
            var count = this.readVarUint32() >>> 0;
            if (!this.hasVarIntBytes()) {
                this._pos = pos;
                return false;
            }
            var type = this.readVarInt7();
            locals.push({ count: count, type: type });
        }
        var bodyStart = this._pos;
        this.state = 28 /* BEGIN_FUNCTION_BODY */;
        this.result = {
            locals: locals
        };
        this._functionRange = new DataRange(bodyStart, bodyEnd);
        this._sectionEntriesLeft--;
        return true;
    };
    BinaryReader.prototype.readSectionHeader = function () {
        if (this._pos >= this._length && this._eof) {
            this._sectionId = -1 /* Unknown */;
            this._sectionRange = null;
            this.result = null;
            this.state = 2 /* END_WASM */;
            return true;
        }
        // TODO: Handle _eof.
        if (this._pos < this._length - 4) {
            var magicNumber = this.peekInt32();
            if (magicNumber === WASM_MAGIC_NUMBER) {
                this._sectionId = -1 /* Unknown */;
                this._sectionRange = null;
                this.result = null;
                this.state = 2 /* END_WASM */;
                return true;
            }
        }
        if (!this.hasVarIntBytes())
            return false;
        var sectionStart = this._pos;
        var id = this.readVarUint7();
        if (!this.hasVarIntBytes()) {
            this._pos = sectionStart;
            return false;
        }
        var payloadLength = this.readVarUint32() >>> 0;
        var name = null;
        var payloadEnd = this._pos + payloadLength;
        if (id == 0) {
            if (!this.hasStringBytes()) {
                this._pos = sectionStart;
                return false;
            }
            name = this.readStringBytes();
        }
        this.result = { id: id, name: name };
        this._sectionId = id;
        this._sectionRange = new DataRange(this._pos, payloadEnd);
        this.state = 3 /* BEGIN_SECTION */;
        return true;
    };
    BinaryReader.prototype.readSectionRawData = function () {
        var payloadLength = this._sectionRange.end - this._sectionRange.start;
        if (!this.hasBytes(payloadLength)) {
            return false;
        }
        this.state = 7 /* SECTION_RAW_DATA */;
        this.result = this.readBytes(payloadLength);
        return true;
    };
    BinaryReader.prototype.readSectionBody = function () {
        if (this._pos >= this._sectionRange.end) {
            this.result = null;
            this.state = 4 /* END_SECTION */;
            this._sectionId = -1 /* Unknown */;
            this._sectionRange = null;
            return true;
        }
        var currentSection = this.result;
        switch (currentSection.id) {
            case 1 /* Type */:
                if (!this.hasSectionPayload())
                    return false;
                this._sectionEntriesLeft = this.readVarUint32() >>> 0;
                return this.readTypeEntry();
            case 2 /* Import */:
                if (!this.hasSectionPayload())
                    return false;
                this._sectionEntriesLeft = this.readVarUint32() >>> 0;
                return this.readImportEntry();
            case 7 /* Export */:
                if (!this.hasSectionPayload())
                    return false;
                this._sectionEntriesLeft = this.readVarUint32() >>> 0;
                return this.readExportEntry();
            case 3 /* Function */:
                if (!this.hasSectionPayload())
                    return false;
                this._sectionEntriesLeft = this.readVarUint32() >>> 0;
                return this.readFunctionEntry();
            case 4 /* Table */:
                if (!this.hasSectionPayload())
                    return false;
                this._sectionEntriesLeft = this.readVarUint32() >>> 0;
                return this.readTableEntry();
            case 5 /* Memory */:
                if (!this.hasSectionPayload())
                    return false;
                this._sectionEntriesLeft = this.readVarUint32() >>> 0;
                return this.readMemoryEntry();
            case 6 /* Global */:
                if (!this.hasVarIntBytes())
                    return false;
                this._sectionEntriesLeft = this.readVarUint32() >>> 0;
                return this.readGlobalEntry();
            case 8 /* Start */:
                if (!this.hasVarIntBytes())
                    return false;
                this.state = 22 /* START_SECTION_ENTRY */;
                this.result = { index: this.readVarUint32() };
                return true;
            case 10 /* Code */:
                if (!this.hasVarIntBytes())
                    return false;
                this._sectionEntriesLeft = this.readVarUint32() >>> 0;
                this.state = 29 /* READING_FUNCTION_HEADER */;
                return this.readFunctionBody();
            case 9 /* Element */:
                if (!this.hasVarIntBytes())
                    return false;
                this._sectionEntriesLeft = this.readVarUint32() >>> 0;
                return this.readElementEntry();
            case 11 /* Data */:
                if (!this.hasVarIntBytes())
                    return false;
                this._sectionEntriesLeft = this.readVarUint32() >>> 0;
                this.state = 18 /* DATA_SECTION_ENTRY */;
                return this.readDataEntry();
            case 0 /* Custom */:
                var customSectionName = exports.bytesToString(currentSection.name);
                if (customSectionName === 'name') {
                    return this.readNameEntry();
                }
                if (customSectionName.indexOf('reloc.') === 0) {
                    return this.readRelocHeader();
                }
                if (customSectionName === 'linking') {
                    if (!this.hasVarIntBytes())
                        return false;
                    this._sectionEntriesLeft = this.readVarUint32() >>> 0;
                    return this.readLinkingEntry();
                }
                if (customSectionName === 'sourceMappingURL') {
                    return this.readSourceMappingURL();
                }
                return this.readSectionRawData();
            default:
                this.error = new Error("Unsupported section: " + this._sectionId);
                this.state = -1 /* ERROR */;
                return true;
        }
    };
    BinaryReader.prototype.read = function () {
        switch (this.state) {
            case 0 /* INITIAL */:
                if (!this.hasBytes(8))
                    return false;
                var magicNumber = this.readUint32();
                if (magicNumber != WASM_MAGIC_NUMBER) {
                    this.error = new Error('Bad magic number');
                    this.state = -1 /* ERROR */;
                    return true;
                }
                var version = this.readUint32();
                if (version != WASM_SUPPORTED_VERSION &&
                    version != WASM_SUPPORTED_EXPERIMENTAL_VERSION) {
                    this.error = new Error("Bad version number " + version);
                    this.state = -1 /* ERROR */;
                    return true;
                }
                this.result = { magicNumber: magicNumber, version: version };
                this.state = 1 /* BEGIN_WASM */;
                return true;
            case 2 /* END_WASM */:
                this.result = null;
                this.state = 1 /* BEGIN_WASM */;
                if (this.hasMoreBytes()) {
                    this.state = 0 /* INITIAL */;
                    return this.read();
                }
                return false;
            case -1 /* ERROR */:
                return true;
            case 1 /* BEGIN_WASM */:
            case 4 /* END_SECTION */:
                return this.readSectionHeader();
            case 3 /* BEGIN_SECTION */:
                return this.readSectionBody();
            case 5 /* SKIPPING_SECTION */:
                if (!this.hasSectionPayload()) {
                    return false;
                }
                this.state = 4 /* END_SECTION */;
                this._pos = this._sectionRange.end;
                this._sectionId = -1 /* Unknown */;
                this._sectionRange = null;
                this.result = null;
                return true;
            case 32 /* SKIPPING_FUNCTION_BODY */:
                this.state = 31 /* END_FUNCTION_BODY */;
                this._pos = this._functionRange.end;
                this._functionRange = null;
                this.result = null;
                return true;
            case 11 /* TYPE_SECTION_ENTRY */:
                return this.readTypeEntry();
            case 12 /* IMPORT_SECTION_ENTRY */:
                return this.readImportEntry();
            case 17 /* EXPORT_SECTION_ENTRY */:
                return this.readExportEntry();
            case 13 /* FUNCTION_SECTION_ENTRY */:
                return this.readFunctionEntry();
            case 14 /* TABLE_SECTION_ENTRY */:
                return this.readTableEntry();
            case 15 /* MEMORY_SECTION_ENTRY */:
                return this.readMemoryEntry();
            case 16 /* GLOBAL_SECTION_ENTRY */:
            case 40 /* END_GLOBAL_SECTION_ENTRY */:
                return this.readGlobalEntry();
            case 39 /* BEGIN_GLOBAL_SECTION_ENTRY */:
                return this.readInitExpressionBody();
            case 20 /* ELEMENT_SECTION_ENTRY */:
            case 35 /* END_ELEMENT_SECTION_ENTRY */:
                return this.readElementEntry();
            case 33 /* BEGIN_ELEMENT_SECTION_ENTRY */:
                return this.readInitExpressionBody();
            case 34 /* ELEMENT_SECTION_ENTRY_BODY */:
                this.state = 35 /* END_ELEMENT_SECTION_ENTRY */;
                this.result = null;
                return true;
            case 18 /* DATA_SECTION_ENTRY */:
            case 38 /* END_DATA_SECTION_ENTRY */:
                return this.readDataEntry();
            case 36 /* BEGIN_DATA_SECTION_ENTRY */:
                return this.readInitExpressionBody();
            case 37 /* DATA_SECTION_ENTRY_BODY */:
                this.state = 38 /* END_DATA_SECTION_ENTRY */;
                this.result = null;
                return true;
            case 27 /* END_INIT_EXPRESSION_BODY */:
                switch (this._sectionId) {
                    case 6 /* Global */:
                        this.state = 40 /* END_GLOBAL_SECTION_ENTRY */;
                        return true;
                    case 11 /* Data */:
                        return this.readDataEntryBody();
                    case 9 /* Element */:
                        return this.readElementEntryBody();
                }
                this.error = new Error("Unexpected section type: " + this._sectionId);
                this.state = -1 /* ERROR */;
                return true;
            case 19 /* NAME_SECTION_ENTRY */:
                return this.readNameEntry();
            case 41 /* RELOC_SECTION_HEADER */:
                if (!this.hasVarIntBytes())
                    return false;
                this._sectionEntriesLeft = this.readVarUint32() >>> 0;
                return this.readRelocEntry();
            case 21 /* LINKING_SECTION_ENTRY */:
                return this.readLinkingEntry();
            case 43 /* SOURCE_MAPPING_URL */:
                this.state = 4 /* END_SECTION */;
                this.result = null;
                return true;
            case 42 /* RELOC_SECTION_ENTRY */:
                return this.readRelocEntry();
            case 29 /* READING_FUNCTION_HEADER */:
            case 31 /* END_FUNCTION_BODY */:
                return this.readFunctionBody();
            case 28 /* BEGIN_FUNCTION_BODY */:
                this.state = 30 /* CODE_OPERATOR */;
                return this.readCodeOperator();
            case 25 /* BEGIN_INIT_EXPRESSION_BODY */:
                this.state = 26 /* INIT_EXPRESSION_OPERATOR */;
                return this.readCodeOperator();
            case 30 /* CODE_OPERATOR */:
            case 26 /* INIT_EXPRESSION_OPERATOR */:
                return this.readCodeOperator();
            case 6 /* READING_SECTION_RAW_DATA */:
                return this.readSectionRawData();
            case 22 /* START_SECTION_ENTRY */:
            case 7 /* SECTION_RAW_DATA */:
                this.state = 4 /* END_SECTION */;
                this.result = null;
                return true;
            default:
                this.error = new Error("Unsupported state: " + this.state);
                this.state = -1 /* ERROR */;
                return true;
        }
    };
    BinaryReader.prototype.skipSection = function () {
        if (this.state === -1 /* ERROR */ ||
            this.state === 0 /* INITIAL */ ||
            this.state === 4 /* END_SECTION */ ||
            this.state === 1 /* BEGIN_WASM */ ||
            this.state === 2 /* END_WASM */)
            return;
        this.state = 5 /* SKIPPING_SECTION */;
    };
    BinaryReader.prototype.skipFunctionBody = function () {
        if (this.state !== 28 /* BEGIN_FUNCTION_BODY */ &&
            this.state !== 30 /* CODE_OPERATOR */)
            return;
        this.state = 32 /* SKIPPING_FUNCTION_BODY */;
    };
    BinaryReader.prototype.skipInitExpression = function () {
        while (this.state === 26 /* INIT_EXPRESSION_OPERATOR */)
            this.readCodeOperator();
    };
    BinaryReader.prototype.fetchSectionRawData = function () {
        if (this.state !== 3 /* BEGIN_SECTION */) {
            this.error = new Error("Unsupported state: " + this.state);
            this.state = -1 /* ERROR */;
            return;
        }
        this.state = 6 /* READING_SECTION_RAW_DATA */;
    };
    return BinaryReader;
}());
exports.BinaryReader = BinaryReader;
if (typeof TextDecoder !== 'undefined') {
    try {
        exports.bytesToString = function () {
            var utf8Decoder = new TextDecoder('utf-8');
            utf8Decoder.decode(new Uint8Array([97, 208, 144]));
            return function (b) { return utf8Decoder.decode(b); };
        }();
    }
    catch (_) { }
}
if (!exports.bytesToString) {
    exports.bytesToString = function (b) {
        var str = String.fromCharCode.apply(null, b);
        return decodeURIComponent(escape(str));
    };
}


/***/ }),
/* 8 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14).Buffer))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const model_1 = __webpack_require__(2);
const index_1 = __webpack_require__(3);
var Cassowary = __webpack_require__(93);
function arrayEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}
function toCSSPercent(x) {
    return x + "%";
}
function toCSSPx(x) {
    return (x | 0) + "px";
}
function isCSSPercentage(x) {
    return x[x.length - 1] === "%";
}
function parseCSSPercentage(x) {
    return Number(x.substring(0, x.length - 1)) / 100;
}
function clone(array) {
    return array.slice(0);
}
function sum(array, n) {
    let x = 0;
    if (n === undefined) {
        n = array.length;
    }
    for (let i = 0; i < n; i++) {
        x += array[i];
    }
    return x;
}
function assignObject(to, from) {
    for (var x in from) {
        if (!(x in to)) {
            to[x] = from[x];
        }
    }
    return to;
}
var SplitOrientation;
(function (SplitOrientation) {
    SplitOrientation[SplitOrientation["Horizontal"] = 0] = "Horizontal";
    SplitOrientation[SplitOrientation["Vertical"] = 1] = "Vertical";
})(SplitOrientation = exports.SplitOrientation || (exports.SplitOrientation = {}));
function splitInfoEquals(a, b) {
    return a.min === b.min && a.max === b.max && a.value === b.value && a.resize === b.resize;
}
function splitInfoArrayEquals(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (!splitInfoEquals(a[i], b[i])) {
            return false;
        }
    }
    return true;
}
class Split extends React.Component {
    constructor(props) {
        super(props);
        this.index = -1;
        /**
         * This fires for all splits, even if the resizer doesn't belong to this split.
         */
        this.onResizerMouseUp = (e) => {
            if (this.index < 0) {
                return;
            }
            this.index = -1;
            Split.onResizeEnd.dispatch(this);
            this.solver.endEdit();
            window.document.documentElement.style.pointerEvents = "auto";
            this.querySolver(this.state.splits);
            this.props.onChange && this.props.onChange(this.state.splits);
        };
        this.onResizerMouseMove = (e) => {
            if (this.index < 0) {
                return;
            }
            let vars = this.vars;
            let isVertical = this.props.orientation === SplitOrientation.Vertical;
            let container = this.refs.container;
            let rect = container.getBoundingClientRect();
            let mouseOffset = isVertical ? e.clientX - rect.left : e.clientY - rect.top;
            this.solver.suggestValue(vars[this.index + 1], mouseOffset);
            this.solver.resolve();
            let splits = this.state.splits;
            this.querySolver(splits);
            this.setState({ splits });
            e.preventDefault();
        };
        this.state = {
            splits: []
        };
    }
    onResizerMouseDown(i) {
        this.index = i;
        this.solver.addEditVar(this.vars[this.index + 1], Cassowary.Strength.strong).beginEdit();
        Split.onResizeBegin.dispatch(this);
        window.document.documentElement.style.pointerEvents = "none";
    }
    querySolver(splits) {
        let vars = this.vars;
        for (let i = 0; i < splits.length; i++) {
            splits[i].value = vars[i + 1].value - vars[i].value;
        }
        // console.log(vars.map(v => v.value));
    }
    componentWillReceiveProps(nextProps) {
        // if (this.props.name === "Editors") {
        //   console.info("X: " );
        // }
        // console.info(this.props.name + ": " + this.getContainerSize(nextProps.orientation));
        // console.log("componentWillReceiveProps");
        let splits = this.canonicalizeSplits(nextProps);
        this.setupSolver(splits, this.getContainerSize(nextProps.orientation));
        this.querySolver(splits);
        this.setState({ splits });
    }
    getContainerSize(orientation) {
        return orientation === SplitOrientation.Horizontal ? this.refs.container.clientHeight : this.refs.container.clientWidth;
    }
    canonicalizeSplits(props) {
        let count = React.Children.count(props.children);
        let containerSize = this.getContainerSize(props.orientation);
        let splits = [];
        for (let i = 0; i < count; i++) {
            let info = {};
            if (props.splits && i < props.splits.length) {
                assignObject(info, props.splits[i]);
            }
            if (props.defaultSplit) {
                assignObject(info, props.defaultSplit);
            }
            splits.push(assignObject(info, {
                min: 32,
                max: containerSize,
            }));
        }
        return splits;
    }
    /**
     * Initializes a Cassowary solver and the constraints based on split infos and container size.
     */
    setupSolver(splits, containerSize) {
        index_1.assert(this.index < 0, "Should not be in a dragging state.");
        const weak = Cassowary.Strength.weak;
        const medium = Cassowary.Strength.medium;
        const strong = Cassowary.Strength.strong;
        const required = Cassowary.Strength.required;
        function eq(a1, a2, strength, weight) {
            return new Cassowary.Equation(a1, a2, strength || weak, weight || 0);
        }
        ;
        function geq(a1, a2, strength, weight) {
            return new Cassowary.Inequality(a1, Cassowary.GEQ, a2, strength, weight);
        }
        ;
        function leq(a1, a2, strength, weight) {
            return new Cassowary.Inequality(a1, Cassowary.LEQ, a2, strength, weight);
        }
        ;
        // f     1               2           3   ...    l
        // |-----|---------------|-----------|----------|
        let vars = this.vars = [new Cassowary.Variable()];
        var solver = this.solver = new Cassowary.SimplexSolver();
        // Create Cassowary variables, these the dragged position as an offset from the origin.
        for (let i = 0; i < splits.length; i++) {
            vars.push(new Cassowary.Variable());
        }
        vars[0].value = 0;
        vars[vars.length - 1].value = containerSize;
        solver.addStay(vars[0], required);
        solver.addStay(vars[vars.length - 1], required);
        let offset = 0;
        for (let i = 0; i < vars.length - 1; i++) {
            let { min, max } = splits[i];
            const l = vars[i];
            const r = vars[i + 1];
            solver.addConstraint(geq(Cassowary.minus(r, l), min, strong)); // (y - x) >= min
            solver.addConstraint(leq(Cassowary.minus(r, l), max, strong)); // (y - x) <= max
        }
        // Add stays for the variables representing the dragged panes. This causes them to
        // try and remain in their dragged position unless the constraints prevent that.
        for (let i = 1; i < vars.length - 1; i++) {
            solver.addStay(vars[i], weak);
        }
        this.suggestVarValues(splits);
    }
    suggestVarValues(splits) {
        const vars = this.vars;
        for (let i = 0; i < vars.length - 1; i++) {
            let x = vars[i];
            let y = vars[i + 1];
            if (splits[i].value) {
                if (i < vars.length - 2) {
                    this.solver.addEditVar(y, Cassowary.Strength.strong).beginEdit();
                    this.solver.suggestValue(y, x.value + splits[i].value);
                }
                else {
                    this.solver.addEditVar(x, Cassowary.Strength.strong).beginEdit();
                    this.solver.suggestValue(x, y.value - splits[i].value);
                }
                this.solver.endEdit();
                this.solver.resolve();
            }
        }
    }
    // onGlobalResize = (target: any) => {
    //   if (this === target) {
    //     return;
    //   }
    //   // this.resizePanes();
    //   // this.props.onChange && this.props.onChange();
    // }
    componentDidMount() {
        // console.log("componentDidMount");
        // Split.onGlobalResize.register(this.onGlobalResize);
        document.addEventListener("mousemove", this.onResizerMouseMove);
        document.addEventListener("mouseup", this.onResizerMouseUp);
        let splits = this.canonicalizeSplits(this.props);
        this.setupSolver(splits, this.getContainerSize(this.props.orientation));
        this.querySolver(splits);
        this.setState({ splits });
    }
    componentWillUnmount() {
        // Split.onGlobalResize.unregister(this.onGlobalResize);
        document.removeEventListener("mousemove", this.onResizerMouseMove);
        document.removeEventListener("mouseup", this.onResizerMouseUp);
    }
    render() {
        let { splits } = this.state;
        // let layout = [];
        // let layout = [splits[0].value];
        // for (let i = 1; i < this.vars.length; i++) {
        //   layout.push(vars[i].value - vars[i - 1].value);
        // }
        let resizerClassName = "resizer";
        let isHorizontal = this.props.orientation === SplitOrientation.Horizontal;
        if (isHorizontal) {
            resizerClassName += " horizontal";
        }
        else {
            resizerClassName += " vertical";
        }
        // console.log("Splits", splits, sum(splits), this.state.size);
        let count = React.Children.count(this.props.children);
        let children = [];
        React.Children.forEach(this.props.children, (child, i) => {
            let style = {};
            if (i < count - 1 && i < splits.length) {
                style.flexBasis = toCSSPx(Math.round(splits[i].value));
            }
            else {
                style.flex = 1;
            }
            children.push(React.createElement("div", { key: i, className: "split-pane", style: style }, child));
            if (i < count - 1) {
                children.push(React.createElement("div", { key: "split:" + i, className: resizerClassName, onMouseDown: this.onResizerMouseDown.bind(this, i) }));
            }
        });
        return React.createElement("div", { className: "split", ref: "container", style: { flexDirection: isHorizontal ? "column" : "row" } }, children);
    }
}
Split.onGlobalResize = new model_1.EventDispatcher("Split Resize");
Split.onResizeBegin = new model_1.EventDispatcher("Resize Begin");
Split.onResizeEnd = new model_1.EventDispatcher("Resize End");
exports.Split = Split;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(14)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const wasmparser_1 = __webpack_require__(48);
const model_1 = __webpack_require__(2);
__webpack_require__(5);
const util_1 = __webpack_require__(64);
const index_1 = __webpack_require__(3);
var Language;
(function (Language) {
    Language["C"] = "c";
    Language["Cpp"] = "cpp";
    Language["Wast"] = "wast";
    Language["Wasm"] = "wasm";
    Language["Cretonne"] = "cton";
    Language["x86"] = "x86";
})(Language = exports.Language || (exports.Language = {}));
class Service {
    static sendRequest(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch("//wasmexplorer-service.herokuapp.com/service.php", {
                method: "POST",
                body: command,
                headers: new Headers({ "Content-type": "application/x-www-form-urlencoded" })
            });
            return JSON.parse(yield response.text());
        });
    }
    static getMarkers(response) {
        // Parse and annotate errors if compilation fails.
        var annotations = [];
        if (response.indexOf("(module") !== 0) {
            var re1 = /^.*?:(\d+?):(\d+?):\s(.*)$/gm;
            var m;
            // Single position.
            while ((m = re1.exec(response)) !== null) {
                if (m.index === re1.lastIndex) {
                    re1.lastIndex++;
                }
                var startLineNumber = parseInt(m[1]);
                var startColumn = parseInt(m[2]);
                var message = m[3];
                let severity = monaco.Severity.Info;
                if (message.indexOf("error") >= 0) {
                    severity = monaco.Severity.Error;
                }
                else if (message.indexOf("warning") >= 0) {
                    severity = monaco.Severity.Warning;
                }
                annotations.push({
                    severity, message,
                    startLineNumber: startLineNumber, startColumn: startColumn,
                    endLineNumber: startLineNumber, endColumn: startColumn
                });
            }
            // Range. This is generated via the -diagnostics-print-source-range-info
            // clang flag.
            var re2 = /^.*?:\d+?:\d+?:\{(\d+?):(\d+?)-(\d+?):(\d+?)\}:\s(.*)$/gm;
            while ((m = re2.exec(response)) !== null) {
                if (m.index === re2.lastIndex) {
                    re2.lastIndex++;
                }
                var message = m[5];
                let severity = monaco.Severity.Info;
                if (message.indexOf("error") >= 0) {
                    severity = monaco.Severity.Error;
                }
                else if (message.indexOf("warning") >= 0) {
                    severity = monaco.Severity.Warning;
                }
                annotations.push({
                    severity, message,
                    startLineNumber: parseInt(m[1]), startColumn: parseInt(m[2]),
                    endLineNumber: parseInt(m[3]), endColumn: parseInt(m[4])
                });
            }
        }
        return annotations;
    }
    static compileFile(file, from, to, options = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Service.compile(file.getData(), from, to, options);
            let markers = Service.getMarkers(result.tasks[0].console);
            if (markers.length) {
                monaco.editor.setModelMarkers(file.buffer, "compiler", markers);
                file.setProblems(markers.map(marker => {
                    return model_1.Problem.fromMarker(file, marker);
                }));
            }
            if (!result.success) {
                throw new Error(result.message);
            }
            var buffer = atob(result.output);
            var data = new Uint8Array(buffer.length);
            for (var i = 0; i < buffer.length; i++) {
                data[i] = buffer.charCodeAt(i);
            }
            return data;
        });
    }
    static compile(src, from, to, options = "") {
        return __awaiter(this, void 0, void 0, function* () {
            if (from === Language.C && to === Language.Wasm) {
                let project = {
                    output: "wasm",
                    files: [
                        {
                            type: from,
                            name: "file." + from,
                            options,
                            src
                        }
                    ]
                };
                let input = encodeURIComponent(JSON.stringify(project)).replace('%20', '+');
                return this.sendRequest("input=" + input + "&action=build");
            }
            else if (from === Language.Wasm && to === Language.x86) {
                let input = encodeURIComponent(base64js.fromByteArray(src));
                return this.sendRequest("input=" + input + "&action=wasm2assembly&options=" + encodeURIComponent(options));
            }
            /*
            src = encodeURIComponent(src).replace('%20', '+');
            if (from === Language.C && to === Language.Wast) {
              let action = "c2wast";
              let version = "2";
              options = "-O3 -fdiagnostics-print-source-range-info " + options;
              let command = [
                `input=${src}`,
                `action=${action}`,
                `version=${version}`,
                `options=${encodeURIComponent(options)}`
              ]
              return this.sendRequest(command.join("&"));
            } else if (from === Language.Wast && to === Language.Wasm) {
              let action = "wast2wasm";
              let version = "";
              let command = [
                `input=${src}`,
                `action=${action}`,
                `version=${version}`,
                `options=${encodeURIComponent(options)}`
              ]
              const x = await this.sendRequest(command.join("&"));
              var buffer = atob(x.split('\n', 2)[1]);
              var data = new Uint8Array(buffer.length);
              for (var i = 0; i < buffer.length; i++) {
                data[i] = buffer.charCodeAt(i);
              }
              return data;
            } else if (from === Language.Wast && to === Language.x86) {
              let action = "wast2assembly";
              let version = "";
              let command = [
                `input=${src}`,
                `action=${action}`,
                `version=${version}`,
                `options=${encodeURIComponent(options)}`
              ]
              return this.sendRequest(command.join("&"));
            }
            */
        });
    }
    static disassembleWasm(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof wabt === "undefined") {
                yield Service.lazyLoad("lib/libwabt.js");
            }
            var module = wabt.readWasm(buffer, { readDebugNames: true });
            if (true) {
                module.generateNames();
                module.applyNames();
            }
            return module.toText({ foldExprs: false, inlineExport: true });
        });
    }
    static disassembleWasmWithWabt(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Service.disassembleWasm(file.getData());
            let output = file.parent.newFile(file.name + ".wast", model_1.FileType.Wast);
            output.description = "Disassembled from " + file.name + " using Wabt.";
            output.setData(result);
        });
    }
    static assembleWast(wast) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof wabt === "undefined") {
                yield Service.lazyLoad("lib/libwabt.js");
            }
            var module = wabt.parseWat('test.wast', wast);
            module.resolveNames();
            module.validate();
            let binary = module.toBinary({ log: true, write_debug_names: true });
            return binary.buffer;
        });
    }
    static assembleWastWithWabt(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Service.assembleWast(file.getData());
            let output = file.parent.newFile(file.name + ".wasm", model_1.FileType.Wasm);
            output.description = "Assembled from " + file.name + " using Wabt.";
            output.setData(result);
        });
    }
    static disassembleWasmWithWasmDisassembler(file) {
        let buffer = file.getData();
        let reader = new wasmparser_1.BinaryReader();
        reader.setData(buffer, 0, buffer.byteLength);
        let dis = new wasmparser_1.WasmDisassembler();
        dis.addOffsets = true;
        dis.disassembleChunk(reader);
        let result = dis.getResult().lines.join("\n");
        let output = file.parent.newFile(file.name + ".wast", model_1.FileType.Wast);
        output.description = "Disassembled from " + file.name + " using WasmDisassembler.";
        output.setData(result);
        return;
    }
    static loadJSON(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = "https://api.myjson.com/bins/" + uri;
            const response = yield fetch(url, {
                headers: new Headers({ "Content-type": "application/json; charset=utf-8" })
            });
            return JSON.parse(yield response.text());
        });
    }
    static saveJSON(json, uri) {
        let update = !!uri;
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("load", function () {
                if (update) {
                    resolve(uri);
                }
                else {
                    let jsonURI = JSON.parse(this.response).uri;
                    jsonURI = jsonURI.substring(jsonURI.lastIndexOf("/") + 1);
                    resolve(jsonURI);
                }
            });
            xhr.addEventListener("error", function () {
                reject();
            });
            if (update) {
                xhr.open("PUT", "//api.myjson.com/bins/" + uri, true);
            }
            else {
                xhr.open("POST", "//api.myjson.com/bins", true);
            }
            xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
            xhr.send(JSON.stringify(json));
        });
    }
    static parseFiddleURI() {
        let uri = window.location.search.substring(1);
        if (uri) {
            let i = uri.indexOf("/");
            if (i > 0) {
                uri = uri.substring(0, i);
            }
        }
        return uri;
    }
    static saveProject(project, openedFiles, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            function serialize(file) {
                if (file instanceof model_1.Directory) {
                    return {
                        name: file.name,
                        children: file.mapEachFile((file) => serialize(file))
                    };
                }
                else {
                    return {
                        name: file.name,
                        type: file.type,
                        data: file.data
                    };
                }
            }
            let json = serialize(project);
            json.openedFiles = openedFiles;
            return yield this.saveJSON(json, uri);
        });
    }
    static loadProject(json, project) {
        return __awaiter(this, void 0, void 0, function* () {
            function deserialize(json, basePath) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (Array.isArray(json)) {
                        return Promise.all(json.map((x) => deserialize(x, basePath)));
                    }
                    if (json.children) {
                        const directory = new model_1.Directory(json.name);
                        (yield deserialize(json.children, basePath + "/" + json.name)).forEach((file) => {
                            directory.addFile(file);
                        });
                        return directory;
                    }
                    const file = new model_1.File(json.name, json.type);
                    if (json.data) {
                        file.setData(json.data);
                    }
                    else {
                        const request = yield fetch(basePath + "/" + json.name);
                        file.setData(yield request.text());
                    }
                    return file;
                });
            }
            project.name = json.name;
            (yield deserialize(json.children, "templates/" + json.directory)).forEach((file) => {
                project.addFile(file);
            });
            return json;
        });
    }
    static lazyLoad(uri) {
        return new Promise((resolve, reject) => {
            var self = this;
            var d = window.document;
            var b = d.body;
            var e = d.createElement("script");
            e.async = true;
            e.src = uri;
            b.appendChild(e);
            e.onload = function () {
                resolve(this);
            };
        });
    }
    static optimizeWasmWithBinaryen(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof Binaryen === "undefined") {
                yield Service.lazyLoad("lib/binaryen.js");
            }
            let data = file.getData();
            let module = Binaryen.readBinary(data);
            module.optimize();
            data = module.emitBinary();
            file.setData(data);
            file.buffer.setValue(yield Service.disassembleWasm(data));
        });
    }
    static validateWasmWithBinaryen(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof Binaryen === "undefined") {
                yield Service.lazyLoad("lib/binaryen.js");
            }
            let data = file.getData();
            let module = Binaryen.readBinary(data);
            alert(module.validate());
        });
    }
    static validateWastWithBinaryen(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof Binaryen === "undefined") {
                yield Service.lazyLoad("lib/binaryen.js");
            }
            let data = file.getData();
            let module = Binaryen.parseText(data);
            alert(module.validate());
        });
    }
    static disassembleWasmWithBinaryen(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof Binaryen === "undefined") {
                yield Service.lazyLoad("lib/binaryen.js");
            }
            let data = file.getData();
            let module = Binaryen.readBinary(data);
            let output = file.parent.newFile(file.name + ".wast", model_1.FileType.Wast);
            output.description = "Disassembled from " + file.name + " using Binaryen.";
            output.setData(module.emitText());
        });
    }
    static download(file) {
        if (!Service.downloadLink) {
            Service.downloadLink = document.createElement("a");
            Service.downloadLink.style.display = "none";
            document.body.appendChild(Service.downloadLink);
        }
        index_1.assert(file.type == model_1.FileType.Wasm);
        let url = URL.createObjectURL(new Blob([file.getData()], { type: 'application/wasm' }));
        Service.downloadLink.href = url;
        Service.downloadLink.download = file.name;
        if (Service.downloadLink.href != document.location) {
            Service.downloadLink.click();
        }
    }
    // Kudos to https://github.com/tbfleming/cib
    static clangFormat(file) {
        return __awaiter(this, void 0, void 0, function* () {
            function format() {
                let result = Service.clangFormatModule.ccall('formatCode', 'string', ['string'], [file.buffer.getValue()]);
                file.buffer.setValue(result);
            }
            if (Service.clangFormatModule) {
                format();
            }
            else {
                yield Service.lazyLoad("lib/clang-format.js");
                const response = yield fetch('lib/clang-format.wasm');
                const wasmBinary = yield response.arrayBuffer();
                let module = {
                    postRun() {
                        format();
                    },
                    wasmBinary
                };
                Service.clangFormatModule = Module(module);
            }
        });
    }
    static disassembleX86(file, options = "") {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof capstone === "undefined") {
                yield Service.lazyLoad("lib/capstone.x86.min.js");
            }
            let output = file.parent.newFile(file.name + ".x86", model_1.FileType.x86);
            function toBytes(a) {
                return a.map(function (x) { return util_1.padLeft(Number(x).toString(16), 2, "0"); }).join(" ");
            }
            let data = file.getData();
            const json = yield Service.compile(data, Language.Wasm, Language.x86, options);
            let s = "";
            var cs = new capstone.Cs(capstone.ARCH_X86, capstone.MODE_64);
            var annotations = [];
            var assemblyInstructionsByAddress = Object.create(null);
            for (var i = 0; i < json.regions.length; i++) {
                var region = json.regions[i];
                s += region.name + ":\n";
                var csBuffer = util_1.decodeRestrictedBase64ToBytes(region.bytes);
                var instructions = cs.disasm(csBuffer, region.entry);
                var basicBlocks = {};
                instructions.forEach(function (instr, i) {
                    assemblyInstructionsByAddress[instr.address] = instr;
                    if (util_1.isBranch(instr)) {
                        var targetAddress = parseInt(instr.op_str);
                        if (!basicBlocks[targetAddress]) {
                            basicBlocks[targetAddress] = [];
                        }
                        basicBlocks[targetAddress].push(instr.address);
                        if (i + 1 < instructions.length) {
                            basicBlocks[instructions[i + 1].address] = [];
                        }
                    }
                });
                instructions.forEach(function (instr) {
                    if (basicBlocks[instr.address]) {
                        s += " " + util_1.padRight(util_1.toAddress(instr.address) + ":", 39, " ");
                        if (basicBlocks[instr.address].length > 0) {
                            s += "; " + util_1.toAddress(instr.address) + " from: [" + basicBlocks[instr.address].map(util_1.toAddress).join(", ") + "]";
                        }
                        s += "\n";
                    }
                    s += "  " + util_1.padRight(instr.mnemonic + " " + instr.op_str, 38, " ");
                    s += "; " + util_1.toAddress(instr.address) + " " + toBytes(instr.bytes) + "\n";
                });
                s += "\n";
            }
            output.setData(s);
        });
    }
    static compileMarkdownToHtml(src) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof showdown === "undefined") {
                yield Service.lazyLoad("lib/showdown.min.js");
            }
            var converter = new showdown.Converter({ tables: true });
            showdown.setFlavor('github');
            return converter.makeHtml(src);
        });
    }
}
Service.downloadLink = null;
// static disassembleWasmWithWasmDisassembler(file: File) {
//   let data = file.getData() as ArrayBuffer;
//   let output = file.parent.newFile(file.name + ".wast", FileType.Wast);
//   output.description = "Disassembled from " + file.name + " using WasmDisassembler.";
//   output.setData(Service.disassembleWasm(data));
// }
Service.clangFormatModule = null;
exports.Service = Service;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(51)
var ieee754 = __webpack_require__(52)
var isArray = __webpack_require__(28)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 15 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29);
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(17);
exports.Duplex = __webpack_require__(4);
exports.Transform = __webpack_require__(34);
exports.PassThrough = __webpack_require__(58);


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate, global) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.



/*<replacement>*/

var processNextTick = __webpack_require__(11);
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(6);
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(57)
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(30);
/*</replacement>*/

/*<replacement>*/
var Buffer = __webpack_require__(12).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

var destroyImpl = __webpack_require__(31);

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(4);

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __webpack_require__(4);

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = _isUint8Array(chunk) && !state.objectMode;

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    processNextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    processNextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      processNextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(32).setImmediate, __webpack_require__(8)))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const model_1 = __webpack_require__(2);
__webpack_require__(5);
class Monaco extends React.Component {
    constructor() {
        super(...arguments);
        this.timeout = 0;
        this.layout = () => {
            if (this.timeout) {
                window.clearTimeout(this.timeout);
            }
            this.timeout = window.setTimeout(() => {
                this.timeout = 0;
                this.editor.layout();
            }, 10);
        };
    }
    revealLastLine() {
        this.editor.revealLine(this.editor.getModel().getLineCount());
    }
    componentDidMount() {
        let { view } = this.props;
        if (view) {
            this.ensureEditor();
            this.editor.setModel(view.file.buffer);
            // TODO: Weird that we need this to make monaco really think it needs to update the language.
            monaco.editor.setModelLanguage(this.editor.getModel(), model_1.languageForFileType(view.file.type));
            this.editor.restoreViewState(view.state);
            this.editor.updateOptions({ readOnly: view.file.isBufferReadOnly });
        }
        document.addEventListener("layout", this.layout);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.view !== nextProps.view) {
            // We're about to switch to a new file, save the view state.
            this.props.view.state = this.editor.saveViewState();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.view === nextProps.view) {
            return false;
        }
        return true;
    }
    componentDidUpdate() {
        let { view } = this.props;
        if (view) {
            this.ensureEditor();
            this.editor.setModel(view.file.buffer);
            this.editor.restoreViewState(view.state);
            this.editor.updateOptions({ readOnly: view.file.isBufferReadOnly });
        }
    }
    componentWillUnmount() {
        document.removeEventListener("layout", this.layout);
        // We're about to close the editor, save the view state.
        this.props.view.state = this.editor.saveViewState();
    }
    registerActions() {
        let self = this;
        this.editor.addAction({
            id: 'save',
            label: 'Save',
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S
            ],
            precondition: null,
            keybindingContext: null,
            run: function () {
                let view = self.props.view;
                if (view && !view.file.isBufferReadOnly) {
                    view.file.save();
                }
                return null;
            }
        });
        this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_B, function () {
            model_1.Project.build();
        }, null);
        this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function () {
            model_1.Project.run();
        }, null);
    }
    ensureEditor() {
        if (this.editor)
            return;
        let options = Object.assign({
            value: "",
            theme: "fiddle-theme",
            minimap: {
                enabled: false
            },
            fontWeight: "bold",
            renderLineHighlight: "none",
        }, this.props.options);
        if (this.container.lastChild) {
            this.container.removeChild(this.container.lastChild);
        }
        this.editor = monaco.editor.create(this.container, options);
        this.registerActions();
        console.info("Created a new Monaco editor.");
    }
    setContainer(container) {
        if (container == null)
            return;
        if (this.container !== container) {
            // ...
        }
        this.container = container;
    }
    render() {
        return React.createElement("div", { className: "fill", ref: (ref) => this.setContainer(ref) });
    }
}
exports.Monaco = Monaco;
class Editor extends React.Component {
    setMonaco(monaco) {
        this.monaco = monaco;
    }
    revealLastLine() {
        this.monaco.revealLastLine();
    }
    render() {
        let file = this.props.view.file;
        if (file.description) {
            return React.createElement("div", { className: "fill" },
                React.createElement("div", { className: "editor-status-bar" },
                    React.createElement("div", { className: "status-bar-item" }, file.description)),
                React.createElement("div", { className: "editor-container" },
                    React.createElement(Monaco, { ref: (ref) => this.setMonaco(ref), view: this.props.view, options: this.props.options })),
                ";");
        }
        else {
            return React.createElement("div", { className: "fill" },
                React.createElement(Monaco, { ref: (ref) => this.setMonaco(ref), view: this.props.view, options: this.props.options }));
        }
    }
}
exports.Editor = Editor;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const index_1 = __webpack_require__(3);
class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.onWheel = (e) => {
            let delta = index_1.clamp(e.deltaY, -16, 16);
            let { scrollLeft } = this.state;
            scrollLeft += delta;
            // TODO: Work out the details of scrolling.
            scrollLeft = index_1.clamp(scrollLeft, 0, this.refs.container.clientWidth);
            this.setState({ scrollLeft });
            e.preventDefault();
        };
        this.onDoubleClick = (e) => {
            this.props.onDoubleClick && this.props.onDoubleClick();
        };
        this.state = {
            scrollLeft: 0
        };
    }
    render() {
        return React.createElement("div", { className: "tabs-container" },
            React.createElement("div", { ref: "container", className: "tabs-tab-container", onWheel: this.onWheel, onDoubleClick: this.onDoubleClick }, this.props.children),
            React.createElement("div", { className: "tabs-command-container" }, this.props.commands));
    }
    componentDidUpdate() {
        this.refs.container.scrollLeft = this.state.scrollLeft;
    }
}
exports.Tabs = Tabs;
class Tab extends React.Component {
    render() {
        let { onClick, onDoubleClick, onClose } = this.props;
        let className = "tab";
        if (this.props.isActive)
            className += " active";
        if (this.props.isMarked)
            className += " marked";
        if (this.props.isItalic)
            className += " italic";
        return React.createElement("div", { className: className, onClick: (e) => {
                e.stopPropagation();
                onClick && onClick(this.props.value);
            }, onDoubleClick: (e) => {
                e.stopPropagation();
                onDoubleClick && onDoubleClick(this.props.value);
            } },
            this.props.icon && React.createElement("div", { className: "icon", style: {
                    backgroundImage: `url(svg/${this.props.icon}.svg)`
                } }),
            React.createElement("div", { className: "label" }, this.props.label),
            React.createElement("div", { className: "close", onClick: (e) => {
                    e.stopPropagation();
                    onClose && onClose(this.props.value);
                } }));
    }
}
exports.Tab = Tab;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
class Icon extends React.Component {
    render() {
        return React.createElement("div", { style: {
                width: 16, height: 16,
                backgroundImage: `url("${this.props.src}")`
            } });
    }
}
exports.Icon = Icon;
class GoRepoForked extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-repo-forked", viewBox: "0 0 10 16", version: "1.1", width: "10", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z" }));
    }
}
exports.GoRepoForked = GoRepoForked;
class GoBeaker extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-beaker", viewBox: "0 0 16 16", version: "1.1", width: "16", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M14.38 14.59L11 7V3h1V2H3v1h1v4L.63 14.59A1 1 0 0 0 1.54 16h11.94c.72 0 1.2-.75.91-1.41h-.01zM3.75 10L5 7V3h5v4l1.25 3h-7.5zM8 8h1v1H8V8zM7 7H6V6h1v1zm0-3h1v1H7V4zm0-3H6V0h1v1z" }));
    }
}
exports.GoBeaker = GoBeaker;
class GoGear extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-gear", viewBox: "0 0 14 16", version: "1.1", width: "14", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M14 8.77v-1.6l-1.94-.64-.45-1.09.88-1.84-1.13-1.13-1.81.91-1.09-.45-.69-1.92h-1.6l-.63 1.94-1.11.45-1.84-.88-1.13 1.13.91 1.81-.45 1.09L0 7.23v1.59l1.94.64.45 1.09-.88 1.84 1.13 1.13 1.81-.91 1.09.45.69 1.92h1.59l.63-1.94 1.11-.45 1.84.88 1.13-1.13-.92-1.81.47-1.09L14 8.75v.02zM7 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" }));
    }
}
exports.GoGear = GoGear;
class GoBook extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-book", viewBox: "0 0 16 16", version: "1.1", width: "16", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M3 5h4v1H3V5zm0 3h4V7H3v1zm0 2h4V9H3v1zm11-5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm2-6v9c0 .55-.45 1-1 1H9.5l-1 1-1-1H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5.5l1 1 1-1H15c.55 0 1 .45 1 1zm-8 .5L7.5 3H2v9h6V3.5zm7-.5H9.5l-.5.5V12h6V3z" }));
    }
}
exports.GoBook = GoBook;
class GoRocket extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-rocket", viewBox: "0 0 16 16", version: "1.1", width: "16", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M12.17 3.83c-.27-.27-.47-.55-.63-.88-.16-.31-.27-.66-.34-1.02-.58.33-1.16.7-1.73 1.13-.58.44-1.14.94-1.69 1.48-.7.7-1.33 1.81-1.78 2.45H3L0 10h3l2-2c-.34.77-1.02 2.98-1 3l1 1c.02.02 2.23-.64 3-1l-2 2v3l3-3v-3c.64-.45 1.75-1.09 2.45-1.78.55-.55 1.05-1.13 1.47-1.7.44-.58.81-1.16 1.14-1.72-.36-.08-.7-.19-1.03-.34a3.39 3.39 0 0 1-.86-.63M16 0s-.09.38-.3 1.06c-.2.7-.55 1.58-1.06 2.66-.7-.08-1.27-.33-1.66-.72-.39-.39-.63-.94-.7-1.64C13.36.84 14.23.48 14.92.28 15.62.08 16 0 16 0" }));
    }
}
exports.GoRocket = GoRocket;
class GoPencil extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-pencil", viewBox: "0 0 14 16", version: "1.1", width: "14", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M0 12v3h3l8-8-3-3-8 8zm3 2H1v-2h1v1h1v1zm10.3-9.3L12 6 9 3l1.3-1.3a.996.996 0 0 1 1.41 0l1.59 1.59c.39.39.39 1.02 0 1.41z" }));
    }
}
exports.GoPencil = GoPencil;
class GoDelete extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-x", viewBox: "0 0 12 16", version: "1.1", width: "12", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z" }));
    }
}
exports.GoDelete = GoDelete;
class GoVerified extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-verified", viewBox: "0 0 16 16", version: "1.1", width: "16", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M15.67 7.06l-1.08-1.34c-.17-.22-.28-.48-.31-.77l-.19-1.7a1.51 1.51 0 0 0-1.33-1.33l-1.7-.19c-.3-.03-.56-.16-.78-.33L8.94.32c-.55-.44-1.33-.44-1.88 0L5.72 1.4c-.22.17-.48.28-.77.31l-1.7.19c-.7.08-1.25.63-1.33 1.33l-.19 1.7c-.03.3-.16.56-.33.78L.32 7.05c-.44.55-.44 1.33 0 1.88l1.08 1.34c.17.22.28.48.31.77l.19 1.7c.08.7.63 1.25 1.33 1.33l1.7.19c.3.03.56.16.78.33l1.34 1.08c.55.44 1.33.44 1.88 0l1.34-1.08c.22-.17.48-.28.77-.31l1.7-.19c.7-.08 1.25-.63 1.33-1.33l.19-1.7c.03-.3.16-.56.33-.78l1.08-1.34c.44-.55.44-1.33 0-1.88zM6.5 12L3 8.5 4.5 7l2 2 5-5L13 5.55 6.5 12z" }));
    }
}
exports.GoVerified = GoVerified;
class GoFile extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-file", viewBox: "0 0 12 16", version: "1.1", width: "12", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z" }));
    }
}
exports.GoFile = GoFile;
class GoFileBinary extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-file-binary", viewBox: "0 0 12 16", version: "1.1", width: "12", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M4 12h1v1H2v-1h1v-2H2V9h2v3zm8-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5zM8 4H6v1h1v2H6v1h3V7H8V4zM2 4h3v4H2V4zm1 3h1V5H3v2zm3 2h3v4H6V9zm1 3h1v-2H7v2z" }));
    }
}
exports.GoFileBinary = GoFileBinary;
class GoFileCode extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-file-code", viewBox: "0 0 12 16", version: "1.1", width: "12", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M8.5 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V4.5L8.5 1zM11 14H1V2h7l3 3v9zM5 6.98L3.5 8.5 5 10l-.5 1L2 8.5 4.5 6l.5.98zM7.5 6L10 8.5 7.5 11l-.5-.98L8.5 8.5 7 7l.5-1z" }));
    }
}
exports.GoFileCode = GoFileCode;
class GoQuote extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-quote", viewBox: "0 0 14 16", version: "1.1", width: "14", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M6.16 3.5C3.73 5.06 2.55 6.67 2.55 9.36c.16-.05.3-.05.44-.05 1.27 0 2.5.86 2.5 2.41 0 1.61-1.03 2.61-2.5 2.61-1.9 0-2.99-1.52-2.99-4.25 0-3.8 1.75-6.53 5.02-8.42L6.16 3.5zm7 0c-2.43 1.56-3.61 3.17-3.61 5.86.16-.05.3-.05.44-.05 1.27 0 2.5.86 2.5 2.41 0 1.61-1.03 2.61-2.5 2.61-1.89 0-2.98-1.52-2.98-4.25 0-3.8 1.75-6.53 5.02-8.42l1.14 1.84h-.01z" }));
    }
}
exports.GoQuote = GoQuote;
class GoDesktopDownload extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-desktop-download", viewBox: "0 0 16 16", version: "1.1", width: "16", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M4 6h3V0h2v6h3l-4 4-4-4zm11-4h-4v1h4v8H1V3h4V2H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5.34c-.25.61-.86 1.39-2.34 2h8c-1.48-.61-2.09-1.39-2.34-2H15c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z" }));
    }
}
exports.GoDesktopDownload = GoDesktopDownload;
class GoX extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-x", viewBox: "0 0 12 16", version: "1.1", width: "12", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z" }));
    }
}
exports.GoX = GoX;
class GoKebabHorizontal extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-kebab-horizontal", viewBox: "0 0 13 16", version: "1.1", width: "13", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M1.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" }));
    }
}
exports.GoKebabHorizontal = GoKebabHorizontal;
class GoThreeBars extends React.PureComponent {
    render() {
        return React.createElement("svg", { className: "octicon octicon-three-bars", viewBox: "0 0 12 16", version: "1.1", width: "12", height: "16", "aria-hidden": "true" },
            React.createElement("path", { fillRule: "evenodd", d: "M11.41 9H.59C0 9 0 8.59 0 8c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zm0-4H.59C0 5 0 4.59 0 4c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM.59 11H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1H.59C0 13 0 12.59 0 12c0-.59 0-1 .59-1z" }));
    }
}
exports.GoThreeBars = GoThreeBars;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
class Button extends React.Component {
    render() {
        let className = "button";
        if (this.props.isDisabled) {
            className += " disabled";
        }
        return React.createElement("div", { className: className, onClick: () => {
                if (this.props.onClick && !this.props.isDisabled) {
                    this.props.onClick();
                }
            }, title: this.props.title },
            this.props.icon,
            " ",
            this.props.label);
    }
}
exports.Button = Button;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
class Spacer extends React.Component {
    render() {
        return React.createElement("div", { style: { height: this.props.height } });
    }
}
exports.Spacer = Spacer;
class Divider extends React.Component {
    render() {
        return React.createElement("div", { className: "divider", style: {
                marginTop: this.props.height / 2,
                marginBottom: this.props.height / 2
            } });
    }
}
exports.Divider = Divider;
class TextInputBox extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const input = React.createElement("input", { className: "text-input-box", type: "text", value: this.props.value, onChange: this.props.onChange });
        if (this.props.label) {
            return React.createElement("div", { style: { display: "flex", flexDirection: "row" } },
                React.createElement("div", { className: "text-input-box-label" }, this.props.label),
                React.createElement("div", { style: { flex: 1 } }, input),
                this.props.error && React.createElement("div", { className: "text-input-box-error" }, this.props.error));
        }
        else {
            return input;
        }
    }
}
exports.TextInputBox = TextInputBox;
class ListItem extends React.Component {
    render() {
        let className = "list-item";
        if (this.props.selected) {
            className += " selected";
        }
        return React.createElement("div", { className: className, onClick: this.props.onClick },
            React.createElement("div", { className: "icon" }, this.props.icon),
            React.createElement("div", { className: "label" }, this.props.label));
    }
}
exports.ListItem = ListItem;
class ListBox extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { children, onSelect } = this.props;
        var newChildren = React.Children.map(children, (child, index) => {
            return React.cloneElement(child, {
                onClick: () => {
                    onSelect && onSelect(child.props.value);
                },
                selected: this.props.value === child.props.value
            });
        });
        return React.createElement("div", { className: "list-box", style: {
                height: this.props.height
            } }, newChildren);
    }
}
exports.ListBox = ListBox;


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __webpack_require__(44)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __webpack_require__(45)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),
/* 28 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



/*<replacement>*/

var processNextTick = __webpack_require__(11);
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = __webpack_require__(28);
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = __webpack_require__(15).EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(30);
/*</replacement>*/

// TODO(bmeurer): Change this back to const once hole checks are
// properly optimized away early in Ignition+TurboFan.
/*<replacement>*/
var Buffer = __webpack_require__(12).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(6);
/*</replacement>*/

/*<replacement>*/
var debugUtil = __webpack_require__(54);
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = __webpack_require__(55);
var destroyImpl = __webpack_require__(31);
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(4);

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __webpack_require__(33).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(4);

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __webpack_require__(33).StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], self.emit.bind(self, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8), __webpack_require__(1)))

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(15).EventEmitter;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

var processNextTick = __webpack_require__(11);
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      processNextTick(emitErrorNT, this, err);
    }
    return;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      processNextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(56);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(12).Buffer;

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return -1;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// UTF-8 replacement characters ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd'.repeat(p);
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd'.repeat(p + 1);
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd'.repeat(p + 2);
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character for each buffered byte of a (partial)
// character needs to be added to the output.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd'.repeat(this.lastTotal - this.lastNeed);
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.



module.exports = Transform;

var Duplex = __webpack_require__(4);

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(6);
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return stream.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
class MenuItem extends React.Component {
    render() {
        return React.createElement("div", { className: "menu-entry", onClick: this.props.onClick },
            React.createElement("div", { className: "icon" }, this.props.icon),
            React.createElement("div", { className: "label" }, this.props.label));
    }
}
exports.MenuItem = MenuItem;
function inFirefox() {
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}
class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { x: 0, y: 0, visible: false };
    }
    static closeActive() {
        if (Menu.active) {
            Menu.active.hide();
            Menu.active = null;
        }
    }
    hide() {
        this.setState({ visible: false });
    }
    onClick(e) {
        if (this.props.activateOnLeftClick && Menu.active === this) {
            return;
        }
        if (this.props.activateOnLeftClick) {
            this.onContextMenu(e);
            Menu.ignoreNextWindowClickEvent = true;
        }
    }
    onContextMenu(e) {
        Menu.closeActive();
        Menu.active = this;
        let offset = 4;
        let popupMenuWidth = 256;
        let onRight = e.clientX + offset + popupMenuWidth < window.innerWidth;
        let x = 0, y = 0;
        if (onRight) {
            x = e.clientX + offset;
        }
        else {
            x = e.clientX - offset - popupMenuWidth;
        }
        y = e.clientY + offset;
        this.setState({ x, y, visible: true });
        e.preventDefault();
        if (inFirefox()) {
            Menu.ignoreNextWindowClickEvent = true;
        }
    }
    // menu: HTMLDivElement;
    // setMenu(menu: HTMLDivElement) {
    //   this.menu = menu;
    // }
    render() {
        return React.createElement("div", { className: "menu", onClick: this.onClick.bind(this), onContextMenu: this.onContextMenu.bind(this) },
            this.state.visible && React.createElement("div", { style: { left: this.state.x, top: this.state.y }, className: "menu popup" }, this.props.items),
            this.props.children);
    }
}
Menu.active = null;
Menu.ignoreNextWindowClickEvent = false;
exports.Menu = Menu;
window.addEventListener("click", (e) => {
    if (Menu.ignoreNextWindowClickEvent) {
        Menu.ignoreNextWindowClickEvent = false;
        return;
    }
    // console.log("window click");
    Menu.closeActive();
});


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const index_1 = __webpack_require__(3);
const Tabs_1 = __webpack_require__(19);
const Editor_1 = __webpack_require__(18);
const model_1 = __webpack_require__(2);
__webpack_require__(5);
const Markdown_1 = __webpack_require__(71);
const Button_1 = __webpack_require__(21);
const Icons_1 = __webpack_require__(20);
const Menu_1 = __webpack_require__(35);
class View {
    constructor(file, state) {
        this.file = file;
        this.state = state;
        // ...
    }
}
exports.View = View;
class EditorPaneProps {
}
exports.EditorPaneProps = EditorPaneProps;
function diff(a, b) {
    return {
        ab: a.filter(x => b.indexOf(x) < 0),
        ba: b.filter(x => a.indexOf(x) < 0)
    };
}
class EditorPane extends React.Component {
    constructor(props) {
        super(props);
        this.onUpdate = () => {
            this.forceUpdate();
        };
        let views = new Map();
        props.files.forEach((file) => {
            views.set(file, new View(file, null));
        });
        this.state = { views };
    }
    componentWillReceiveProps(nextProps) {
        let views = this.state.views;
        nextProps.files.forEach((file) => {
            if (!views.has(file)) {
                views.set(file, new View(file, null));
            }
        });
    }
    render() {
        let { onClickFile, onDoubleClickFile, onClose, file, preview, hasFocus } = this.props;
        let { views } = this.state;
        let view;
        if (file) {
            view = views.get(file);
            index_1.assert(view);
        }
        let viewer;
        if (file && file.type === model_1.FileType.Markdown) {
            viewer = React.createElement(Markdown_1.Markdown, { src: file.getData() });
        }
        else if (file) {
            viewer = React.createElement(Editor_1.Editor, { view: view, options: { readOnly: file.isBufferReadOnly } });
        }
        else {
            return React.createElement("div", { className: "editor-pane-container empty" });
        }
        let className = "editor-pane-container";
        if (!hasFocus)
            className += " blurred";
        return React.createElement("div", { className: className, onClick: this.props.onFocus },
            React.createElement(Tabs_1.Tabs, { onDoubleClick: () => {
                    this.props.onNewFile && this.props.onNewFile();
                }, commands: [
                    React.createElement(Button_1.Button, { key: "split", icon: React.createElement(Icons_1.GoBook, null), title: "Split Editor", onClick: () => {
                            this.props.onSplitEditor && this.props.onSplitEditor();
                        } }),
                    React.createElement(Menu_1.Menu, { key: file.key, activateOnLeftClick: true, items: [React.createElement(Menu_1.MenuItem, { key: "new file", label: "New File", icon: React.createElement(Icons_1.GoFile, null), onClick: () => {
                                } })] },
                        React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoKebabHorizontal, null), title: "Split Editor" }))
                ] }, this.props.files.map(x => {
                return React.createElement(Tabs_1.Tab, { key: x.key, label: x.name, value: x, icon: model_1.getIconForFileType(x.type), isMarked: x.isDirty, isActive: x === file, isItalic: x === preview, onClick: onClickFile, onDoubleClick: onDoubleClickFile, onClose: onClose });
            })),
            React.createElement("div", { style: { height: "calc(100% - 40px)" } }, viewer));
    }
}
exports.EditorPane = EditorPane;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Modal = __webpack_require__(78);

var _Modal2 = _interopRequireDefault(_Modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Modal2.default;
module.exports = exports["default"];

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(79)(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(82)();
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(22);

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findTabbableDescendants;
/*!
 * Adapted from jQuery UI core
 *
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */

var tabbableNode = /input|select|textarea|button|object/;

function hidesContents(element) {
  var zeroSize = element.offsetWidth <= 0 && element.offsetHeight <= 0;

  // If the node is empty, this is good enough
  if (zeroSize && !element.innerHTML) return true;

  // Otherwise we need to check some styles
  var style = window.getComputedStyle(element);
  return zeroSize ? style.getPropertyValue("overflow") !== "visible" : style.getPropertyValue("display") == "none";
}

function visible(element) {
  var parentElement = element;
  while (parentElement) {
    if (parentElement === document.body) break;
    if (hidesContents(parentElement)) return false;
    parentElement = parentElement.parentNode;
  }
  return true;
}

function focusable(element, isTabIndexNotNaN) {
  var nodeName = element.nodeName.toLowerCase();
  var res = tabbableNode.test(nodeName) && !element.disabled || (nodeName === "a" ? element.href || isTabIndexNotNaN : isTabIndexNotNaN);
  return res && visible(element);
}

function tabbable(element) {
  var tabIndex = element.getAttribute("tabindex");
  if (tabIndex === null) tabIndex = undefined;
  var isTabIndexNaN = isNaN(tabIndex);
  return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
}

function findTabbableDescendants(element) {
  return [].slice.call(element.querySelectorAll("*"), 0).filter(tabbable);
}
module.exports = exports["default"];

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertNodeList = assertNodeList;
exports.setElement = setElement;
exports.validateElement = validateElement;
exports.hide = hide;
exports.show = show;
exports.documentNotReadyOrSSRTesting = documentNotReadyOrSSRTesting;
exports.resetForTesting = resetForTesting;

var _warning = __webpack_require__(86);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globalElement = null;

function assertNodeList(nodeList, selector) {
  if (!nodeList || !nodeList.length) {
    throw new Error("react-modal: No elements were found for selector " + selector + ".");
  }
}

function setElement(element) {
  var useElement = element;
  if (typeof useElement === "string") {
    var el = document.querySelectorAll(useElement);
    assertNodeList(el, useElement);
    useElement = "length" in el ? el[0] : el;
  }
  globalElement = useElement || globalElement;
  return globalElement;
}

function validateElement(appElement) {
  if (!appElement && !globalElement) {
    (0, _warning2.default)(false, ["react-modal: App element is not defined.", "Please use `Modal.setAppElement(el)` or set `appElement={el}`.", "This is needed so screen readers don't see main content", "when modal is opened. It is not recommended, but you can opt-out", "by setting `ariaHideApp={false}`."].join(" "));

    return false;
  }

  return true;
}

function hide(appElement) {
  if (validateElement(appElement)) {
    (appElement || globalElement).setAttribute("aria-hidden", "true");
  }
}

function show(appElement) {
  if (validateElement(appElement)) {
    (appElement || globalElement).removeAttribute("aria-hidden");
  }
}

function documentNotReadyOrSSRTesting() {
  globalElement = null;
}

function resetForTesting() {
  globalElement = null;
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.add = add;
exports.remove = remove;
exports.totalCount = totalCount;
var classListMap = {};

function get() {
  return classListMap;
}

function add(bodyClass) {
  // Set variable and default if none
  if (!classListMap[bodyClass]) {
    classListMap[bodyClass] = 0;
  }
  classListMap[bodyClass] += 1;
  return bodyClass;
}

function remove(bodyClass) {
  if (classListMap[bodyClass]) {
    classListMap[bodyClass] -= 1;
  }
  return bodyClass;
}

function totalCount() {
  return Object.keys(classListMap).reduce(function (acc, curr) {
    return acc + classListMap[curr];
  }, 0);
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canUseDOM = undefined;

var _exenv = __webpack_require__(88);

var _exenv2 = _interopRequireDefault(_exenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EE = _exenv2.default;

var SafeHTMLElement = EE.canUseDOM ? window.HTMLElement : {};

var canUseDOM = exports.canUseDOM = EE.canUseDOM;

exports.default = SafeHTMLElement;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var concatMap = __webpack_require__(46);
var balanced = __webpack_require__(47);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Just re-exporting everything.
var WasmParser_1 = __webpack_require__(7);
exports.SectionCode = WasmParser_1.SectionCode;
exports.OperatorCode = WasmParser_1.OperatorCode;
exports.OperatorCodeNames = WasmParser_1.OperatorCodeNames;
exports.ExternalKind = WasmParser_1.ExternalKind;
exports.Type = WasmParser_1.Type;
exports.RelocType = WasmParser_1.RelocType;
exports.LinkingType = WasmParser_1.LinkingType;
exports.NameType = WasmParser_1.NameType;
exports.BinaryReaderState = WasmParser_1.BinaryReaderState;
exports.Int64 = WasmParser_1.Int64;
exports.BinaryReader = WasmParser_1.BinaryReader;
exports.bytesToString = WasmParser_1.bytesToString;
var WasmEmitter_1 = __webpack_require__(49);
exports.Emitter = WasmEmitter_1.Emitter;
var WasmParserTransform_1 = __webpack_require__(50);
exports.BinaryReaderTransform = WasmParserTransform_1.BinaryReaderTransform;
var WasmDis_1 = __webpack_require__(63);
exports.DefaultNameResolver = WasmDis_1.DefaultNameResolver;
exports.NumericNameResolver = WasmDis_1.NumericNameResolver;
exports.WasmDisassembler = WasmDis_1.WasmDisassembler;
exports.LabelMode = WasmDis_1.LabelMode;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* Copyright 2017 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var WasmParser_1 = __webpack_require__(7);
var EmitterState;
(function (EmitterState) {
    EmitterState[EmitterState["Initial"] = 0] = "Initial";
    EmitterState[EmitterState["Error"] = 1] = "Error";
    EmitterState[EmitterState["Wasm"] = 2] = "Wasm";
    EmitterState[EmitterState["CustomSecton"] = 3] = "CustomSecton";
    EmitterState[EmitterState["TypeSection"] = 4] = "TypeSection";
    EmitterState[EmitterState["ImportSection"] = 5] = "ImportSection";
    EmitterState[EmitterState["FunctionSection"] = 6] = "FunctionSection";
    EmitterState[EmitterState["TableSection"] = 7] = "TableSection";
    EmitterState[EmitterState["MemorySection"] = 8] = "MemorySection";
    EmitterState[EmitterState["GlobalSection"] = 9] = "GlobalSection";
    EmitterState[EmitterState["ExportSection"] = 10] = "ExportSection";
    EmitterState[EmitterState["StartSection"] = 11] = "StartSection";
    EmitterState[EmitterState["ElementSection"] = 12] = "ElementSection";
    EmitterState[EmitterState["CodeSection"] = 13] = "CodeSection";
    EmitterState[EmitterState["DataSection"] = 14] = "DataSection";
    EmitterState[EmitterState["FunctionBody"] = 15] = "FunctionBody";
    EmitterState[EmitterState["DataSectionEntry"] = 16] = "DataSectionEntry";
    EmitterState[EmitterState["DataSectionEntryBody"] = 17] = "DataSectionEntryBody";
    EmitterState[EmitterState["DataSectionEntryEnd"] = 18] = "DataSectionEntryEnd";
    EmitterState[EmitterState["InitExpression"] = 19] = "InitExpression";
    EmitterState[EmitterState["ElementSectionEntry"] = 20] = "ElementSectionEntry";
    EmitterState[EmitterState["ElementSectionEntryBody"] = 21] = "ElementSectionEntryBody";
    EmitterState[EmitterState["ElementSectionEntryEnd"] = 22] = "ElementSectionEntryEnd";
    EmitterState[EmitterState["GlobalSectionEntry"] = 23] = "GlobalSectionEntry";
    EmitterState[EmitterState["GlobalSectionEntryEnd"] = 24] = "GlobalSectionEntryEnd";
    EmitterState[EmitterState["RawDataSection"] = 25] = "RawDataSection";
    EmitterState[EmitterState["NameEntry"] = 26] = "NameEntry";
    EmitterState[EmitterState["RelocHeader"] = 27] = "RelocHeader";
    EmitterState[EmitterState["RelocEntry"] = 28] = "RelocEntry";
    EmitterState[EmitterState["LinkingEntry"] = 29] = "LinkingEntry";
    EmitterState[EmitterState["SourceMappingURL"] = 30] = "SourceMappingURL";
    EmitterState[EmitterState["SourceMappingURLEnd"] = 31] = "SourceMappingURLEnd";
})(EmitterState || (EmitterState = {}));
var Emitter = (function () {
    function Emitter() {
        this._buffer = [];
        this._state = EmitterState.Initial;
        this._sectionStart = 0;
        this._sectionSizeBytes = 0;
        this._sectionEntiesCount = 0;
        this._sectionEntiesCountBytes = 0;
        this._bodyStart = 0;
        this._bodySizeBytes = 0;
        this._data = null;
        this._endWritten = false;
        this._initExpressionAfterState = EmitterState.Initial;
    }
    Object.defineProperty(Emitter.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Emitter.prototype.write = function (reader) {
        this.writeStateAndResult(reader.state, reader.result);
    };
    Emitter.prototype.writeData = function (data) {
        this.writeStateAndResult(data.state, data.result || null);
    };
    Emitter.prototype.writeStateAndResult = function (state, result) {
        switch (state) {
            case 1 /* BEGIN_WASM */:
                this.writeBeginWasm(result);
                break;
            case 2 /* END_WASM */:
                this.writeEndWasm();
                break;
            case 3 /* BEGIN_SECTION */:
                this.writeBeginSection(result);
                break;
            case 4 /* END_SECTION */:
                this.writeEndSection();
                break;
            case 11 /* TYPE_SECTION_ENTRY */:
                this.writeTypeSectionEntry(result);
                break;
            case 12 /* IMPORT_SECTION_ENTRY */:
                this.writeImportSectionEntry(result);
                break;
            case 13 /* FUNCTION_SECTION_ENTRY */:
                this.writeFunctionSectionEntry(result);
                break;
            case 17 /* EXPORT_SECTION_ENTRY */:
                this.writeExportSectionEntry(result);
                break;
            case 28 /* BEGIN_FUNCTION_BODY */:
                this.writeBeginFunctionBody(result);
                break;
            case 31 /* END_FUNCTION_BODY */:
                this.writeEndFunctionBody();
                break;
            case 15 /* MEMORY_SECTION_ENTRY */:
                this.writeMemorySectionEntry(result);
                break;
            case 26 /* INIT_EXPRESSION_OPERATOR */:
            case 30 /* CODE_OPERATOR */:
                this.writeOperator(result);
                break;
            case 36 /* BEGIN_DATA_SECTION_ENTRY */:
                this.writeBeginDataSectionEntry(result);
                break;
            case 37 /* DATA_SECTION_ENTRY_BODY */:
                this.writeDataSectionBody(result);
                break;
            case 38 /* END_DATA_SECTION_ENTRY */:
                this.writeEndDataSectionEntry();
                break;
            case 25 /* BEGIN_INIT_EXPRESSION_BODY */:
                this.writeBeginInitExpression();
                break;
            case 27 /* END_INIT_EXPRESSION_BODY */:
                this.writeEndInitExpression();
                break;
            case 14 /* TABLE_SECTION_ENTRY */:
                this.writeTableSectionEntry(result);
                break;
            case 33 /* BEGIN_ELEMENT_SECTION_ENTRY */:
                this.writeBeginElementSectionEntry(result);
                break;
            case 35 /* END_ELEMENT_SECTION_ENTRY */:
                this.writeEndElementSectionEntry();
                break;
            case 34 /* ELEMENT_SECTION_ENTRY_BODY */:
                this.writeElementSectionBody(result);
                break;
            case 39 /* BEGIN_GLOBAL_SECTION_ENTRY */:
                this.writeBeginGlobalSectionEntry(result);
                break;
            case 40 /* END_GLOBAL_SECTION_ENTRY */:
                this.writeEndGlobalSectionEntry();
                break;
            case 7 /* SECTION_RAW_DATA */:
                this.writeSectionRawData(result);
                break;
            case 19 /* NAME_SECTION_ENTRY */:
                this.writeNameEntry(result);
                break;
            case 41 /* RELOC_SECTION_HEADER */:
                this.writeRelocHeader(result);
                break;
            case 42 /* RELOC_SECTION_ENTRY */:
                this.writeRelocEntry(result);
                break;
            case 21 /* LINKING_SECTION_ENTRY */:
                this.writeLinkingSection(result);
                break;
            case 43 /* SOURCE_MAPPING_URL */:
                this.writeSourceMappingURL(result);
                break;
            default:
                throw new Error("Invalid state: " + state);
        }
    };
    Emitter.prototype.writeByte = function (byte) {
        this._buffer.push(byte);
    };
    Emitter.prototype.writeMutiple = function () {
        var bytes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            bytes[_i] = arguments[_i];
        }
        (_a = this._buffer).push.apply(_a, bytes);
        var _a;
    };
    Object.defineProperty(Emitter.prototype, "_position", {
        get: function () {
            return this._buffer.length;
        },
        enumerable: true,
        configurable: true
    });
    Emitter.prototype.patchByte = function (pos, byte) {
        this._buffer[pos] = byte;
    };
    Emitter.prototype.writeVarUint = function (n) {
        while ((n & ~0x7F)) {
            this.writeByte(0x80 | (n & 0x7f));
            n >>>= 7;
        }
        this.writeByte(n);
    };
    Emitter.prototype.writeVarInt = function (n) {
        n |= 0;
        var test = n >> 31;
        while ((n >> 6) != test) {
            this.writeByte(0x80 | (n & 0x7f));
            n >>= 7;
        }
        this.writeByte(n & 0x7f);
    };
    Emitter.prototype.writePatchableVarUint32 = function () {
        var pos = this._position;
        this.writeMutiple(0x80, 0x80, 0x80, 0x80, 0x00);
        return pos;
    };
    Emitter.prototype.writePatchableSectionEntriesCount = function () {
        this._sectionEntiesCountBytes = this.writePatchableVarUint32();
        this._sectionEntiesCount = 0;
    };
    Emitter.prototype.writeBytes = function (bytes, start, end) {
        for (var i = start; i < end; i++)
            this.writeByte(bytes[i]);
    };
    Emitter.prototype.writeString = function (str) {
        this.writeVarUint(str.length);
        this.writeBytes(str, 0, str.length);
    };
    Emitter.prototype.patchVarUint32 = function (pos, n) {
        this.patchByte(pos, 0x80 | (n & 0x7F));
        this.patchByte(pos + 1, 0x80 | ((n >>> 7) & 0x7F));
        this.patchByte(pos + 2, 0x80 | ((n >>> 14) & 0x7F));
        this.patchByte(pos + 3, 0x80 | ((n >>> 21) & 0x7F));
        this.patchByte(pos + 4, ((n >>> 28) & 0x7F));
    };
    Emitter.prototype.ensureState = function (state) {
        if (this._state !== state)
            throw new Error("Unexpected state: " + this._state + " (expected " + state + ").");
    };
    Emitter.prototype.ensureEitherState = function (states) {
        if (states.indexOf(this._state) < 0)
            throw new Error("Unexpected state: " + this._state + " (expected one of " + states + ").");
    };
    Emitter.prototype.ensureEndOperatorWritten = function () {
        if (!this._endWritten)
            throw new Error('End as a last written operator is expected.');
    };
    Emitter.prototype.writeBeginWasm = function (header) {
        this.ensureState(EmitterState.Initial);
        this.writeMutiple(0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00);
        this._state = EmitterState.Wasm;
    };
    Emitter.prototype.writeEndWasm = function () {
        this.ensureState(EmitterState.Wasm);
        this._state = EmitterState.Initial;
        this._data = new Uint8Array(this._buffer);
        this._buffer.length = 0;
    };
    Emitter.prototype.writeBeginSection = function (section) {
        this.ensureState(EmitterState.Wasm);
        this.writeVarUint(section.id);
        this._sectionSizeBytes = this.writePatchableVarUint32();
        this._sectionStart = this._position;
        switch (section.id) {
            case 0 /* Custom */:
                this.writeString(section.name);
                var sectionName = WasmParser_1.bytesToString(section.name);
                if (sectionName === 'name') {
                    this._state = EmitterState.NameEntry;
                    break;
                }
                if (sectionName.indexOf('reloc.') === 0) {
                    this._state = EmitterState.RelocHeader;
                    break;
                }
                if (sectionName === 'linking') {
                    this._state = EmitterState.LinkingEntry;
                    break;
                }
                if (sectionName === 'sourceMappingURL') {
                    this._state = EmitterState.SourceMappingURL;
                    break;
                }
                this._state = EmitterState.RawDataSection;
                break;
            default:
                this._state = EmitterState.Error;
                throw new Error("Unexpected section " + section.id);
            case 1 /* Type */:
                this._state = EmitterState.TypeSection;
                this.writePatchableSectionEntriesCount();
                break;
            case 2 /* Import */:
                this._state = EmitterState.ImportSection;
                this.writePatchableSectionEntriesCount();
                break;
            case 3 /* Function */:
                this._state = EmitterState.FunctionSection;
                this.writePatchableSectionEntriesCount();
                break;
            case 7 /* Export */:
                this._state = EmitterState.ExportSection;
                this.writePatchableSectionEntriesCount();
                break;
            case 10 /* Code */:
                this._state = EmitterState.CodeSection;
                this.writePatchableSectionEntriesCount();
                break;
            case 5 /* Memory */:
                this._state = EmitterState.MemorySection;
                this.writePatchableSectionEntriesCount();
                break;
            case 6 /* Global */:
                this._state = EmitterState.GlobalSection;
                this.writePatchableSectionEntriesCount();
                break;
            case 11 /* Data */:
                this._state = EmitterState.DataSection;
                this.writePatchableSectionEntriesCount();
                break;
            case 4 /* Table */:
                this._state = EmitterState.TableSection;
                this.writePatchableSectionEntriesCount();
                break;
            case 9 /* Element */:
                this._state = EmitterState.ElementSection;
                this.writePatchableSectionEntriesCount();
                break;
            case 6 /* Global */:
                this._state = EmitterState.GlobalSection;
                this.writePatchableSectionEntriesCount();
                break;
        }
    };
    Emitter.prototype.writeBeginSectionRawData = function (section) {
        this.ensureState(EmitterState.Wasm);
        this.writeVarUint(section.id);
        if (section.id == 0 /* Custom */) {
            this.writeString(section.name);
        }
        this._state = EmitterState.RawDataSection;
    };
    Emitter.prototype.writeSectionRawData = function (bytes) {
        this.ensureState(EmitterState.RawDataSection);
        this.writeBytes(bytes, 0, bytes.length);
    };
    Emitter.prototype.writeFuncType = function (type) {
        this.writeVarInt(type.form);
        this.writeVarUint(type.params.length);
        for (var i = 0; i < type.params.length; i++)
            this.writeVarInt(type.params[i]);
        this.writeVarUint(type.returns.length);
        for (var i = 0; i < type.returns.length; i++)
            this.writeVarInt(type.returns[i]);
    };
    Emitter.prototype.writeTypeSectionEntry = function (type) {
        this.ensureState(EmitterState.TypeSection);
        this._sectionEntiesCount++;
        this.writeFuncType(type);
    };
    Emitter.prototype.writeResizableLimits = function (limits) {
        var flags = limits.maximum == undefined ? 0 : 1;
        this.writeVarUint(flags);
        this.writeVarUint(limits.initial);
        if (flags)
            this.writeVarUint(limits.maximum);
    };
    Emitter.prototype.writeTableType = function (type) {
        this.writeVarInt(type.elementType);
        this.writeResizableLimits(type.limits);
    };
    Emitter.prototype.writeMemoryType = function (type) {
        this.writeResizableLimits(type.limits);
    };
    Emitter.prototype.writeGlobalType = function (type) {
        this.writeVarInt(type.contentType);
        this.writeVarUint(type.mutability);
    };
    Emitter.prototype.writeImportSectionEntry = function (entry) {
        this.ensureState(EmitterState.ImportSection);
        this._sectionEntiesCount++;
        this.writeString(entry.module);
        this.writeString(entry.field);
        this.writeByte(entry.kind);
        switch (entry.kind) {
            case 0 /* Function */:
                this.writeVarUint(entry.funcTypeIndex);
                break;
            case 1 /* Table */:
                this.writeTableType(entry.type);
                break;
            case 2 /* Memory */:
                this.writeMemoryType(entry.type);
                break;
            case 3 /* Global */:
                this.writeGlobalType(entry.type);
                break;
            default:
                throw new Error("Invalid import kind: " + entry.kind);
        }
    };
    Emitter.prototype.writeFunctionSectionEntry = function (entry) {
        this.ensureState(EmitterState.FunctionSection);
        this._sectionEntiesCount++;
        this.writeVarUint(entry.typeIndex);
    };
    Emitter.prototype.writeExportSectionEntry = function (entry) {
        this.ensureState(EmitterState.ExportSection);
        this._sectionEntiesCount++;
        this.writeString(entry.field);
        this.writeByte(entry.kind);
        this.writeVarUint(entry.index);
    };
    Emitter.prototype.writeBeginFunctionBody = function (functionInfo) {
        this.ensureState(EmitterState.CodeSection);
        this._sectionEntiesCount++;
        this._bodySizeBytes = this.writePatchableVarUint32();
        this._bodyStart = this._position;
        this._endWritten = false;
        this._state = EmitterState.FunctionBody;
        this.writeVarUint(functionInfo.locals.length);
        for (var i = 0; i < functionInfo.locals.length; i++) {
            this.writeVarUint(functionInfo.locals[i].count);
            this.writeVarInt(functionInfo.locals[i].type);
        }
    };
    Emitter.prototype.writeEndFunctionBody = function () {
        this.ensureState(EmitterState.FunctionBody);
        this.ensureEndOperatorWritten();
        var bodySize = this._position - this._bodyStart;
        this.patchVarUint32(this._bodySizeBytes, bodySize);
        this._state = EmitterState.CodeSection;
    };
    Emitter.prototype.writeBeginDataSectionEntry = function (entry) {
        this.ensureState(EmitterState.DataSection);
        this._sectionEntiesCount++;
        this.writeVarUint(entry.index);
        this._state = EmitterState.DataSectionEntry;
    };
    Emitter.prototype.writeDataSectionBody = function (body) {
        this.ensureState(EmitterState.DataSectionEntryBody);
        this.writeString(body.data);
        this._state = EmitterState.DataSectionEntryEnd;
    };
    Emitter.prototype.writeEndDataSectionEntry = function () {
        this.ensureState(EmitterState.DataSectionEntryEnd);
        this._state = EmitterState.DataSection;
    };
    Emitter.prototype.writeTableSectionEntry = function (entry) {
        this.ensureState(EmitterState.TableSection);
        this._sectionEntiesCount++;
        this.writeVarInt(entry.elementType);
        this.writeResizableLimits(entry.limits);
    };
    Emitter.prototype.writeBeginElementSectionEntry = function (entry) {
        this.ensureState(EmitterState.ElementSection);
        this._sectionEntiesCount++;
        this.writeVarUint(entry.index);
        this._state = EmitterState.ElementSectionEntry;
    };
    Emitter.prototype.writeElementSectionBody = function (body) {
        this.ensureState(EmitterState.ElementSectionEntryBody);
        this.writeVarUint(body.elements.length);
        for (var i = 0; i < body.elements.length; i++)
            this.writeVarUint(body.elements[i]);
        this._state = EmitterState.ElementSectionEntryEnd;
    };
    Emitter.prototype.writeEndElementSectionEntry = function () {
        this.ensureState(EmitterState.ElementSectionEntryEnd);
        this._state = EmitterState.ElementSection;
    };
    Emitter.prototype.writeBeginGlobalSectionEntry = function (entry) {
        this.ensureState(EmitterState.GlobalSection);
        this._sectionEntiesCount++;
        this.writeGlobalType(entry.type);
        this._state = EmitterState.GlobalSectionEntry;
    };
    Emitter.prototype.writeEndGlobalSectionEntry = function () {
        this.ensureState(EmitterState.GlobalSectionEntryEnd);
        this._state = EmitterState.GlobalSection;
    };
    Emitter.prototype.writeBeginInitExpression = function () {
        switch (this._state) {
            case EmitterState.DataSectionEntry:
                this._initExpressionAfterState = EmitterState.DataSectionEntryBody;
                break;
            case EmitterState.ElementSectionEntry:
                this._initExpressionAfterState = EmitterState.ElementSectionEntryBody;
                break;
            case EmitterState.GlobalSectionEntry:
                this._initExpressionAfterState = EmitterState.GlobalSectionEntryEnd;
                break;
            default:
                throw new Error("Unexpected state " + this._state + " at writeEndInitExpression");
        }
        this._endWritten = false;
        this._state = EmitterState.InitExpression;
    };
    Emitter.prototype.writeEndInitExpression = function () {
        this.ensureState(EmitterState.InitExpression);
        this.ensureEndOperatorWritten();
        this._state = this._initExpressionAfterState;
    };
    Emitter.prototype.writeMemoryImmediate = function (address) {
        this.writeVarUint(address.flags);
        this.writeVarUint(address.offset);
    };
    Emitter.prototype.writeVarInt64 = function (n) {
        var pos = 0, end = 7;
        var highBit = n.data[end] & 0x80;
        var optionalBits = highBit ? 0xFF : 0;
        while (end > 0 && n.data[end] === optionalBits) {
            end--;
        }
        var buffer = n.data[pos], buffered = 8;
        do {
            this.writeByte(0x80 | (buffer & 0x7F));
            buffer >>= 7;
            buffered -= 7;
            if (buffered > 7)
                continue;
            if (pos < end) {
                ++pos;
                buffer |= n.data[pos] << buffered;
                buffered += 8;
            }
            else if (pos == end && buffer === 7 &&
                (n.data[pos] & 0x80) !== highBit) {
                ++pos;
                buffer |= optionalBits << buffered;
                buffered += 8;
            }
        } while (buffered > 7);
        buffer |= optionalBits << buffered;
        this.writeByte(buffer & 0x7f);
    };
    Emitter.prototype.writeFloat32 = function (n) {
        var data = new Uint8Array(4);
        new DataView(data.buffer, 0).setFloat32(0, n, true);
        this.writeBytes(data, 0, data.length);
    };
    Emitter.prototype.writeFloat64 = function (n) {
        var data = new Uint8Array(8);
        new DataView(data.buffer, 0).setFloat64(0, n, true);
        this.writeBytes(data, 0, data.length);
    };
    Emitter.prototype.writeOperator = function (opInfo) {
        this.ensureEitherState([EmitterState.FunctionBody, EmitterState.InitExpression]);
        if (opInfo.code < 0x100) {
            this.writeByte(opInfo.code);
        }
        else {
            this.writeByte(opInfo.code >> 8);
            this.writeByte(opInfo.code & 255);
        }
        this._endWritten = opInfo.code == 11 /* end */;
        switch (opInfo.code | 0) {
            case 2 /* block */:
            case 3 /* loop */:
            case 4 /* if */:
                this.writeVarInt(opInfo.blockType);
                break;
            case 12 /* br */:
            case 13 /* br_if */:
                this.writeVarUint(opInfo.brDepth);
                break;
            case 14 /* br_table */:
                var tableCount = opInfo.brTable.length - 1;
                this.writeVarUint(tableCount);
                for (var i = 0; i <= tableCount; i++) {
                    this.writeVarUint(opInfo.brTable[i]);
                }
                break;
            case 16 /* call */:
                this.writeVarUint(opInfo.funcIndex);
                break;
            case 17 /* call_indirect */:
                this.writeVarUint(opInfo.typeIndex);
                this.writeVarUint(0);
                break;
            case 32 /* get_local */:
            case 33 /* set_local */:
            case 34 /* tee_local */:
                this.writeVarUint(opInfo.localIndex);
                break;
            case 35 /* get_global */:
            case 36 /* set_global */:
                this.writeVarUint(opInfo.globalIndex);
                break;
            case 40 /* i32_load */:
            case 41 /* i64_load */:
            case 42 /* f32_load */:
            case 43 /* f64_load */:
            case 44 /* i32_load8_s */:
            case 45 /* i32_load8_u */:
            case 46 /* i32_load16_s */:
            case 47 /* i32_load16_u */:
            case 48 /* i64_load8_s */:
            case 49 /* i64_load8_u */:
            case 50 /* i64_load16_s */:
            case 51 /* i64_load16_u */:
            case 52 /* i64_load32_s */:
            case 53 /* i64_load32_u */:
            case 54 /* i32_store */:
            case 55 /* i64_store */:
            case 56 /* f32_store */:
            case 57 /* f64_store */:
            case 58 /* i32_store8 */:
            case 59 /* i32_store16 */:
            case 60 /* i64_store8 */:
            case 61 /* i64_store16 */:
            case 62 /* i64_store32 */:
            case 65024 /* atomic_wake */:
            case 65025 /* i32_atomic_wait */:
            case 65026 /* i64_atomic_wait */:
            case 65040 /* i32_atomic_load */:
            case 65041 /* i64_atomic_load */:
            case 65042 /* i32_atomic_load8_u */:
            case 65043 /* i32_atomic_load16_u */:
            case 65044 /* i64_atomic_load8_u */:
            case 65045 /* i64_atomic_load16_u */:
            case 65046 /* i64_atomic_load32_u */:
            case 65047 /* i32_atomic_store */:
            case 65048 /* i64_atomic_store */:
            case 65049 /* i32_atomic_store8 */:
            case 65050 /* i32_atomic_store16 */:
            case 65051 /* i64_atomic_store8 */:
            case 65052 /* i64_atomic_store16 */:
            case 65053 /* i64_atomic_store32 */:
            case 65054 /* i32_atomic_rmw_add */:
            case 65055 /* i64_atomic_rmw_add */:
            case 65056 /* i32_atomic_rmw8_u_add */:
            case 65057 /* i32_atomic_rmw16_u_add */:
            case 65058 /* i64_atomic_rmw8_u_add */:
            case 65059 /* i64_atomic_rmw16_u_add */:
            case 65060 /* i64_atomic_rmw32_u_add */:
            case 65061 /* i32_atomic_rmw_sub */:
            case 65062 /* i64_atomic_rmw_sub */:
            case 65063 /* i32_atomic_rmw8_u_sub */:
            case 65064 /* i32_atomic_rmw16_u_sub */:
            case 65065 /* i64_atomic_rmw8_u_sub */:
            case 65066 /* i64_atomic_rmw16_u_sub */:
            case 65067 /* i64_atomic_rmw32_u_sub */:
            case 65068 /* i32_atomic_rmw_and */:
            case 65069 /* i64_atomic_rmw_and */:
            case 65070 /* i32_atomic_rmw8_u_and */:
            case 65071 /* i32_atomic_rmw16_u_and */:
            case 65072 /* i64_atomic_rmw8_u_and */:
            case 65073 /* i64_atomic_rmw16_u_and */:
            case 65074 /* i64_atomic_rmw32_u_and */:
            case 65075 /* i32_atomic_rmw_or */:
            case 65076 /* i64_atomic_rmw_or */:
            case 65077 /* i32_atomic_rmw8_u_or */:
            case 65078 /* i32_atomic_rmw16_u_or */:
            case 65079 /* i64_atomic_rmw8_u_or */:
            case 65080 /* i64_atomic_rmw16_u_or */:
            case 65081 /* i64_atomic_rmw32_u_or */:
            case 65082 /* i32_atomic_rmw_xor */:
            case 65083 /* i64_atomic_rmw_xor */:
            case 65084 /* i32_atomic_rmw8_u_xor */:
            case 65085 /* i32_atomic_rmw16_u_xor */:
            case 65086 /* i64_atomic_rmw8_u_xor */:
            case 65087 /* i64_atomic_rmw16_u_xor */:
            case 65088 /* i64_atomic_rmw32_u_xor */:
            case 65089 /* i32_atomic_rmw_xchg */:
            case 65090 /* i64_atomic_rmw_xchg */:
            case 65091 /* i32_atomic_rmw8_u_xchg */:
            case 65092 /* i32_atomic_rmw16_u_xchg */:
            case 65093 /* i64_atomic_rmw8_u_xchg */:
            case 65094 /* i64_atomic_rmw16_u_xchg */:
            case 65095 /* i64_atomic_rmw32_u_xchg */:
            case 65096 /* i32_atomic_rmw_cmpxchg */:
            case 65097 /* i64_atomic_rmw_cmpxchg */:
            case 65098 /* i32_atomic_rmw8_u_cmpxchg */:
            case 65099 /* i32_atomic_rmw16_u_cmpxchg */:
            case 65100 /* i64_atomic_rmw8_u_cmpxchg */:
            case 65101 /* i64_atomic_rmw16_u_cmpxchg */:
            case 65102 /* i64_atomic_rmw32_u_cmpxchg */:
                this.writeMemoryImmediate(opInfo.memoryAddress);
                break;
            case 63 /* current_memory */:
            case 64 /* grow_memory */:
                this.writeVarUint(0);
                break;
            case 65 /* i32_const */:
                this.writeVarInt(opInfo.literal | 0);
                break;
            case 66 /* i64_const */:
                this.writeVarInt64(opInfo.literal);
                break;
            case 67 /* f32_const */:
                this.writeFloat32(opInfo.literal);
                break;
            case 68 /* f64_const */:
                this.writeFloat64(opInfo.literal);
                break;
        }
    };
    Emitter.prototype.writeMemorySectionEntry = function (entry) {
        this.ensureState(EmitterState.MemorySection);
        this._sectionEntiesCount++;
        this.writeMemoryType(entry);
    };
    Emitter.prototype.writeNameMap = function (map) {
        var _this = this;
        this.writeVarUint(map.length);
        map.forEach(function (naming) {
            _this.writeVarUint(naming.index);
            _this.writeString(naming.name);
        });
    };
    Emitter.prototype.writeNameEntry = function (entry) {
        var _this = this;
        this.ensureState(EmitterState.NameEntry);
        this.writeVarUint(entry.type);
        var payloadLengthPatchable = this.writePatchableVarUint32();
        var start = this._position;
        switch (entry.type) {
            case 0 /* Module */:
                this.writeString(entry.moduleName);
                break;
            case 1 /* Function */:
                this.writeNameMap(entry.names);
                break;
            case 2 /* Local */:
                var funcs = entry.funcs;
                this.writeVarUint(funcs.length);
                funcs.forEach(function (func) {
                    _this.writeVarUint(func.index);
                    _this.writeNameMap(func.locals);
                });
                break;
            default:
                throw new Error("Unexpected name entry type " + entry.type);
        }
        this.patchVarUint32(payloadLengthPatchable, this._position - start);
    };
    Emitter.prototype.writeRelocHeader = function (header) {
        this.ensureState(EmitterState.RelocHeader);
        this.writeVarInt(header.id);
        if (header.id == 0 /* Custom */) {
            this.writeString(header.name);
        }
        this.writePatchableSectionEntriesCount();
        this._state = EmitterState.RelocEntry;
    };
    Emitter.prototype.writeRelocEntry = function (entry) {
        this.ensureState(EmitterState.RelocEntry);
        this._sectionEntiesCount++;
        this.writeVarUint(entry.type);
        this.writeVarUint(entry.offset);
        this.writeVarUint(entry.index);
        switch (entry.type) {
            case 0 /* FunctionIndex_LEB */:
            case 1 /* TableIndex_SLEB */:
            case 2 /* TableIndex_I32 */:
                break;
            case 3 /* GlobalAddr_LEB */:
            case 4 /* GlobalAddr_SLEB */:
            case 5 /* GlobalAddr_I32 */:
                this.writeVarUint(entry.addend);
                break;
            default:
                throw new Error("Unexpected reloc entry type " + entry.type);
        }
    };
    Emitter.prototype.writeLinkingSection = function (entry) {
        this.ensureState(EmitterState.LinkingEntry);
        this._sectionEntiesCount++;
        this.writeVarUint(entry.type);
        switch (entry.type) {
            case 1 /* StackPointer */:
                this.writeVarUint(entry.index);
                break;
            default:
                throw new Error("Unexpected linking entry type " + entry.type);
        }
    };
    Emitter.prototype.writeSourceMappingURL = function (url) {
        this.ensureState(EmitterState.SourceMappingURL);
        this.writeString(url.url);
        this._state = EmitterState.SourceMappingURLEnd;
    };
    Emitter.prototype.writeEndSection = function () {
        switch (this._state) {
            case EmitterState.TypeSection:
            case EmitterState.ImportSection:
            case EmitterState.FunctionSection:
            case EmitterState.ExportSection:
            case EmitterState.CodeSection:
            case EmitterState.MemorySection:
            case EmitterState.GlobalSection:
            case EmitterState.DataSection:
            case EmitterState.TableSection:
            case EmitterState.ElementSection:
            case EmitterState.RelocEntry:
            case EmitterState.LinkingEntry:
                this.patchVarUint32(this._sectionEntiesCountBytes, this._sectionEntiesCount);
                break;
            case EmitterState.NameEntry:
            case EmitterState.SourceMappingURLEnd:
            case EmitterState.RawDataSection:
                break;
            default:
                throw new Error("Unexpected state: " + this._state + " (expected section state)");
        }
        var sectionLength = this._position - this._sectionStart;
        this.patchVarUint32(this._sectionSizeBytes, sectionLength);
        this._state = EmitterState.Wasm;
    };
    return Emitter;
}());
exports.Emitter = Emitter;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {/* Copyright 2016 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = __webpack_require__(53);
var WasmParser_1 = __webpack_require__(7);
var WasmParser_2 = __webpack_require__(7);
exports.BinaryReaderState = WasmParser_2.BinaryReaderState;
exports.SectionCode = WasmParser_2.SectionCode;
var BinaryReaderTransform = (function (_super) {
    __extends(BinaryReaderTransform, _super);
    function BinaryReaderTransform() {
        var _this = _super.call(this, {
            readableObjectMode: true
        }) || this;
        _this._buffer = new ArrayBuffer(1024);
        _this._bufferSize = 0;
        _this._parser = new WasmParser_1.BinaryReader();
        return _this;
    }
    BinaryReaderTransform.prototype._transform = function (chunk, encoding, callback) {
        var buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
        var bufferNeeded = this._bufferSize + buf.length;
        if (bufferNeeded > this._buffer.byteLength) {
            var oldData = new Uint8Array(this._buffer, 0, this._bufferSize);
            var newBuffer = new ArrayBuffer(bufferNeeded);
            new Uint8Array(newBuffer).set(oldData);
            this._buffer = newBuffer;
        }
        var arr = new Uint8Array(this._buffer, 0, bufferNeeded);
        arr.set(new Uint8Array(buf.buffer, buf.byteOffset, buf.length), this._bufferSize);
        this._bufferSize = bufferNeeded;
        var parser = this._parser;
        parser.setData(this._buffer, 0, bufferNeeded, false);
        while (parser.read()) {
            this.push({
                state: parser.state,
                result: parser.result
            });
        }
        if (parser.position > 0) {
            var left = parser.length - parser.position;
            if (left > 0) {
                arr.set(arr.subarray(parser.position, parser.length));
            }
            this._bufferSize = left;
        }
        callback();
    };
    BinaryReaderTransform.prototype._flush = function (callback) {
        var parser = this._parser;
        parser.setData(this._buffer, 0, this._bufferSize, true);
        while (parser.read()) {
            this.push({
                state: parser.state,
                result: parser.result
            });
        }
        this._bufferSize = 0;
        callback();
    };
    return BinaryReaderTransform;
}(stream_1.Transform));
exports.BinaryReaderTransform = BinaryReaderTransform;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14).Buffer))

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 52 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = __webpack_require__(15).EventEmitter;
var inherits = __webpack_require__(6);

inherits(Stream, EE);
Stream.Readable = __webpack_require__(16);
Stream.Writable = __webpack_require__(59);
Stream.Duplex = __webpack_require__(60);
Stream.Transform = __webpack_require__(61);
Stream.PassThrough = __webpack_require__(62);

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};


/***/ }),
/* 54 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = __webpack_require__(12).Buffer;
/*</replacement>*/

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8), __webpack_require__(1)))

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



module.exports = PassThrough;

var Transform = __webpack_require__(34);

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(6);
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(17);


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16).Transform


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16).PassThrough


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* Copyright 2016 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var WasmParser_1 = __webpack_require__(7);
function typeToString(type) {
    switch (type) {
        case -1 /* i32 */: return 'i32';
        case -2 /* i64 */: return 'i64';
        case -3 /* f32 */: return 'f32';
        case -4 /* f64 */: return 'f64';
        case -16 /* anyfunc */: return 'anyfunc';
        default: throw new Error('Unexpected type');
    }
}
function formatFloat32(n) {
    if (n === 0)
        return (1 / n) < 0 ? '-0.0' : '0.0';
    if (isFinite(n))
        return n.toString();
    if (!isNaN(n))
        return n < 0 ? '-infinity' : 'infinity';
    var view = new DataView(new ArrayBuffer(8));
    view.setFloat32(0, n, true);
    var data = view.getInt32(0, true);
    var payload = data & 0x7FFFFF;
    var canonicalBits = 4194304; // 0x800..0
    if (data > 0 && payload === canonicalBits)
        return 'nan'; // canonical NaN;
    else if (payload === canonicalBits)
        return '-nan';
    return (data < 0 ? '-' : '+') + 'nan:0x' + payload.toString(16);
}
function formatFloat64(n) {
    if (n === 0)
        return (1 / n) < 0 ? '-0.0' : '0.0';
    if (isFinite(n))
        return n.toString();
    if (!isNaN(n))
        return n < 0 ? '-infinity' : 'infinity';
    var view = new DataView(new ArrayBuffer(8));
    view.setFloat64(0, n, true);
    var data1 = view.getUint32(0, true);
    var data2 = view.getInt32(4, true);
    var payload = data1 + (data2 & 0xFFFFF) * 4294967296;
    var canonicalBits = 524288 * 4294967296; // 0x800..0
    if (data2 > 0 && payload === canonicalBits)
        return 'nan'; // canonical NaN;
    else if (payload === canonicalBits)
        return '-nan';
    return (data2 < 0 ? '-' : '+') + 'nan:0x' + payload.toString(16);
}
function memoryAddressToString(address, code) {
    var defaultAlignFlags;
    switch (code) {
        case 41 /* i64_load */:
        case 55 /* i64_store */:
        case 43 /* f64_load */:
        case 57 /* f64_store */:
        case 65026 /* i64_atomic_wait */:
        case 65041 /* i64_atomic_load */:
        case 65048 /* i64_atomic_store */:
        case 65055 /* i64_atomic_rmw_add */:
        case 65062 /* i64_atomic_rmw_sub */:
        case 65069 /* i64_atomic_rmw_and */:
        case 65076 /* i64_atomic_rmw_or */:
        case 65083 /* i64_atomic_rmw_xor */:
        case 65090 /* i64_atomic_rmw_xchg */:
        case 65097 /* i64_atomic_rmw_cmpxchg */:
            defaultAlignFlags = 3;
            break;
        case 40 /* i32_load */:
        case 52 /* i64_load32_s */:
        case 53 /* i64_load32_u */:
        case 54 /* i32_store */:
        case 62 /* i64_store32 */:
        case 42 /* f32_load */:
        case 56 /* f32_store */:
        case 65024 /* atomic_wake */:
        case 65025 /* i32_atomic_wait */:
        case 65040 /* i32_atomic_load */:
        case 65046 /* i64_atomic_load32_u */:
        case 65047 /* i32_atomic_store */:
        case 65053 /* i64_atomic_store32 */:
        case 65054 /* i32_atomic_rmw_add */:
        case 65060 /* i64_atomic_rmw32_u_add */:
        case 65061 /* i32_atomic_rmw_sub */:
        case 65067 /* i64_atomic_rmw32_u_sub */:
        case 65068 /* i32_atomic_rmw_and */:
        case 65074 /* i64_atomic_rmw32_u_and */:
        case 65075 /* i32_atomic_rmw_or */:
        case 65081 /* i64_atomic_rmw32_u_or */:
        case 65082 /* i32_atomic_rmw_xor */:
        case 65088 /* i64_atomic_rmw32_u_xor */:
        case 65089 /* i32_atomic_rmw_xchg */:
        case 65095 /* i64_atomic_rmw32_u_xchg */:
        case 65096 /* i32_atomic_rmw_cmpxchg */:
        case 65102 /* i64_atomic_rmw32_u_cmpxchg */:
            defaultAlignFlags = 2;
            break;
        case 46 /* i32_load16_s */:
        case 47 /* i32_load16_u */:
        case 50 /* i64_load16_s */:
        case 51 /* i64_load16_u */:
        case 59 /* i32_store16 */:
        case 61 /* i64_store16 */:
        case 65043 /* i32_atomic_load16_u */:
        case 65045 /* i64_atomic_load16_u */:
        case 65050 /* i32_atomic_store16 */:
        case 65052 /* i64_atomic_store16 */:
        case 65057 /* i32_atomic_rmw16_u_add */:
        case 65059 /* i64_atomic_rmw16_u_add */:
        case 65064 /* i32_atomic_rmw16_u_sub */:
        case 65066 /* i64_atomic_rmw16_u_sub */:
        case 65071 /* i32_atomic_rmw16_u_and */:
        case 65073 /* i64_atomic_rmw16_u_and */:
        case 65078 /* i32_atomic_rmw16_u_or */:
        case 65080 /* i64_atomic_rmw16_u_or */:
        case 65085 /* i32_atomic_rmw16_u_xor */:
        case 65087 /* i64_atomic_rmw16_u_xor */:
        case 65092 /* i32_atomic_rmw16_u_xchg */:
        case 65094 /* i64_atomic_rmw16_u_xchg */:
        case 65099 /* i32_atomic_rmw16_u_cmpxchg */:
        case 65101 /* i64_atomic_rmw16_u_cmpxchg */:
            defaultAlignFlags = 1;
            break;
        case 44 /* i32_load8_s */:
        case 45 /* i32_load8_u */:
        case 48 /* i64_load8_s */:
        case 49 /* i64_load8_u */:
        case 58 /* i32_store8 */:
        case 60 /* i64_store8 */:
        case 65042 /* i32_atomic_load8_u */:
        case 65044 /* i64_atomic_load8_u */:
        case 65049 /* i32_atomic_store8 */:
        case 65051 /* i64_atomic_store8 */:
        case 65056 /* i32_atomic_rmw8_u_add */:
        case 65058 /* i64_atomic_rmw8_u_add */:
        case 65063 /* i32_atomic_rmw8_u_sub */:
        case 65065 /* i64_atomic_rmw8_u_sub */:
        case 65070 /* i32_atomic_rmw8_u_and */:
        case 65072 /* i64_atomic_rmw8_u_and */:
        case 65077 /* i32_atomic_rmw8_u_or */:
        case 65079 /* i64_atomic_rmw8_u_or */:
        case 65084 /* i32_atomic_rmw8_u_xor */:
        case 65086 /* i64_atomic_rmw8_u_xor */:
        case 65091 /* i32_atomic_rmw8_u_xchg */:
        case 65093 /* i64_atomic_rmw8_u_xchg */:
        case 65098 /* i32_atomic_rmw8_u_cmpxchg */:
        case 65100 /* i64_atomic_rmw8_u_cmpxchg */:
            defaultAlignFlags = 0;
            break;
    }
    if (address.flags == defaultAlignFlags)
        return !address.offset ? null : "offset=" + address.offset;
    if (!address.offset)
        return "align=" + (1 << address.flags);
    return "offset=" + (address.offset | 0) + " align=" + (1 << address.flags);
}
function globalTypeToString(type) {
    if (!type.mutability)
        return typeToString(type.contentType);
    return "(mut " + typeToString(type.contentType) + ")";
}
function limitsToString(limits) {
    return limits.initial + (limits.maximum !== undefined ? ' ' + limits.maximum : '');
}
var paddingCache = ['0', '00', '000'];
function formatHex(n, width) {
    var s = n.toString(16).toUpperCase();
    if (width === undefined || s.length >= width)
        return s;
    var paddingIndex = width - s.length - 1;
    while (paddingIndex >= paddingCache.length)
        paddingCache.push(paddingCache[paddingCache.length - 1] + '0');
    return paddingCache[paddingIndex] + s;
}
var IndentIncrement = '  ';
var operatorCodeNamesCache = null;
function getOperatorName(code) {
    if (!operatorCodeNamesCache) {
        operatorCodeNamesCache = Object.create(null);
        Object.keys(WasmParser_1.OperatorCodeNames).forEach(function (key) {
            var value = WasmParser_1.OperatorCodeNames[key];
            if (typeof value !== 'string')
                return;
            operatorCodeNamesCache[key] = value.replace(/^([if](32|64))_/, "$1.").replace(/_([if](32|64))$/, "\/$1");
        });
    }
    return operatorCodeNamesCache[code];
}
var DefaultNameResolver = (function () {
    function DefaultNameResolver() {
    }
    DefaultNameResolver.prototype.getTypeName = function (index, isRef) {
        return '$type' + index;
    };
    DefaultNameResolver.prototype.getTableName = function (index, isRef) {
        return '$table' + index;
    };
    DefaultNameResolver.prototype.getMemoryName = function (index, isRef) {
        // TODO '$memory' + index;
        return isRef ? '' + index : "(;" + index + ";)";
    };
    DefaultNameResolver.prototype.getGlobalName = function (index, isRef) {
        return '$global' + index;
    };
    DefaultNameResolver.prototype.getFunctionName = function (index, isImport, isRef) {
        return (isImport ? '$import' : '$func') + index;
    };
    DefaultNameResolver.prototype.getVariableName = function (funcIndex, index, isRef) {
        return '$var' + index;
    };
    DefaultNameResolver.prototype.getLabel = function (index) {
        return '$label' + index;
    };
    return DefaultNameResolver;
}());
exports.DefaultNameResolver = DefaultNameResolver;
var NumericNameResolver = (function () {
    function NumericNameResolver() {
    }
    NumericNameResolver.prototype.getTypeName = function (index, isRef) {
        return isRef ? '' + index : "(;" + index + ";)";
    };
    NumericNameResolver.prototype.getTableName = function (index, isRef) {
        return isRef ? '' + index : "(;" + index + ";)";
    };
    NumericNameResolver.prototype.getMemoryName = function (index, isRef) {
        return isRef ? '' + index : "(;" + index + ";)";
    };
    NumericNameResolver.prototype.getGlobalName = function (index, isRef) {
        return isRef ? '' + index : "(;" + index + ";)";
    };
    NumericNameResolver.prototype.getFunctionName = function (index, isImport, isRef) {
        return isRef ? '' + index : "(;" + index + ";)";
    };
    NumericNameResolver.prototype.getVariableName = function (funcIndex, index, isRef) {
        return isRef ? '' + index : "(;" + index + ";)";
    };
    NumericNameResolver.prototype.getLabel = function (index) {
        return null;
    };
    return NumericNameResolver;
}());
exports.NumericNameResolver = NumericNameResolver;
var LineBuffer = (function () {
    function LineBuffer() {
        this._firstPart = '';
        this._secondPart = '';
        this._thirdPart = '';
        this._count = 0;
    }
    Object.defineProperty(LineBuffer.prototype, "length", {
        get: function () {
            switch (this._count) {
                case 0:
                    return 0;
                case 1:
                    return this._firstPart.length;
                case 2:
                    return this._firstPart.length + this._secondPart.length;
                default:
                    return this._firstPart.length +
                        this._secondPart.length +
                        this._thirdPart.length;
            }
        },
        enumerable: true,
        configurable: true
    });
    LineBuffer.prototype.append = function (part) {
        switch (this._count) {
            case 0:
                this._firstPart = part;
                this._count = 1;
                break;
            case 1:
                this._secondPart = part;
                this._count = 2;
                break;
            case 2:
                this._thirdPart = part;
                this._count = 3;
                break;
            default:
                this._count = 1;
                this._firstPart = this._firstPart + this._secondPart +
                    this._thirdPart + part;
                break;
        }
    };
    LineBuffer.prototype.finalize = function () {
        switch (this._count) {
            case 0:
                return '';
            case 1:
                this._count = 0;
                return this._firstPart;
            case 2:
                this._count = 0;
                return this._firstPart + this._secondPart;
            default:
                this._count = 0;
                return this._firstPart + this._secondPart + this._thirdPart;
        }
    };
    return LineBuffer;
}());
var LabelMode;
(function (LabelMode) {
    LabelMode[LabelMode["Depth"] = 0] = "Depth";
    LabelMode[LabelMode["WhenUsed"] = 1] = "WhenUsed";
    LabelMode[LabelMode["Always"] = 2] = "Always";
})(LabelMode = exports.LabelMode || (exports.LabelMode = {}));
var WasmDisassembler = (function () {
    function WasmDisassembler() {
        this._lines = [];
        this._offsets = [];
        this._buffer = new LineBuffer();
        this._indent = null;
        this._indentLevel = 0;
        this._addOffsets = false;
        this._done = false;
        this._currentPosition = 0;
        this._nameResolver = new DefaultNameResolver();
        this._labelMode = LabelMode.WhenUsed;
        this._reset();
    }
    WasmDisassembler.prototype._reset = function () {
        this._types = [];
        this._funcIndex = 0;
        this._funcTypes = [];
        this._importCount = 0;
        this._globalCount = 0;
        this._memoryCount = 0;
        this._tableCount = 0;
        this._initExpression = [];
        this._backrefLabels = null;
        this._labelIndex = 0;
    };
    Object.defineProperty(WasmDisassembler.prototype, "addOffsets", {
        get: function () {
            return this._addOffsets;
        },
        set: function (value) {
            if (this._currentPosition)
                throw new Error('Cannot switch addOffsets during processing.');
            this._addOffsets = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WasmDisassembler.prototype, "labelMode", {
        get: function () {
            return this._labelMode;
        },
        set: function (value) {
            if (this._currentPosition)
                throw new Error('Cannot switch labelMode during processing.');
            this._labelMode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WasmDisassembler.prototype, "nameResolver", {
        get: function () {
            return this._nameResolver;
        },
        set: function (resolver) {
            if (this._currentPosition)
                throw new Error('Cannot switch nameResolver during processing.');
            this._nameResolver = resolver;
        },
        enumerable: true,
        configurable: true
    });
    WasmDisassembler.prototype.appendBuffer = function (s) {
        this._buffer.append(s);
    };
    WasmDisassembler.prototype.newLine = function () {
        if (this.addOffsets)
            this._offsets.push(this._currentPosition);
        this._lines.push(this._buffer.finalize());
    };
    WasmDisassembler.prototype.printFuncType = function (typeIndex) {
        var type = this._types[typeIndex];
        if (type.form !== -32 /* func */)
            throw new Error('NYI other function form');
        if (type.params.length > 0) {
            this.appendBuffer(' (param');
            for (var i = 0; i < type.params.length; i++) {
                this.appendBuffer(' ');
                this.appendBuffer(typeToString(type.params[i]));
            }
            this.appendBuffer(')');
        }
        if (type.returns.length > 0) {
            this.appendBuffer(' (result');
            for (var i = 0; i < type.returns.length; i++) {
                this.appendBuffer(' ');
                this.appendBuffer(typeToString(type.returns[i]));
            }
            this.appendBuffer(')');
        }
    };
    WasmDisassembler.prototype.printString = function (b) {
        this.appendBuffer('\"');
        for (var i = 0; i < b.length; i++) {
            var byte = b[i];
            if (byte < 0x20 || byte >= 0x7F ||
                byte == 0x22 || byte == 0x5c) {
                this.appendBuffer('\\' + (byte >> 4).toString(16) + (byte & 15).toString(16));
            }
            else {
                this.appendBuffer(String.fromCharCode(byte));
            }
        }
        this.appendBuffer('\"');
    };
    WasmDisassembler.prototype.useLabel = function (depth) {
        if (!this._backrefLabels) {
            return '' + depth;
        }
        var i = this._backrefLabels.length - depth - 1;
        if (i < 0) {
            return '' + depth;
        }
        var backrefLabel = this._backrefLabels[i];
        if (!backrefLabel.useLabel) {
            backrefLabel.useLabel = true;
            backrefLabel.label = this._nameResolver.getLabel(this._labelIndex);
            var line = this._lines[backrefLabel.line];
            this._lines[backrefLabel.line] = line.substring(0, backrefLabel.position) +
                ' ' + backrefLabel.label + line.substring(backrefLabel.position);
            this._labelIndex++;
        }
        return backrefLabel.label || '' + depth;
    };
    WasmDisassembler.prototype.printOperator = function (operator) {
        var code = operator.code | 0;
        this.appendBuffer(getOperatorName(code));
        switch (code) {
            case 2 /* block */:
            case 3 /* loop */:
            case 4 /* if */:
                if (this._labelMode !== LabelMode.Depth) {
                    var backrefLabel_1 = {
                        line: this._lines.length,
                        position: this._buffer.length,
                        useLabel: false,
                        label: null,
                    };
                    if (this._labelMode === LabelMode.Always) {
                        backrefLabel_1.useLabel = true;
                        backrefLabel_1.label = this._nameResolver.getLabel(this._labelIndex++);
                        if (backrefLabel_1.label) {
                            this.appendBuffer(' ');
                            this.appendBuffer(backrefLabel_1.label);
                        }
                    }
                    this._backrefLabels.push(backrefLabel_1);
                }
                if (operator.blockType !== -64 /* empty_block_type */) {
                    this.appendBuffer(' (result ');
                    this.appendBuffer(typeToString(operator.blockType));
                    this.appendBuffer(')');
                }
                break;
            case 11 /* end */:
                if (this._labelMode === LabelMode.Depth) {
                    break;
                }
                var backrefLabel = this._backrefLabels.pop();
                if (backrefLabel.label) {
                    this.appendBuffer(' ');
                    this.appendBuffer(backrefLabel.label);
                }
                break;
            case 12 /* br */:
            case 13 /* br_if */:
                this.appendBuffer(' ');
                this.appendBuffer(this.useLabel(operator.brDepth));
                break;
            case 14 /* br_table */:
                for (var i = 0; i < operator.brTable.length; i++) {
                    this.appendBuffer(' ');
                    this.appendBuffer(this.useLabel(operator.brTable[i]));
                }
                break;
            case 16 /* call */:
                var funcName = this._nameResolver.getFunctionName(operator.funcIndex, operator.funcIndex < this._importCount, true);
                this.appendBuffer(" " + funcName);
                break;
            case 17 /* call_indirect */:
                var typeName = this._nameResolver.getTypeName(operator.typeIndex, true);
                this.appendBuffer(" " + typeName);
                break;
            case 32 /* get_local */:
            case 33 /* set_local */:
            case 34 /* tee_local */:
                var paramName = this._nameResolver.getVariableName(this._funcIndex, operator.localIndex, true);
                this.appendBuffer(" " + paramName);
                break;
            case 35 /* get_global */:
            case 36 /* set_global */:
                var globalName = this._nameResolver.getGlobalName(operator.globalIndex, true);
                this.appendBuffer(" " + globalName);
                break;
            case 40 /* i32_load */:
            case 41 /* i64_load */:
            case 42 /* f32_load */:
            case 43 /* f64_load */:
            case 44 /* i32_load8_s */:
            case 45 /* i32_load8_u */:
            case 46 /* i32_load16_s */:
            case 47 /* i32_load16_u */:
            case 48 /* i64_load8_s */:
            case 49 /* i64_load8_u */:
            case 50 /* i64_load16_s */:
            case 51 /* i64_load16_u */:
            case 52 /* i64_load32_s */:
            case 53 /* i64_load32_u */:
            case 54 /* i32_store */:
            case 55 /* i64_store */:
            case 56 /* f32_store */:
            case 57 /* f64_store */:
            case 58 /* i32_store8 */:
            case 59 /* i32_store16 */:
            case 60 /* i64_store8 */:
            case 61 /* i64_store16 */:
            case 62 /* i64_store32 */:
            case 65024 /* atomic_wake */:
            case 65025 /* i32_atomic_wait */:
            case 65026 /* i64_atomic_wait */:
            case 65040 /* i32_atomic_load */:
            case 65041 /* i64_atomic_load */:
            case 65042 /* i32_atomic_load8_u */:
            case 65043 /* i32_atomic_load16_u */:
            case 65044 /* i64_atomic_load8_u */:
            case 65045 /* i64_atomic_load16_u */:
            case 65046 /* i64_atomic_load32_u */:
            case 65047 /* i32_atomic_store */:
            case 65048 /* i64_atomic_store */:
            case 65049 /* i32_atomic_store8 */:
            case 65050 /* i32_atomic_store16 */:
            case 65051 /* i64_atomic_store8 */:
            case 65052 /* i64_atomic_store16 */:
            case 65053 /* i64_atomic_store32 */:
            case 65054 /* i32_atomic_rmw_add */:
            case 65055 /* i64_atomic_rmw_add */:
            case 65056 /* i32_atomic_rmw8_u_add */:
            case 65057 /* i32_atomic_rmw16_u_add */:
            case 65058 /* i64_atomic_rmw8_u_add */:
            case 65059 /* i64_atomic_rmw16_u_add */:
            case 65060 /* i64_atomic_rmw32_u_add */:
            case 65061 /* i32_atomic_rmw_sub */:
            case 65062 /* i64_atomic_rmw_sub */:
            case 65063 /* i32_atomic_rmw8_u_sub */:
            case 65064 /* i32_atomic_rmw16_u_sub */:
            case 65065 /* i64_atomic_rmw8_u_sub */:
            case 65066 /* i64_atomic_rmw16_u_sub */:
            case 65067 /* i64_atomic_rmw32_u_sub */:
            case 65068 /* i32_atomic_rmw_and */:
            case 65069 /* i64_atomic_rmw_and */:
            case 65070 /* i32_atomic_rmw8_u_and */:
            case 65071 /* i32_atomic_rmw16_u_and */:
            case 65072 /* i64_atomic_rmw8_u_and */:
            case 65073 /* i64_atomic_rmw16_u_and */:
            case 65074 /* i64_atomic_rmw32_u_and */:
            case 65075 /* i32_atomic_rmw_or */:
            case 65076 /* i64_atomic_rmw_or */:
            case 65077 /* i32_atomic_rmw8_u_or */:
            case 65078 /* i32_atomic_rmw16_u_or */:
            case 65079 /* i64_atomic_rmw8_u_or */:
            case 65080 /* i64_atomic_rmw16_u_or */:
            case 65081 /* i64_atomic_rmw32_u_or */:
            case 65082 /* i32_atomic_rmw_xor */:
            case 65083 /* i64_atomic_rmw_xor */:
            case 65084 /* i32_atomic_rmw8_u_xor */:
            case 65085 /* i32_atomic_rmw16_u_xor */:
            case 65086 /* i64_atomic_rmw8_u_xor */:
            case 65087 /* i64_atomic_rmw16_u_xor */:
            case 65088 /* i64_atomic_rmw32_u_xor */:
            case 65089 /* i32_atomic_rmw_xchg */:
            case 65090 /* i64_atomic_rmw_xchg */:
            case 65091 /* i32_atomic_rmw8_u_xchg */:
            case 65092 /* i32_atomic_rmw16_u_xchg */:
            case 65093 /* i64_atomic_rmw8_u_xchg */:
            case 65094 /* i64_atomic_rmw16_u_xchg */:
            case 65095 /* i64_atomic_rmw32_u_xchg */:
            case 65096 /* i32_atomic_rmw_cmpxchg */:
            case 65097 /* i64_atomic_rmw_cmpxchg */:
            case 65098 /* i32_atomic_rmw8_u_cmpxchg */:
            case 65099 /* i32_atomic_rmw16_u_cmpxchg */:
            case 65100 /* i64_atomic_rmw8_u_cmpxchg */:
            case 65101 /* i64_atomic_rmw16_u_cmpxchg */:
            case 65102 /* i64_atomic_rmw32_u_cmpxchg */:
                var memoryAddress = memoryAddressToString(operator.memoryAddress, operator.code);
                if (memoryAddress !== null) {
                    this.appendBuffer(' ');
                    this.appendBuffer(memoryAddress);
                }
                break;
            case 63 /* current_memory */:
            case 64 /* grow_memory */:
                break;
            case 65 /* i32_const */:
                this.appendBuffer(" " + operator.literal.toString());
                break;
            case 66 /* i64_const */:
                this.appendBuffer(" " + operator.literal.toDouble());
                break;
            case 67 /* f32_const */:
                this.appendBuffer(" " + formatFloat32(operator.literal));
                break;
            case 68 /* f64_const */:
                this.appendBuffer(" " + formatFloat64(operator.literal));
                break;
        }
    };
    WasmDisassembler.prototype.printImportSource = function (info) {
        this.printString(info.module);
        this.appendBuffer(' ');
        this.printString(info.field);
    };
    WasmDisassembler.prototype.increaseIndent = function () {
        this._indent += IndentIncrement;
        this._indentLevel++;
    };
    WasmDisassembler.prototype.decreaseIndent = function () {
        this._indent = this._indent.slice(0, -IndentIncrement.length);
        this._indentLevel--;
    };
    WasmDisassembler.prototype.disassemble = function (reader) {
        var _this = this;
        var done = this.disassembleChunk(reader);
        if (!done)
            return null;
        var lines = this._lines;
        if (this._addOffsets) {
            lines = lines.map(function (line, index) {
                var position = formatHex(_this._offsets[index], 4);
                return line + ' ;; @' + position;
            });
        }
        lines.push(''); // we need '\n' after last line
        var result = lines.join('\n');
        this._lines.length = 0;
        this._offsets.length = 0;
        return result;
    };
    WasmDisassembler.prototype.getResult = function () {
        var linesReady = this._lines.length;
        if (this._backrefLabels && this._labelMode === LabelMode.WhenUsed) {
            this._backrefLabels.some(function (backrefLabel) {
                if (backrefLabel.useLabel)
                    return false;
                linesReady = backrefLabel.line;
                return true;
            });
        }
        if (linesReady === 0) {
            return {
                lines: [],
                offsets: this._addOffsets ? [] : undefined,
                done: this._done,
            };
        }
        if (linesReady === this._lines.length) {
            var result_1 = {
                lines: this._lines,
                offsets: this._addOffsets ? this._offsets : undefined,
                done: this._done,
            };
            this._lines = [];
            if (this._addOffsets)
                this._offsets = [];
            return result_1;
        }
        var result = {
            lines: this._lines.splice(0, linesReady),
            offsets: this._addOffsets ? this._offsets.splice(0, linesReady) : undefined,
            done: false,
        };
        if (this._backrefLabels) {
            this._backrefLabels.forEach(function (backrefLabel) {
                backrefLabel.line -= linesReady;
            });
        }
        return result;
    };
    WasmDisassembler.prototype.disassembleChunk = function (reader, offsetInModule) {
        var _this = this;
        if (offsetInModule === void 0) { offsetInModule = 0; }
        if (this._done)
            throw new Error('Invalid state: disassembly process was already finished.');
        while (true) {
            this._currentPosition = reader.position + offsetInModule;
            if (!reader.read())
                return false;
            switch (reader.state) {
                case 2 /* END_WASM */:
                    this.appendBuffer(')');
                    this.newLine();
                    this._reset();
                    if (!reader.hasMoreBytes()) {
                        this._done = true;
                        return true;
                    }
                    break;
                case -1 /* ERROR */:
                    throw reader.error;
                case 1 /* BEGIN_WASM */:
                    this.appendBuffer('(module');
                    this.newLine();
                    break;
                case 4 /* END_SECTION */:
                    break;
                case 3 /* BEGIN_SECTION */:
                    var sectionInfo = reader.result;
                    switch (sectionInfo.id) {
                        case 1 /* Type */:
                        case 2 /* Import */:
                        case 7 /* Export */:
                        case 6 /* Global */:
                        case 3 /* Function */:
                        case 8 /* Start */:
                        case 10 /* Code */:
                        case 5 /* Memory */:
                        case 11 /* Data */:
                        case 4 /* Table */:
                        case 9 /* Element */:
                            break; // reading known section;
                        default:
                            reader.skipSection();
                            break;
                    }
                    break;
                case 15 /* MEMORY_SECTION_ENTRY */:
                    var memoryInfo = reader.result;
                    var memoryName = this._nameResolver.getMemoryName(this._memoryCount++, false);
                    this.appendBuffer("  (memory " + memoryName + " ");
                    if (memoryInfo.shared) {
                        this.appendBuffer("(shared " + limitsToString(memoryInfo.limits) + ")");
                    }
                    else {
                        this.appendBuffer(limitsToString(memoryInfo.limits));
                    }
                    this.appendBuffer(')');
                    this.newLine();
                    break;
                case 14 /* TABLE_SECTION_ENTRY */:
                    var tableInfo = reader.result;
                    var tableName = this._nameResolver.getTableName(this._tableCount++, false);
                    this.appendBuffer("  (table " + tableName + " " + limitsToString(tableInfo.limits) + " " + typeToString(tableInfo.elementType) + ")");
                    this.newLine();
                    break;
                case 17 /* EXPORT_SECTION_ENTRY */:
                    var exportInfo = reader.result;
                    this.appendBuffer('  (export ');
                    this.printString(exportInfo.field);
                    this.appendBuffer(' ');
                    switch (exportInfo.kind) {
                        case 0 /* Function */:
                            var funcName = this._nameResolver.getFunctionName(exportInfo.index, exportInfo.index < this._importCount, true);
                            this.appendBuffer("(func " + funcName + ")");
                            break;
                        case 1 /* Table */:
                            var tableName = this._nameResolver.getTableName(exportInfo.index, true);
                            this.appendBuffer("(table " + tableName + ")");
                            break;
                        case 2 /* Memory */:
                            var memoryName = this._nameResolver.getMemoryName(exportInfo.index, true);
                            this.appendBuffer("(memory " + memoryName + ")");
                            break;
                        case 3 /* Global */:
                            var globalName = this._nameResolver.getGlobalName(exportInfo.index, true);
                            this.appendBuffer("(global " + globalName + ")");
                            break;
                        default:
                            throw new Error("Unsupported export " + exportInfo.kind);
                    }
                    this.appendBuffer(')');
                    this.newLine();
                    break;
                case 12 /* IMPORT_SECTION_ENTRY */:
                    var importInfo = reader.result;
                    this.appendBuffer('  (import ');
                    this.printImportSource(importInfo);
                    switch (importInfo.kind) {
                        case 0 /* Function */:
                            this._importCount++;
                            var funcName = this._nameResolver.getFunctionName(this._funcIndex++, true, false);
                            this.appendBuffer(" (func " + funcName);
                            this.printFuncType(importInfo.funcTypeIndex);
                            this.appendBuffer(')');
                            break;
                        case 1 /* Table */:
                            var tableImportInfo = importInfo.type;
                            var tableName = this._nameResolver.getTableName(this._tableCount++, false);
                            this.appendBuffer(" (table " + tableName + " " + limitsToString(tableImportInfo.limits) + " " + typeToString(tableImportInfo.elementType) + ")");
                            break;
                        case 2 /* Memory */:
                            var memoryImportInfo = importInfo.type;
                            var memoryName = this._nameResolver.getMemoryName(this._memoryCount++, false);
                            this.appendBuffer(" (memory " + memoryName + " ");
                            if (memoryImportInfo.shared) {
                                this.appendBuffer("(shared " + limitsToString(memoryImportInfo.limits) + ")");
                            }
                            else {
                                this.appendBuffer(limitsToString(memoryImportInfo.limits));
                            }
                            this.appendBuffer(')');
                            break;
                        case 3 /* Global */:
                            var globalImportInfo = importInfo.type;
                            var globalName = this._nameResolver.getGlobalName(this._globalCount++, false);
                            this.appendBuffer(" (global " + globalName + " " + globalTypeToString(globalImportInfo) + ")");
                            break;
                        default:
                            throw new Error("NYI other import types: " + importInfo.kind);
                    }
                    this.appendBuffer(')');
                    this.newLine();
                    break;
                case 33 /* BEGIN_ELEMENT_SECTION_ENTRY */:
                    var elementSegmentInfo = reader.result;
                    this.appendBuffer('  (elem ');
                    break;
                case 35 /* END_ELEMENT_SECTION_ENTRY */:
                    this.appendBuffer(')');
                    this.newLine();
                    break;
                case 34 /* ELEMENT_SECTION_ENTRY_BODY */:
                    var elementSegmentBody = reader.result;
                    elementSegmentBody.elements.forEach(function (funcIndex) {
                        var funcName = _this._nameResolver.getFunctionName(funcIndex, funcIndex < _this._importCount, true);
                        _this.appendBuffer(" " + funcName);
                    });
                    break;
                case 39 /* BEGIN_GLOBAL_SECTION_ENTRY */:
                    var globalInfo = reader.result;
                    var globalName = this._nameResolver.getGlobalName(this._globalCount++, false);
                    this.appendBuffer("  (global " + globalName + " " + globalTypeToString(globalInfo.type) + " ");
                    break;
                case 40 /* END_GLOBAL_SECTION_ENTRY */:
                    this.appendBuffer(')');
                    this.newLine();
                    break;
                case 11 /* TYPE_SECTION_ENTRY */:
                    var funcType = reader.result;
                    var typeIndex = this._types.length;
                    this._types.push(funcType);
                    var typeName = this._nameResolver.getTypeName(typeIndex, false);
                    this.appendBuffer("  (type " + typeName + " (func");
                    this.printFuncType(typeIndex);
                    this.appendBuffer('))');
                    this.newLine();
                    break;
                case 22 /* START_SECTION_ENTRY */:
                    var startEntry = reader.result;
                    var funcName = this._nameResolver.getFunctionName(startEntry.index, startEntry.index < this._importCount, true);
                    this.appendBuffer("  (start " + funcName + ")");
                    this.newLine();
                    break;
                case 36 /* BEGIN_DATA_SECTION_ENTRY */:
                    this.appendBuffer('  (data ');
                    break;
                case 37 /* DATA_SECTION_ENTRY_BODY */:
                    var body = reader.result;
                    this.newLine();
                    this.appendBuffer('    ');
                    this.printString(body.data);
                    this.newLine();
                    break;
                case 38 /* END_DATA_SECTION_ENTRY */:
                    this.appendBuffer('  )');
                    this.newLine();
                    break;
                case 25 /* BEGIN_INIT_EXPRESSION_BODY */:
                    break;
                case 26 /* INIT_EXPRESSION_OPERATOR */:
                    this._initExpression.push(reader.result);
                    break;
                case 27 /* END_INIT_EXPRESSION_BODY */:
                    this.appendBuffer('(');
                    // TODO fix printing when more that one operator is used.
                    this._initExpression.forEach(function (op, index) {
                        if (op.code === 11 /* end */) {
                            return; // do not print end
                        }
                        if (index > 0) {
                            _this.appendBuffer(' ');
                        }
                        _this.printOperator(op);
                    });
                    this.appendBuffer(')');
                    this._initExpression.length = 0;
                    break;
                case 13 /* FUNCTION_SECTION_ENTRY */:
                    this._funcTypes.push(reader.result.typeIndex);
                    break;
                case 28 /* BEGIN_FUNCTION_BODY */:
                    var func = reader.result;
                    var type = this._types[this._funcTypes[this._funcIndex - this._importCount]];
                    this.appendBuffer('  (func ');
                    this.appendBuffer(this._nameResolver.getFunctionName(this._funcIndex, false, false));
                    for (var i = 0; i < type.params.length; i++) {
                        var paramName = this._nameResolver.getVariableName(this._funcIndex, i, false);
                        this.appendBuffer(" (param " + paramName + " " + typeToString(type.params[i]) + ")");
                    }
                    for (var i = 0; i < type.returns.length; i++) {
                        this.appendBuffer(" (result " + typeToString(type.returns[i]) + ")");
                    }
                    this.newLine();
                    var localIndex = type.params.length;
                    if (func.locals.length > 0) {
                        this.appendBuffer('   ');
                        for (var _i = 0, _a = func.locals; _i < _a.length; _i++) {
                            var l = _a[_i];
                            for (var i = 0; i < l.count; i++) {
                                var paramName = this._nameResolver.getVariableName(this._funcIndex, localIndex++, false);
                                this.appendBuffer(" (local " + paramName + " " + typeToString(l.type) + ")");
                            }
                        }
                        this.newLine();
                    }
                    this._indent = '    ';
                    this._indentLevel = 0;
                    this._labelIndex = 0;
                    this._backrefLabels = this._labelMode === LabelMode.Depth ? null : [];
                    break;
                case 30 /* CODE_OPERATOR */:
                    var operator = reader.result;
                    if (operator.code == 11 /* end */ && this._indentLevel == 0) {
                        // reached of the function, skipping the operator
                        break;
                    }
                    switch (operator.code) {
                        case 11 /* end */:
                        case 5 /* else */:
                            this.decreaseIndent();
                            break;
                    }
                    this.appendBuffer(this._indent);
                    this.printOperator(operator);
                    this.newLine();
                    switch (operator.code) {
                        case 4 /* if */:
                        case 2 /* block */:
                        case 3 /* loop */:
                        case 5 /* else */:
                            this.increaseIndent();
                            break;
                    }
                    break;
                case 31 /* END_FUNCTION_BODY */:
                    this._funcIndex++;
                    this._backrefLabels = null;
                    this.appendBuffer("  )");
                    this.newLine();
                    break;
                default:
                    throw new Error("Expectected state: " + reader.state);
            }
        }
    };
    return WasmDisassembler;
}());
exports.WasmDisassembler = WasmDisassembler;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function toAddress(n) {
    var s = n.toString(16);
    while (s.length < 6) {
        s = "0" + s;
    }
    return "0x" + s;
}
exports.toAddress = toAddress;
function padRight(s, n, c) {
    s = String(s);
    while (s.length < n) {
        s = s + c;
    }
    return s;
}
exports.padRight = padRight;
function padLeft(s, n, c) {
    s = String(s);
    while (s.length < n) {
        s = c + s;
    }
    return s;
}
exports.padLeft = padLeft;
var x86JumpInstructions = [
    "jmp", "ja", "jae", "jb", "jbe", "jc", "je", "jg", "jge", "jl", "jle", "jna", "jnae",
    "jnb", "jnbe", "jnc", "jne", "jng", "jnge", "jnl", "jnle", "jno", "jnp", "jns", "jnz",
    "jo", "jp", "jpe", "jpo", "js", "jz"
];
function isBranch(instr) {
    return x86JumpInstructions.indexOf(instr.mnemonic) >= 0;
}
exports.isBranch = isBranch;
var base64DecodeMap = [
    62, 0, 0, 0, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
    0, 0, 0, 0, 0, 0, 0,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25, 0, 0, 0, 0, 0, 0,
    26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
    44, 45, 46, 47, 48, 49, 50, 51
];
var base64DecodeMapOffset = 0x2B;
var base64EOF = 0x3D;
function decodeRestrictedBase64ToBytes(encoded) {
    var ch;
    var code;
    var code2;
    var len = encoded.length;
    var padding = encoded.charAt(len - 2) === '=' ? 2 : encoded.charAt(len - 1) === '=' ? 1 : 0;
    var decoded = new Uint8Array((encoded.length >> 2) * 3 - padding);
    for (var i = 0, j = 0; i < encoded.length;) {
        ch = encoded.charCodeAt(i++);
        code = base64DecodeMap[ch - base64DecodeMapOffset];
        ch = encoded.charCodeAt(i++);
        code2 = base64DecodeMap[ch - base64DecodeMapOffset];
        decoded[j++] = (code << 2) | ((code2 & 0x30) >> 4);
        ch = encoded.charCodeAt(i++);
        if (ch == base64EOF) {
            return decoded;
        }
        code = base64DecodeMap[ch - base64DecodeMapOffset];
        decoded[j++] = ((code2 & 0x0f) << 4) | ((code & 0x3c) >> 2);
        ch = encoded.charCodeAt(i++);
        if (ch == base64EOF) {
            return decoded;
        }
        code2 = base64DecodeMap[ch - base64DecodeMapOffset];
        decoded[j++] = ((code & 0x03) << 6) | code2;
    }
    return decoded;
}
exports.decodeRestrictedBase64ToBytes = decodeRestrictedBase64ToBytes;
function base64Encode(buffer) {
    var bytes = new TextEncoder('utf-8').encode(buffer);
    return;
}
exports.base64Encode = base64Encode;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const Workspace_1 = __webpack_require__(66);
const Toolbar_1 = __webpack_require__(70);
const EditorPane_1 = __webpack_require__(36);
const model_1 = __webpack_require__(2);
const service_1 = __webpack_require__(13);
const Split_1 = __webpack_require__(10);
const index_1 = __webpack_require__(3);
const wast_1 = __webpack_require__(72);
const log_1 = __webpack_require__(73);
const Mousetrap = __webpack_require__(74);
const gulpy_1 = __webpack_require__(76);
const Icons_1 = __webpack_require__(20);
const Button_1 = __webpack_require__(21);
const NewFileDialog_1 = __webpack_require__(77);
const EditFileDialog_1 = __webpack_require__(89);
const cton_1 = __webpack_require__(91);
const x86_1 = __webpack_require__(92);
const ShareDialog_1 = __webpack_require__(95);
const NewProjectDialog_1 = __webpack_require__(96);
const errors_1 = __webpack_require__(97);
const ControlCenter_1 = __webpack_require__(98);
class Group {
    constructor(file, preview, files) {
        this.file = file;
        this.preview = preview;
        this.files = files;
    }
    open(file, shouldPreview = true) {
        let files = this.files;
        let index = files.indexOf(file);
        if (index >= 0) {
            // Switch to file if it's aleady open.
            this.file = file;
            if (!shouldPreview) {
                this.preview = null;
            }
            return;
        }
        if (shouldPreview) {
            if (this.preview) {
                // Replace preview file if there is one.
                let previewIndex = files.indexOf(this.preview);
                index_1.assert(previewIndex >= 0);
                this.file = this.preview = files[previewIndex] = file;
            }
            else {
                files.push(file);
                this.file = this.preview = file;
            }
        }
        else {
            files.push(file);
            this.file = file;
            this.preview = null;
        }
    }
    close(file) {
        let i = this.files.indexOf(file);
        index_1.assert(i >= 0);
        if (file == this.preview) {
            this.preview = null;
        }
        this.files.splice(i, 1);
        this.file = this.files.length ? this.files[Math.min(this.files.length - 1, i)] : null;
    }
}
exports.Group = Group;
class App extends React.Component {
    constructor(props) {
        super(props);
        // makeMenuItems(file: File) {
        //   let items = [];
        //   let directory = file.type === FileType.Directory ? file : file.parent;
        //   items.push(
        //     <MenuItem key="new file" label="New File" icon={<GoFile />} onClick={() => {
        //       this.setState({ newFileDialogDirectory: directory as Directory });
        //     }} />
        //   );
        //   if (file.type === FileType.Wasm) {
        //     items.push(
        //       <MenuItem key="opt bin" label="Optimize w/ Binaryen" icon={<GoGear />} onClick={() => {
        //         Service.optimizeWasmWithBinaryen(file);
        //       }} />
        //     );
        //     items.push(
        //       <MenuItem key="val bin" label="Validate w/ Binaryen" icon={<GoVerified />} onClick={() => {
        //         Service.validateWasmWithBinaryen(file);
        //       }} />
        //     );
        //     items.push(
        //       <MenuItem key="dld bin" label="Download" icon={<GoDesktopDownload />} onClick={() => {
        //         Service.download(file);
        //       }} />
        //     );
        //     items.push(
        //       <MenuItem key="dis bin" label="Disassemble w/ Wabt" icon={<GoFileCode />} onClick={() => {
        //         Service.disassembleWasmWithWabt(file);
        //       }} />
        //     );
        //     items.push(
        //       <MenuItem key="dis x86" label="Firefox x86" icon={<GoFileBinary />} onClick={() => {
        //         Service.disassembleX86(file);
        //       }} />,
        //       <MenuItem key="dis x86 base" label="Firefox x86 Baseline" icon={<GoFileBinary />} onClick={() => {
        //         Service.disassembleX86(file, "--wasm-always-baseline");
        //       }} />
        //     );
        //   } else if (file.type === FileType.C || file.type === FileType.Cpp) {
        //     items.push(
        //       <MenuItem key="format" label="Format w/ Clang" icon={<GoQuote />} onClick={() => {
        //         Service.clangFormat(file);
        //       }} />
        //     );
        //   } else if (file.type === FileType.Wast) {
        //     items.push(
        //       <MenuItem key="asm bin" label="Assemble w/ Wabt" icon={<GoFileBinary />} onClick={() => {
        //         Service.assembleWastWithWabt(file);
        //       }} />
        //     );
        //   }
        //   items.push(<Divider key="divider" height={8} />);
        //   items.push(<MenuItem key="edit" label="Edit" icon={<GoPencil />} onClick={() => {
        //     this.setState({ editFileDialogFile: file });
        //   }} />);
        //   items.push(<MenuItem key="delete" label="Delete" icon={<GoDelete />} onClick={() => {
        //     let message = "";
        //     if (file instanceof Directory) {
        //       message = `Are you sure you want to delete '${file.name}' and its contents?`;
        //     } else {
        //       message = `Are you sure you want to delete '${file.name}'?`;
        //     }
        //     if (confirm(message)) {
        //       file.parent.removeFile(file);
        //     }
        //   }} />);
        //   return items;
        // }
        /**
         * Remember workspace split.
         */
        this.workspaceSplit = null;
        let group0 = new Group(null, null, []);
        this.state = {
            fiddle: props.fiddle,
            file: null,
            groups: [
                group0,
            ],
            group: group0,
            newFileDialogDirectory: null,
            editFileDialogFile: null,
            newProjectDialog: !props.fiddle,
            shareDialog: false,
            workspaceSplits: [
                {
                    min: 200,
                    max: 400,
                    value: 200,
                },
                {
                    min: 256
                }
            ],
            consoleSplits: [
                { min: 100 },
                { min: 40, value: 256 }
            ],
            editorSplits: [],
            showProblems: true,
            showSandbox: true
        };
        this.registerLanguages();
    }
    openProjectFiles(json) {
        let groups = json.openedFiles.map((paths) => {
            let files = paths.map(file => {
                return this.project.getFile(file);
            });
            return new Group(files[0], null, files);
        });
        this.setState({ group: groups[0], groups });
    }
    initializeProject() {
        return __awaiter(this, void 0, void 0, function* () {
            this.project = new model_1.Project();
            if (this.state.fiddle) {
                let json = yield service_1.Service.loadJSON(this.state.fiddle);
                json = yield service_1.Service.loadProject(json, this.project);
                if (false) {
                    // this.loadProject(json);
                }
                this.logLn("Project Loaded ...");
                this.forceUpdate();
            }
            this.project.onDidChangeBuffer.register(() => {
                this.forceUpdate();
            });
            this.project.onDidChangeData.register(() => {
                this.forceUpdate();
            });
            this.project.onDidChangeChildren.register(() => {
                this.forceUpdate();
            });
            this.project.onDirtyFileUsed.register((file) => {
                this.logLn(`Changes in ${file.getPath()} were ignored, save your changes.`, "warn");
            });
        });
    }
    // TODO: Optimize
    // shouldComponentUpdate(nextProps: any, nextState: AppState) {
    //   let state = this.state;
    //   if (state.file !== nextState.file) return true;
    //   if (state.group !== nextState.group) return true;
    //   if (!shallowCompare(state.groups, nextState.groups)) return true;
    //   return false;
    // }
    registerLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            monaco.editor.defineTheme("fiddle-theme", {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    { token: 'custom-info', foreground: 'd4d4d4' },
                    { token: 'custom-warn', foreground: 'ff9900' },
                    { token: 'custom-error', background: '00ff00', foreground: 'ff0000', fontStyle: 'bold' }
                ]
            });
            // Wast
            monaco.languages.register({
                id: "wast"
            });
            monaco.languages.onLanguage("wast", () => {
                monaco.languages.setMonarchTokensProvider("wast", wast_1.Wast.MonarchDefinitions);
                monaco.languages.setLanguageConfiguration("wast", wast_1.Wast.LanguageConfiguration);
                monaco.languages.registerCompletionItemProvider("wast", wast_1.Wast.CompletionItemProvider);
                monaco.languages.registerHoverProvider("wast", wast_1.Wast.HoverProvider);
            });
            // Log
            monaco.languages.register({
                id: "log"
            });
            monaco.languages.onLanguage("log", () => {
                monaco.languages.setMonarchTokensProvider("log", log_1.Log.MonarchTokensProvider);
            });
            // Cretonne
            monaco.languages.register({
                id: "cton"
            });
            monaco.languages.onLanguage("cton", () => {
                monaco.languages.setMonarchTokensProvider("cton", cton_1.Cton.MonarchDefinitions);
                // monaco.languages.setLanguageConfiguration("cton", Cton.LanguageConfiguration);
                // monaco.languages.registerCompletionItemProvider("cton", Cton.CompletionItemProvider);
                // monaco.languages.registerHoverProvider("cton", Cton.HoverProvider);
            });
            // X86
            monaco.languages.register({
                id: "x86"
            });
            monaco.languages.onLanguage("x86", () => {
                monaco.languages.setMonarchTokensProvider("x86", x86_1.X86.MonarchDefinitions);
                // monaco.languages.setLanguageConfiguration("cton", Cton.LanguageConfiguration);
                // monaco.languages.registerCompletionItemProvider("cton", Cton.CompletionItemProvider);
                // monaco.languages.registerHoverProvider("cton", Cton.HoverProvider);
            });
            let response = yield fetch("lib/lib.es6.d.ts");
            monaco.languages.typescript.typescriptDefaults.addExtraLib(yield response.text());
            response = yield fetch("lib/fiddle.d.ts");
            monaco.languages.typescript.typescriptDefaults.addExtraLib(yield response.text());
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({ noLib: true, allowNonTsExtensions: true });
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ noLib: true, allowNonTsExtensions: true });
        });
    }
    loadReleaseNotes() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch("notes/notes.md");
            const src = yield response.text();
            let notes = new model_1.File("Release Notes", model_1.FileType.Markdown);
            notes.setData(src);
            this.state.group.open(notes);
            this.forceUpdate();
        });
    }
    registerShortcuts() {
        model_1.Project.onBuild.register(() => {
            this.build();
        });
        model_1.Project.onRun.register(() => {
            this.run();
        });
        Mousetrap.bind('command+b', () => {
            model_1.Project.build();
        });
        Mousetrap.bind('command+enter', () => {
            model_1.Project.run();
        });
        // Mousetrap.bind('command+1', (e) => {
        //   let groups = this.state.groups;
        //   groups.length > 0 && this.setState({group: groups[0]});
        //   e.preventDefault();
        // });
        // Mousetrap.bind('command+2', (e) => {
        //   let groups = this.state.groups;
        //   groups.length > 1 && this.setState({group: groups[1]});
        //   e.preventDefault();
        // });
        // Mousetrap.bind('command+3', (e) => {
        //   let groups = this.state.groups;
        //   groups.length > 2 && this.setState({group: groups[2]});
        //   e.preventDefault();
        // });
        // Mousetrap.bind('command+shift+left', (e) => {
        //   console.log("left");
        //   e.preventDefault();
        // });
        // Mousetrap.bind('command+shift+right', (e) => {
        //   console.log("right");
        //   e.preventDefault();
        // });
    }
    logLn(message, kind = "") {
        if (this.controlCenter) {
            this.controlCenter.logLn(message, kind);
        }
    }
    componentWillMount() {
        this.initializeProject();
    }
    componentDidMount() {
        index_1.layout();
        this.registerShortcuts();
        if (!this.props.embed) {
            this.loadReleaseNotes();
        }
        window.addEventListener("resize", () => {
            console.log("App.forceUpdate because of window resize.");
            this.forceUpdate();
        }, false);
    }
    share() {
        this.setState({ shareDialog: true });
    }
    run() {
        let root = this.project;
        let src = root.getFile("src/main.html").getData();
        src = src.replace(/src\s*=\s*"(.+?)"/, (a, b) => {
            let src = root.getFile(b).buffer.getValue();
            let blob = new Blob([src], { type: "text/javascript" });
            return `src="${window.URL.createObjectURL(blob)}"`;
        });
        this.controlCenter.sandbox.run(this.project, src);
    }
    splitGroup() {
        let groups = this.state.groups;
        let lastGroup = groups[groups.length - 1];
        if (lastGroup.files.length === 0) {
            return;
        }
        let group = new Group(lastGroup.file, null, [lastGroup.file]);
        this.state.groups.push(group);
        this.setState({ group });
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            const run = (src) => {
                let fn = new Function("gulp", "project", "Service", "logLn", src);
                let gulp = new gulpy_1.Gulpy();
                fn(gulp, this.project, service_1.Service, this.logLn.bind(self));
                gulp.run("default");
            };
            let buildTs = this.project.getFile("build.ts");
            let buildJS = this.project.getFile("build.js");
            if (buildTs) {
                const output = yield buildTs.getEmitOutput();
                run(output.outputFiles[0].text);
            }
            else if (buildJS) {
                run(buildJS.getData());
            }
            else {
                this.logLn(errors_1.Errors.BuildFileMissing, "error");
                return;
            }
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logLn("Saving Project ...");
            let openedFiles = this.state.groups.map((group) => {
                return group.files.map((file) => file.getPath());
            });
            yield service_1.Service.saveProject(this.project, openedFiles, this.state.fiddle);
            this.logLn("Saved Project OK");
        });
    }
    fork() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logLn("Forking Project ...");
            const fiddle = yield service_1.Service.saveProject(this.project, []);
            this.logLn("Forked Project OK " + fiddle);
            let search = window.location.search;
            if (this.state.fiddle) {
                index_1.assert(search.indexOf(this.state.fiddle) >= 0);
                history.replaceState({}, fiddle, search.replace(this.state.fiddle, fiddle));
            }
            else {
                history.pushState({}, fiddle, `?f=${fiddle}`);
            }
            this.setState({ fiddle });
        });
    }
    makeToolbarButtons() {
        let toolbarButtons = [
            React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoThreeBars, null), title: "View Workspace", onClick: () => {
                    let workspaceSplits = this.state.workspaceSplits;
                    let first = workspaceSplits[0];
                    let second = workspaceSplits[1];
                    if (this.workspaceSplit) {
                        Object.assign(first, this.workspaceSplit);
                        this.workspaceSplit = null;
                        delete second.value;
                    }
                    else {
                        this.workspaceSplit = Object.assign({}, first);
                        first.max = first.min = 0;
                    }
                    this.setState({ workspaceSplits });
                } })
        ];
        if (this.props.embed) {
            toolbarButtons.push(React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoPencil, null), label: "Edit in Web Assembly Studio", title: "Edit in WebAssembly Fiddle", onClick: () => {
                    // this.update();
                } }));
        }
        else {
            toolbarButtons.push(React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoPencil, null), label: "Update", title: "Update Fiddle", onClick: () => {
                    this.update();
                } }), React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoRepoForked, null), label: "Fork", title: "Fork Fiddle", onClick: () => {
                    this.fork();
                } }), React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoRocket, null), label: "Share", onClick: () => {
                    this.share();
                } }));
        }
        toolbarButtons.push(React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoBeaker, null), label: "Build", title: "Build: CtrlCmd + B", onClick: () => {
                this.build();
            } }), React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoGear, null), label: "Run", title: "Run: CtrlCmd + Enter", onClick: () => {
                this.run();
            } }));
        return toolbarButtons;
    }
    setControlCenter(controlCenter) {
        this.controlCenter = controlCenter;
    }
    render() {
        let self = this;
        function makeEditorPanes(groups) {
            if (groups.length === 0) {
                return React.createElement("div", null, "No Groups");
            }
            return groups.map(group => {
                return React.createElement(EditorPane_1.EditorPane, { files: group.files.slice(0), file: group.file, preview: group.preview, onSplitEditor: () => {
                        self.splitGroup();
                    }, hasFocus: self.state.group === group, onFocus: () => {
                        // TODO: Should be taken care of in shouldComponentUpdate instead.
                        if (self.state.group !== group) {
                            self.setState({ group });
                        }
                    }, onClickFile: (file) => {
                        group.open(file);
                        self.setState({ group });
                    }, onDoubleClickFile: (file) => {
                        if (file instanceof model_1.Directory) {
                            return;
                        }
                        group.open(file, false);
                        self.setState({ group });
                    }, onClose: (file) => {
                        let groups = self.state.groups;
                        group.close(file);
                        if (group.files.length === 0 && groups.length > 1) {
                            let i = groups.indexOf(group);
                            groups.splice(i, 1);
                            let g = groups.length ? groups[Math.min(groups.length - 1, i)] : null;
                            self.setState({ groups, group: g });
                            index_1.layout();
                        }
                        else {
                            self.setState({ group });
                        }
                    } });
            });
        }
        let editorPanes = React.createElement(Split_1.Split, { name: "Editors", orientation: Split_1.SplitOrientation.Vertical, defaultSplit: {
                min: 128,
            }, splits: this.state.editorSplits, onChange: (splits) => {
                this.setState({ editorSplits: splits });
                index_1.layout();
            } }, makeEditorPanes(this.state.groups));
        return React.createElement("div", { className: "fill" },
            this.state.newProjectDialog &&
                React.createElement(NewProjectDialog_1.NewProjectDialog, { isOpen: true, onCancel: () => {
                        this.setState({ newProjectDialog: null });
                    }, onCreate: (template) => __awaiter(this, void 0, void 0, function* () {
                        if (!template.project) {
                            this.logLn("Template doesn't contain a project definition.", "error");
                        }
                        else {
                            const json = yield service_1.Service.loadProject(template.project, this.project);
                            this.openProjectFiles(json);
                        }
                        this.setState({ newProjectDialog: false });
                    }) }),
            this.state.newFileDialogDirectory &&
                React.createElement(NewFileDialog_1.NewFileDialog, { isOpen: true, directory: this.state.newFileDialogDirectory, onCancel: () => {
                        this.setState({ newFileDialogDirectory: null });
                    }, onCreate: (file) => {
                        this.project.addFile(file);
                        this.setState({ newFileDialogDirectory: null });
                    } }),
            this.state.editFileDialogFile &&
                React.createElement(EditFileDialog_1.EditFileDialog, { isOpen: true, file: this.state.editFileDialogFile, onCancel: () => {
                        this.setState({ editFileDialogFile: null });
                    }, onChange: (name, description) => {
                        let file = this.state.editFileDialogFile;
                        file.name = name;
                        file.description = description;
                        this.setState({ editFileDialogFile: null });
                    } }),
            this.state.shareDialog &&
                React.createElement(ShareDialog_1.ShareDialog, { isOpen: true, fiddle: this.state.fiddle, onCancel: () => {
                        this.setState({ shareDialog: false });
                    } }),
            React.createElement("div", { style: { height: "calc(100% - 22px)" } },
                React.createElement(Split_1.Split, { name: "Workspace", orientation: Split_1.SplitOrientation.Vertical, splits: this.state.workspaceSplits, onChange: (splits) => {
                        this.setState({ workspaceSplits: splits });
                        index_1.layout();
                    } },
                    React.createElement(Workspace_1.Workspace, { project: this.project, file: this.state.file, onNewFile: (directory) => {
                            this.setState({ newFileDialogDirectory: directory });
                        }, onEditFile: (file) => {
                            this.setState({ editFileDialogFile: file });
                        }, onDeleteFile: (file) => {
                            let message = "";
                            if (file instanceof model_1.Directory) {
                                message = `Are you sure you want to delete '${file.name}' and its contents?`;
                            }
                            else {
                                message = `Are you sure you want to delete '${file.name}'?`;
                            }
                            if (confirm(message)) {
                                file.parent.removeFile(file);
                            }
                        }, onClickFile: (file) => {
                            this.state.group.open(file);
                            this.forceUpdate();
                        }, onDoubleClickFile: (file) => {
                            if (file instanceof model_1.Directory) {
                                return;
                            }
                            this.state.group.open(file, false);
                            this.forceUpdate();
                        } }),
                    React.createElement("div", { className: "fill" },
                        React.createElement("div", { style: { height: "40px" } },
                            React.createElement(Toolbar_1.Toolbar, null, this.makeToolbarButtons())),
                        React.createElement("div", { style: { height: "calc(100% - 40px)" } },
                            React.createElement(Split_1.Split, { name: "Console", orientation: Split_1.SplitOrientation.Horizontal, splits: this.state.consoleSplits, onChange: (splits) => {
                                    this.setState({ consoleSplits: splits });
                                    index_1.layout();
                                } },
                                editorPanes,
                                React.createElement(ControlCenter_1.ControlCenter, { project: this.project, ref: (ref) => this.setControlCenter(ref) })))))),
            React.createElement("div", { className: "status-bar" },
                React.createElement("div", { className: "status-bar-item" }, "Web Assembly Studio")));
    }
}
exports.App = App;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const Header_1 = __webpack_require__(67);
const DirectoryTree_1 = __webpack_require__(100);
const Split_1 = __webpack_require__(10);
class Workspace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showProject: false,
            showFiles: true,
            splits: []
        };
    }
    render() {
        let project = this.props.project;
        return React.createElement("div", { className: "workspaceContainer" },
            React.createElement(Header_1.Header, null),
            React.createElement("div", { style: { height: "calc(100% - 41px)" } },
                React.createElement(Split_1.Split, { name: "Workspace", orientation: Split_1.SplitOrientation.Horizontal, splits: this.state.splits, onChange: (splits) => {
                        this.setState({ splits: splits });
                    } },
                    React.createElement("div", null),
                    React.createElement(DirectoryTree_1.DirectoryTree, { directory: project, value: this.props.file, onNewFile: this.props.onNewFile, onNewDirectory: this.props.onNewDirectory, onEditFile: this.props.onEditFile, onDeleteFile: this.props.onDeleteFile, onClickFile: (file) => {
                            this.props.onClickFile(file);
                        }, onDoubleClickFile: (file) => {
                            this.props.onDoubleClickFile(file);
                        } }))));
    }
}
exports.Workspace = Workspace;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
class Header extends React.Component {
    render() {
        return React.createElement("div", { className: "wasmStudioHeader" },
            React.createElement("span", { className: "waHeaderText" }, "Web Assembly Studio"));
    }
}
exports.Header = Header;


/***/ }),
/* 68 */,
/* 69 */,
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
class Toolbar extends React.Component {
    render() {
        return React.createElement("div", { className: "toolbar" }, this.props.children);
    }
}
exports.Toolbar = Toolbar;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const service_1 = __webpack_require__(13);
class Markdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            html: "Loading ..."
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield service_1.Service.compileMarkdownToHtml(this.props.src);
            this.setState({ html });
        });
    }
    componentWillReceiveProps(props) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.props.src !== props.src) {
                const html = yield service_1.Service.compileMarkdownToHtml(props.src);
                this.setState({ html });
            }
        });
    }
    render() {
        return React.createElement("div", { style: { padding: "8px" }, className: "md", dangerouslySetInnerHTML: { __html: this.state.html } });
    }
}
exports.Markdown = Markdown;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(5);
let completionItems = null;
function getCompletionItems() {
    const keyword = monaco.languages.CompletionItemKind.Keyword;
    if (completionItems) {
        return completionItems;
    }
    return completionItems = [
        { label: 'module', documentation: '', kind: keyword, insertText: 'module' },
        { label: 'func', documentation: 'function declaration', kind: keyword, insertText: 'func' },
        { label: 'param', documentation: 'parameter', kind: keyword, insertText: { value: 'param ${1:identifier} ${2:type}' } },
        // 'table',
        // 'memory',
        // 'export',
        // 'import',
        // 'func',
        // 'result',
        // 'offset',
        // 'anyfunc',
        { label: 'i32', documentation: '32-bit integer', kind: keyword, insertText: 'i32' },
        { label: 'i64', documentation: '64-bit integer', kind: keyword, insertText: 'i64' },
        { label: 'f32', documentation: '32-bit floating point', kind: keyword, insertText: 'f32' },
        { label: 'f64', documentation: '64-bit floating point', kind: keyword, insertText: 'f64' },
        { label: 'i32.load8_s', documentation: 'load 1 byte and sign-extend i8 to i32', kind: keyword, insertText: 'i32.load8_s' },
        { label: 'i32.load8_u', documentation: 'load 1 byte and zero-extend i8 to i32', kind: keyword, insertText: 'i32.load8_u' },
        { label: 'i32.load16_s', documentation: 'load 2 bytes and sign-extend i16 to i32', kind: keyword, insertText: 'i32.load16_s' },
        { label: 'i32.load16_u', documentation: 'load 2 bytes and zero-extend i16 to i32', kind: keyword, insertText: 'i32.load16_u' },
        { label: 'i32.load', documentation: 'load 4 bytes as i32', kind: keyword, insertText: 'i32.load' },
        { label: 'i64.load8_s', documentation: 'load 1 byte and sign-extend i8 to i64', kind: keyword, insertText: 'i64.load8_s' },
        { label: 'i64.load8_u', documentation: 'load 1 byte and zero-extend i8 to i64', kind: keyword, insertText: 'i64.load8_u' },
        { label: 'i64.load16_s', documentation: 'load 2 bytes and sign-extend i16 to i64', kind: keyword, insertText: 'i64.load16_s' },
        { label: 'i64.load16_u', documentation: 'load 2 bytes and zero-extend i16 to i64', kind: keyword, insertText: 'i64.load16_u' },
        { label: 'i64.load32_s', documentation: 'load 4 bytes and sign-extend i32 to i64', kind: keyword, insertText: 'i64.load32_s' },
        { label: 'i64.load32_u', documentation: 'load 4 bytes and zero-extend i32 to i64', kind: keyword, insertText: 'i64.load32_u' },
        { label: 'i64.load', documentation: 'load 8 bytes as i64', kind: keyword, insertText: 'i64.load' },
        { label: 'f32.load', documentation: 'load 4 bytes as f32', kind: keyword, insertText: 'f32.load' },
        { label: 'f64.load', documentation: 'load 8 bytes as f64', kind: keyword, insertText: 'f64.load' },
        { label: 'i32.store8', documentation: 'wrap i32 to i8 and store 1 byte', kind: keyword, insertText: 'i32.store8' },
        { label: 'i32.store16', documentation: 'wrap i32 to i16 and store 2 bytes', kind: keyword, insertText: 'i32.store16' },
        { label: 'i32.store', documentation: '(no conversion) store 4 bytes', kind: keyword, insertText: 'i32.store' },
        { label: 'i64.store8', documentation: 'wrap i64 to i8 and store 1 byte', kind: keyword, insertText: 'i64.store8' },
        { label: 'i64.store16', documentation: 'wrap i64 to i16 and store 2 bytes', kind: keyword, insertText: 'i64.store16' },
        { label: 'i64.store32', documentation: 'wrap i64 to i32 and store 4 bytes', kind: keyword, insertText: 'i64.store32' },
        { label: 'i64.store', documentation: '(no conversion) store 8 bytes', kind: keyword, insertText: 'i64.store' },
        { label: 'f32.store', documentation: '(no conversion) store 4 bytes', kind: keyword, insertText: 'f32.store' },
        { label: 'f64.store', documentation: '(no conversion) store 8 bytes', kind: keyword, insertText: 'f64.store' },
        { label: 'get_local', documentation: 'read the current value of a local variable', kind: keyword, insertText: 'get_local' },
        { label: 'set_local', documentation: 'set the current value of a local variable', kind: keyword, insertText: 'set_local' },
        { label: 'tee_local', documentation: 'like `set_local`, but also returns the set value', kind: keyword, insertText: 'tee_local' },
        { label: 'get_global', documentation: 'get the current value of a global variable', kind: keyword, insertText: 'get_global' },
        { label: 'set_global', documentation: 'set the current value of a global variable', kind: keyword, insertText: 'set_global' },
        { label: 'nop', documentation: 'no operation, no effect', kind: keyword, insertText: 'nop' },
        { label: 'block', documentation: 'the beginning of a block construct, a sequence of instructions with a label at the end', kind: keyword, insertText: 'block' },
        { label: 'loop', documentation: 'a block with a label at the beginning which may be used to form loops', kind: keyword, insertText: 'loop' },
        { label: 'if', documentation: 'the beginning of an if construct with an implicit *then* block', kind: keyword, insertText: 'if' },
        { label: 'else', documentation: 'marks the else block of an if', kind: keyword, insertText: 'else' },
        { label: 'br', documentation: 'branch to a given label in an enclosing construct', kind: keyword, insertText: 'br' },
        { label: 'br_if', documentation: 'conditionally branch to a given label in an enclosing construct', kind: keyword, insertText: 'br_if' },
        { label: 'br_table', documentation: 'a jump table which jumps to a label in an enclosing construct', kind: keyword, insertText: 'br_table' },
        { label: 'return', documentation: 'return zero or more values from this function', kind: keyword, insertText: 'return' },
        { label: 'end', documentation: 'an instruction that marks the end of a block, loop, if, or function', kind: keyword, insertText: 'end' },
        { label: 'call', documentation: 'call function directly', kind: keyword, insertText: 'call' },
        { label: 'call_indirect', documentation: 'call function indirectly', kind: keyword, insertText: 'call_indirect' },
        { label: 'i64.const', documentation: 'produce the value of an i64 immediate', kind: keyword, insertText: { value: 'i64.const ${1:constant}' } },
        { label: 'i32.const', documentation: 'produce the value of an i32 immediate', kind: keyword, insertText: { value: 'i32.const ${1:constant}' } },
        { label: 'f32.const', documentation: 'produce the value of an f32 immediate', kind: keyword, insertText: { value: 'f32.const ${1:constant}' } },
        { label: 'f64.const', documentation: 'produce the value of an f64 immediate', kind: keyword, insertText: { value: 'f64.const ${1:constant}' } },
        { label: 'i32.add', documentation: 'sign-agnostic addition', kind: keyword, insertText: 'i32.add' },
        { label: 'i32.sub', documentation: 'sign-agnostic subtraction', kind: keyword, insertText: 'i32.sub' },
        { label: 'i32.mul', documentation: 'sign-agnostic multiplication (lower 32-bits)', kind: keyword, insertText: 'i32.mul' },
        { label: 'i32.div_s', documentation: 'signed division (result is truncated toward zero)', kind: keyword, insertText: 'i32.div_s' },
        { label: 'i32.div_u', documentation: 'unsigned division (result is [floored](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions))', kind: keyword, insertText: 'i32.div_u' },
        { label: 'i32.rem_s', documentation: 'signed remainder (result has the sign of the dividend)', kind: keyword, insertText: 'i32.rem_s' },
        { label: 'i32.rem_u', documentation: 'unsigned remainder', kind: keyword, insertText: 'i32.rem_u' },
        { label: 'i32.and', documentation: 'sign-agnostic bitwise and', kind: keyword, insertText: 'i32.and' },
        { label: 'i32.or', documentation: 'sign-agnostic bitwise inclusive or', kind: keyword, insertText: 'i32.or' },
        { label: 'i32.xor', documentation: 'sign-agnostic bitwise exclusive or', kind: keyword, insertText: 'i32.xor' },
        { label: 'i32.shl', documentation: 'sign-agnostic shift left', kind: keyword, insertText: 'i32.shl' },
        { label: 'i32.shr_u', documentation: 'zero-replicating (logical) shift right', kind: keyword, insertText: 'i32.shr_u' },
        { label: 'i32.shr_s', documentation: 'sign-replicating (arithmetic) shift right', kind: keyword, insertText: 'i32.shr_s' },
        { label: 'i32.rotl', documentation: 'sign-agnostic rotate left', kind: keyword, insertText: 'i32.rotl' },
        { label: 'i32.rotr', documentation: 'sign-agnostic rotate right', kind: keyword, insertText: 'i32.rotr' },
        { label: 'i32.eq', documentation: 'sign-agnostic compare equal', kind: keyword, insertText: 'i32.eq' },
        { label: 'i32.ne', documentation: 'sign-agnostic compare unequal', kind: keyword, insertText: 'i32.ne' },
        { label: 'i32.lt_s', documentation: 'signed less than', kind: keyword, insertText: 'i32.lt_s' },
        { label: 'i32.le_s', documentation: 'signed less than or equal', kind: keyword, insertText: 'i32.le_s' },
        { label: 'i32.lt_u', documentation: 'unsigned less than', kind: keyword, insertText: 'i32.lt_u' },
        { label: 'i32.le_u', documentation: 'unsigned less than or equal', kind: keyword, insertText: 'i32.le_u' },
        { label: 'i32.gt_s', documentation: 'signed greater than', kind: keyword, insertText: 'i32.gt_s' },
        { label: 'i32.ge_s', documentation: 'signed greater than or equal', kind: keyword, insertText: 'i32.ge_s' },
        { label: 'i32.gt_u', documentation: 'unsigned greater than', kind: keyword, insertText: 'i32.gt_u' },
        { label: 'i32.ge_u', documentation: 'unsigned greater than or equal', kind: keyword, insertText: 'i32.ge_u' },
        { label: 'i32.clz', documentation: 'sign-agnostic count leading zero bits (All zero bits are considered leading if the value is zero)', kind: keyword, insertText: 'i32.clz' },
        { label: 'i32.ctz', documentation: 'sign-agnostic count trailing zero bits (All zero bits are considered trailing if the value is zero)', kind: keyword, insertText: 'i32.ctz' },
        { label: 'i32.popcnt', documentation: 'sign-agnostic count number of one bits', kind: keyword, insertText: 'i32.popcnt' },
        { label: 'i32.eqz', documentation: 'compare equal to zero (return 1 if operand is zero, 0 otherwise)', kind: keyword, insertText: 'i32.eqz' },
        { label: 'f32.add', documentation: 'addition', kind: keyword, insertText: 'f32.add' },
        { label: 'f32.sub', documentation: 'subtraction', kind: keyword, insertText: 'f32.sub' },
        { label: 'f32.mul', documentation: 'multiplication', kind: keyword, insertText: 'f32.mul' },
        { label: 'f32.div', documentation: 'division', kind: keyword, insertText: 'f32.div' },
        { label: 'f32.abs', documentation: 'absolute value', kind: keyword, insertText: 'f32.abs' },
        { label: 'f32.neg', documentation: 'negation', kind: keyword, insertText: 'f32.neg' },
        { label: 'f32.copysign', documentation: 'copysign', kind: keyword, insertText: 'f32.copysign' },
        { label: 'f32.ceil', documentation: 'ceiling operator', kind: keyword, insertText: 'f32.ceil' },
        { label: 'f32.floor', documentation: 'floor operator', kind: keyword, insertText: 'f32.floor' },
        { label: 'f32.trunc', documentation: 'round to nearest integer towards zero', kind: keyword, insertText: 'f32.trunc' },
        { label: 'f32.nearest', documentation: 'round to nearest integer, ties to even', kind: keyword, insertText: 'f32.nearest' },
        { label: 'f32.eq', documentation: 'compare ordered and equal', kind: keyword, insertText: 'f32.eq' },
        { label: 'f32.ne', documentation: 'compare unordered or unequal', kind: keyword, insertText: 'f32.ne' },
        { label: 'f32.lt', documentation: 'compare ordered and less than', kind: keyword, insertText: 'f32.lt' },
        { label: 'f32.le', documentation: 'compare ordered and less than or equal', kind: keyword, insertText: 'f32.le' },
        { label: 'f32.gt', documentation: 'compare ordered and greater than', kind: keyword, insertText: 'f32.gt' },
        { label: 'f32.ge', documentation: 'compare ordered and greater than or equal', kind: keyword, insertText: 'f32.ge' },
        { label: 'f32.sqrt', documentation: 'square root', kind: keyword, insertText: 'f32.sqrt' },
        { label: 'f32.min', documentation: 'minimum (binary operator); if either operand is NaN, returns NaN', kind: keyword, insertText: 'f32.min' },
        { label: 'f32.max', documentation: 'maximum (binary operator); if either operand is NaN, returns NaN', kind: keyword, insertText: 'f32.max' },
        { label: 'f64.add', documentation: 'addition', kind: keyword, insertText: 'f64.add' },
        { label: 'f64.sub', documentation: 'subtraction', kind: keyword, insertText: 'f64.sub' },
        { label: 'f64.mul', documentation: 'multiplication', kind: keyword, insertText: 'f64.mul' },
        { label: 'f64.div', documentation: 'division', kind: keyword, insertText: 'f64.div' },
        { label: 'f64.abs', documentation: 'absolute value', kind: keyword, insertText: 'f64.abs' },
        { label: 'f64.neg', documentation: 'negation', kind: keyword, insertText: 'f64.neg' },
        { label: 'f64.copysign', documentation: 'copysign', kind: keyword, insertText: 'f64.copysign' },
        { label: 'f64.ceil', documentation: 'ceiling operator', kind: keyword, insertText: 'f64.ceil' },
        { label: 'f64.floor', documentation: 'floor operator', kind: keyword, insertText: 'f64.floor' },
        { label: 'f64.trunc', documentation: 'round to nearest integer towards zero', kind: keyword, insertText: 'f64.trunc' },
        { label: 'f64.nearest', documentation: 'round to nearest integer, ties to even', kind: keyword, insertText: 'f64.nearest' },
        { label: 'f64.eq', documentation: 'compare ordered and equal', kind: keyword, insertText: 'f64.eq' },
        { label: 'f64.ne', documentation: 'compare unordered or unequal', kind: keyword, insertText: 'f64.ne' },
        { label: 'f64.lt', documentation: 'compare ordered and less than', kind: keyword, insertText: 'f64.lt' },
        { label: 'f64.le', documentation: 'compare ordered and less than or equal', kind: keyword, insertText: 'f64.le' },
        { label: 'f64.gt', documentation: 'compare ordered and greater than', kind: keyword, insertText: 'f64.gt' },
        { label: 'f64.ge', documentation: 'compare ordered and greater than or equal', kind: keyword, insertText: 'f64.ge' },
        { label: 'f64.sqrt', documentation: 'square root', kind: keyword, insertText: 'f64.sqrt' },
        { label: 'f64.min', documentation: 'minimum (binary operator); if either operand is NaN, returns NaN', kind: keyword, insertText: 'f64.min' },
        { label: 'f64.max', documentation: 'maximum (binary operator); if either operand is NaN, returns NaN', kind: keyword, insertText: 'f64.max' },
        { label: 'i32.wrap/i64', documentation: 'wrap a 64-bit integer to a 32-bit integer', kind: keyword, insertText: 'i32.wrap/i64' },
        { label: 'i32.trunc_s/f32', documentation: 'truncate a 32-bit float to a signed 32-bit integer', kind: keyword, insertText: 'i32.trunc_s/f32' },
        { label: 'i32.trunc_s/f64', documentation: 'truncate a 64-bit float to a signed 32-bit integer', kind: keyword, insertText: 'i32.trunc_s/f64' },
        { label: 'i32.trunc_u/f32', documentation: 'truncate a 32-bit float to an unsigned 32-bit integer', kind: keyword, insertText: 'i32.trunc_u/f32' },
        { label: 'i32.trunc_u/f64', documentation: 'truncate a 64-bit float to an unsigned 32-bit integer', kind: keyword, insertText: 'i32.trunc_u/f64' },
        { label: 'i32.reinterpret/f32', documentation: 'reinterpret the bits of a 32-bit float as a 32-bit integer', kind: keyword, insertText: 'i32.reinterpret/f32' },
        { label: 'i64.extend_s/i32', documentation: 'extend a signed 32-bit integer to a 64-bit integer', kind: keyword, insertText: 'i64.extend_s/i32' },
        { label: 'i64.extend_u/i32', documentation: 'extend an unsigned 32-bit integer to a 64-bit integer', kind: keyword, insertText: 'i64.extend_u/i32' },
        { label: 'i64.trunc_s/f32', documentation: 'truncate a 32-bit float to a signed 64-bit integer', kind: keyword, insertText: 'i64.trunc_s/f32' },
        { label: 'i64.trunc_s/f64', documentation: 'truncate a 64-bit float to a signed 64-bit integer', kind: keyword, insertText: 'i64.trunc_s/f64' },
        { label: 'i64.trunc_u/f32', documentation: 'truncate a 32-bit float to an unsigned 64-bit integer', kind: keyword, insertText: 'i64.trunc_u/f32' },
        { label: 'i64.trunc_u/f64', documentation: 'truncate a 64-bit float to an unsigned 64-bit integer', kind: keyword, insertText: 'i64.trunc_u/f64' },
        { label: 'i64.reinterpret/f64', documentation: 'reinterpret the bits of a 64-bit float as a 64-bit integer', kind: keyword, insertText: 'i64.reinterpret/f64' },
        { label: 'f32.demote/f64', documentation: 'demote a 64-bit float to a 32-bit float', kind: keyword, insertText: 'f32.demote/f64' },
        { label: 'f32.convert_s/i32', documentation: 'convert a signed 32-bit integer to a 32-bit float', kind: keyword, insertText: 'f32.convert_s/i32' },
        { label: 'f32.convert_s/i64', documentation: 'convert a signed 64-bit integer to a 32-bit float', kind: keyword, insertText: 'f32.convert_s/i64' },
        { label: 'f32.convert_u/i32', documentation: 'convert an unsigned 32-bit integer to a 32-bit float', kind: keyword, insertText: 'f32.convert_u/i32' },
        { label: 'f32.convert_u/i64', documentation: 'convert an unsigned 64-bit integer to a 32-bit float', kind: keyword, insertText: 'f32.convert_u/i64' },
        { label: 'f32.reinterpret/i32', documentation: 'reinterpret the bits of a 32-bit integer as a 32-bit float', kind: keyword, insertText: 'f32.reinterpret/i32' },
        { label: 'f64.promote/f32', documentation: 'promote a 32-bit float to a 64-bit float', kind: keyword, insertText: 'f64.promote/f32' },
        { label: 'f64.convert_s/i32', documentation: 'convert a signed 32-bit integer to a 64-bit float', kind: keyword, insertText: 'f64.convert_s/i32' },
        { label: 'f64.convert_s/i64', documentation: 'convert a signed 64-bit integer to a 64-bit float', kind: keyword, insertText: 'f64.convert_s/i64' },
        { label: 'f64.convert_u/i32', documentation: 'convert an unsigned 32-bit integer to a 64-bit float', kind: keyword, insertText: 'f64.convert_u/i32' },
        { label: 'f64.convert_u/i64', documentation: 'convert an unsigned 64-bit integer to a 64-bit float', kind: keyword, insertText: 'f64.convert_u/i64' },
        { label: 'f64.reinterpret/i64', documentation: 'reinterpret the bits of a 64-bit integer as a 64-bit float', kind: keyword, insertText: 'f64.reinterpret/i64' }
    ];
}
const LanguageConfiguration = {
    // the default separators except `@$`
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
    comments: {
        lineComment: '//',
        blockComment: ['/*', '*/'],
    },
    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
    ],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: '\'', close: '\'' },
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: '\'', close: '\'' },
        { open: '<', close: '>' },
    ]
};
const MonarchDefinitions = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    // defaultToken: 'invalid',
    keywords: [
        'module',
        'table',
        'memory',
        'export',
        'import',
        'func',
        'result',
        'offset',
        'anyfunc',
        'i32.load8_s',
        'i32.load8_u',
        'i32.load16_s',
        'i32.load16_u',
        'i32.load',
        'i64.load8_s',
        'i64.load8_u',
        'i64.load16_s',
        'i64.load16_u',
        'i64.load32_s',
        'i64.load32_u',
        'i64.load',
        'f32.load',
        'f64.load',
        'i32.store8',
        'i32.store16',
        'i32.store',
        'i64.store8',
        'i64.store16',
        'i64.store32',
        'i64.store',
        'f32.store',
        'f64.store',
        'i32.const',
        'i64.const',
        'f32.const',
        'f64.const',
        'i32.add',
        'i32.sub',
        'i32.mul',
        'i32.div_s',
        'i32.div_u',
        'i32.rem_s',
        'i32.rem_u',
        'i32.and',
        'i32.or',
        'i32.xor',
        'i32.shl',
        'i32.shr_u',
        'i32.shr_s',
        'i32.rotl',
        'i32.rotr',
        'i32.eq',
        'i32.ne',
        'i32.lt_s',
        'i32.le_s',
        'i32.lt_u',
        'i32.le_u',
        'i32.gt_s',
        'i32.ge_s',
        'i32.gt_u',
        'i32.ge_u',
        'i32.clz',
        'i32.ctz',
        'i32.popcnt',
        'i32.eqz',
        'f32.add',
        'f32.sub',
        'f32.mul',
        'f32.div',
        'f32.abs',
        'f32.neg',
        'f32.copysign',
        'f32.ceil',
        'f32.floor',
        'f32.trunc',
        'f32.nearest',
        'f32.eq',
        'f32.ne',
        'f32.lt',
        'f32.le',
        'f32.gt',
        'f32.ge',
        'f32.sqrt',
        'f32.min',
        'f32.max',
        'f64.add',
        'f64.sub',
        'f64.mul',
        'f64.div',
        'f64.abs',
        'f64.neg',
        'f64.copysign',
        'f64.ceil',
        'f64.floor',
        'f64.trunc',
        'f64.nearest',
        'f64.eq',
        'f64.ne',
        'f64.lt',
        'f64.le',
        'f64.gt',
        'f64.ge',
        'f64.sqrt',
        'f64.min',
        'f64.max',
        'i32.wrap/i64',
        'i32.trunc_s/f32',
        'i32.trunc_s/f64',
        'i32.trunc_u/f32',
        'i32.trunc_u/f64',
        'i32.reinterpret/f32',
        'i64.extend_s/i32',
        'i64.extend_u/i32',
        'i64.trunc_s/f32',
        'i64.trunc_s/f64',
        'i64.trunc_u/f32',
        'i64.trunc_u/f64',
        'i64.reinterpret/f64',
        'f32.demote/f64',
        'f32.convert_s/i32',
        'f32.convert_s/i64',
        'f32.convert_u/i32',
        'f32.convert_u/i64',
        'f32.reinterpret/i32',
        'f64.promote/f32',
        'f64.convert_s/i32',
        'f64.convert_s/i64',
        'f64.convert_u/i32',
        'f64.convert_u/i64',
        'f64.reinterpret/i64',
        'get_local',
        'set_local',
        'tee_local'
    ],
    typeKeywords: [
        'i32', 'i64', 'f32', 'f64'
    ],
    operators: [],
    brackets: [
        ['(', ')', 'bracket.parenthesis'],
        ['{', '}', 'bracket.curly'],
        ['[', ']', 'bracket.square']
    ],
    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    // C# style strings
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    // The main tokenizer for our languages
    tokenizer: {
        root: [
            // identifiers and keywords
            [/[a-z_$][\w$\.]*/, {
                    cases: {
                        '@keywords': 'keyword',
                        '@typeKeywords': 'type',
                        '@default': 'type.identifier'
                    }
                }],
            // [/[A-Z][\w\$]*/, 'type.identifier' ],  // to show class names nicely
            // // whitespace
            // { include: '@whitespace' },
            // // delimiters and operators
            // [/[{}()\[\]]/, '@brackets'],
            // [/[<>](?!@symbols)/, '@brackets'],
            // [/@symbols/, { cases: { '@operators': 'operator',
            //                         '@default'  : '' } } ],
            // // @ annotations.
            // // As an example, we emit a debugging log message on these tokens.
            // // Note: message are supressed during the first load -- change some lines to see them.
            // [/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation', log: 'annotation token: $0' }],
            // // numbers
            // [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            // [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],
            // // delimiter: after number because of .\d floats
            // [/[;,.]/, 'delimiter'],
            // strings
            // [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
            [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
            // // characters
            // [/'[^\\']'/, 'string'],
            // [/(')(@escapes)(')/, ['string','string.escape','string']],
            // [/'/, 'string.invalid']
            [/[{}()\[\]]/, '@brackets']
        ],
        comment: [
            [/[^\/*]+/, 'comment'],
            [/\/\*/, 'comment', '@push'],
            ["\\*/", 'comment', '@pop'],
            [/[\/*]/, 'comment']
        ],
        string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],
        whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
        ],
    },
};
exports.Wast = {
    MonarchDefinitions,
    LanguageConfiguration,
    CompletionItemProvider: {
        provideCompletionItems: function (model, position) {
            return getCompletionItems();
        }
    },
    HoverProvider: {
        provideHover: function (model, position) {
            return {
                range: new monaco.Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())),
                contents: [
                    '**DETAILS**',
                    { language: 'html', value: "TODO" }
                ]
            };
        }
    }
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(5);
exports.Log = {
    MonarchTokensProvider: {
        tokenizer: {
            root: [
                [/\[error.*/, "custom-error"],
                [/\[notice.*/, "custom-notice"],
                [/\[info.*/, "custom-info"]
            ]
        }
    }
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*global define:false */
/**
 * Copyright 2012-2017 Craig Campbell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Mousetrap is a simple keyboard shortcut library for Javascript with
 * no external dependencies
 *
 * @version 1.6.1
 * @url craig.is/killing/mice
 */
(function(window, document, undefined) {

    // Check if mousetrap is used inside browser, if not, return
    if (!window) {
        return;
    }

    /**
     * mapping of special keycodes to their corresponding keys
     *
     * everything in this dictionary cannot use keypress events
     * so it has to be here to map to the correct keycodes for
     * keyup/keydown events
     *
     * @type {Object}
     */
    var _MAP = {
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        20: 'capslock',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'ins',
        46: 'del',
        91: 'meta',
        93: 'meta',
        224: 'meta'
    };

    /**
     * mapping for special characters so they can support
     *
     * this dictionary is only used incase you want to bind a
     * keyup or keydown event to one of these keys
     *
     * @type {Object}
     */
    var _KEYCODE_MAP = {
        106: '*',
        107: '+',
        109: '-',
        110: '.',
        111 : '/',
        186: ';',
        187: '=',
        188: ',',
        189: '-',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        220: '\\',
        221: ']',
        222: '\''
    };

    /**
     * this is a mapping of keys that require shift on a US keypad
     * back to the non shift equivelents
     *
     * this is so you can use keyup events with these keys
     *
     * note that this will only work reliably on US keyboards
     *
     * @type {Object}
     */
    var _SHIFT_MAP = {
        '~': '`',
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0',
        '_': '-',
        '+': '=',
        ':': ';',
        '\"': '\'',
        '<': ',',
        '>': '.',
        '?': '/',
        '|': '\\'
    };

    /**
     * this is a list of special strings you can use to map
     * to modifier keys when you specify your keyboard shortcuts
     *
     * @type {Object}
     */
    var _SPECIAL_ALIASES = {
        'option': 'alt',
        'command': 'meta',
        'return': 'enter',
        'escape': 'esc',
        'plus': '+',
        'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
    };

    /**
     * variable to store the flipped version of _MAP from above
     * needed to check if we should use keypress or not when no action
     * is specified
     *
     * @type {Object|undefined}
     */
    var _REVERSE_MAP;

    /**
     * loop through the f keys, f1 to f19 and add them to the map
     * programatically
     */
    for (var i = 1; i < 20; ++i) {
        _MAP[111 + i] = 'f' + i;
    }

    /**
     * loop through to map numbers on the numeric keypad
     */
    for (i = 0; i <= 9; ++i) {

        // This needs to use a string cause otherwise since 0 is falsey
        // mousetrap will never fire for numpad 0 pressed as part of a keydown
        // event.
        //
        // @see https://github.com/ccampbell/mousetrap/pull/258
        _MAP[i + 96] = i.toString();
    }

    /**
     * cross browser add event method
     *
     * @param {Element|HTMLDocument} object
     * @param {string} type
     * @param {Function} callback
     * @returns void
     */
    function _addEvent(object, type, callback) {
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
            return;
        }

        object.attachEvent('on' + type, callback);
    }

    /**
     * takes the event and returns the key character
     *
     * @param {Event} e
     * @return {string}
     */
    function _characterFromEvent(e) {

        // for keypress events we should return the character as is
        if (e.type == 'keypress') {
            var character = String.fromCharCode(e.which);

            // if the shift key is not pressed then it is safe to assume
            // that we want the character to be lowercase.  this means if
            // you accidentally have caps lock on then your key bindings
            // will continue to work
            //
            // the only side effect that might not be desired is if you
            // bind something like 'A' cause you want to trigger an
            // event when capital A is pressed caps lock will no longer
            // trigger the event.  shift+a will though.
            if (!e.shiftKey) {
                character = character.toLowerCase();
            }

            return character;
        }

        // for non keypress events the special maps are needed
        if (_MAP[e.which]) {
            return _MAP[e.which];
        }

        if (_KEYCODE_MAP[e.which]) {
            return _KEYCODE_MAP[e.which];
        }

        // if it is not in the special map

        // with keydown and keyup events the character seems to always
        // come in as an uppercase character whether you are pressing shift
        // or not.  we should make sure it is always lowercase for comparisons
        return String.fromCharCode(e.which).toLowerCase();
    }

    /**
     * checks if two arrays are equal
     *
     * @param {Array} modifiers1
     * @param {Array} modifiers2
     * @returns {boolean}
     */
    function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
    }

    /**
     * takes a key event and figures out what the modifiers are
     *
     * @param {Event} e
     * @returns {Array}
     */
    function _eventModifiers(e) {
        var modifiers = [];

        if (e.shiftKey) {
            modifiers.push('shift');
        }

        if (e.altKey) {
            modifiers.push('alt');
        }

        if (e.ctrlKey) {
            modifiers.push('ctrl');
        }

        if (e.metaKey) {
            modifiers.push('meta');
        }

        return modifiers;
    }

    /**
     * prevents default for this event
     *
     * @param {Event} e
     * @returns void
     */
    function _preventDefault(e) {
        if (e.preventDefault) {
            e.preventDefault();
            return;
        }

        e.returnValue = false;
    }

    /**
     * stops propogation for this event
     *
     * @param {Event} e
     * @returns void
     */
    function _stopPropagation(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
            return;
        }

        e.cancelBubble = true;
    }

    /**
     * determines if the keycode specified is a modifier key or not
     *
     * @param {string} key
     * @returns {boolean}
     */
    function _isModifier(key) {
        return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
    }

    /**
     * reverses the map lookup so that we can look for specific keys
     * to see what can and can't use keypress
     *
     * @return {Object}
     */
    function _getReverseMap() {
        if (!_REVERSE_MAP) {
            _REVERSE_MAP = {};
            for (var key in _MAP) {

                // pull out the numeric keypad from here cause keypress should
                // be able to detect the keys from the character
                if (key > 95 && key < 112) {
                    continue;
                }

                if (_MAP.hasOwnProperty(key)) {
                    _REVERSE_MAP[_MAP[key]] = key;
                }
            }
        }
        return _REVERSE_MAP;
    }

    /**
     * picks the best action based on the key combination
     *
     * @param {string} key - character for key
     * @param {Array} modifiers
     * @param {string=} action passed in
     */
    function _pickBestAction(key, modifiers, action) {

        // if no action was picked in we should try to pick the one
        // that we think would work best for this key
        if (!action) {
            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
        }

        // modifier keys don't work as expected with keypress,
        // switch to keydown
        if (action == 'keypress' && modifiers.length) {
            action = 'keydown';
        }

        return action;
    }

    /**
     * Converts from a string key combination to an array
     *
     * @param  {string} combination like "command+shift+l"
     * @return {Array}
     */
    function _keysFromString(combination) {
        if (combination === '+') {
            return ['+'];
        }

        combination = combination.replace(/\+{2}/g, '+plus');
        return combination.split('+');
    }

    /**
     * Gets info for a specific key combination
     *
     * @param  {string} combination key combination ("command+s" or "a" or "*")
     * @param  {string=} action
     * @returns {Object}
     */
    function _getKeyInfo(combination, action) {
        var keys;
        var key;
        var i;
        var modifiers = [];

        // take the keys from this pattern and figure out what the actual
        // pattern is all about
        keys = _keysFromString(combination);

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            // normalize key names
            if (_SPECIAL_ALIASES[key]) {
                key = _SPECIAL_ALIASES[key];
            }

            // if this is not a keypress event then we should
            // be smart about using shift keys
            // this will only work for US keyboards however
            if (action && action != 'keypress' && _SHIFT_MAP[key]) {
                key = _SHIFT_MAP[key];
                modifiers.push('shift');
            }

            // if this key is a modifier then add it to the list of modifiers
            if (_isModifier(key)) {
                modifiers.push(key);
            }
        }

        // depending on what the key combination is
        // we will try to pick the best event for it
        action = _pickBestAction(key, modifiers, action);

        return {
            key: key,
            modifiers: modifiers,
            action: action
        };
    }

    function _belongsTo(element, ancestor) {
        if (element === null || element === document) {
            return false;
        }

        if (element === ancestor) {
            return true;
        }

        return _belongsTo(element.parentNode, ancestor);
    }

    function Mousetrap(targetElement) {
        var self = this;

        targetElement = targetElement || document;

        if (!(self instanceof Mousetrap)) {
            return new Mousetrap(targetElement);
        }

        /**
         * element to attach key events to
         *
         * @type {Element}
         */
        self.target = targetElement;

        /**
         * a list of all the callbacks setup via Mousetrap.bind()
         *
         * @type {Object}
         */
        self._callbacks = {};

        /**
         * direct map of string combinations to callbacks used for trigger()
         *
         * @type {Object}
         */
        self._directMap = {};

        /**
         * keeps track of what level each sequence is at since multiple
         * sequences can start out with the same sequence
         *
         * @type {Object}
         */
        var _sequenceLevels = {};

        /**
         * variable to store the setTimeout call
         *
         * @type {null|number}
         */
        var _resetTimer;

        /**
         * temporary state where we will ignore the next keyup
         *
         * @type {boolean|string}
         */
        var _ignoreNextKeyup = false;

        /**
         * temporary state where we will ignore the next keypress
         *
         * @type {boolean}
         */
        var _ignoreNextKeypress = false;

        /**
         * are we currently inside of a sequence?
         * type of action ("keyup" or "keydown" or "keypress") or false
         *
         * @type {boolean|string}
         */
        var _nextExpectedAction = false;

        /**
         * resets all sequence counters except for the ones passed in
         *
         * @param {Object} doNotReset
         * @returns void
         */
        function _resetSequences(doNotReset) {
            doNotReset = doNotReset || {};

            var activeSequences = false,
                key;

            for (key in _sequenceLevels) {
                if (doNotReset[key]) {
                    activeSequences = true;
                    continue;
                }
                _sequenceLevels[key] = 0;
            }

            if (!activeSequences) {
                _nextExpectedAction = false;
            }
        }

        /**
         * finds all callbacks that match based on the keycode, modifiers,
         * and action
         *
         * @param {string} character
         * @param {Array} modifiers
         * @param {Event|Object} e
         * @param {string=} sequenceName - name of the sequence we are looking for
         * @param {string=} combination
         * @param {number=} level
         * @returns {Array}
         */
        function _getMatches(character, modifiers, e, sequenceName, combination, level) {
            var i;
            var callback;
            var matches = [];
            var action = e.type;

            // if there are no events related to this keycode
            if (!self._callbacks[character]) {
                return [];
            }

            // if a modifier key is coming up on its own we should allow it
            if (action == 'keyup' && _isModifier(character)) {
                modifiers = [character];
            }

            // loop through all callbacks for the key that was pressed
            // and see if any of them match
            for (i = 0; i < self._callbacks[character].length; ++i) {
                callback = self._callbacks[character][i];

                // if a sequence name is not specified, but this is a sequence at
                // the wrong level then move onto the next match
                if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
                    continue;
                }

                // if the action we are looking for doesn't match the action we got
                // then we should keep going
                if (action != callback.action) {
                    continue;
                }

                // if this is a keypress event and the meta key and control key
                // are not pressed that means that we need to only look at the
                // character, otherwise check the modifiers as well
                //
                // chrome will not fire a keypress if meta or control is down
                // safari will fire a keypress if meta or meta+shift is down
                // firefox will fire a keypress if meta or control is down
                if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {

                    // when you bind a combination or sequence a second time it
                    // should overwrite the first one.  if a sequenceName or
                    // combination is specified in this call it does just that
                    //
                    // @todo make deleting its own method?
                    var deleteCombo = !sequenceName && callback.combo == combination;
                    var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
                    if (deleteCombo || deleteSequence) {
                        self._callbacks[character].splice(i, 1);
                    }

                    matches.push(callback);
                }
            }

            return matches;
        }

        /**
         * actually calls the callback function
         *
         * if your callback function returns false this will use the jquery
         * convention - prevent default and stop propogation on the event
         *
         * @param {Function} callback
         * @param {Event} e
         * @returns void
         */
        function _fireCallback(callback, e, combo, sequence) {

            // if this event should not happen stop here
            if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
                return;
            }

            if (callback(e, combo) === false) {
                _preventDefault(e);
                _stopPropagation(e);
            }
        }

        /**
         * handles a character key event
         *
         * @param {string} character
         * @param {Array} modifiers
         * @param {Event} e
         * @returns void
         */
        self._handleKey = function(character, modifiers, e) {
            var callbacks = _getMatches(character, modifiers, e);
            var i;
            var doNotReset = {};
            var maxLevel = 0;
            var processedSequenceCallback = false;

            // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
            for (i = 0; i < callbacks.length; ++i) {
                if (callbacks[i].seq) {
                    maxLevel = Math.max(maxLevel, callbacks[i].level);
                }
            }

            // loop through matching callbacks for this key event
            for (i = 0; i < callbacks.length; ++i) {

                // fire for all sequence callbacks
                // this is because if for example you have multiple sequences
                // bound such as "g i" and "g t" they both need to fire the
                // callback for matching g cause otherwise you can only ever
                // match the first one
                if (callbacks[i].seq) {

                    // only fire callbacks for the maxLevel to prevent
                    // subsequences from also firing
                    //
                    // for example 'a option b' should not cause 'option b' to fire
                    // even though 'option b' is part of the other sequence
                    //
                    // any sequences that do not match here will be discarded
                    // below by the _resetSequences call
                    if (callbacks[i].level != maxLevel) {
                        continue;
                    }

                    processedSequenceCallback = true;

                    // keep a list of which sequences were matches for later
                    doNotReset[callbacks[i].seq] = 1;
                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
                    continue;
                }

                // if there were no sequence matches but we are still here
                // that means this is a regular match so we should fire that
                if (!processedSequenceCallback) {
                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
                }
            }

            // if the key you pressed matches the type of sequence without
            // being a modifier (ie "keyup" or "keypress") then we should
            // reset all sequences that were not matched by this event
            //
            // this is so, for example, if you have the sequence "h a t" and you
            // type "h e a r t" it does not match.  in this case the "e" will
            // cause the sequence to reset
            //
            // modifier keys are ignored because you can have a sequence
            // that contains modifiers such as "enter ctrl+space" and in most
            // cases the modifier key will be pressed before the next key
            //
            // also if you have a sequence such as "ctrl+b a" then pressing the
            // "b" key will trigger a "keypress" and a "keydown"
            //
            // the "keydown" is expected when there is a modifier, but the
            // "keypress" ends up matching the _nextExpectedAction since it occurs
            // after and that causes the sequence to reset
            //
            // we ignore keypresses in a sequence that directly follow a keydown
            // for the same character
            var ignoreThisKeypress = e.type == 'keypress' && _ignoreNextKeypress;
            if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
                _resetSequences(doNotReset);
            }

            _ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown';
        };

        /**
         * handles a keydown event
         *
         * @param {Event} e
         * @returns void
         */
        function _handleKeyEvent(e) {

            // normalize e.which for key events
            // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
            if (typeof e.which !== 'number') {
                e.which = e.keyCode;
            }

            var character = _characterFromEvent(e);

            // no character found then stop
            if (!character) {
                return;
            }

            // need to use === for the character check because the character can be 0
            if (e.type == 'keyup' && _ignoreNextKeyup === character) {
                _ignoreNextKeyup = false;
                return;
            }

            self.handleKey(character, _eventModifiers(e), e);
        }

        /**
         * called to set a 1 second timeout on the specified sequence
         *
         * this is so after each key press in the sequence you have 1 second
         * to press the next key before you have to start over
         *
         * @returns void
         */
        function _resetSequenceTimer() {
            clearTimeout(_resetTimer);
            _resetTimer = setTimeout(_resetSequences, 1000);
        }

        /**
         * binds a key sequence to an event
         *
         * @param {string} combo - combo specified in bind call
         * @param {Array} keys
         * @param {Function} callback
         * @param {string=} action
         * @returns void
         */
        function _bindSequence(combo, keys, callback, action) {

            // start off by adding a sequence level record for this combination
            // and setting the level to 0
            _sequenceLevels[combo] = 0;

            /**
             * callback to increase the sequence level for this sequence and reset
             * all other sequences that were active
             *
             * @param {string} nextAction
             * @returns {Function}
             */
            function _increaseSequence(nextAction) {
                return function() {
                    _nextExpectedAction = nextAction;
                    ++_sequenceLevels[combo];
                    _resetSequenceTimer();
                };
            }

            /**
             * wraps the specified callback inside of another function in order
             * to reset all sequence counters as soon as this sequence is done
             *
             * @param {Event} e
             * @returns void
             */
            function _callbackAndReset(e) {
                _fireCallback(callback, e, combo);

                // we should ignore the next key up if the action is key down
                // or keypress.  this is so if you finish a sequence and
                // release the key the final key will not trigger a keyup
                if (action !== 'keyup') {
                    _ignoreNextKeyup = _characterFromEvent(e);
                }

                // weird race condition if a sequence ends with the key
                // another sequence begins with
                setTimeout(_resetSequences, 10);
            }

            // loop through keys one at a time and bind the appropriate callback
            // function.  for any key leading up to the final one it should
            // increase the sequence. after the final, it should reset all sequences
            //
            // if an action is specified in the original bind call then that will
            // be used throughout.  otherwise we will pass the action that the
            // next key in the sequence should match.  this allows a sequence
            // to mix and match keypress and keydown events depending on which
            // ones are better suited to the key provided
            for (var i = 0; i < keys.length; ++i) {
                var isFinal = i + 1 === keys.length;
                var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
                _bindSingle(keys[i], wrappedCallback, action, combo, i);
            }
        }

        /**
         * binds a single keyboard combination
         *
         * @param {string} combination
         * @param {Function} callback
         * @param {string=} action
         * @param {string=} sequenceName - name of sequence if part of sequence
         * @param {number=} level - what part of the sequence the command is
         * @returns void
         */
        function _bindSingle(combination, callback, action, sequenceName, level) {

            // store a direct mapped reference for use with Mousetrap.trigger
            self._directMap[combination + ':' + action] = callback;

            // make sure multiple spaces in a row become a single space
            combination = combination.replace(/\s+/g, ' ');

            var sequence = combination.split(' ');
            var info;

            // if this pattern is a sequence of keys then run through this method
            // to reprocess each pattern one key at a time
            if (sequence.length > 1) {
                _bindSequence(combination, sequence, callback, action);
                return;
            }

            info = _getKeyInfo(combination, action);

            // make sure to initialize array if this is the first time
            // a callback is added for this key
            self._callbacks[info.key] = self._callbacks[info.key] || [];

            // remove an existing match if there is one
            _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);

            // add this call back to the array
            // if it is a sequence put it at the beginning
            // if not put it at the end
            //
            // this is important because the way these are processed expects
            // the sequence ones to come first
            self._callbacks[info.key][sequenceName ? 'unshift' : 'push']({
                callback: callback,
                modifiers: info.modifiers,
                action: info.action,
                seq: sequenceName,
                level: level,
                combo: combination
            });
        }

        /**
         * binds multiple combinations to the same callback
         *
         * @param {Array} combinations
         * @param {Function} callback
         * @param {string|undefined} action
         * @returns void
         */
        self._bindMultiple = function(combinations, callback, action) {
            for (var i = 0; i < combinations.length; ++i) {
                _bindSingle(combinations[i], callback, action);
            }
        };

        // start!
        _addEvent(targetElement, 'keypress', _handleKeyEvent);
        _addEvent(targetElement, 'keydown', _handleKeyEvent);
        _addEvent(targetElement, 'keyup', _handleKeyEvent);
    }

    /**
     * binds an event to mousetrap
     *
     * can be a single key, a combination of keys separated with +,
     * an array of keys, or a sequence of keys separated by spaces
     *
     * be sure to list the modifier keys first to make sure that the
     * correct key ends up getting bound (the last key in the pattern)
     *
     * @param {string|Array} keys
     * @param {Function} callback
     * @param {string=} action - 'keypress', 'keydown', or 'keyup'
     * @returns void
     */
    Mousetrap.prototype.bind = function(keys, callback, action) {
        var self = this;
        keys = keys instanceof Array ? keys : [keys];
        self._bindMultiple.call(self, keys, callback, action);
        return self;
    };

    /**
     * unbinds an event to mousetrap
     *
     * the unbinding sets the callback function of the specified key combo
     * to an empty function and deletes the corresponding key in the
     * _directMap dict.
     *
     * TODO: actually remove this from the _callbacks dictionary instead
     * of binding an empty function
     *
     * the keycombo+action has to be exactly the same as
     * it was defined in the bind method
     *
     * @param {string|Array} keys
     * @param {string} action
     * @returns void
     */
    Mousetrap.prototype.unbind = function(keys, action) {
        var self = this;
        return self.bind.call(self, keys, function() {}, action);
    };

    /**
     * triggers an event that has already been bound
     *
     * @param {string} keys
     * @param {string=} action
     * @returns void
     */
    Mousetrap.prototype.trigger = function(keys, action) {
        var self = this;
        if (self._directMap[keys + ':' + action]) {
            self._directMap[keys + ':' + action]({}, keys);
        }
        return self;
    };

    /**
     * resets the library back to its initial state.  this is useful
     * if you want to clear out the current keyboard shortcuts and bind
     * new ones - for example if you switch to another page
     *
     * @returns void
     */
    Mousetrap.prototype.reset = function() {
        var self = this;
        self._callbacks = {};
        self._directMap = {};
        return self;
    };

    /**
     * should we stop this event before firing off callbacks
     *
     * @param {Event} e
     * @param {Element} element
     * @return {boolean}
     */
    Mousetrap.prototype.stopCallback = function(e, element) {
        var self = this;

        // if the element has the class "mousetrap" then no need to stop
        if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
            return false;
        }

        if (_belongsTo(element, self.target)) {
            return false;
        }

        // stop for input, select, and textarea
        return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
    };

    /**
     * exposes _handleKey publicly so it can be overwritten by extensions
     */
    Mousetrap.prototype.handleKey = function() {
        var self = this;
        return self._handleKey.apply(self, arguments);
    };

    /**
     * allow custom key mappings
     */
    Mousetrap.addKeycodes = function(object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                _MAP[key] = object[key];
            }
        }
        _REVERSE_MAP = null;
    };

    /**
     * Init the global mousetrap functions
     *
     * This method is needed to allow the global mousetrap functions to work
     * now that mousetrap is a constructor function.
     */
    Mousetrap.init = function() {
        var documentMousetrap = Mousetrap(document);
        for (var method in documentMousetrap) {
            if (method.charAt(0) !== '_') {
                Mousetrap[method] = (function(method) {
                    return function() {
                        return documentMousetrap[method].apply(documentMousetrap, arguments);
                    };
                } (method));
            }
        }
    };

    Mousetrap.init();

    // expose mousetrap to the global object
    window.Mousetrap = Mousetrap;

    // expose as a common js module
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Mousetrap;
    }

    // expose mousetrap as an AMD module
    if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
            return Mousetrap;
        }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
}) (typeof window !== 'undefined' ? window : null, typeof  window !== 'undefined' ? document : null);


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const Split_1 = __webpack_require__(10);
const model_1 = __webpack_require__(2);
class Sandbox extends React.Component {
    constructor() {
        super(...arguments);
        this.onResizeBegin = () => {
            this.container.style.pointerEvents = "none";
        };
        this.onResizeEnd = () => {
            this.container.style.pointerEvents = "auto";
        };
    }
    setContainer(container) {
        if (container == null)
            return;
        if (this.container !== container) {
            // ...
        }
        this.container = container;
    }
    componentDidMount() {
        Split_1.Split.onResizeBegin.register(this.onResizeBegin);
        Split_1.Split.onResizeEnd.register(this.onResizeEnd);
    }
    componentWillUnmount() {
        Split_1.Split.onResizeBegin.unregister(this.onResizeBegin);
        Split_1.Split.onResizeEnd.unregister(this.onResizeEnd);
    }
    run(project, src) {
        var iframe = document.createElement('iframe');
        iframe.className = "sandbox";
        iframe.src = URL.createObjectURL(new Blob([src], { type: 'text/html' }));
        if (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        this.container.appendChild(iframe);
        let contentWindow = iframe.contentWindow;
        let logger = this.props.logger;
        // Hijack Console
        let log = contentWindow.console.log;
        contentWindow.console.log = function (message) {
            logger.logLn(message);
            log.apply(contentWindow.console, arguments);
        };
        contentWindow.getFileURL = (path) => {
            let file = project.getFile(path);
            if (!file) {
                this.props.logger.logLn(`Cannot find file ${path}`, "error");
                return;
            }
            let blob = new Blob([file.getData()], { type: model_1.mimeTypeForFileType(file.type) });
            return window.URL.createObjectURL(blob);
        };
        let ready = new Promise((resolve) => {
            iframe.onready = () => {
                resolve(contentWindow);
            };
        });
    }
    render() {
        return React.createElement("div", { className: "fill", ref: (ref) => this.setContainer(ref) });
    }
}
exports.Sandbox = Sandbox;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Task {
    constructor(dependencies, promiseMaker) {
        this.dependencies = dependencies;
        this.promiseMaker = promiseMaker;
    }
}
class TaskInstance {
    constructor(task) {
        this.task = task;
        this.promise = null;
    }
    makePromise() {
        if (this.promise) {
            return this.promise;
        }
        return this.promise = this.task.promiseMaker();
    }
}
class GulpySession {
    constructor(gulpy) {
        this.tasks = new Map();
        this.gulpy = gulpy;
    }
    ensureInstance(task) {
        let instance = this.tasks.get(task);
        if (instance) {
            return instance;
        }
        instance = new TaskInstance(task);
        this.tasks.set(task, instance);
        return instance;
    }
    runInstance(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            let dependencies = instance.task.dependencies.map(x => this.ensureInstance(x));
            yield Promise.all(dependencies.map(x => this.runInstance(x)));
            return instance.makePromise();
        });
    }
    run(task) {
        return this.runInstance(this.ensureInstance(task));
    }
}
class Gulpy {
    constructor() {
        this.tasks = {};
    }
    task(name, a, b) {
        let dependencies = [];
        let fn = null;
        if (arguments.length == 3) {
            dependencies = a;
            fn = b;
        }
        else if (arguments.length == 2) {
            fn = a;
        }
        this.tasks[name] = new Task(dependencies.map(x => this.tasks[x]), fn);
    }
    series(tasks) {
        return null;
    }
    parallel(tasks) {
        return null;
    }
    run(name) {
        let session = new GulpySession(this);
        session.run(this.tasks[name]);
    }
}
exports.Gulpy = Gulpy;
function testGulpy() {
    let gulp = new Gulpy();
    gulp.task("b", () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("Running Task B " + performance.now());
                resolve();
            }, 50);
        });
    });
    gulp.task("c", [], () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("Running Task C " + performance.now());
                resolve();
            }, 100);
        });
    });
    gulp.task("a", ["b", "c"], () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("Running Task A " + performance.now());
                resolve();
            }, 200);
        });
    });
    gulp.run("a");
}
exports.testGulpy = testGulpy;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const ReactModal = __webpack_require__(37);
const Button_1 = __webpack_require__(21);
const Icons_1 = __webpack_require__(20);
const model_1 = __webpack_require__(2);
const Widgets_1 = __webpack_require__(25);
class NewFileDialog extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeName = (event) => {
            this.setState({ name: event.target.value });
        };
        this.state = {
            fileType: model_1.FileType.C,
            description: "",
            name: ""
        };
    }
    nameError() {
        let directory = this.props.directory;
        if (this.state.name) {
            if (!/^[a-z0-9\.\-\_]+$/i.test(this.state.name)) {
                return "Illegal characters in file name.";
            }
            else if (!this.state.name.endsWith(model_1.extensionForFileType(this.state.fileType))) {
                return model_1.nameForFileType(this.state.fileType) + " file extension is missing.";
            }
            else if (directory && directory.getImmediateChild(this.state.name)) {
                return `File '${this.state.name}' already exists.`;
            }
        }
        return "";
    }
    fileName() {
        let name = this.state.name;
        let extension = model_1.extensionForFileType(this.state.fileType);
        if (!name.endsWith("." + extension)) {
            name += "." + extension;
        }
        return name;
    }
    createButtonLabel() {
        return "Create";
    }
    render() {
        return React.createElement(ReactModal, { isOpen: this.props.isOpen, contentLabel: "Create New File", className: "modal", overlayClassName: "overlay", ariaHideApp: false },
            React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
                React.createElement("div", { className: "modal-title-bar" }, "Create New File"),
                React.createElement("div", null,
                    React.createElement("div", { style: { display: "flex" } },
                        React.createElement("div", { style: { width: 250 } },
                            React.createElement(Widgets_1.ListBox, { value: this.state.fileType, height: 240, onSelect: (fileType) => {
                                    let description = "";
                                    switch (fileType) {
                                        case model_1.FileType.C:
                                            description = "Creates a file containing C source code.";
                                            break;
                                        case model_1.FileType.Cpp:
                                            description = "Creates a file containing C++ source code.";
                                            break;
                                        case model_1.FileType.Cretonne:
                                            description = "Cretonne intermediate language (IL) source code.";
                                            break;
                                        default:
                                            description = "N/A";
                                            break;
                                    }
                                    this.setState({ fileType, description });
                                } },
                                React.createElement(Widgets_1.ListItem, { value: model_1.FileType.C, label: "C File (.c)", icon: React.createElement(Icons_1.Icon, { src: "svg/file_type_c.svg" }) }),
                                React.createElement(Widgets_1.ListItem, { value: model_1.FileType.Cpp, label: "C++ File (.cpp)", icon: React.createElement(Icons_1.Icon, { src: "svg/file_type_cpp.svg" }) }),
                                React.createElement(Widgets_1.ListItem, { value: model_1.FileType.Rust, label: "Rust File (.rs)", icon: React.createElement(Icons_1.Icon, { src: "svg/file_type_rust.svg" }) }),
                                React.createElement(Widgets_1.ListItem, { value: model_1.FileType.Cretonne, label: "Cretonne (.cton)", icon: React.createElement(Icons_1.Icon, { src: "svg/default_file.svg" }) }),
                                React.createElement(Widgets_1.ListItem, { value: model_1.FileType.Wast, label: "Wast (.wast)", icon: React.createElement(Icons_1.Icon, { src: "svg/default_file.svg" }) }),
                                React.createElement(Widgets_1.ListItem, { value: model_1.FileType.JavaScript, label: "JavaScript (.js)", icon: React.createElement(Icons_1.Icon, { src: "svg/file_type_js.svg" }) }),
                                React.createElement(Widgets_1.ListItem, { value: model_1.FileType.TypeScript, label: "TypeScript (.ts)", icon: React.createElement(Icons_1.Icon, { src: "svg/file_type_typescript.svg" }) }),
                                React.createElement(Widgets_1.ListItem, { value: model_1.FileType.HTML, label: "HTML (.html)", icon: React.createElement(Icons_1.Icon, { src: "svg/file_type_html.svg" }) }),
                                React.createElement(Widgets_1.ListItem, { value: model_1.FileType.CSS, label: "CSS (.css)", icon: React.createElement(Icons_1.Icon, { src: "svg/file_type_css.svg" }) }),
                                React.createElement(Widgets_1.ListItem, { value: model_1.FileType.Markdown, label: "Markdown (.md)", icon: React.createElement(Icons_1.Icon, { src: "svg/file_type_markdown.svg" }) }))),
                        React.createElement("div", { className: "new-file-dialog-description" }, this.state.description))),
                React.createElement("div", { style: { flex: 1, padding: "8px" } },
                    React.createElement(Widgets_1.TextInputBox, { label: "Name: " + (this.props.directory ? this.props.directory.getPath() + "/" : ""), error: this.nameError(), value: this.state.name, onChange: this.onChangeName })),
                React.createElement("div", null,
                    React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoX, null), label: "Cancel", title: "Create New File", onClick: () => {
                            this.props.onCancel();
                        } }),
                    React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoFile, null), label: this.createButtonLabel(), title: "Create New File", isDisabled: !this.state.fileType || !this.state.name || !!this.nameError(), onClick: () => {
                            let file = new model_1.File(this.fileName(), this.state.fileType);
                            this.props.onCreate && this.props.onCreate(file);
                        } }))));
    }
}
exports.NewFileDialog = NewFileDialog;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bodyOpenClassName = exports.portalClassName = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(26);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = __webpack_require__(38);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ModalPortal = __webpack_require__(83);

var _ModalPortal2 = _interopRequireDefault(_ModalPortal);

var _ariaAppHider = __webpack_require__(41);

var ariaAppHider = _interopRequireWildcard(_ariaAppHider);

var _safeHTMLElement = __webpack_require__(43);

var _safeHTMLElement2 = _interopRequireDefault(_safeHTMLElement);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var portalClassName = exports.portalClassName = "ReactModalPortal";
var bodyOpenClassName = exports.bodyOpenClassName = "ReactModal__Body--open";

var isReact16 = _reactDom2.default.createPortal !== undefined;
var createPortal = isReact16 ? _reactDom2.default.createPortal : _reactDom2.default.unstable_renderSubtreeIntoContainer;

function getParentElement(parentSelector) {
  return parentSelector();
}

var Modal = function (_Component) {
  _inherits(Modal, _Component);

  function Modal() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Modal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Modal.__proto__ || Object.getPrototypeOf(Modal)).call.apply(_ref, [this].concat(args))), _this), _this.removePortal = function () {
      !isReact16 && _reactDom2.default.unmountComponentAtNode(_this.node);
      var parent = getParentElement(_this.props.parentSelector);
      parent.removeChild(_this.node);
    }, _this.portalRef = function (ref) {
      _this.portal = ref;
    }, _this.renderPortal = function (props) {
      var portal = createPortal(_this, _react2.default.createElement(_ModalPortal2.default, _extends({ defaultStyles: Modal.defaultStyles }, props)), _this.node);
      _this.portalRef(portal);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Modal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!_safeHTMLElement.canUseDOM) return;

      if (!isReact16) {
        this.node = document.createElement("div");
      }
      this.node.className = this.props.portalClassName;

      var parent = getParentElement(this.props.parentSelector);
      parent.appendChild(this.node);

      !isReact16 && this.renderPortal(this.props);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(newProps) {
      if (!_safeHTMLElement.canUseDOM) return;
      var isOpen = newProps.isOpen;
      // Stop unnecessary renders if modal is remaining closed

      if (!this.props.isOpen && !isOpen) return;

      var currentParent = getParentElement(this.props.parentSelector);
      var newParent = getParentElement(newProps.parentSelector);

      if (newParent !== currentParent) {
        currentParent.removeChild(this.node);
        newParent.appendChild(this.node);
      }

      !isReact16 && this.renderPortal(newProps);
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(newProps) {
      if (!_safeHTMLElement.canUseDOM) return;
      if (newProps.portalClassName !== this.props.portalClassName) {
        this.node.className = newProps.portalClassName;
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!_safeHTMLElement.canUseDOM || !this.node || !this.portal) return;

      var state = this.portal.state;
      var now = Date.now();
      var closesAt = state.isOpen && this.props.closeTimeoutMS && (state.closesAt || now + this.props.closeTimeoutMS);

      if (closesAt) {
        if (!state.beforeClose) {
          this.portal.closeWithTimeout();
        }

        setTimeout(this.removePortal, closesAt - now);
      } else {
        this.removePortal();
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (!_safeHTMLElement.canUseDOM || !isReact16) {
        return null;
      }

      if (!this.node && isReact16) {
        this.node = document.createElement("div");
      }

      return createPortal(_react2.default.createElement(_ModalPortal2.default, _extends({
        ref: this.portalRef,
        defaultStyles: Modal.defaultStyles
      }, this.props)), this.node);
    }
  }], [{
    key: "setAppElement",
    value: function setAppElement(element) {
      ariaAppHider.setElement(element);
    }

    /* eslint-disable react/no-unused-prop-types */

    /* eslint-enable react/no-unused-prop-types */

  }]);

  return Modal;
}(_react.Component);

Modal.propTypes = {
  isOpen: _propTypes2.default.bool.isRequired,
  style: _propTypes2.default.shape({
    content: _propTypes2.default.object,
    overlay: _propTypes2.default.object
  }),
  portalClassName: _propTypes2.default.string,
  bodyOpenClassName: _propTypes2.default.string,
  className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.shape({
    base: _propTypes2.default.string.isRequired,
    afterOpen: _propTypes2.default.string.isRequired,
    beforeClose: _propTypes2.default.string.isRequired
  })]),
  overlayClassName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.shape({
    base: _propTypes2.default.string.isRequired,
    afterOpen: _propTypes2.default.string.isRequired,
    beforeClose: _propTypes2.default.string.isRequired
  })]),
  appElement: _propTypes2.default.instanceOf(_safeHTMLElement2.default),
  onAfterOpen: _propTypes2.default.func,
  onRequestClose: _propTypes2.default.func,
  closeTimeoutMS: _propTypes2.default.number,
  ariaHideApp: _propTypes2.default.bool,
  shouldFocusAfterRender: _propTypes2.default.bool,
  shouldCloseOnOverlayClick: _propTypes2.default.bool,
  shouldReturnFocusAfterClose: _propTypes2.default.bool,
  parentSelector: _propTypes2.default.func,
  aria: _propTypes2.default.object,
  role: _propTypes2.default.string,
  contentLabel: _propTypes2.default.string,
  shouldCloseOnEsc: _propTypes2.default.bool
};
Modal.defaultProps = {
  isOpen: false,
  portalClassName: portalClassName,
  bodyOpenClassName: bodyOpenClassName,
  ariaHideApp: true,
  closeTimeoutMS: 0,
  shouldFocusAfterRender: true,
  shouldCloseOnEsc: true,
  shouldCloseOnOverlayClick: true,
  shouldReturnFocusAfterClose: true,
  parentSelector: function parentSelector() {
    return document.body;
  }
};
Modal.defaultStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.75)"
  },
  content: {
    position: "absolute",
    top: "40px",
    left: "40px",
    right: "40px",
    bottom: "40px",
    border: "1px solid #ccc",
    background: "#fff",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "4px",
    outline: "none",
    padding: "20px"
  }
};
exports.default = Modal;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(22);
var invariant = __webpack_require__(23);
var warning = __webpack_require__(39);
var assign = __webpack_require__(80);

var ReactPropTypesSecret = __webpack_require__(24);
var checkPropTypes = __webpack_require__(81);

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(
          false,
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (process.env.NODE_ENV !== 'production') {
  var invariant = __webpack_require__(23);
  var warning = __webpack_require__(39);
  var ReactPropTypesSecret = __webpack_require__(24);
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(22);
var invariant = __webpack_require__(23);
var ReactPropTypesSecret = __webpack_require__(24);

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(38);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _focusManager = __webpack_require__(84);

var focusManager = _interopRequireWildcard(_focusManager);

var _scopeTab = __webpack_require__(85);

var _scopeTab2 = _interopRequireDefault(_scopeTab);

var _ariaAppHider = __webpack_require__(41);

var ariaAppHider = _interopRequireWildcard(_ariaAppHider);

var _refCount = __webpack_require__(42);

var refCount = _interopRequireWildcard(_refCount);

var _bodyClassList = __webpack_require__(87);

var bodyClassList = _interopRequireWildcard(_bodyClassList);

var _safeHTMLElement = __webpack_require__(43);

var _safeHTMLElement2 = _interopRequireDefault(_safeHTMLElement);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// so that our CSS is statically analyzable
var CLASS_NAMES = {
  overlay: "ReactModal__Overlay",
  content: "ReactModal__Content"
};

var TAB_KEY = 9;
var ESC_KEY = 27;

var ModalPortal = function (_Component) {
  _inherits(ModalPortal, _Component);

  function ModalPortal(props) {
    _classCallCheck(this, ModalPortal);

    var _this = _possibleConstructorReturn(this, (ModalPortal.__proto__ || Object.getPrototypeOf(ModalPortal)).call(this, props));

    _this.setFocusAfterRender = function (focus) {
      _this.focusAfterRender = _this.props.shouldFocusAfterRender && focus;
    };

    _this.setOverlayRef = function (overlay) {
      _this.overlay = overlay;
    };

    _this.setContentRef = function (content) {
      _this.content = content;
    };

    _this.afterClose = function () {
      var _this$props = _this.props,
          appElement = _this$props.appElement,
          ariaHideApp = _this$props.ariaHideApp;

      // Remove body class

      bodyClassList.remove(_this.props.bodyOpenClassName);

      // Reset aria-hidden attribute if all modals have been removed
      if (ariaHideApp && refCount.totalCount() < 1) {
        ariaAppHider.show(appElement);
      }

      if (_this.props.shouldFocusAfterRender) {
        if (_this.props.shouldReturnFocusAfterClose) {
          focusManager.returnFocus();
          focusManager.teardownScopedFocus();
        } else {
          focusManager.popWithoutFocus();
        }
      }
    };

    _this.open = function () {
      _this.beforeOpen();
      if (_this.state.afterOpen && _this.state.beforeClose) {
        clearTimeout(_this.closeTimer);
        _this.setState({ beforeClose: false });
      } else {
        if (_this.props.shouldFocusAfterRender) {
          focusManager.setupScopedFocus(_this.node);
          focusManager.markForFocusLater();
        }

        _this.setState({ isOpen: true }, function () {
          _this.setState({ afterOpen: true });

          if (_this.props.isOpen && _this.props.onAfterOpen) {
            _this.props.onAfterOpen();
          }
        });
      }
    };

    _this.close = function () {
      if (_this.props.closeTimeoutMS > 0) {
        _this.closeWithTimeout();
      } else {
        _this.closeWithoutTimeout();
      }
    };

    _this.focusContent = function () {
      return _this.content && !_this.contentHasFocus() && _this.content.focus();
    };

    _this.closeWithTimeout = function () {
      var closesAt = Date.now() + _this.props.closeTimeoutMS;
      _this.setState({ beforeClose: true, closesAt: closesAt }, function () {
        _this.closeTimer = setTimeout(_this.closeWithoutTimeout, _this.state.closesAt - Date.now());
      });
    };

    _this.closeWithoutTimeout = function () {
      _this.setState({
        beforeClose: false,
        isOpen: false,
        afterOpen: false,
        closesAt: null
      }, _this.afterClose);
    };

    _this.handleKeyDown = function (event) {
      if (event.keyCode === TAB_KEY) {
        (0, _scopeTab2.default)(_this.content, event);
      }

      if (_this.props.shouldCloseOnEsc && event.keyCode === ESC_KEY) {
        event.stopPropagation();
        _this.requestClose(event);
      }
    };

    _this.handleOverlayOnClick = function (event) {
      if (_this.shouldClose === null) {
        _this.shouldClose = true;
      }

      if (_this.shouldClose && _this.props.shouldCloseOnOverlayClick) {
        if (_this.ownerHandlesClose()) {
          _this.requestClose(event);
        } else {
          _this.focusContent();
        }
      }
      _this.shouldClose = null;
      _this.moveFromContentToOverlay = null;
    };

    _this.handleOverlayOnMouseUp = function () {
      if (_this.moveFromContentToOverlay === null) {
        _this.shouldClose = false;
      }
    };

    _this.handleContentOnMouseUp = function () {
      _this.shouldClose = false;
    };

    _this.handleOverlayOnMouseDown = function (event) {
      if (!_this.props.shouldCloseOnOverlayClick && event.target == _this.overlay) {
        event.preventDefault();
      }
      _this.moveFromContentToOverlay = false;
    };

    _this.handleContentOnClick = function () {
      _this.shouldClose = false;
    };

    _this.handleContentOnMouseDown = function () {
      _this.shouldClose = false;
      _this.moveFromContentToOverlay = false;
    };

    _this.requestClose = function (event) {
      return _this.ownerHandlesClose() && _this.props.onRequestClose(event);
    };

    _this.ownerHandlesClose = function () {
      return _this.props.onRequestClose;
    };

    _this.shouldBeClosed = function () {
      return !_this.state.isOpen && !_this.state.beforeClose;
    };

    _this.contentHasFocus = function () {
      return document.activeElement === _this.content || _this.content.contains(document.activeElement);
    };

    _this.buildClassName = function (which, additional) {
      var classNames = (typeof additional === "undefined" ? "undefined" : _typeof(additional)) === "object" ? additional : {
        base: CLASS_NAMES[which],
        afterOpen: CLASS_NAMES[which] + "--after-open",
        beforeClose: CLASS_NAMES[which] + "--before-close"
      };
      var className = classNames.base;
      if (_this.state.afterOpen) {
        className = className + " " + classNames.afterOpen;
      }
      if (_this.state.beforeClose) {
        className = className + " " + classNames.beforeClose;
      }
      return typeof additional === "string" && additional ? className + " " + additional : className;
    };

    _this.ariaAttributes = function (items) {
      return Object.keys(items).reduce(function (acc, name) {
        acc["aria-" + name] = items[name];
        return acc;
      }, {});
    };

    _this.state = {
      afterOpen: false,
      beforeClose: false
    };

    _this.shouldClose = null;
    _this.moveFromContentToOverlay = null;
    return _this;
  }

  _createClass(ModalPortal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Focus needs to be set when mounting and already open
      if (this.props.isOpen) {
        this.setFocusAfterRender(true);
        this.open();
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(newProps) {
      if (process.env.NODE_ENV !== "production") {
        if (newProps.bodyOpenClassName !== this.props.bodyOpenClassName) {
          // eslint-disable-next-line no-console
          console.warn('React-Modal: "bodyOpenClassName" prop has been modified. ' + "This may cause unexpected behavior when multiple modals are open.");
        }
      }
      // Focus only needs to be set once when the modal is being opened
      if (!this.props.isOpen && newProps.isOpen) {
        this.setFocusAfterRender(true);
        this.open();
      } else if (this.props.isOpen && !newProps.isOpen) {
        this.close();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.focusAfterRender) {
        this.focusContent();
        this.setFocusAfterRender(false);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.afterClose();
      clearTimeout(this.closeTimer);
    }
  }, {
    key: "beforeOpen",
    value: function beforeOpen() {
      var _props = this.props,
          appElement = _props.appElement,
          ariaHideApp = _props.ariaHideApp,
          bodyOpenClassName = _props.bodyOpenClassName;
      // Add body class

      bodyClassList.add(bodyOpenClassName);
      // Add aria-hidden to appElement
      if (ariaHideApp) {
        ariaAppHider.hide(appElement);
      }
    }

    // Don't steal focus from inner elements

  }, {
    key: "render",
    value: function render() {
      var _props2 = this.props,
          className = _props2.className,
          overlayClassName = _props2.overlayClassName,
          defaultStyles = _props2.defaultStyles;

      var contentStyles = className ? {} : defaultStyles.content;
      var overlayStyles = overlayClassName ? {} : defaultStyles.overlay;

      return this.shouldBeClosed() ? null : _react2.default.createElement(
        "div",
        {
          ref: this.setOverlayRef,
          className: this.buildClassName("overlay", overlayClassName),
          style: _extends({}, overlayStyles, this.props.style.overlay),
          onClick: this.handleOverlayOnClick,
          onMouseDown: this.handleOverlayOnMouseDown,
          onMouseUp: this.handleOverlayOnMouseUp,
          "aria-modal": "true"
        },
        _react2.default.createElement(
          "div",
          _extends({
            ref: this.setContentRef,
            style: _extends({}, contentStyles, this.props.style.content),
            className: this.buildClassName("content", className),
            tabIndex: "-1",
            onKeyDown: this.handleKeyDown,
            onMouseDown: this.handleContentOnMouseDown,
            onMouseUp: this.handleContentOnMouseUp,
            onClick: this.handleContentOnClick,
            role: this.props.role,
            "aria-label": this.props.contentLabel
          }, this.ariaAttributes(this.props.aria || {})),
          this.props.children
        )
      );
    }
  }]);

  return ModalPortal;
}(_react.Component);

ModalPortal.defaultProps = {
  style: {
    overlay: {},
    content: {}
  }
};
ModalPortal.propTypes = {
  isOpen: _propTypes2.default.bool.isRequired,
  defaultStyles: _propTypes2.default.shape({
    content: _propTypes2.default.object,
    overlay: _propTypes2.default.object
  }),
  style: _propTypes2.default.shape({
    content: _propTypes2.default.object,
    overlay: _propTypes2.default.object
  }),
  className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
  overlayClassName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
  bodyOpenClassName: _propTypes2.default.string,
  ariaHideApp: _propTypes2.default.bool,
  appElement: _propTypes2.default.instanceOf(_safeHTMLElement2.default),
  onAfterOpen: _propTypes2.default.func,
  onRequestClose: _propTypes2.default.func,
  closeTimeoutMS: _propTypes2.default.number,
  shouldFocusAfterRender: _propTypes2.default.bool,
  shouldCloseOnOverlayClick: _propTypes2.default.bool,
  shouldReturnFocusAfterClose: _propTypes2.default.bool,
  role: _propTypes2.default.string,
  contentLabel: _propTypes2.default.string,
  aria: _propTypes2.default.object,
  children: _propTypes2.default.node,
  shouldCloseOnEsc: _propTypes2.default.bool
};
exports.default = ModalPortal;
module.exports = exports["default"];
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleBlur = handleBlur;
exports.handleFocus = handleFocus;
exports.markForFocusLater = markForFocusLater;
exports.returnFocus = returnFocus;
exports.popWithoutFocus = popWithoutFocus;
exports.setupScopedFocus = setupScopedFocus;
exports.teardownScopedFocus = teardownScopedFocus;

var _tabbable = __webpack_require__(40);

var _tabbable2 = _interopRequireDefault(_tabbable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var focusLaterElements = [];
var modalElement = null;
var needToFocus = false;

function handleBlur() {
  needToFocus = true;
}

function handleFocus() {
  if (needToFocus) {
    needToFocus = false;
    if (!modalElement) {
      return;
    }
    // need to see how jQuery shims document.on('focusin') so we don't need the
    // setTimeout, firefox doesn't support focusin, if it did, we could focus
    // the element outside of a setTimeout. Side-effect of this implementation
    // is that the document.body gets focus, and then we focus our element right
    // after, seems fine.
    setTimeout(function () {
      if (modalElement.contains(document.activeElement)) {
        return;
      }
      var el = (0, _tabbable2.default)(modalElement)[0] || modalElement;
      el.focus();
    }, 0);
  }
}

function markForFocusLater() {
  focusLaterElements.push(document.activeElement);
}

/* eslint-disable no-console */
function returnFocus() {
  var toFocus = null;
  try {
    if (focusLaterElements.length !== 0) {
      toFocus = focusLaterElements.pop();
      toFocus.focus();
    }
    return;
  } catch (e) {
    console.warn(["You tried to return focus to", toFocus, "but it is not in the DOM anymore"].join(" "));
  }
}
/* eslint-enable no-console */

function popWithoutFocus() {
  focusLaterElements.length > 0 && focusLaterElements.pop();
}

function setupScopedFocus(element) {
  modalElement = element;

  if (window.addEventListener) {
    window.addEventListener("blur", handleBlur, false);
    document.addEventListener("focus", handleFocus, true);
  } else {
    window.attachEvent("onBlur", handleBlur);
    document.attachEvent("onFocus", handleFocus);
  }
}

function teardownScopedFocus() {
  modalElement = null;

  if (window.addEventListener) {
    window.removeEventListener("blur", handleBlur);
    document.removeEventListener("focus", handleFocus);
  } else {
    window.detachEvent("onBlur", handleBlur);
    document.detachEvent("onFocus", handleFocus);
  }
}

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scopeTab;

var _tabbable = __webpack_require__(40);

var _tabbable2 = _interopRequireDefault(_tabbable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scopeTab(node, event) {
  var tabbable = (0, _tabbable2.default)(node);

  if (!tabbable.length) {
    // Do nothing, since there are no elements that can receive focus.
    event.preventDefault();
    return;
  }

  var shiftKey = event.shiftKey;
  var head = tabbable[0];
  var tail = tabbable[tabbable.length - 1];

  // proceed with default browser behavior
  if (node === document.activeElement) {
    return;
  }

  var target;
  if (tail === document.activeElement && !shiftKey) {
    target = head;
  }

  if (head === document.activeElement && shiftKey) {
    target = tail;
  }

  if (target) {
    event.preventDefault();
    target.focus();
    return;
  }

  // Safari radio issue.
  //
  // Safari does not move the focus to the radio button,
  // so we need to force it to really walk through all elements.
  //
  // This is very error prune, since we are trying to guess
  // if it is a safari browser from the first occurence between
  // chrome or safari.
  //
  // The chrome user agent contains the first ocurrence
  // as the 'chrome/version' and later the 'safari/version'.
  var checkSafari = /(\bChrome\b|\bSafari\b)\//.exec(navigator.userAgent);
  var isSafariDesktop = checkSafari != null && checkSafari[1] != "Chrome" && /\biPod\b|\biPad\b/g.exec(navigator.userAgent) == null;

  // If we are not in safari desktop, let the browser control
  // the focus
  if (!isSafariDesktop) return;

  var x = tabbable.indexOf(document.activeElement);

  if (x > -1) {
    x += shiftKey ? -1 : 1;
  }

  event.preventDefault();

  tabbable[x].focus();
}
module.exports = exports["default"];

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = function() {};

if (process.env.NODE_ENV !== 'production') {
  warning = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' +
        format.replace(/%s/g, function() {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.remove = remove;

var _refCount = __webpack_require__(42);

var refCount = _interopRequireWildcard(_refCount);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function add(bodyClass) {
  // Increment class(es) on refCount tracker and add class(es) to body
  bodyClass.split(" ").map(refCount.add).forEach(function (className) {
    return document.body.classList.add(className);
  });
}

function remove(bodyClass) {
  var classListMap = refCount.get();
  // Decrement class(es) from the refCount tracker
  // and remove unused class(es) from body
  bodyClass.split(" ").map(refCount.remove).filter(function (className) {
    return classListMap[className] === 0;
  }).forEach(function (className) {
    return document.body.classList.remove(className);
  });
}

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2015 Jed Watson.
  Based on code that is Copyright 2013-2015, Facebook, Inc.
  All rights reserved.
*/
/* global define */

(function () {
	'use strict';

	var canUseDOM = !!(
		typeof window !== 'undefined' &&
		window.document &&
		window.document.createElement
	);

	var ExecutionEnvironment = {

		canUseDOM: canUseDOM,

		canUseWorkers: typeof Worker !== 'undefined',

		canUseEventListeners:
			canUseDOM && !!(window.addEventListener || window.attachEvent),

		canUseViewport: canUseDOM && !!window.screen

	};

	if (true) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return ExecutionEnvironment;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = ExecutionEnvironment;
	} else {
		window.ExecutionEnvironment = ExecutionEnvironment;
	}

}());


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const ReactModal = __webpack_require__(37);
const Button_1 = __webpack_require__(21);
const Icons_1 = __webpack_require__(20);
const model_1 = __webpack_require__(2);
const Widgets_1 = __webpack_require__(25);
class EditFileDialog extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeName = (event) => {
            this.setState({ name: event.target.value });
        };
        this.onChangeDescription = (event) => {
            this.setState({ description: event.target.value });
        };
        this.state = {
            description: props.file.description,
            name: props.file.name
        };
    }
    error() {
        let directory = this.props.file.parent;
        let file = directory.getImmediateChild(this.state.name);
        if (file && file !== this.props.file) {
            return `A file with the same name already exists.`;
        }
        return "";
    }
    render() {
        let file = this.props.file;
        return React.createElement(ReactModal, { isOpen: this.props.isOpen, contentLabel: "Edit " + (file instanceof model_1.Directory ? "Directory" : "File"), className: "modal", overlayClassName: "overlay", ariaHideApp: false },
            React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
                React.createElement("div", { className: "modal-title-bar" }, `Edit ${file instanceof model_1.Directory ? "Directory" : "File"} ${file.name}`),
                React.createElement("div", { style: { flex: 1, padding: "8px" } },
                    React.createElement(Widgets_1.TextInputBox, { label: "Name:", error: this.error(), value: this.state.name, onChange: this.onChangeName }),
                    React.createElement(Widgets_1.Spacer, { height: 8 }),
                    React.createElement(Widgets_1.TextInputBox, { label: "Description:", error: this.error(), value: this.state.description, onChange: this.onChangeDescription })),
                React.createElement("div", null,
                    React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoX, null), label: "Cancel", title: "Cancel", onClick: () => {
                            this.props.onCancel();
                        } }),
                    React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoPencil, null), label: "Edit", title: "Edit", isDisabled: !this.state.name || !!this.error(), onClick: () => {
                            this.props.onChange && this.props.onChange(this.state.name, this.state.description);
                        } }))));
    }
}
exports.EditFileDialog = EditFileDialog;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const Tabs_1 = __webpack_require__(19);
const EditorPane_1 = __webpack_require__(36);
const model_1 = __webpack_require__(2);
const index_1 = __webpack_require__(3);
const timers_1 = __webpack_require__(32);
const Split_1 = __webpack_require__(10);
const Button_1 = __webpack_require__(21);
class TabBasicTest extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement("div", null,
            React.createElement(Tabs_1.Tabs, null,
                React.createElement(Tabs_1.Tab, { label: "A" }),
                React.createElement(Tabs_1.Tab, { label: "Really Long Name That I Can't Fit In This Tab" }),
                React.createElement(Tabs_1.Tab, { label: "Ion", icon: "default_file" }),
                React.createElement(Tabs_1.Tab, { label: "Active", isActive: true }),
                React.createElement(Tabs_1.Tab, { label: "Marked", isMarked: true }),
                React.createElement(Tabs_1.Tab, { label: "Active & Marked", isActive: true, isMarked: true })));
    }
}
class TabSelectTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0,
            tabs: ["Arabaalelealel", "Bannanananana", "Copaoappaoasasoas", "Dendododlaoadad"]
        };
    }
    render() {
        return React.createElement("div", null,
            React.createElement(Tabs_1.Tabs, null, this.state.tabs.map((x, i) => {
                return React.createElement(Tabs_1.Tab, { key: x, label: x, onClick: () => {
                        this.setState({ selectedTab: i });
                    }, isActive: i === this.state.selectedTab });
            })));
    }
}
class TabSelectRandomTest extends TabSelectTest {
    constructor(props) {
        super(props);
        timers_1.setInterval(() => {
            this.setState({
                selectedTab: Math.random() * this.state.tabs.length | 0
            });
        }, 200);
    }
}
class TabBasicScrollTest extends React.Component {
    render() {
        return React.createElement("div", { style: { width: 512 } },
            React.createElement(TabBasicTest, null));
    }
}
class EditorPaneTest extends React.Component {
    constructor(props) {
        super(props);
        let a = new model_1.File("A", model_1.FileType.JavaScript);
        let b = new model_1.File("B", model_1.FileType.JavaScript);
        let c = new model_1.File("C", model_1.FileType.JavaScript);
        a.onDidChangeData.register(() => this.forceUpdate());
        b.onDidChangeData.register(() => this.forceUpdate());
        c.onDidChangeData.register(() => this.forceUpdate());
        this.state = {
            file: a,
            files: [a, b, c]
        };
    }
    render() {
        return React.createElement("div", { style: { height: 128 } },
            React.createElement(EditorPane_1.EditorPane, { preview: this.state.file, file: this.state.file, files: this.state.files, onNewFile: () => {
                    let { files } = this.state;
                    let f = new model_1.File("X", model_1.FileType.JavaScript);
                    files.push(f);
                    // files.splice(i, 1);
                    this.setState({ files, file: files[files.length - 1] });
                }, onClickFile: (x) => { this.setState({ file: x }); }, onClose: (x) => {
                    let { files } = this.state;
                    let i = files.indexOf(x);
                    files.splice(i, 1);
                    this.setState({ files, file: files[0] });
                } }));
    }
}
class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            splits: [
                { min: 128, max: 192, value: 130 }, {}, {}, { value: 64 }
            ],
            width: 600
        };
    }
    componentDidMount() {
        index_1.layout();
    }
    render() {
        let view = new EditorPane_1.View(new model_1.File("X", model_1.FileType.JavaScript), null);
        view.file.buffer.setValue(`
    render() {
      let { splits } = this.state;
      let resizerClassName = "resizer";
      let isHorizontal = this.props.orientation === SplitOrientation.Horizontal;
      if (isHorizontal) {
        resizerClassName += " horizontal";
      } else {
        resizerClassName += " vertical";
      }
      // console.log("Splits", splits, sum(splits), this.state.size);
      let count = React.Children.count(this.props.children);
      let children: any[] = [];
      React.Children.forEach(this.props.children, (child, i) => {
        let style: any = {};
        if (i < count - 1) {
          style.flexBasis = toCSSPx(Math.round(splits[i]));
        } else {
          style.flex = 1;
        }
        children.push(<div key={i} className="split-pane" style={style}>{child}</div>);
        if (i < count - 1) {
          children.push(<div key={"split:" + i} className={resizerClassName} onMouseDown={this.onResizerMouseDown.bind(this, i)}>
          </div>);
        }
      });
      return <div className="split" ref="container" style={{ flexDirection: isHorizontal ? "column" : "row" }}>
        {children}
      </div>;
    }
    `);
        return React.createElement("div", null,
            React.createElement("div", { style: { width: this.state.width, height: 128, border: "solid 1px red" } },
                React.createElement(Split_1.Split, { orientation: Split_1.SplitOrientation.Vertical, splits: this.state.splits, onChange: (splits) => {
                        this.setState({ splits });
                    } },
                    React.createElement("div", null, "A"),
                    React.createElement("div", null, "B"),
                    React.createElement("div", null, "C"),
                    React.createElement("div", null, "D"))),
            React.createElement(Button_1.Button, { label: "Force Update", onClick: () => {
                    // this.setState({splits});
                    timers_1.setInterval(() => {
                        let width = this.state.width - 10;
                        this.setState({ width });
                    }, 100);
                } }));
    }
}
exports.Test = Test;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(5);
let completionItems = null;
function getCompletionItems() {
    const keyword = monaco.languages.CompletionItemKind.Keyword;
    if (completionItems) {
        return completionItems;
    }
    return completionItems = [];
}
const LanguageConfiguration = {
    // the default separators except `@$`
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
    // comments: {
    //   lineComment: '//',
    //   blockComment: ['/*', '*/'],
    // },
    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
    ],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: '\'', close: '\'' },
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: '\'', close: '\'' },
        { open: '<', close: '>' },
    ]
};
const MonarchDefinitions = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    // defaultToken: 'invalid',
    keywords: [
        'function', 'jump'
    ],
    typeKeywords: [
        'i32', 'i64', 'f32', 'f64'
    ],
    operators: [],
    // brackets: [
    //   ['(', ')', 'bracket.parenthesis'],
    //   ['{', '}', 'bracket.curly'],
    //   ['[', ']', 'bracket.square']
    // ],
    // we include these common regular expressions
    // symbols: /[=><!~?:&|+\-*\/\^%]+/,
    symbols: /[=><~&|+\-*\/%@#]+/,
    // C# style strings
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    // The main tokenizer for our languages
    tokenizer: {
        root: [
            // identifiers and keywords
            [/[a-z_$][\w$\.]*/, {
                    cases: {
                        '@keywords': 'keyword',
                        '@typeKeywords': 'type',
                        '@default': 'type.identifier'
                    }
                }],
            // [/[A-Z][\w\$]*/, 'type.identifier' ],  // to show class names nicely
            // // whitespace
            // { include: '@whitespace' },
            // // delimiters and operators
            // [/[{}()\[\]]/, '@brackets'],
            // [/[<>](?!@symbols)/, '@brackets'],
            // [/@symbols/, { cases: { '@operators': 'operator',
            //                         '@default'  : '' } } ],
            // // @ annotations.
            // // As an example, we emit a debugging log message on these tokens.
            // // Note: message are supressed during the first load -- change some lines to see them.
            // [/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation', log: 'annotation token: $0' }],
            // // numbers
            // [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            // [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],
            // // delimiter: after number because of .\d floats
            // [/[;,.]/, 'delimiter'],
            // strings
            // [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
            [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
            // // characters
            // [/'[^\\']'/, 'string'],
            // [/(')(@escapes)(')/, ['string','string.escape','string']],
            // [/'/, 'string.invalid']
            [/[{}()\[\]]/, '@brackets']
        ],
        // comment: [
        //   [/[^\/*]+/, 'comment'],
        //   // [/[^\/*]+/, 'comment'],
        //   // [/\/\*/, 'comment', '@push'],    // nested comment
        //   // ["\\*/", 'comment', '@pop'],
        //   // [/[\/*]/, 'comment']
        // ],
        string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],
        whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/;.*$/, 'comment']
            // [/\/\*/, 'comment', '@comment'],
            // [/\/\/.*$/, 'comment'],
        ],
    },
};
exports.Cton = {
    MonarchDefinitions,
    LanguageConfiguration,
    CompletionItemProvider: {
        provideCompletionItems: function (model, position) {
            return getCompletionItems();
        }
    },
    HoverProvider: {
        provideHover: function (model, position) {
            return {
                range: new monaco.Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())),
                contents: [
                    '**DETAILS**',
                    { language: 'html', value: "TODO" }
                ]
            };
        }
    }
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(5);
let completionItems = null;
function getCompletionItems() {
    const keyword = monaco.languages.CompletionItemKind.Keyword;
    if (completionItems) {
        return completionItems;
    }
    return completionItems = [];
}
const LanguageConfiguration = {
    // the default separators except `@$`
    wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
    // comments: {
    //   lineComment: '//',
    //   blockComment: ['/*', '*/'],
    // },
    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
    ],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: '\'', close: '\'' },
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: '\'', close: '\'' },
        { open: '<', close: '>' },
    ]
};
const MonarchDefinitions = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: 'invalid',
    ignoreCase: true,
    keywords: [
        'qword', 'ptr'
    ],
    typeKeywords: [
        'i32', 'i64', 'f32', 'f64'
    ],
    ops: [
        'add',
        'sub',
        'mov',
        'jmp',
        'ret',
        'int3',
        'nop',
        'cmp'
    ],
    registers: [
        'R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15',
        'CS', 'DS', 'ES', 'FS', 'GS', 'SS', 'RAX', 'EAX', 'RBX', 'EBX', 'RCX', 'ECX', 'RDX', 'EDX',
        'RCX', 'RIP', 'EIP', 'IP', 'RSP', 'ESP', 'SP', 'RSI', 'ESI', 'SI', 'RDI', 'EDI', 'DI', 'RFLAGS', 'EFLAGS', 'FLAGS'
    ],
    // operators: [
    //   // '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
    //   // '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
    //   // '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
    //   // '%=', '<<=', '>>=', '>>>='
    // ] as any,
    // brackets: [
    //   ['(', ')', 'bracket.parenthesis'],
    //   ['{', '}', 'bracket.curly'],
    //   ['[', ']', 'bracket.square']
    // ],
    // we include these common regular expressions
    // symbols: /[=><!~?:&|+\-*\/\^%]+/,
    // symbols:  /[=><~&|+\-*\/%@#]+/,
    // C# style strings
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    // The main tokenizer for our languages
    tokenizer: {
        root: [
            // identifiers and keywords
            [/[a-z_$][\w$\.]*/, {
                    cases: {
                        '@ops': 'keyword',
                        '@registers': 'type',
                        '@keywords': 'keyword',
                        '@typeKeywords': 'keyword.type',
                        '@default': 'identifier'
                    }
                }],
            // [/[A-Z][\w\$]*/, 'type.identifier' ],  // to show class names nicely
            // // whitespace
            { include: '@whitespace' },
            // // delimiters and operators
            // [/[{}()\[\]]/, '@brackets'],
            // [/[<>](?!@symbols)/, '@brackets'],
            // [/@symbols/, { cases: { '@operators': 'operator',
            //                         '@default'  : '' } } ],
            // // @ annotations.
            // // As an example, we emit a debugging log message on these tokens.
            // // Note: message are supressed during the first load -- change some lines to see them.
            // [/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation', log: 'annotation token: $0' }],
            // // numbers
            // [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],
            // // delimiter: after number because of .\d floats
            [/[;,.]/, 'delimiter'],
            // strings
            // [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
            [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
            // // characters
            // [/'[^\\']'/, 'string'],
            // [/(')(@escapes)(')/, ['string','string.escape','string']],
            // [/'/, 'string.invalid']
            [/[{}()\[\]]/, '@brackets']
        ],
        comment: [
            [/;.*/, 'comment'],
        ],
        string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],
        whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/;.*$/, 'comment']
            // [/\/\*/, 'comment', '@comment'],
            // [/\/\/.*$/, 'comment'],
        ],
    },
};
exports.X86 = {
    MonarchDefinitions,
    LanguageConfiguration,
    CompletionItemProvider: {
        provideCompletionItems: function (model, position) {
            return getCompletionItems();
        }
    },
    HoverProvider: {
        provideHover: function (model, position) {
            return {
                range: new monaco.Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())),
                contents: [
                    '**DETAILS**',
                    { language: 'html', value: "TODO" }
                ]
            };
        }
    }
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/**
 * Parts Copyright (C) 2011-2012, Alex Russell (slightlyoff@chromium.org)
 * Parts Copyright (C) Copyright (C) 1998-2000 Greg J. Badros
 *
 * Use of this source code is governed by the LGPL, which can be found in the
 * COPYING.LGPL file.
 *
 * This is a compiled version of Cassowary/JS. For source versions or to
 * contribute, see the github project:
 *
 *  https://github.com/slightlyoff/cassowary-js-refactor
 *
 */

(function() {
(function(a){"use strict";try{(function(){}).bind(a)}catch(b){Object.defineProperty(Function.prototype,"bind",{value:function(a){var b=this;return function(){return b.apply(a,arguments)}},enumerable:!1,configurable:!0,writable:!0})}var c=a.HTMLElement!==void 0,d=function(a){for(var b=null;a&&a!=Object.prototype;){if(a.tagName){b=a.tagName;break}a=a.prototype}return b||"div"},e=1e-8,f={},g=function(a,b){if(a&&b){if("function"==typeof a[b])return a[b];var c=a.prototype;if(c&&"function"==typeof c[b])return c[b];if(c!==Object.prototype&&c!==Function.prototype)return"function"==typeof a.__super__?g(a.__super__,b):void 0}},h=a.c={debug:!1,trace:!1,verbose:!1,traceAdded:!1,GC:!1,GEQ:1,LEQ:2,inherit:function(b){var e=null,g=null;b["extends"]&&(g=b["extends"],delete b["extends"]),b.initialize&&(e=b.initialize,delete b.initialize);var h=e||function(){};Object.defineProperty(h,"__super__",{value:g?g:Object,enumerable:!1,configurable:!0,writable:!1}),b._t&&(f[b._t]=h);var i=h.prototype=Object.create(g?g.prototype:Object.prototype);if(this.extend(i,b),c&&g&&g.prototype instanceof a.HTMLElement){var j=h,k=d(i),l=function(a){return a.__proto__=i,j.apply(a,arguments),i.created&&a.created(),i.decorate&&a.decorate(),a};this.extend(i,{upgrade:l}),h=function(){return l(a.document.createElement(k))},h.prototype=i,this.extend(h,{ctor:j})}return h},extend:function(a,b){return this.own(b,function(c){var d=Object.getOwnPropertyDescriptor(b,c);try{"function"==typeof d.get||"function"==typeof d.set?Object.defineProperty(a,c,d):"function"==typeof d.value||"_"===c.charAt(0)?(d.writable=!0,d.configurable=!0,d.enumerable=!1,Object.defineProperty(a,c,d)):a[c]=b[c]}catch(e){}}),a},own:function(b,c,d){return Object.getOwnPropertyNames(b).forEach(c,d||a),b},traceprint:function(a){h.verbose&&console.log(a)},fnenterprint:function(a){console.log("* "+a)},fnexitprint:function(a){console.log("- "+a)},assert:function(a,b){if(!a)throw new h.InternalError("Assertion failed: "+b)},plus:function(a,b){return a instanceof h.Expression||(a=new h.Expression(a)),b instanceof h.Expression||(b=new h.Expression(b)),a.plus(b)},minus:function(a,b){return a instanceof h.Expression||(a=new h.Expression(a)),b instanceof h.Expression||(b=new h.Expression(b)),a.minus(b)},times:function(a,b){return("number"==typeof a||a instanceof h.Variable)&&(a=new h.Expression(a)),("number"==typeof b||b instanceof h.Variable)&&(b=new h.Expression(b)),a.times(b)},divide:function(a,b){return("number"==typeof a||a instanceof h.Variable)&&(a=new h.Expression(a)),("number"==typeof b||b instanceof h.Variable)&&(b=new h.Expression(b)),a.divide(b)},approx:function(a,b){if(a===b)return!0;var c,d;return c=a instanceof h.Variable?a.value:a,d=b instanceof h.Variable?b.value:b,0==c?e>Math.abs(d):0==d?e>Math.abs(c):Math.abs(c-d)<Math.abs(c)*e},_inc:function(a){return function(){return a++}}(0),parseJSON:function(a){return JSON.parse(a,function(a,b){if("object"!=typeof b||"string"!=typeof b._t)return b;var c=b._t,d=f[c];if(c&&d){var e=g(d,"fromJSON");if(e)return e(b,d)}return b})}};"function"=="function"&&"undefined"!=typeof module&&"undefined"==typeof load&&(a.exports=h)})(this),function(a){"use strict";var b=function(a){var b=a.hashCode?a.hashCode:""+a;return b},c=function(a,b){Object.keys(a).forEach(function(c){b[c]=a[c]})},d={};a.HashTable=a.inherit({initialize:function(){this.size=0,this._store={},this._keyStrMap={},this._deleted=0},set:function(a,c){var d=b(a);this._store.hasOwnProperty(d)||this.size++,this._store[d]=c,this._keyStrMap[d]=a},get:function(a){if(!this.size)return null;a=b(a);var c=this._store[a];return c!==void 0?this._store[a]:null},clear:function(){this.size=0,this._store={},this._keyStrMap={}},_compact:function(){var a={};c(this._store,a),this._store=a},_compactThreshold:100,_perhapsCompact:function(){this._size>64||this._deleted>this._compactThreshold&&(this._compact(),this._deleted=0)},"delete":function(a){a=b(a),this._store.hasOwnProperty(a)&&(this._deleted++,delete this._store[a],this.size>0&&this.size--)},each:function(a,b){if(this.size){this._perhapsCompact();var c=this._store,d=this._keyStrMap;Object.keys(this._store).forEach(function(e){a.call(b||null,d[e],c[e])},this)}},escapingEach:function(a,b){if(this.size){this._perhapsCompact();for(var c=this,e=this._store,f=this._keyStrMap,g=d,h=Object.keys(e),i=0;h.length>i;i++)if(function(d){c._store.hasOwnProperty(d)&&(g=a.call(b||null,f[d],e[d]))}(h[i]),g){if(void 0!==g.retval)return g;if(g.brk)break}}},clone:function(){var b=new a.HashTable;return this.size&&(b.size=this.size,c(this._store,b._store),c(this._keyStrMap,b._keyStrMap)),b},equals:function(b){if(b===this)return!0;if(!(b instanceof a.HashTable)||b._size!==this._size)return!1;for(var c=Object.keys(this._store),d=0;c.length>d;d++){var e=c[d];if(this._keyStrMap[e]!==b._keyStrMap[e]||this._store[e]!==b._store[e])return!1}return!0},toString:function(){var b="";return this.each(function(a,c){b+=a+" => "+c+"\n"}),b}})}(this.c||module.parent.exports||{}),function(a){"use strict";a.HashSet=a.inherit({_t:"c.HashSet",initialize:function(){this.storage=[],this.size=0},add:function(a){var b=this.storage;b.indexOf(a),-1==b.indexOf(a)&&b.push(a),this.size=this.storage.length},values:function(){return this.storage},has:function(a){var b=this.storage;return-1!=b.indexOf(a)},"delete":function(a){var b=this.storage.indexOf(a);return-1==b?null:(this.storage.splice(b,1)[0],this.size=this.storage.length,void 0)},clear:function(){this.storage.length=0},each:function(a,b){this.size&&this.storage.forEach(a,b)},escapingEach:function(a,b){this.size&&this.storage.forEach(a,b)},toString:function(){var a=this.size+" {",b=!0;return this.each(function(c){b?b=!1:a+=", ",a+=c}),a+="}\n"},toJSON:function(){var a=[];return this.each(function(b){a.push(b.toJSON())}),{_t:"c.HashSet",data:a}},fromJSON:function(b){var c=new a.HashSet;return b.data&&(c.size=b.data.length,c.storage=b.data),c}})}(this.c||module.parent.exports||{}),function(a){"use strict";a.Error=a.inherit({initialize:function(a){a&&(this._description=a)},_name:"c.Error",_description:"An error has occured in Cassowary",set description(a){this._description=a},get description(){return"("+this._name+") "+this._description},get message(){return this.description},toString:function(){return this.description}});var b=function(b,c){return a.inherit({"extends":a.Error,initialize:function(){a.Error.apply(this,arguments)},_name:b||"",_description:c||""})};a.ConstraintNotFound=b("c.ConstraintNotFound","Tried to remove a constraint never added to the tableu"),a.InternalError=b("c.InternalError"),a.NonExpression=b("c.NonExpression","The resulting expression would be non"),a.NotEnoughStays=b("c.NotEnoughStays","There are not enough stays to give specific values to every variable"),a.RequiredFailure=b("c.RequiredFailure","A required constraint cannot be satisfied"),a.TooDifficult=b("c.TooDifficult","The constraints are too difficult to solve")}(this.c||module.parent.exports||{}),function(a){"use strict";var b=1e3;a.SymbolicWeight=a.inherit({_t:"c.SymbolicWeight",initialize:function(){this.value=0;for(var a=1,c=arguments.length-1;c>=0;--c)this.value+=arguments[c]*a,a*=b},toJSON:function(){return{_t:this._t,value:this.value}}})}(this.c||module.parent.exports||{}),function(a){a.Strength=a.inherit({initialize:function(b,c,d,e){this.name=b,this.symbolicWeight=c instanceof a.SymbolicWeight?c:new a.SymbolicWeight(c,d,e)},get required(){return this===a.Strength.required},toString:function(){return this.name+(this.isRequired?"":":"+this.symbolicWeight)}}),a.Strength.required=new a.Strength("<Required>",1e3,1e3,1e3),a.Strength.strong=new a.Strength("strong",1,0,0),a.Strength.medium=new a.Strength("medium",0,1,0),a.Strength.weak=new a.Strength("weak",0,0,1)}(this.c||( true?module.parent.exports.c:{})),function(a){"use strict";a.AbstractVariable=a.inherit({isDummy:!1,isExternal:!1,isPivotable:!1,isRestricted:!1,_init:function(b,c){this.hashCode=a._inc(),this.name=(c||"")+this.hashCode,b&&(b.name!==void 0&&(this.name=b.name),b.value!==void 0&&(this.value=b.value),b.prefix!==void 0&&(this._prefix=b.prefix))},_prefix:"",name:"",value:0,toJSON:function(){var a={};return this._t&&(a._t=this._t),this.name&&(a.name=this.name),this.value!==void 0&&(a.value=this.value),this._prefix&&(a._prefix=this._prefix),this._t&&(a._t=this._t),a},fromJSON:function(b,c){var d=new c;return a.extend(d,b),d},toString:function(){return this._prefix+"["+this.name+":"+this.value+"]"}}),a.Variable=a.inherit({_t:"c.Variable","extends":a.AbstractVariable,initialize:function(b){this._init(b,"v");var c=a.Variable._map;c&&(c[this.name]=this)},isExternal:!0}),a.DummyVariable=a.inherit({_t:"c.DummyVariable","extends":a.AbstractVariable,initialize:function(a){this._init(a,"d")},isDummy:!0,isRestricted:!0,value:"dummy"}),a.ObjectiveVariable=a.inherit({_t:"c.ObjectiveVariable","extends":a.AbstractVariable,initialize:function(a){this._init(a,"o")},value:"obj"}),a.SlackVariable=a.inherit({_t:"c.SlackVariable","extends":a.AbstractVariable,initialize:function(a){this._init(a,"s")},isPivotable:!0,isRestricted:!0,value:"slack"})}(this.c||module.parent.exports||{}),function(a){"use strict";a.Point=a.inherit({initialize:function(b,c,d){if(b instanceof a.Variable)this._x=b;else{var e={value:b};d&&(e.name="x"+d),this._x=new a.Variable(e)}if(c instanceof a.Variable)this._y=c;else{var f={value:c};d&&(f.name="y"+d),this._y=new a.Variable(f)}},get x(){return this._x},set x(b){b instanceof a.Variable?this._x=b:this._x.value=b},get y(){return this._y},set y(b){b instanceof a.Variable?this._y=b:this._y.value=b},toString:function(){return"("+this.x+", "+this.y+")"}})}(this.c||module.parent.exports||{}),function(a){"use strict";a.Expression=a.inherit({initialize:function(b,c,d){a.GC&&console.log("new c.Expression"),this.constant="number"!=typeof d||isNaN(d)?0:d,this.terms=new a.HashTable,b instanceof a.AbstractVariable?this.setVariable(b,"number"==typeof c?c:1):"number"==typeof b&&(isNaN(b)?console.trace():this.constant=b)},initializeFromHash:function(b,c){return a.verbose&&(console.log("*******************************"),console.log("clone c.initializeFromHash"),console.log("*******************************")),a.GC&&console.log("clone c.Expression"),this.constant=b,this.terms=c.clone(),this},multiplyMe:function(a){this.constant*=a;var b=this.terms;return b.each(function(c,d){b.set(c,d*a)}),this},clone:function(){a.verbose&&(console.log("*******************************"),console.log("clone c.Expression"),console.log("*******************************"));var b=new a.Expression;return b.initializeFromHash(this.constant,this.terms),b},times:function(b){if("number"==typeof b)return this.clone().multiplyMe(b);if(this.isConstant)return b.times(this.constant);if(b.isConstant)return this.times(b.constant);throw new a.NonExpression},plus:function(b){return b instanceof a.Expression?this.clone().addExpression(b,1):b instanceof a.Variable?this.clone().addVariable(b,1):void 0},minus:function(b){return b instanceof a.Expression?this.clone().addExpression(b,-1):b instanceof a.Variable?this.clone().addVariable(b,-1):void 0},divide:function(b){if("number"==typeof b){if(a.approx(b,0))throw new a.NonExpression;return this.times(1/b)}if(b instanceof a.Expression){if(!b.isConstant)throw new a.NonExpression;return this.times(1/b.constant)}},addExpression:function(b,c,d,e){return b instanceof a.AbstractVariable&&(b=new a.Expression(b),a.trace&&console.log("addExpression: Had to cast a var to an expression")),c=c||1,this.constant+=c*b.constant,b.terms.each(function(a,b){this.addVariable(a,b*c,d,e)},this),this},addVariable:function(b,c,d,e){null==c&&(c=1),a.trace&&console.log("c.Expression::addVariable():",b,c);var f=this.terms.get(b);if(f){var g=f+c;0==g||a.approx(g,0)?(e&&e.noteRemovedVariable(b,d),this.terms.delete(b)):this.setVariable(b,g)}else a.approx(c,0)||(this.setVariable(b,c),e&&e.noteAddedVariable(b,d));return this},setVariable:function(a,b){return this.terms.set(a,b),this},anyPivotableVariable:function(){if(this.isConstant)throw new a.InternalError("anyPivotableVariable called on a constant");var b=this.terms.escapingEach(function(a){return a.isPivotable?{retval:a}:void 0});return b&&void 0!==b.retval?b.retval:null},substituteOut:function(b,c,d,e){a.trace&&(a.fnenterprint("CLE:substituteOut: "+b+", "+c+", "+d+", ..."),a.traceprint("this = "+this));var f=this.setVariable.bind(this),g=this.terms,h=g.get(b);g.delete(b),this.constant+=h*c.constant,c.terms.each(function(b,c){var i=g.get(b);if(i){var j=i+h*c;a.approx(j,0)?(e.noteRemovedVariable(b,d),g.delete(b)):f(b,j)}else f(b,h*c),e&&e.noteAddedVariable(b,d)}),a.trace&&a.traceprint("Now this is "+this)},changeSubject:function(a,b){this.setVariable(a,this.newSubject(b))},newSubject:function(b){a.trace&&a.fnenterprint("newSubject:"+b);var c=1/this.terms.get(b);return this.terms.delete(b),this.multiplyMe(-c),c},coefficientFor:function(a){return this.terms.get(a)||0},get isConstant(){return 0==this.terms.size},toString:function(){var b="",c=!1;if(!a.approx(this.constant,0)||this.isConstant){if(b+=this.constant,this.isConstant)return b;c=!0}return this.terms.each(function(a,d){c&&(b+=" + "),b+=d+"*"+a,c=!0}),b},equals:function(b){return b===this?!0:b instanceof a.Expression&&b.constant===this.constant&&b.terms.equals(this.terms)},Plus:function(a,b){return a.plus(b)},Minus:function(a,b){return a.minus(b)},Times:function(a,b){return a.times(b)},Divide:function(a,b){return a.divide(b)}})}(this.c||module.parent.exports||{}),function(a){"use strict";a.AbstractConstraint=a.inherit({initialize:function(b,c){this.hashCode=a._inc(),this.strength=b||a.Strength.required,this.weight=c||1},isEditConstraint:!1,isInequality:!1,isStayConstraint:!1,get required(){return this.strength===a.Strength.required},toString:function(){return this.strength+" {"+this.weight+"} ("+this.expression+")"}});var b=a.AbstractConstraint.prototype.toString,c=function(b,c,d){a.AbstractConstraint.call(this,c||a.Strength.strong,d),this.variable=b,this.expression=new a.Expression(b,-1,b.value)};a.EditConstraint=a.inherit({"extends":a.AbstractConstraint,initialize:function(){c.apply(this,arguments)},isEditConstraint:!0,toString:function(){return"edit:"+b.call(this)}}),a.StayConstraint=a.inherit({"extends":a.AbstractConstraint,initialize:function(){c.apply(this,arguments)},isStayConstraint:!0,toString:function(){return"stay:"+b.call(this)}});var d=a.Constraint=a.inherit({"extends":a.AbstractConstraint,initialize:function(b,c,d){a.AbstractConstraint.call(this,c,d),this.expression=b}});a.Inequality=a.inherit({"extends":a.Constraint,_cloneOrNewCle:function(b){return b.clone?b.clone():new a.Expression(b)},initialize:function(b,c,e,f,g){var h=b instanceof a.Expression,i=e instanceof a.Expression,j=b instanceof a.AbstractVariable,k=e instanceof a.AbstractVariable,l="number"==typeof b,m="number"==typeof e;if((h||l)&&k){var n=b,o=c,p=e,q=f,r=g;if(d.call(this,this._cloneOrNewCle(n),q,r),o==a.LEQ)this.expression.multiplyMe(-1),this.expression.addVariable(p);else{if(o!=a.GEQ)throw new a.InternalError("Invalid operator in c.Inequality constructor");this.expression.addVariable(p,-1)}}else if(j&&(i||m)){var n=e,o=c,p=b,q=f,r=g;if(d.call(this,this._cloneOrNewCle(n),q,r),o==a.GEQ)this.expression.multiplyMe(-1),this.expression.addVariable(p);else{if(o!=a.LEQ)throw new a.InternalError("Invalid operator in c.Inequality constructor");this.expression.addVariable(p,-1)}}else{if(h&&m){var s=b,o=c,t=e,q=f,r=g;if(d.call(this,this._cloneOrNewCle(s),q,r),o==a.LEQ)this.expression.multiplyMe(-1),this.expression.addExpression(this._cloneOrNewCle(t));else{if(o!=a.GEQ)throw new a.InternalError("Invalid operator in c.Inequality constructor");this.expression.addExpression(this._cloneOrNewCle(t),-1)}return this}if(l&&i){var s=e,o=c,t=b,q=f,r=g;if(d.call(this,this._cloneOrNewCle(s),q,r),o==a.GEQ)this.expression.multiplyMe(-1),this.expression.addExpression(this._cloneOrNewCle(t));else{if(o!=a.LEQ)throw new a.InternalError("Invalid operator in c.Inequality constructor");this.expression.addExpression(this._cloneOrNewCle(t),-1)}return this}if(h&&i){var s=b,o=c,t=e,q=f,r=g;if(d.call(this,this._cloneOrNewCle(t),q,r),o==a.GEQ)this.expression.multiplyMe(-1),this.expression.addExpression(this._cloneOrNewCle(s));else{if(o!=a.LEQ)throw new a.InternalError("Invalid operator in c.Inequality constructor");this.expression.addExpression(this._cloneOrNewCle(s),-1)}}else{if(h)return d.call(this,b,c,e);if(c==a.GEQ)d.call(this,new a.Expression(e),f,g),this.expression.multiplyMe(-1),this.expression.addVariable(b);else{if(c!=a.LEQ)throw new a.InternalError("Invalid operator in c.Inequality constructor");d.call(this,new a.Expression(e),f,g),this.expression.addVariable(b,-1)}}}},isInequality:!0,toString:function(){return d.prototype.toString.call(this)+" >= 0) id: "+this.hashCode}}),a.Equation=a.inherit({"extends":a.Constraint,initialize:function(b,c,e,f){if(b instanceof a.Expression&&!c||c instanceof a.Strength)d.call(this,b,c,e);else if(b instanceof a.AbstractVariable&&c instanceof a.Expression){var g=b,h=c,i=e,j=f;d.call(this,h.clone(),i,j),this.expression.addVariable(g,-1)}else if(b instanceof a.AbstractVariable&&"number"==typeof c){var g=b,k=c,i=e,j=f;d.call(this,new a.Expression(k),i,j),this.expression.addVariable(g,-1)}else if(b instanceof a.Expression&&c instanceof a.AbstractVariable){var h=b,g=c,i=e,j=f;d.call(this,h.clone(),i,j),this.expression.addVariable(g,-1)}else{if(!(b instanceof a.Expression||b instanceof a.AbstractVariable||"number"==typeof b)||!(c instanceof a.Expression||c instanceof a.AbstractVariable||"number"==typeof c))throw"Bad initializer to c.Equation";b=b instanceof a.Expression?b.clone():new a.Expression(b),c=c instanceof a.Expression?c.clone():new a.Expression(c),d.call(this,b,e,f),this.expression.addExpression(c,-1)}a.assert(this.strength instanceof a.Strength,"_strength not set")},toString:function(){return d.prototype.toString.call(this)+" = 0)"}})}(this.c||module.parent.exports||{}),function(a){"use strict";a.EditInfo=a.inherit({initialize:function(a,b,c,d,e){this.constraint=a,this.editPlus=b,this.editMinus=c,this.prevEditConstant=d,this.index=e},toString:function(){return"<cn="+this.constraint+", ep="+this.editPlus+", em="+this.editMinus+", pec="+this.prevEditConstant+", index="+this.index+">"}})}(this.c||module.parent.exports||{}),function(a){"use strict";a.Tableau=a.inherit({initialize:function(){this.columns=new a.HashTable,this.rows=new a.HashTable,this._infeasibleRows=new a.HashSet,this._externalRows=new a.HashSet,this._externalParametricVars=new a.HashSet},noteRemovedVariable:function(b,c){a.trace&&console.log("c.Tableau::noteRemovedVariable: ",b,c);var d=this.columns.get(b);c&&d&&d.delete(c)},noteAddedVariable:function(a,b){b&&this.insertColVar(a,b)},getInternalInfo:function(){var a="Tableau Information:\n";return a+="Rows: "+this.rows.size,a+=" (= "+(this.rows.size-1)+" constraints)",a+="\nColumns: "+this.columns.size,a+="\nInfeasible Rows: "+this._infeasibleRows.size,a+="\nExternal basic variables: "+this._externalRows.size,a+="\nExternal parametric variables: ",a+=this._externalParametricVars.size,a+="\n"},toString:function(){var a="Tableau:\n";return this.rows.each(function(b,c){a+=b,a+=" <==> ",a+=c,a+="\n"}),a+="\nColumns:\n",a+=this.columns,a+="\nInfeasible rows: ",a+=this._infeasibleRows,a+="External basic variables: ",a+=this._externalRows,a+="External parametric variables: ",a+=this._externalParametricVars},insertColVar:function(b,c){var d=this.columns.get(b);d||(d=new a.HashSet,this.columns.set(b,d)),d.add(c)},addRow:function(b,c){a.trace&&a.fnenterprint("addRow: "+b+", "+c),this.rows.set(b,c),c.terms.each(function(a){this.insertColVar(a,b),a.isExternal&&this._externalParametricVars.add(a)},this),b.isExternal&&this._externalRows.add(b),a.trace&&a.traceprint(""+this)},removeColumn:function(b){a.trace&&a.fnenterprint("removeColumn:"+b);var c=this.columns.get(b);c?(this.columns.delete(b),c.each(function(a){var c=this.rows.get(a);c.terms.delete(b)},this)):a.trace&&console.log("Could not find var",b,"in columns"),b.isExternal&&(this._externalRows.delete(b),this._externalParametricVars.delete(b))},removeRow:function(b){a.trace&&a.fnenterprint("removeRow:"+b);var c=this.rows.get(b);return a.assert(null!=c),c.terms.each(function(c){var e=this.columns.get(c);null!=e&&(a.trace&&console.log("removing from varset:",b),e.delete(b))},this),this._infeasibleRows.delete(b),b.isExternal&&this._externalRows.delete(b),this.rows.delete(b),a.trace&&a.fnexitprint("returning "+c),c},substituteOut:function(b,c){a.trace&&a.fnenterprint("substituteOut:"+b+", "+c),a.trace&&a.traceprint(""+this);var d=this.columns.get(b);d.each(function(a){var d=this.rows.get(a);d.substituteOut(b,c,a,this),a.isRestricted&&0>d.constant&&this._infeasibleRows.add(a)},this),b.isExternal&&(this._externalRows.add(b),this._externalParametricVars.delete(b)),this.columns.delete(b)},columnsHasKey:function(a){return!!this.columns.get(a)}})}(this.c||module.parent.exports||{}),function(a){var b=a.Tableau,c=b.prototype,d=1e-8,e=a.Strength.weak;a.SimplexSolver=a.inherit({"extends":a.Tableau,initialize:function(){a.Tableau.call(this),this._stayMinusErrorVars=[],this._stayPlusErrorVars=[],this._errorVars=new a.HashTable,this._markerVars=new a.HashTable,this._objective=new a.ObjectiveVariable({name:"Z"}),this._editVarMap=new a.HashTable,this._editVarList=[],this._slackCounter=0,this._artificialCounter=0,this._dummyCounter=0,this.autoSolve=!0,this._fNeedsSolving=!1,this._optimizeCount=0,this.rows.set(this._objective,new a.Expression),this._stkCedcns=[0],a.trace&&a.traceprint("objective expr == "+this.rows.get(this._objective))},addLowerBound:function(b,c){var d=new a.Inequality(b,a.GEQ,new a.Expression(c));return this.addConstraint(d)},addUpperBound:function(b,c){var d=new a.Inequality(b,a.LEQ,new a.Expression(c));return this.addConstraint(d)},addBounds:function(a,b,c){return this.addLowerBound(a,b),this.addUpperBound(a,c),this},add:function(){for(var a=0;arguments.length>a;a++)this.addConstraint(arguments[a]);return this},addConstraint:function(b){a.trace&&a.fnenterprint("addConstraint: "+b);var c=Array(2),d=Array(1),e=this.newExpression(b,c,d);if(d=d[0],this.tryAddingDirectly(e)||this.addWithArtificialVariable(e),this._fNeedsSolving=!0,b.isEditConstraint){var f=this._editVarMap.size,g=c[0],h=c[1];!g instanceof a.SlackVariable&&console.warn("cvEplus not a slack variable =",g),!h instanceof a.SlackVariable&&console.warn("cvEminus not a slack variable =",h),a.debug&&console.log("new c.EditInfo("+b+", "+g+", "+h+", "+d+", "+f+")");var i=new a.EditInfo(b,g,h,d,f);this._editVarMap.set(b.variable,i),this._editVarList[f]={v:b.variable,info:i}}return this.autoSolve&&(this.optimize(this._objective),this._setExternalVariables()),this},addConstraintNoException:function(b){a.trace&&a.fnenterprint("addConstraintNoException: "+b);try{return this.addConstraint(b),!0}catch(c){return!1}},addEditVar:function(b,c){return a.trace&&a.fnenterprint("addEditVar: "+b+" @ "+c),this.addConstraint(new a.EditConstraint(b,c||a.Strength.strong))},beginEdit:function(){return a.assert(this._editVarMap.size>0,"_editVarMap.size > 0"),this._infeasibleRows.clear(),this._resetStayConstants(),this._stkCedcns.push(this._editVarMap.size),this},endEdit:function(){return a.assert(this._editVarMap.size>0,"_editVarMap.size > 0"),this.resolve(),this._stkCedcns.pop(),this.removeEditVarsTo(this._stkCedcns[this._stkCedcns.length-1]),this},removeAllEditVars:function(){return this.removeEditVarsTo(0)},removeEditVarsTo:function(b){try{for(var c=this._editVarList.length,d=b;c>d;d++)this._editVarList[d]&&this.removeConstraint(this._editVarMap.get(this._editVarList[d].v).constraint);return this._editVarList.length=b,a.assert(this._editVarMap.size==b,"_editVarMap.size == n"),this}catch(e){throw new a.InternalError("Constraint not found in removeEditVarsTo")}},addPointStays:function(b){return a.trace&&console.log("addPointStays",b),b.forEach(function(a,b){this.addStay(a.x,e,Math.pow(2,b)),this.addStay(a.y,e,Math.pow(2,b))},this),this},addStay:function(b,c,d){var f=new a.StayConstraint(b,c||e,d||1);return this.addConstraint(f)},removeConstraint:function(a){return this.removeConstraintInternal(a),this},removeConstraintInternal:function(b){a.trace&&a.fnenterprint("removeConstraintInternal: "+b),a.trace&&a.traceprint(""+this),this._fNeedsSolving=!0,this._resetStayConstants();var c=this.rows.get(this._objective),d=this._errorVars.get(b);a.trace&&a.traceprint("eVars == "+d),null!=d&&d.each(function(e){var f=this.rows.get(e);null==f?c.addVariable(e,-b.weight*b.strength.symbolicWeight.value,this._objective,this):c.addExpression(f,-b.weight*b.strength.symbolicWeight.value,this._objective,this),a.trace&&a.traceprint("now eVars == "+d)},this);var e=this._markerVars.get(b);if(this._markerVars.delete(b),null==e)throw new a.InternalError("Constraint not found in removeConstraintInternal");if(a.trace&&a.traceprint("Looking to remove var "+e),null==this.rows.get(e)){var f=this.columns.get(e);a.trace&&a.traceprint("Must pivot -- columns are "+f);var g=null,h=0;f.each(function(b){if(b.isRestricted){var c=this.rows.get(b),d=c.coefficientFor(e);if(a.trace&&a.traceprint("Marker "+e+"'s coefficient in "+c+" is "+d),0>d){var f=-c.constant/d;(null==g||h>f||a.approx(f,h)&&b.hashCode<g.hashCode)&&(h=f,g=b)}}},this),null==g&&(a.trace&&a.traceprint("exitVar is still null"),f.each(function(a){if(a.isRestricted){var b=this.rows.get(a),c=b.coefficientFor(e),d=b.constant/c;(null==g||h>d)&&(h=d,g=a)}},this)),null==g&&(0==f.size?this.removeColumn(e):f.escapingEach(function(a){return a!=this._objective?(g=a,{brk:!0}):void 0},this)),null!=g&&this.pivot(e,g)}if(null!=this.rows.get(e)&&this.removeRow(e),null!=d&&d.each(function(a){a!=e&&this.removeColumn(a)},this),b.isStayConstraint){if(null!=d)for(var j=0;this._stayPlusErrorVars.length>j;j++)d.delete(this._stayPlusErrorVars[j]),d.delete(this._stayMinusErrorVars[j])}else if(b.isEditConstraint){a.assert(null!=d,"eVars != null");var k=this._editVarMap.get(b.variable);this.removeColumn(k.editMinus),this._editVarMap.delete(b.variable)}return null!=d&&this._errorVars.delete(d),this.autoSolve&&(this.optimize(this._objective),this._setExternalVariables()),this},reset:function(){throw a.trace&&a.fnenterprint("reset"),new a.InternalError("reset not implemented")},resolveArray:function(b){a.trace&&a.fnenterprint("resolveArray"+b);var c=b.length;this._editVarMap.each(function(a,d){var e=d.index;c>e&&this.suggestValue(a,b[e])},this),this.resolve()},resolvePair:function(a,b){this.suggestValue(this._editVarList[0].v,a),this.suggestValue(this._editVarList[1].v,b),this.resolve()},resolve:function(){a.trace&&a.fnenterprint("resolve()"),this.dualOptimize(),this._setExternalVariables(),this._infeasibleRows.clear(),this._resetStayConstants()},suggestValue:function(b,c){a.trace&&console.log("suggestValue("+b+", "+c+")");var d=this._editVarMap.get(b);if(!d)throw new a.Error("suggestValue for variable "+b+", but var is not an edit variable");var e=c-d.prevEditConstant;return d.prevEditConstant=c,this.deltaEditConstant(e,d.editPlus,d.editMinus),this},solve:function(){return this._fNeedsSolving&&(this.optimize(this._objective),this._setExternalVariables()),this},setEditedValue:function(b,c){if(!this.columnsHasKey(b)&&null==this.rows.get(b))return b.value=c,this;if(!a.approx(c,b.value)){this.addEditVar(b),this.beginEdit();try{this.suggestValue(b,c)}catch(d){throw new a.InternalError("Error in setEditedValue")}this.endEdit()}return this},addVar:function(b){if(!this.columnsHasKey(b)&&null==this.rows.get(b)){try{this.addStay(b)}catch(c){throw new a.InternalError("Error in addVar -- required failure is impossible")}a.trace&&a.traceprint("added initial stay on "+b)}return this},getInternalInfo:function(){var a=c.getInternalInfo.call(this);return a+="\nSolver info:\n",a+="Stay Error Variables: ",a+=this._stayPlusErrorVars.length+this._stayMinusErrorVars.length,a+=" ("+this._stayPlusErrorVars.length+" +, ",a+=this._stayMinusErrorVars.length+" -)\n",a+="Edit Variables: "+this._editVarMap.size,a+="\n"},getDebugInfo:function(){return""+this+this.getInternalInfo()+"\n"},toString:function(){var a=c.getInternalInfo.call(this);return a+="\n_stayPlusErrorVars: ",a+="["+this._stayPlusErrorVars+"]",a+="\n_stayMinusErrorVars: ",a+="["+this._stayMinusErrorVars+"]",a+="\n",a+="_editVarMap:\n"+this._editVarMap,a+="\n"},getConstraintMap:function(){return this._markerVars},addWithArtificialVariable:function(b){a.trace&&a.fnenterprint("addWithArtificialVariable: "+b);var c=new a.SlackVariable({value:++this._artificialCounter,prefix:"a"}),d=new a.ObjectiveVariable({name:"az"}),e=b.clone();a.trace&&a.traceprint("before addRows:\n"+this),this.addRow(d,e),this.addRow(c,b),a.trace&&a.traceprint("after addRows:\n"+this),this.optimize(d);var f=this.rows.get(d);if(a.trace&&a.traceprint("azTableauRow.constant == "+f.constant),!a.approx(f.constant,0))throw this.removeRow(d),this.removeColumn(c),new a.RequiredFailure;var g=this.rows.get(c);if(null!=g){if(g.isConstant)return this.removeRow(c),this.removeRow(d),void 0;var h=g.anyPivotableVariable();this.pivot(h,c)}a.assert(null==this.rows.get(c),"rowExpression(av) == null"),this.removeColumn(c),this.removeRow(d)},tryAddingDirectly:function(b){a.trace&&a.fnenterprint("tryAddingDirectly: "+b);var c=this.chooseSubject(b);return null==c?(a.trace&&a.fnexitprint("returning false"),!1):(b.newSubject(c),this.columnsHasKey(c)&&this.substituteOut(c,b),this.addRow(c,b),a.trace&&a.fnexitprint("returning true"),!0)},chooseSubject:function(b){a.trace&&a.fnenterprint("chooseSubject: "+b);var c=null,d=!1,e=!1,f=b.terms,g=f.escapingEach(function(a,b){if(d){if(!a.isRestricted&&!this.columnsHasKey(a))return{retval:a}}else if(a.isRestricted){if(!e&&!a.isDummy&&0>b){var f=this.columns.get(a);(null==f||1==f.size&&this.columnsHasKey(this._objective))&&(c=a,e=!0)}}else c=a,d=!0},this);if(g&&void 0!==g.retval)return g.retval;if(null!=c)return c;var h=0,g=f.escapingEach(function(a,b){return a.isDummy?(this.columnsHasKey(a)||(c=a,h=b),void 0):{retval:null}},this);if(g&&void 0!==g.retval)return g.retval;if(!a.approx(b.constant,0))throw new a.RequiredFailure;return h>0&&b.multiplyMe(-1),c},deltaEditConstant:function(b,c,d){a.trace&&a.fnenterprint("deltaEditConstant :"+b+", "+c+", "+d);var e=this.rows.get(c);if(null!=e)return e.constant+=b,0>e.constant&&this._infeasibleRows.add(c),void 0;var f=this.rows.get(d);if(null!=f)return f.constant+=-b,0>f.constant&&this._infeasibleRows.add(d),void 0;var g=this.columns.get(d);g||console.log("columnVars is null -- tableau is:\n"+this),g.each(function(a){var c=this.rows.get(a),e=c.coefficientFor(d);c.constant+=e*b,a.isRestricted&&0>c.constant&&this._infeasibleRows.add(a)},this)},dualOptimize:function(){a.trace&&a.fnenterprint("dualOptimize:");for(var b=this.rows.get(this._objective);this._infeasibleRows.size;){var c=this._infeasibleRows.values()[0];this._infeasibleRows.delete(c);var d=null,e=this.rows.get(c);if(e&&0>e.constant){var g,f=Number.MAX_VALUE,h=e.terms;if(h.each(function(c,e){if(e>0&&c.isPivotable){var h=b.coefficientFor(c);g=h/e,(f>g||a.approx(g,f)&&c.hashCode<d.hashCode)&&(d=c,f=g)}}),f==Number.MAX_VALUE)throw new a.InternalError("ratio == nil (MAX_VALUE) in dualOptimize");this.pivot(d,c)}}},newExpression:function(b,c,d){a.trace&&(a.fnenterprint("newExpression: "+b),a.traceprint("cn.isInequality == "+b.isInequality),a.traceprint("cn.required == "+b.required));var e=b.expression,f=new a.Expression(e.constant),g=new a.SlackVariable,h=new a.DummyVariable,i=new a.SlackVariable,j=new a.SlackVariable,k=e.terms;if(k.each(function(a,b){var c=this.rows.get(a);c?f.addExpression(c,b):f.addVariable(a,b)},this),b.isInequality){if(a.trace&&a.traceprint("Inequality, adding slack"),++this._slackCounter,g=new a.SlackVariable({value:this._slackCounter,prefix:"s"}),f.setVariable(g,-1),this._markerVars.set(b,g),!b.required){++this._slackCounter,i=new a.SlackVariable({value:this._slackCounter,prefix:"em"}),f.setVariable(i,1);
var l=this.rows.get(this._objective);l.setVariable(i,b.strength.symbolicWeight.value*b.weight),this.insertErrorVar(b,i),this.noteAddedVariable(i,this._objective)}}else if(b.required)a.trace&&a.traceprint("Equality, required"),++this._dummyCounter,h=new a.DummyVariable({value:this._dummyCounter,prefix:"d"}),f.setVariable(h,1),this._markerVars.set(b,h),a.trace&&a.traceprint("Adding dummyVar == d"+this._dummyCounter);else{a.trace&&a.traceprint("Equality, not required"),++this._slackCounter,j=new a.SlackVariable({value:this._slackCounter,prefix:"ep"}),i=new a.SlackVariable({value:this._slackCounter,prefix:"em"}),f.setVariable(j,-1),f.setVariable(i,1),this._markerVars.set(b,j);var l=this.rows.get(this._objective);a.trace&&console.log(l);var m=b.strength.symbolicWeight.value*b.weight;0==m&&(a.trace&&a.traceprint("cn == "+b),a.trace&&a.traceprint("adding "+j+" and "+i+" with swCoeff == "+m)),l.setVariable(j,m),this.noteAddedVariable(j,this._objective),l.setVariable(i,m),this.noteAddedVariable(i,this._objective),this.insertErrorVar(b,i),this.insertErrorVar(b,j),b.isStayConstraint?(this._stayPlusErrorVars.push(j),this._stayMinusErrorVars.push(i)):b.isEditConstraint&&(c[0]=j,c[1]=i,d[0]=e.constant)}return 0>f.constant&&f.multiplyMe(-1),a.trace&&a.fnexitprint("returning "+f),f},optimize:function(b){a.trace&&a.fnenterprint("optimize: "+b),a.trace&&a.traceprint(""+this),this._optimizeCount++;var c=this.rows.get(b);a.assert(null!=c,"zRow != null");for(var g,h,e=null,f=null;;){if(g=0,h=c.terms,h.escapingEach(function(a,b){return a.isPivotable&&g>b?(g=b,e=a,{brk:1}):void 0},this),g>=-d)return;a.trace&&console.log("entryVar:",e,"objectiveCoeff:",g);var i=Number.MAX_VALUE,j=this.columns.get(e),k=0;if(j.each(function(b){if(a.trace&&a.traceprint("Checking "+b),b.isPivotable){var c=this.rows.get(b),d=c.coefficientFor(e);a.trace&&a.traceprint("pivotable, coeff = "+d),0>d&&(k=-c.constant/d,(i>k||a.approx(k,i)&&b.hashCode<f.hashCode)&&(i=k,f=b))}},this),i==Number.MAX_VALUE)throw new a.InternalError("Objective function is unbounded in optimize");this.pivot(e,f),a.trace&&a.traceprint(""+this)}},pivot:function(b,c){a.trace&&console.log("pivot: ",b,c);var d=!1;d&&console.time(" SimplexSolver::pivot"),null==b&&console.warn("pivot: entryVar == null"),null==c&&console.warn("pivot: exitVar == null"),d&&console.time("  removeRow");var e=this.removeRow(c);d&&console.timeEnd("  removeRow"),d&&console.time("  changeSubject"),e.changeSubject(c,b),d&&console.timeEnd("  changeSubject"),d&&console.time("  substituteOut"),this.substituteOut(b,e),d&&console.timeEnd("  substituteOut"),d&&console.time("  addRow"),this.addRow(b,e),d&&console.timeEnd("  addRow"),d&&console.timeEnd(" SimplexSolver::pivot")},_resetStayConstants:function(){a.trace&&console.log("_resetStayConstants");for(var b=0;this._stayPlusErrorVars.length>b;b++){var c=this.rows.get(this._stayPlusErrorVars[b]);null==c&&(c=this.rows.get(this._stayMinusErrorVars[b])),null!=c&&(c.constant=0)}},_setExternalVariables:function(){a.trace&&a.fnenterprint("_setExternalVariables:"),a.trace&&a.traceprint(""+this),this._externalParametricVars.each(function(b){null!=this.rows.get(b)?a.trace&&console.log("Error: variable"+b+" in _externalParametricVars is basic"):b.value=0},this),this._externalRows.each(function(a){var b=this.rows.get(a);a.value!=b.constant&&(a.value=b.constant)},this),this._fNeedsSolving=!1,this.onsolved()},onsolved:function(){},insertErrorVar:function(b,c){a.trace&&a.fnenterprint("insertErrorVar:"+b+", "+c);var d=this._errorVars.get(c);d||(d=new a.HashSet,this._errorVars.set(b,d)),d.add(c)}})}(this.c||module.parent.exports||{}),function(a){"use strict";a.Timer=a.inherit({initialize:function(){this.isRunning=!1,this._elapsedMs=0},start:function(){return this.isRunning=!0,this._startReading=new Date,this},stop:function(){return this.isRunning=!1,this._elapsedMs+=new Date-this._startReading,this},reset:function(){return this.isRunning=!1,this._elapsedMs=0,this},elapsedTime:function(){return this.isRunning?(this._elapsedMs+(new Date-this._startReading))/1e3:this._elapsedMs/1e3}})}(this.c||module.parent.exports||{}),__cassowary_parser=function(){function a(a){return'"'+a.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\x08/g,"\\b").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\f/g,"\\f").replace(/\r/g,"\\r").replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g,escape)+'"'}var b={parse:function(b,c){function k(a){g>e||(e>g&&(g=e,h=[]),h.push(a))}function l(){var a,b,c,d,f;if(d=e,f=e,a=z(),null!==a){if(c=m(),null!==c)for(b=[];null!==c;)b.push(c),c=m();else b=null;null!==b?(c=z(),null!==c?a=[a,b,c]:(a=null,e=f)):(a=null,e=f)}else a=null,e=f;return null!==a&&(a=function(a,b){return b}(d,a[1])),null===a&&(e=d),a}function m(){var a,b,c,d;return c=e,d=e,a=P(),null!==a?(b=s(),null!==b?a=[a,b]:(a=null,e=d)):(a=null,e=d),null!==a&&(a=function(a,b){return b}(c,a[0])),null===a&&(e=c),a}function n(){var a;return b.length>e?(a=b.charAt(e),e++):(a=null,0===f&&k("any character")),a}function o(){var a;return/^[a-zA-Z]/.test(b.charAt(e))?(a=b.charAt(e),e++):(a=null,0===f&&k("[a-zA-Z]")),null===a&&(36===b.charCodeAt(e)?(a="$",e++):(a=null,0===f&&k('"$"')),null===a&&(95===b.charCodeAt(e)?(a="_",e++):(a=null,0===f&&k('"_"')))),a}function p(){var a;return f++,/^[\t\x0B\f \xA0\uFEFF]/.test(b.charAt(e))?(a=b.charAt(e),e++):(a=null,0===f&&k("[\\t\\x0B\\f \\xA0\\uFEFF]")),f--,0===f&&null===a&&k("whitespace"),a}function q(){var a;return/^[\n\r\u2028\u2029]/.test(b.charAt(e))?(a=b.charAt(e),e++):(a=null,0===f&&k("[\\n\\r\\u2028\\u2029]")),a}function r(){var a;return f++,10===b.charCodeAt(e)?(a="\n",e++):(a=null,0===f&&k('"\\n"')),null===a&&("\r\n"===b.substr(e,2)?(a="\r\n",e+=2):(a=null,0===f&&k('"\\r\\n"')),null===a&&(13===b.charCodeAt(e)?(a="\r",e++):(a=null,0===f&&k('"\\r"')),null===a&&(8232===b.charCodeAt(e)?(a="\u2028",e++):(a=null,0===f&&k('"\\u2028"')),null===a&&(8233===b.charCodeAt(e)?(a="\u2029",e++):(a=null,0===f&&k('"\\u2029"')))))),f--,0===f&&null===a&&k("end of line"),a}function s(){var a,c,d;return d=e,a=z(),null!==a?(59===b.charCodeAt(e)?(c=";",e++):(c=null,0===f&&k('";"')),null!==c?a=[a,c]:(a=null,e=d)):(a=null,e=d),null===a&&(d=e,a=y(),null!==a?(c=r(),null!==c?a=[a,c]:(a=null,e=d)):(a=null,e=d),null===a&&(d=e,a=z(),null!==a?(c=t(),null!==c?a=[a,c]:(a=null,e=d)):(a=null,e=d))),a}function t(){var a,c;return c=e,f++,b.length>e?(a=b.charAt(e),e++):(a=null,0===f&&k("any character")),f--,null===a?a="":(a=null,e=c),a}function u(){var a;return f++,a=v(),null===a&&(a=x()),f--,0===f&&null===a&&k("comment"),a}function v(){var a,c,d,g,h,i,j;if(h=e,"/*"===b.substr(e,2)?(a="/*",e+=2):(a=null,0===f&&k('"/*"')),null!==a){for(c=[],i=e,j=e,f++,"*/"===b.substr(e,2)?(d="*/",e+=2):(d=null,0===f&&k('"*/"')),f--,null===d?d="":(d=null,e=j),null!==d?(g=n(),null!==g?d=[d,g]:(d=null,e=i)):(d=null,e=i);null!==d;)c.push(d),i=e,j=e,f++,"*/"===b.substr(e,2)?(d="*/",e+=2):(d=null,0===f&&k('"*/"')),f--,null===d?d="":(d=null,e=j),null!==d?(g=n(),null!==g?d=[d,g]:(d=null,e=i)):(d=null,e=i);null!==c?("*/"===b.substr(e,2)?(d="*/",e+=2):(d=null,0===f&&k('"*/"')),null!==d?a=[a,c,d]:(a=null,e=h)):(a=null,e=h)}else a=null,e=h;return a}function w(){var a,c,d,g,h,i,j;if(h=e,"/*"===b.substr(e,2)?(a="/*",e+=2):(a=null,0===f&&k('"/*"')),null!==a){for(c=[],i=e,j=e,f++,"*/"===b.substr(e,2)?(d="*/",e+=2):(d=null,0===f&&k('"*/"')),null===d&&(d=q()),f--,null===d?d="":(d=null,e=j),null!==d?(g=n(),null!==g?d=[d,g]:(d=null,e=i)):(d=null,e=i);null!==d;)c.push(d),i=e,j=e,f++,"*/"===b.substr(e,2)?(d="*/",e+=2):(d=null,0===f&&k('"*/"')),null===d&&(d=q()),f--,null===d?d="":(d=null,e=j),null!==d?(g=n(),null!==g?d=[d,g]:(d=null,e=i)):(d=null,e=i);null!==c?("*/"===b.substr(e,2)?(d="*/",e+=2):(d=null,0===f&&k('"*/"')),null!==d?a=[a,c,d]:(a=null,e=h)):(a=null,e=h)}else a=null,e=h;return a}function x(){var a,c,d,g,h,i,j;if(h=e,"//"===b.substr(e,2)?(a="//",e+=2):(a=null,0===f&&k('"//"')),null!==a){for(c=[],i=e,j=e,f++,d=q(),f--,null===d?d="":(d=null,e=j),null!==d?(g=n(),null!==g?d=[d,g]:(d=null,e=i)):(d=null,e=i);null!==d;)c.push(d),i=e,j=e,f++,d=q(),f--,null===d?d="":(d=null,e=j),null!==d?(g=n(),null!==g?d=[d,g]:(d=null,e=i)):(d=null,e=i);null!==c?a=[a,c]:(a=null,e=h)}else a=null,e=h;return a}function y(){var a,b;for(a=[],b=p(),null===b&&(b=w(),null===b&&(b=x()));null!==b;)a.push(b),b=p(),null===b&&(b=w(),null===b&&(b=x()));return a}function z(){var a,b;for(a=[],b=p(),null===b&&(b=r(),null===b&&(b=u()));null!==b;)a.push(b),b=p(),null===b&&(b=r(),null===b&&(b=u()));return a}function A(){var a,b;return b=e,a=C(),null===a&&(a=B()),null!==a&&(a=function(a,b){return{type:"NumericLiteral",value:b}}(b,a)),null===a&&(e=b),a}function B(){var a,c,d;if(d=e,/^[0-9]/.test(b.charAt(e))?(c=b.charAt(e),e++):(c=null,0===f&&k("[0-9]")),null!==c)for(a=[];null!==c;)a.push(c),/^[0-9]/.test(b.charAt(e))?(c=b.charAt(e),e++):(c=null,0===f&&k("[0-9]"));else a=null;return null!==a&&(a=function(a,b){return parseInt(b.join(""))}(d,a)),null===a&&(e=d),a}function C(){var a,c,d,g,h;return g=e,h=e,a=B(),null!==a?(46===b.charCodeAt(e)?(c=".",e++):(c=null,0===f&&k('"."')),null!==c?(d=B(),null!==d?a=[a,c,d]:(a=null,e=h)):(a=null,e=h)):(a=null,e=h),null!==a&&(a=function(a,b){return parseFloat(b.join(""))}(g,a)),null===a&&(e=g),a}function D(){var a,c,d,g;if(g=e,/^[\-+]/.test(b.charAt(e))?(a=b.charAt(e),e++):(a=null,0===f&&k("[\\-+]")),a=null!==a?a:"",null!==a){if(/^[0-9]/.test(b.charAt(e))?(d=b.charAt(e),e++):(d=null,0===f&&k("[0-9]")),null!==d)for(c=[];null!==d;)c.push(d),/^[0-9]/.test(b.charAt(e))?(d=b.charAt(e),e++):(d=null,0===f&&k("[0-9]"));else c=null;null!==c?a=[a,c]:(a=null,e=g)}else a=null,e=g;return a}function E(){var a,b;return f++,b=e,a=F(),null!==a&&(a=function(a,b){return b}(b,a)),null===a&&(e=b),f--,0===f&&null===a&&k("identifier"),a}function F(){var a,b,c,d,g;if(f++,d=e,g=e,a=o(),null!==a){for(b=[],c=o();null!==c;)b.push(c),c=o();null!==b?a=[a,b]:(a=null,e=g)}else a=null,e=g;return null!==a&&(a=function(a,b,c){return b+c.join("")}(d,a[0],a[1])),null===a&&(e=d),f--,0===f&&null===a&&k("identifier"),a}function G(){var a,c,d,g,h,i,j;return i=e,a=E(),null!==a&&(a=function(a,b){return{type:"Variable",name:b}}(i,a)),null===a&&(e=i),null===a&&(a=A(),null===a&&(i=e,j=e,40===b.charCodeAt(e)?(a="(",e++):(a=null,0===f&&k('"("')),null!==a?(c=z(),null!==c?(d=P(),null!==d?(g=z(),null!==g?(41===b.charCodeAt(e)?(h=")",e++):(h=null,0===f&&k('")"')),null!==h?a=[a,c,d,g,h]:(a=null,e=j)):(a=null,e=j)):(a=null,e=j)):(a=null,e=j)):(a=null,e=j),null!==a&&(a=function(a,b){return b}(i,a[2])),null===a&&(e=i))),a}function H(){var a,b,c,d,f;return a=G(),null===a&&(d=e,f=e,a=I(),null!==a?(b=z(),null!==b?(c=H(),null!==c?a=[a,b,c]:(a=null,e=f)):(a=null,e=f)):(a=null,e=f),null!==a&&(a=function(a,b,c){return{type:"UnaryExpression",operator:b,expression:c}}(d,a[0],a[2])),null===a&&(e=d)),a}function I(){var a;return 43===b.charCodeAt(e)?(a="+",e++):(a=null,0===f&&k('"+"')),null===a&&(45===b.charCodeAt(e)?(a="-",e++):(a=null,0===f&&k('"-"')),null===a&&(33===b.charCodeAt(e)?(a="!",e++):(a=null,0===f&&k('"!"')))),a}function J(){var a,b,c,d,f,g,h,i,j;if(h=e,i=e,a=H(),null!==a){for(b=[],j=e,c=z(),null!==c?(d=K(),null!==d?(f=z(),null!==f?(g=H(),null!==g?c=[c,d,f,g]:(c=null,e=j)):(c=null,e=j)):(c=null,e=j)):(c=null,e=j);null!==c;)b.push(c),j=e,c=z(),null!==c?(d=K(),null!==d?(f=z(),null!==f?(g=H(),null!==g?c=[c,d,f,g]:(c=null,e=j)):(c=null,e=j)):(c=null,e=j)):(c=null,e=j);null!==b?a=[a,b]:(a=null,e=i)}else a=null,e=i;return null!==a&&(a=function(a,b,c){for(var d=b,e=0;c.length>e;e++)d={type:"MultiplicativeExpression",operator:c[e][1],left:d,right:c[e][3]};return d}(h,a[0],a[1])),null===a&&(e=h),a}function K(){var a;return 42===b.charCodeAt(e)?(a="*",e++):(a=null,0===f&&k('"*"')),null===a&&(47===b.charCodeAt(e)?(a="/",e++):(a=null,0===f&&k('"/"'))),a}function L(){var a,b,c,d,f,g,h,i,j;if(h=e,i=e,a=J(),null!==a){for(b=[],j=e,c=z(),null!==c?(d=M(),null!==d?(f=z(),null!==f?(g=J(),null!==g?c=[c,d,f,g]:(c=null,e=j)):(c=null,e=j)):(c=null,e=j)):(c=null,e=j);null!==c;)b.push(c),j=e,c=z(),null!==c?(d=M(),null!==d?(f=z(),null!==f?(g=J(),null!==g?c=[c,d,f,g]:(c=null,e=j)):(c=null,e=j)):(c=null,e=j)):(c=null,e=j);null!==b?a=[a,b]:(a=null,e=i)}else a=null,e=i;return null!==a&&(a=function(a,b,c){for(var d=b,e=0;c.length>e;e++)d={type:"AdditiveExpression",operator:c[e][1],left:d,right:c[e][3]};return d}(h,a[0],a[1])),null===a&&(e=h),a}function M(){var a;return 43===b.charCodeAt(e)?(a="+",e++):(a=null,0===f&&k('"+"')),null===a&&(45===b.charCodeAt(e)?(a="-",e++):(a=null,0===f&&k('"-"'))),a}function N(){var a,b,c,d,f,g,h,i,j;if(h=e,i=e,a=L(),null!==a){for(b=[],j=e,c=z(),null!==c?(d=O(),null!==d?(f=z(),null!==f?(g=L(),null!==g?c=[c,d,f,g]:(c=null,e=j)):(c=null,e=j)):(c=null,e=j)):(c=null,e=j);null!==c;)b.push(c),j=e,c=z(),null!==c?(d=O(),null!==d?(f=z(),null!==f?(g=L(),null!==g?c=[c,d,f,g]:(c=null,e=j)):(c=null,e=j)):(c=null,e=j)):(c=null,e=j);null!==b?a=[a,b]:(a=null,e=i)}else a=null,e=i;return null!==a&&(a=function(a,b,c){for(var d=b,e=0;c.length>e;e++)d={type:"Inequality",operator:c[e][1],left:d,right:c[e][3]};return d}(h,a[0],a[1])),null===a&&(e=h),a}function O(){var a;return"<="===b.substr(e,2)?(a="<=",e+=2):(a=null,0===f&&k('"<="')),null===a&&(">="===b.substr(e,2)?(a=">=",e+=2):(a=null,0===f&&k('">="')),null===a&&(60===b.charCodeAt(e)?(a="<",e++):(a=null,0===f&&k('"<"')),null===a&&(62===b.charCodeAt(e)?(a=">",e++):(a=null,0===f&&k('">"'))))),a}function P(){var a,c,d,g,h,i,j,l,m;if(j=e,l=e,a=N(),null!==a){for(c=[],m=e,d=z(),null!==d?("=="===b.substr(e,2)?(g="==",e+=2):(g=null,0===f&&k('"=="')),null!==g?(h=z(),null!==h?(i=N(),null!==i?d=[d,g,h,i]:(d=null,e=m)):(d=null,e=m)):(d=null,e=m)):(d=null,e=m);null!==d;)c.push(d),m=e,d=z(),null!==d?("=="===b.substr(e,2)?(g="==",e+=2):(g=null,0===f&&k('"=="')),null!==g?(h=z(),null!==h?(i=N(),null!==i?d=[d,g,h,i]:(d=null,e=m)):(d=null,e=m)):(d=null,e=m)):(d=null,e=m);null!==c?a=[a,c]:(a=null,e=l)}else a=null,e=l;return null!==a&&(a=function(a,b,c){for(var d=b,e=0;c.length>e;e++)d={type:"Equality",operator:c[e][1],left:d,right:c[e][3]};return d}(j,a[0],a[1])),null===a&&(e=j),a}function Q(a){a.sort();for(var b=null,c=[],d=0;a.length>d;d++)a[d]!==b&&(c.push(a[d]),b=a[d]);return c}function R(){for(var a=1,c=1,d=!1,f=0;Math.max(e,g)>f;f++){var h=b.charAt(f);"\n"===h?(d||a++,c=1,d=!1):"\r"===h||"\u2028"===h||"\u2029"===h?(a++,c=1,d=!0):(c++,d=!1)}return{line:a,column:c}}var d={start:l,Statement:m,SourceCharacter:n,IdentifierStart:o,WhiteSpace:p,LineTerminator:q,LineTerminatorSequence:r,EOS:s,EOF:t,Comment:u,MultiLineComment:v,MultiLineCommentNoLineTerminator:w,SingleLineComment:x,_:y,__:z,Literal:A,Integer:B,Real:C,SignedInteger:D,Identifier:E,IdentifierName:F,PrimaryExpression:G,UnaryExpression:H,UnaryOperator:I,MultiplicativeExpression:J,MultiplicativeOperator:K,AdditiveExpression:L,AdditiveOperator:M,InequalityExpression:N,InequalityOperator:O,LinearExpression:P};if(void 0!==c){if(void 0===d[c])throw Error("Invalid rule name: "+a(c)+".")}else c="start";var e=0,f=0,g=0,h=[],S=d[c]();if(null===S||e!==b.length){var T=Math.max(e,g),U=b.length>T?b.charAt(T):null,V=R();throw new this.SyntaxError(Q(h),U,T,V.line,V.column)}return S},toSource:function(){return this._source}};return b.SyntaxError=function(b,c,d,e,f){function g(b,c){var d,e;switch(b.length){case 0:d="end of input";break;case 1:d=b[0];break;default:d=b.slice(0,b.length-1).join(", ")+" or "+b[b.length-1]}return e=c?a(c):"end of input","Expected "+d+" but "+e+" found."}this.name="SyntaxError",this.expected=b,this.found=c,this.message=g(b,c),this.offset=d,this.line=e,this.column=f},b.SyntaxError.prototype=Error.prototype,b}();
}).call(
  ( true) ?
      (module.compiled = true && module) : this
);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(94)(module)))

/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const ReactModal = __webpack_require__(37);
const Button_1 = __webpack_require__(21);
const Icons_1 = __webpack_require__(20);
const Widgets_1 = __webpack_require__(25);
class ShareDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let urlPrefix = `${location.protocol}//${location.host}${location.pathname}`;
        // let embedCode = `<iframe src="${urlPrefix}?embed&f=${this.props.fiddle}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`;
        return React.createElement(ReactModal, { isOpen: this.props.isOpen, contentLabel: "Share Project", className: "modal", overlayClassName: "overlay", ariaHideApp: false },
            React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
                React.createElement("div", { className: "modal-title-bar" }, "Share Project"),
                React.createElement("div", { style: { flex: 1, padding: "8px" } },
                    React.createElement(Widgets_1.TextInputBox, { label: "URL", value: `${urlPrefix}?f=${this.props.fiddle}` }),
                    React.createElement(Widgets_1.TextInputBox, { label: "IFrame", value: `<iframe src="${urlPrefix}?embed&f=${this.props.fiddle}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>` })),
                React.createElement("div", null,
                    React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoX, null), label: "Cancel", title: "Cancel", onClick: () => {
                            this.props.onCancel();
                        } }))));
    }
}
exports.ShareDialog = ShareDialog;


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const service_1 = __webpack_require__(13);
const ReactModal = __webpack_require__(37);
const Button_1 = __webpack_require__(21);
const Icons_1 = __webpack_require__(20);
const Widgets_1 = __webpack_require__(25);
class NewProjectDialog extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeName = (event) => {
            this.setState({ name: event.target.value });
        };
        this.state = {
            template: null,
            description: "",
            name: "",
            templates: []
        };
    }
    nameError() {
        // let directory = this.props.directory;
        // if (this.state.name) {
        //   if (!/^[a-z0-9\.\-\_]+$/i.test(this.state.name)) {
        //     return "Illegal characters in file name.";
        //   } else if (!this.state.name.endsWith(extensionForFileType(this.state.fileType))) {
        //     return nameForFileType(this.state.fileType) + " file extension is missing.";
        //   } else if (directory && directory.getImmediateChild(this.state.name)) {
        //     return `File '${this.state.name}' already exists.`;
        //   }
        // }
        // return "";
    }
    // fileName() {
    //   let name = this.state.name;
    //   let extension = extensionForFileType(this.state.template);
    //   if (!name.endsWith("." + extension)) {
    //     name += "." + extension;
    //   }
    //   return name;
    // }
    createButtonLabel() {
        return "Create";
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch("templates/templates.js");
            const js = yield response.text();
            let templates = eval(js);
            this.setState({ templates });
            this.setTemplate(templates[0]);
        });
    }
    setTemplate(template) {
        return __awaiter(this, void 0, void 0, function* () {
            const description = yield service_1.Service.compileMarkdownToHtml(template.description);
            this.setState({ template, description });
        });
    }
    render() {
        return React.createElement(ReactModal, { isOpen: this.props.isOpen, contentLabel: "Create New Project", className: "modal", overlayClassName: "overlay", ariaHideApp: false },
            React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
                React.createElement("div", { className: "modal-title-bar" }, "Create New Project"),
                React.createElement("div", null,
                    React.createElement("div", { style: { display: "flex" } },
                        React.createElement("div", { style: { width: 200 } },
                            React.createElement(Widgets_1.ListBox, { value: this.state.template, height: 240, onSelect: (template) => {
                                    this.setTemplate(template);
                                } }, this.state.templates.map((template) => {
                                return React.createElement(Widgets_1.ListItem, { value: template, label: template.name, icon: React.createElement(Icons_1.Icon, { src: template.icon }) });
                            }))),
                        React.createElement("div", { style: { flex: 1 }, className: "new-project-dialog-description" },
                            React.createElement("div", { className: "md", dangerouslySetInnerHTML: { __html: this.state.description } })))),
                React.createElement("div", { style: { flex: 1, padding: "8px" } }),
                React.createElement("div", null,
                    React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoX, null), label: "Cancel", title: "Cancel", onClick: () => {
                            this.props.onCancel();
                        } }),
                    React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoFile, null), label: this.createButtonLabel(), title: "Cancel", isDisabled: !this.state.template, onClick: () => {
                            // let file = new File(this.fileName(), this.state.template);
                            this.props.onCreate && this.props.onCreate(this.state.template);
                        } }))));
    }
}
exports.NewProjectDialog = NewProjectDialog;


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = {
    BuildFileMissing: "Build File (build.ts / build.js) is missing."
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const Split_1 = __webpack_require__(10);
const Editor_1 = __webpack_require__(18);
const Sandbox_1 = __webpack_require__(75);
const Tabs_1 = __webpack_require__(19);
const Icons_1 = __webpack_require__(20);
const Button_1 = __webpack_require__(21);
const EditorPane_1 = __webpack_require__(36);
const model_1 = __webpack_require__(2);
const model_2 = __webpack_require__(2);
const Problems_1 = __webpack_require__(99);
class ControlCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: "problems",
            splits: [
                { min: 128, value: 512 },
                { min: 128, value: 256 }
            ]
        };
        this.outputView = new EditorPane_1.View(new model_2.File("output", model_1.FileType.Log), null);
    }
    setOutputViewEditor(editor) {
        this.outputViewEditor = editor;
    }
    setSandbox(sandbox) {
        this.sandbox = sandbox;
    }
    logLn(message, kind = "") {
        if (!this.outputViewEditor) {
            return;
        }
        message = message + "\n";
        if (kind) {
            message = "[" + kind + "]: " + message;
        }
        let model = this.outputView.file.buffer;
        let lineCount = model.getLineCount();
        let lastLineLength = model.getLineMaxColumn(lineCount);
        let range = new monaco.Range(lineCount, lastLineLength, lineCount, lastLineLength);
        model.applyEdits([
            { forceMoveMarkers: true, identifier: null, range, text: message }
        ]);
        this.outputViewEditor.revealLastLine();
        if (!this.logLnTimeout) {
            this.logLnTimeout = window.setTimeout(() => {
                this.forceUpdate();
                this.logLnTimeout = null;
            });
        }
    }
    createPane() {
        switch (this.state.visible) {
            case "output":
                return React.createElement(Editor_1.Editor, { ref: (ref) => this.setOutputViewEditor(ref), view: this.outputView });
            case "problems":
                return React.createElement(Problems_1.Problems, { project: this.props.project });
            default:
                null;
        }
    }
    render() {
        return React.createElement("div", { className: "fill" },
            React.createElement("div", { style: { display: "flex" } },
                React.createElement("div", null,
                    React.createElement(Button_1.Button, { icon: React.createElement(Icons_1.GoThreeBars, null), title: "View Console", onClick: () => {
                            // TODO: Figure out how the UX should work when toggling the console.
                            // let consoleSplits = this.state.consoleSplits;
                            // let second = consoleSplits[1];
                            // second.value = second.value == 40 ? 128 : 40;
                            // this.setState({ consoleSplits });
                            // layout();
                        } })),
                React.createElement("div", null,
                    React.createElement(Tabs_1.Tabs, null,
                        React.createElement(Tabs_1.Tab, { label: `Output (${this.outputView.file.buffer.getLineCount()})`, onClick: () => {
                                this.setState({ visible: "output" });
                            } }),
                        React.createElement(Tabs_1.Tab, { label: "Problems", onClick: () => {
                                this.setState({ visible: "problems" });
                            } })))),
            React.createElement("div", { style: { height: "calc(100% - 40px)" } },
                React.createElement(Split_1.Split, { name: "editor/sandbox", orientation: Split_1.SplitOrientation.Vertical, defaultSplit: {
                        min: 256,
                    }, splits: this.state.splits, onChange: (splits) => {
                        this.setState({ splits });
                        // layout();
                    } },
                    this.createPane(),
                    React.createElement(Sandbox_1.Sandbox, { ref: (ref) => this.setSandbox(ref), logger: this }))));
    }
}
exports.ControlCenter = ControlCenter;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const model_1 = __webpack_require__(2);
const DirectoryTree_1 = __webpack_require__(100);
class ProblemTemplate {
    constructor(container) {
        this.monacoIconLabel = document.createElement("div");
        this.monacoIconLabel.className = "monaco-icon-label";
        this.monacoIconLabel.style.display = "flex";
        container.appendChild(this.monacoIconLabel);
        let labelDescriptionContainer = document.createElement("div");
        labelDescriptionContainer.className = "monaco-icon-label-description-container";
        this.monacoIconLabel.appendChild(labelDescriptionContainer);
        this.label = document.createElement("a");
        this.label.className = "label-name";
        labelDescriptionContainer.appendChild(this.label);
        this.description = document.createElement("span");
        this.description.className = "label-description";
        labelDescriptionContainer.appendChild(this.description);
    }
    dispose() {
    }
    set(problem) {
        let icon = "";
        let marker = problem.marker;
        let position = `(${marker.startLineNumber}, ${marker.startColumn})`;
        this.label.innerHTML = marker.message;
        this.description.innerHTML = position;
    }
}
class Problems extends React.Component {
    constructor(props) {
        super(props);
        this.lastClickedTime = Date.now();
        this.contextViewService = new window.ContextViewService(document.documentElement);
        this.contextMenuService = new window.ContextMenuService(document.documentElement, null, null, this.contextViewService);
    }
    setContainer(container) {
        if (container == null)
            return;
        if (this.container !== container) {
            // ...
        }
        this.container = container;
    }
    ensureTree() {
        if (this.container.lastChild) {
            this.container.removeChild(this.container.lastChild);
        }
        let self = this;
        class Controller extends window.TreeDefaults.DefaultController {
            onContextMenu(tree, file, event) {
                tree.setFocus(file);
                const anchor = { x: event.posx, y: event.posy };
                let actions = [];
                self.contextMenuService.showContextMenu({
                    getAnchor: () => anchor,
                    getActions: () => {
                        return monaco.Promise.as(actions);
                    },
                    getActionItem: (action) => {
                        // const keybinding = this._keybindingService.lookupKeybinding(action.id);
                        // if (keybinding) {
                        //   return new ActionItem(action, action, { label: true, keybinding: keybinding.getLabel() });
                        // }
                        return null;
                    },
                    onHide: (wasCancelled) => {
                        if (wasCancelled) {
                            tree.DOMFocus();
                        }
                    }
                });
                super.onContextMenu(tree, file, event);
                return true;
            }
        }
        this.tree = new window.Tree(this.container, {
            dataSource: {
                /**
                 * Returns the unique identifier of the given element.
                 * No more than one element may use a given identifier.
                 */
                getId: function (tree, element) {
                    return element.key;
                },
                /**
                 * Returns a boolean value indicating whether the element has children.
                 */
                hasChildren: function (tree, element) {
                    if (element instanceof model_1.Directory && element.children.length) {
                        return true;
                    }
                    else if (element instanceof model_1.File) {
                        return element.problems.length > 0;
                    }
                    return false;
                },
                /**
                 * Returns the element's children as an array in a promise.
                 */
                getChildren: function (tree, element) {
                    if (element instanceof model_1.Directory && element.children.length) {
                        let children = [];
                        element.forEachFile((file) => {
                            if (file.problems.length) {
                                children.push(file);
                            }
                        }, true);
                        return monaco.Promise.as(children);
                    }
                    else if (element instanceof model_1.File) {
                        return monaco.Promise.as(element.problems);
                    }
                    return null;
                },
                /**
                 * Returns the element's parent in a promise.
                 */
                getParent: function (tree, element) {
                    if (element instanceof model_1.File) {
                        return monaco.Promise.as(element.getProject());
                    }
                    return monaco.Promise.as(element.file);
                }
            },
            renderer: {
                getHeight: function (tree, element) {
                    return 24;
                },
                getTemplateId(tree, element) {
                    if (element instanceof model_1.File) {
                        return "file";
                    }
                    return "problem";
                },
                renderTemplate: function (tree, templateId, container) {
                    return templateId == "problem" ? new ProblemTemplate(container) : new DirectoryTree_1.FileTemplate(container);
                },
                renderElement: function (tree, element, templateId, templateData) {
                    templateData.set(element);
                },
                disposeTemplate: function (tree, templateId, templateData) {
                    templateData.dispose();
                }
            },
            controller: new Controller()
        });
    }
    onClickFile(file) {
    }
    componentDidMount() {
        this.ensureTree();
        this.tree.model.setInput(this.props.project);
        this.props.project.onDidChangeProblems.register(() => {
            this.tree.refresh();
        });
    }
    componentWillReceiveProps(props) {
        this.tree.refresh();
        this.tree.expandAll();
    }
    render() {
        return React.createElement("div", { className: "fill", ref: (ref) => this.setContainer(ref) });
    }
}
exports.Problems = Problems;


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const model_1 = __webpack_require__(2);
const service_1 = __webpack_require__(13);
class FileTemplate {
    constructor(container) {
        this.monacoIconLabel = document.createElement("div");
        this.monacoIconLabel.className = "monaco-icon-label";
        this.monacoIconLabel.style.display = "flex";
        container.appendChild(this.monacoIconLabel);
        let labelDescriptionContainer = document.createElement("div");
        labelDescriptionContainer.className = "monaco-icon-label-description-container";
        this.monacoIconLabel.appendChild(labelDescriptionContainer);
        this.label = document.createElement("a");
        this.label.className = "label-name";
        labelDescriptionContainer.appendChild(this.label);
        this.description = document.createElement("span");
        this.description.className = "label-description";
        labelDescriptionContainer.appendChild(this.description);
    }
    dispose() {
    }
    set(file) {
        let icon = "";
        switch (file.type) {
            case model_1.FileType.C:
                icon = "c-lang-file-icon";
                break;
            case model_1.FileType.Cpp:
                icon = "cpp-lang-file-icon";
                break;
            case model_1.FileType.JavaScript:
                icon = "javascript-lang-file-icon";
                break;
            case model_1.FileType.HTML:
                icon = "html-lang-file-icon";
                break;
            case model_1.FileType.TypeScript:
                icon = "typescript-lang-file-icon";
                break;
            case model_1.FileType.Markdown:
                icon = "markdown-lang-file-icon";
                break;
        }
        if (file instanceof model_1.Directory) {
            this.monacoIconLabel.classList.add("folder-icon");
        }
        else {
            this.monacoIconLabel.classList.add("file-icon");
        }
        if (icon) {
            this.monacoIconLabel.classList.add(icon);
        }
        this.label.innerHTML = file.name;
        this.monacoIconLabel.classList.toggle("dirty", file.isDirty);
    }
}
exports.FileTemplate = FileTemplate;
class DirectoryTree extends React.Component {
    constructor(props) {
        super(props);
        this.lastClickedTime = Date.now();
        this.contextViewService = new window.ContextViewService(document.documentElement);
        this.contextMenuService = new window.ContextMenuService(document.documentElement, null, null, this.contextViewService);
    }
    setContainer(container) {
        if (container == null)
            return;
        if (this.container !== container) {
            // ...
        }
        this.container = container;
    }
    ensureTree() {
        if (this.container.lastChild) {
            this.container.removeChild(this.container.lastChild);
        }
        let self = this;
        class Controller extends window.TreeDefaults.DefaultController {
            onContextMenu(tree, file, event) {
                tree.setFocus(file);
                const anchor = { x: event.posx, y: event.posy };
                let actions = [];
                if (file instanceof model_1.Directory) {
                    actions.push(new window.Action("x", "New File", "", true, () => {
                        self.props.onNewFile && self.props.onNewFile(file);
                    }));
                    actions.push(new window.Action("x", "New Directory", "", true, () => {
                        self.props.onNewDirectory && self.props.onNewDirectory(file);
                    }));
                }
                else if (file.type === model_1.FileType.Wasm) {
                    actions.push(new window.Action("x", "Optimize w/ Binaryen", "", true, () => {
                        service_1.Service.optimizeWasmWithBinaryen(file);
                    }));
                    actions.push(new window.Action("x", "Validate w/ Binaryen", "", true, () => {
                        service_1.Service.validateWasmWithBinaryen(file);
                    }));
                    actions.push(new window.Action("x", "Download", "", true, () => {
                        service_1.Service.download(file);
                    }));
                    actions.push(new window.Action("x", "Disassemble w/ Wabt", "", true, () => {
                        service_1.Service.disassembleWasmWithWabt(file);
                    }));
                    actions.push(new window.Action("x", "Firefox x86", "", true, () => {
                        service_1.Service.disassembleX86(file);
                    }));
                    actions.push(new window.Action("x", "Firefox x86 Baseline", "", true, () => {
                        service_1.Service.disassembleX86(file, "--wasm-always-baseline");
                    }));
                }
                else if (file.type === model_1.FileType.C || file.type === model_1.FileType.Cpp) {
                    actions.push(new window.Action("x", "Format w/ Clang", "", true, () => {
                        service_1.Service.clangFormat(file);
                    }));
                }
                else if (file.type === model_1.FileType.Wast) {
                    actions.push(new window.Action("x", "Assemble w/ Wabt", "", true, () => {
                        service_1.Service.assembleWastWithWabt(file);
                    }));
                }
                actions.push(new window.Action("x", "Edit", "", true, () => {
                    self.props.onEditFile && self.props.onEditFile(file);
                }));
                actions.push(new window.Action("x", "Delete", "", true, () => {
                    self.props.onDeleteFile && self.props.onDeleteFile(file);
                }));
                self.contextMenuService.showContextMenu({
                    getAnchor: () => anchor,
                    getActions: () => {
                        return monaco.Promise.as(actions);
                    },
                    getActionItem: (action) => {
                        // const keybinding = this._keybindingService.lookupKeybinding(action.id);
                        // if (keybinding) {
                        //   return new ActionItem(action, action, { label: true, keybinding: keybinding.getLabel() });
                        // }
                        return null;
                    },
                    onHide: (wasCancelled) => {
                        if (wasCancelled) {
                            tree.DOMFocus();
                        }
                    }
                });
                super.onContextMenu(tree, file, event);
                return true;
            }
        }
        this.tree = new window.Tree(this.container, {
            dataSource: {
                /**
                 * Returns the unique identifier of the given element.
                 * No more than one element may use a given identifier.
                 */
                getId: function (tree, element) {
                    return element.key;
                },
                /**
                 * Returns a boolean value indicating whether the element has children.
                 */
                hasChildren: function (tree, element) {
                    return element instanceof model_1.Directory;
                },
                /**
                 * Returns the element's children as an array in a promise.
                 */
                getChildren: function (tree, element) {
                    return monaco.Promise.as(element.children);
                },
                /**
                 * Returns the element's parent in a promise.
                 */
                getParent: function (tree, element) {
                    return monaco.Promise.as(element.parent);
                }
            },
            renderer: {
                getHeight: function (tree, element) {
                    return 24;
                },
                renderTemplate: function (tree, templateId, container) {
                    return new FileTemplate(container);
                },
                renderElement: function (tree, element, templateId, templateData) {
                    templateData.set(element);
                },
                disposeTemplate: function (tree, templateId, templateData) {
                    templateData.dispose();
                }
            },
            controller: new Controller()
        });
    }
    onClickFile(file) {
        if (file instanceof model_1.Directory) {
            return;
        }
        if (Date.now() - this.lastClickedTime < 1000 && this.props.onDoubleClickFile) {
            this.props.onDoubleClickFile(file);
        }
        else if (this.props.onClickFile) {
            this.props.onClickFile(file);
        }
        this.lastClickedTime = Date.now();
    }
    componentDidMount() {
        this.ensureTree();
        this.tree.model.setInput(this.props.directory);
        this.tree.model.onDidSelect((e) => {
            if (e.selection.length) {
                this.onClickFile(e.selection[0]);
            }
        });
    }
    componentWillReceiveProps(props) {
        this.tree.refresh();
        this.tree.expandAll();
    }
    render() {
        return React.createElement("div", { className: "fill", ref: (ref) => this.setContainer(ref) });
    }
}
exports.DirectoryTree = DirectoryTree;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map