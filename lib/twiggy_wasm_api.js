
                (function() {
                    var wasm;
                    const __exports = {};
                    

let cachedUint8Memory = null;
function getUint8Memory() {
    if (cachedUint8Memory === null ||
        cachedUint8Memory.buffer !== wasm.memory.buffer)
        cachedUint8Memory = new Uint8Array(wasm.memory.buffer);
    return cachedUint8Memory;
}

function passArray8ToWasm(arg) {
    const ptr = wasm.__wbindgen_malloc(arg.length);
    getUint8Memory().set(arg, ptr);
    return [ptr, arg.length];
}

let cachedUint32Memory = null;
function getUint32Memory() {
    if (cachedUint32Memory === null ||
        cachedUint32Memory.buffer !== wasm.memory.buffer)
        cachedUint32Memory = new Uint32Array(wasm.memory.buffer);
    return cachedUint32Memory;
}

let cachedGlobalArgumentPtr = null;
function globalArgumentPtr() {
    if (cachedGlobalArgumentPtr === null)
        cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
    return cachedGlobalArgumentPtr;
}

function setGlobalArgument(arg, i) {
    const idx = globalArgumentPtr() / 4 + i;
    getUint32Memory()[idx] = arg;
}

let cachedDecoder = new TextDecoder('utf-8');

function getStringFromWasm(ptr, len) {
    return cachedDecoder.decode(getUint8Memory().slice(ptr, ptr + len));
}

function getGlobalArgument(arg) {
    const idx = globalArgumentPtr() / 4 + arg;
    return getUint32Memory()[idx];
}

let cachedEncoder = new TextEncoder('utf-8');

function passStringToWasm(arg) {

    const buf = cachedEncoder.encode(arg);
    const ptr = wasm.__wbindgen_malloc(buf.length);
    getUint8Memory().set(buf, ptr);
    return [ptr, buf.length];
}

__exports.Items = class Items {

                    static __construct(ptr) {
                        return new Items(ptr);
                    }

                    constructor(ptr) {
                        this.ptr = ptr;
                    }

                free() {
                    const ptr = this.ptr;
                    this.ptr = 0;
                    wasm.__wbg_items_free(ptr);
                }
            static parse(arg0) {
    const [ptr0, len0] = passArray8ToWasm(arg0);
    setGlobalArgument(len0, 0);
    try {
        return Items.__construct(wasm.items_parse(ptr0));
    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);
    }
}
top(arg0) {
    const ret = wasm.items_top(this.ptr, arg0.ptr);
    const len = getGlobalArgument(0);
    const realRet = getStringFromWasm(ret, len);
    wasm.__wbindgen_free(ret, len * 1);
    return realRet;
}
dominators(arg0) {
    const ret = wasm.items_dominators(this.ptr, arg0.ptr);
    const len = getGlobalArgument(0);
    const realRet = getStringFromWasm(ret, len);
    wasm.__wbindgen_free(ret, len * 1);
    return realRet;
}
paths(arg0) {
    const ret = wasm.items_paths(this.ptr, arg0.ptr);
    const len = getGlobalArgument(0);
    const realRet = getStringFromWasm(ret, len);
    wasm.__wbindgen_free(ret, len * 1);
    return realRet;
}
monos(arg0) {
    const ret = wasm.items_monos(this.ptr, arg0.ptr);
    const len = getGlobalArgument(0);
    const realRet = getStringFromWasm(ret, len);
    wasm.__wbindgen_free(ret, len * 1);
    return realRet;
}
}

__exports.Dominators = class Dominators {

                    static __construct(ptr) {
                        return new Dominators(ptr);
                    }

                    constructor(ptr) {
                        this.ptr = ptr;
                    }

                free() {
                    const ptr = this.ptr;
                    this.ptr = 0;
                    wasm.__wbg_dominators_free(ptr);
                }
            static new() {
    return Dominators.__construct(wasm.dominators_new());
}
max_depth() {
    return wasm.dominators_max_depth(this.ptr);
}
max_rows() {
    return wasm.dominators_max_rows(this.ptr);
}
set_max_depth(arg0) {
    return wasm.dominators_set_max_depth(this.ptr, arg0);
}
set_max_rows(arg0) {
    return wasm.dominators_set_max_rows(this.ptr, arg0);
}
}

__exports.Paths = class Paths {

                    static __construct(ptr) {
                        return new Paths(ptr);
                    }

                    constructor(ptr) {
                        this.ptr = ptr;
                    }

                free() {
                    const ptr = this.ptr;
                    this.ptr = 0;
                    wasm.__wbg_paths_free(ptr);
                }
            static new() {
    return Paths.__construct(wasm.paths_new());
}
add_function(arg0) {
    const [ptr0, len0] = passStringToWasm(arg0);
    setGlobalArgument(len0, 0);
    return wasm.paths_add_function(this.ptr, ptr0);
}
max_depth() {
    return wasm.paths_max_depth(this.ptr);
}
max_paths() {
    return wasm.paths_max_paths(this.ptr);
}
set_max_depth(arg0) {
    return wasm.paths_set_max_depth(this.ptr, arg0);
}
set_max_paths(arg0) {
    return wasm.paths_set_max_paths(this.ptr, arg0);
}
}

__exports.Top = class Top {

                    static __construct(ptr) {
                        return new Top(ptr);
                    }

                    constructor(ptr) {
                        this.ptr = ptr;
                    }

                free() {
                    const ptr = this.ptr;
                    this.ptr = 0;
                    wasm.__wbg_top_free(ptr);
                }
            static new() {
    return Top.__construct(wasm.top_new());
}
number() {
    return wasm.top_number(this.ptr);
}
retaining_paths() {
    return (wasm.top_retaining_paths(this.ptr)) !== 0;
}
retained() {
    return (wasm.top_retained(this.ptr)) !== 0;
}
set_number(arg0) {
    return wasm.top_set_number(this.ptr, arg0);
}
set_retaining_paths(arg0) {
    return wasm.top_set_retaining_paths(this.ptr, arg0 ? 1 : 0);
}
set_retained(arg0) {
    return wasm.top_set_retained(this.ptr, arg0 ? 1 : 0);
}
}

__exports.Monos = class Monos {

                    static __construct(ptr) {
                        return new Monos(ptr);
                    }

                    constructor(ptr) {
                        this.ptr = ptr;
                    }

                free() {
                    const ptr = this.ptr;
                    this.ptr = 0;
                    wasm.__wbg_monos_free(ptr);
                }
            static new() {
    return Monos.__construct(wasm.monos_new());
}
only_generics() {
    return (wasm.monos_only_generics(this.ptr)) !== 0;
}
max_generics() {
    return wasm.monos_max_generics(this.ptr);
}
max_monos() {
    return wasm.monos_max_monos(this.ptr);
}
set_only_generics(arg0) {
    return wasm.monos_set_only_generics(this.ptr, arg0 ? 1 : 0);
}
set_max_generics(arg0) {
    return wasm.monos_set_max_generics(this.ptr, arg0);
}
set_max_monos(arg0) {
    return wasm.monos_set_max_monos(this.ptr, arg0);
}
}

__exports.__wbindgen_throw = function(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
}

                    function init(wasm_path) {
                        return fetch(wasm_path)
                            .then(response => response.arrayBuffer())
                            .then(buffer => WebAssembly.instantiate(buffer, { './twiggy_wasm_api': __exports }))
                            .then(({instance}) => {
                                wasm = init.wasm = instance.exports;
                                return;
                            });
                    };
                    self.wasm_bindgen = Object.assign(init, __exports);
                })();
            