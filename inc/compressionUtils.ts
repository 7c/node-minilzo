// const LZO1X = require('../src/node-lzo1x.js');
import { LZO1X } from '../src/ts-lzo1x';

const lzo = new LZO1X();
export function compress(inputBuffer: Uint8Array): Uint8Array {
    let output = new Uint8Array(inputBuffer.length*2)
    const compressState = {
        inputBuffer: inputBuffer,
        outputBuffer: output
    }
    const compressResult = lzo.compress(compressState)
    if (compressResult !== 0) {
        throw new Error("Compression failed!");
    }
    return compressState.outputBuffer;
}

export function decompress(inputBuffer: Uint8Array): Uint8Array {
    let output = new Uint8Array(inputBuffer.length*2)
    const decompressState = {
        inputBuffer: inputBuffer,
        outputBuffer: output
    }
    const decompressResult = lzo.decompress(decompressState)
    if (decompressResult !== 0) {
        throw new Error("Decompression failed!");
    }
    return decompressState.outputBuffer;
}