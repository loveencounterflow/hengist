const fs = require("fs");
const loader = require("@assemblyscript/loader");
const imports = { /* imports go here */ };
const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/build/optimized.wasm"), imports);
module.exports = wasmModule.exports;
console.log(wasmModule.exports);
console.log(wasmModule.exports.add);
console.log(wasmModule.exports.add( 123, 456 ));


