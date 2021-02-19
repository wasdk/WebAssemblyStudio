!function(e){var n={};function a(t){if(n[t])return n[t].exports;var i=n[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=e,a.c=n,a.d=function(e,n,t){a.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,n){if(1&n&&(e=a(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(a.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)a.d(t,i,function(n){return e[n]}.bind(null,i));return t},a.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(n,"a",n),n},a.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},a.p="/dist/",a(a.s=51)}({4:function(e,n,a){"use strict";var t;a.d(n,"a",function(){return t}),function(e){e[e.OptimizeWasmWithBinaryen=0]="OptimizeWasmWithBinaryen",e[e.ValidateWasmWithBinaryen=1]="ValidateWasmWithBinaryen",e[e.CreateWasmCallGraphWithBinaryen=2]="CreateWasmCallGraphWithBinaryen",e[e.ConvertWasmToAsmWithBinaryen=3]="ConvertWasmToAsmWithBinaryen",e[e.DisassembleWasmWithBinaryen=4]="DisassembleWasmWithBinaryen",e[e.AssembleWatWithBinaryen=5]="AssembleWatWithBinaryen",e[e.DisassembleWasmWithWabt=6]="DisassembleWasmWithWabt",e[e.AssembleWatWithWabt=7]="AssembleWatWithWabt",e[e.TwiggyWasm=8]="TwiggyWasm"}(t||(t={}))},51:function(e,n,a){"use strict";a.r(n);var t=a(4);async function i(){"undefined"==typeof Binaryen&&importScripts("../lib/binaryen.js")}async function r(){"undefined"==typeof wabt&&(self.global=self,importScripts("../lib/wabt.js"))}let s=null;async function o(e){await i();const n=Binaryen.readBinary(new Uint8Array(e));return n.optimize(),Promise.resolve(n.emitBinary())}async function l(e){await i();const n=Binaryen.readBinary(new Uint8Array(e));return Promise.resolve(n.validate())}async function m(e){await i();const n=Binaryen.readBinary(new Uint8Array(e)),a=Binaryen.print;let t="";return Binaryen.print=(e=>{t+=e+"\n"}),n.runPasses(["print-call-graph"]),Binaryen.print=a,Promise.resolve(t)}async function c(e){await i();const n=Binaryen.readBinary(new Uint8Array(e));return n.optimize(),Promise.resolve(n.emitAsmjs())}async function y(e){await i();const n=Binaryen.readBinary(new Uint8Array(e));return Promise.resolve(n.emitText())}async function u(e){await i();const n=Binaryen.parseText(e);return Promise.resolve(n.emitBinary())}async function d(e){await r();const n=wabt.readWasm(e,{readDebugNames:!0});return n.generateNames(),n.applyNames(),Promise.resolve(n.toText({foldExprs:!1,inlineExport:!0}))}async function p(e){await r();const n=wabt.parseWat("test.wat",e);return n.resolveNames(),n.validate(),Promise.resolve(n.toBinary({log:!0,write_debug_names:!0}).buffer)}async function f(e){let n;await async function(){s||(importScripts("../lib/twiggy_wasm_api.js"),await wasm_bindgen("../lib/twiggy_wasm_api_bg.wasm"),s={Items:wasm_bindgen.Items,Top:wasm_bindgen.Top,Paths:wasm_bindgen.Paths,Monos:wasm_bindgen.Monos,Dominators:wasm_bindgen.Dominators})}();const a=s.Items.parse(new Uint8Array(e));let t="# Twiggy Analysis\n\nTwiggy is a code size profiler, learn more about it [here](https://github.com/rustwasm/twiggy).\n\n";n=s.Top.new();const i=JSON.parse(a.top(n));t+="## Top\n\n",t+="| Shallow Bytes | Shallow % | Item |\n",t+="| ------------: | --------: | :--- |\n";let r=0;i.forEach(e=>{e.shallow_size_percent>=.1?t+=`| ${e.shallow_size} | ${e.shallow_size_percent.toFixed(2)} | \`${e.name}\` |\n`:r++}),r&&(t+=`\n### Note:\n${r} items had a shallow size percent less than 0.1 and were not listed above.\n`),t+="\n\n## Dominators\n\n",t+="| Retained Bytes | Retained % | Dominator Tree |\n",t+="| ------------: | --------: | :--- |\n";const o=.1;return r=0,n=s.Dominators.new(),function e(n,a){let i="";for(let e=0;e<a-1;e++)i+="   ";a&&(i+="⤷ "),t+=`| ${n.retained_size} | ${n.retained_size_percent.toFixed(2)} | \`${i+n.name}\` |\n`,n.children&&n.children.forEach(n=>{n.retained_size_percent>=o?e(n,a+1):r++})}(JSON.parse(a.dominators(n)),0),r&&(t+=`\n### Note:\n${r} items had a retained size percent less than ${o} and were not listed above.\n`),Promise.resolve(t)}onmessage=(e=>{const n={[t.a.OptimizeWasmWithBinaryen]:o,[t.a.ValidateWasmWithBinaryen]:l,[t.a.CreateWasmCallGraphWithBinaryen]:m,[t.a.ConvertWasmToAsmWithBinaryen]:c,[t.a.DisassembleWasmWithBinaryen]:y,[t.a.AssembleWatWithBinaryen]:u,[t.a.DisassembleWasmWithWabt]:d,[t.a.AssembleWatWithWabt]:p,[t.a.TwiggyWasm]:f}[e.data.command];!function(e,n){if(!e)throw new Error(n)}(n,`Command ${e.data.command} not found.`),async function(e,n){const a={id:e.id,payload:null,success:!0};try{a.payload=await n(e.payload)}catch(e){a.payload={message:e.message},a.success=!1}postMessage(a,void 0)}(e.data,n)})}});
//# sourceMappingURL=worker.bundle.js.map