"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decompress = exports.compress = void 0;
// const LZO1X = require('../src/node-lzo1x.js');
const ts_lzo1x_1 = require("../src/ts-lzo1x");
const lzo = new ts_lzo1x_1.LZO1X();
function compress(inputBuffer) {
    let output = new Uint8Array(inputBuffer.length * 2);
    const compressState = {
        inputBuffer: inputBuffer,
        outputBuffer: output
    };
    const compressResult = lzo.compress(compressState);
    if (compressResult !== 0) {
        throw new Error("Compression failed!");
    }
    return compressState.outputBuffer;
}
exports.compress = compress;
function decompress(inputBuffer) {
    let output = new Uint8Array(inputBuffer.length * 2);
    const decompressState = {
        inputBuffer: inputBuffer,
        outputBuffer: output
    };
    const decompressResult = lzo.decompress(decompressState);
    if (decompressResult !== 0) {
        throw new Error("Decompression failed!");
    }
    return decompressState.outputBuffer;
}
exports.decompress = decompress;
//# sourceMappingURL=compressionUtils.js.map