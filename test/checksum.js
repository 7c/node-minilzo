"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_lzo1x_1 = require("../src/ts-lzo1x");
const checksumArray_1 = require("../inc/checksumArray");
const assert_1 = __importDefault(require("assert"));
const lzo = new ts_lzo1x_1.LZO1X();
const baseSentence = "This is a test sentence.";
const sentences = Array.from({ length: 10 }, (_, index) => baseSentence.repeat(index + 1));
sentences.forEach((sentence, index) => {
    const buffer = new Uint8Array(Buffer.from(sentence));
    const bufferChecksum = (0, checksumArray_1.checksumArray)(buffer);
    const compressedBuffer = lzo.compress(buffer);
    const compressedChecksum = (0, checksumArray_1.checksumArray)(compressedBuffer);
    const compressedLength = compressedBuffer.length;
    const decompressedBuffer = lzo.decompress(compressedBuffer);
    const decompressedLength = decompressedBuffer.length;
    const decompressedChecksum = (0, checksumArray_1.checksumArray)(decompressedBuffer);
    const compressionRate = ((1 - (compressedLength / buffer.length)) * 100).toFixed(2);
    console.log(`Sentence ${index + 1}: bufferChecksum = ${bufferChecksum}, compressedChecksum = ${compressedChecksum}, decompressedChecksum = ${decompressedChecksum}, compressedLength = ${compressedLength}, decompressedLength = ${decompressedLength}, compressionRate = ${compressionRate}%`);
    (0, assert_1.default)(bufferChecksum === decompressedChecksum);
});
//# sourceMappingURL=checksum.js.map