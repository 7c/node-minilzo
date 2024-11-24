"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checksumArray_1 = require("./inc/checksumArray");
const compressionUtils_1 = require("./inc/compressionUtils");
const baseSentence = "This is a test sentence.";
const sentences = Array.from({ length: 10 }, (_, index) => baseSentence.repeat(index + 1));
sentences.forEach((sentence, index) => {
    const buffer = new Uint8Array(Buffer.from(sentence));
    const compressChecksum = (0, checksumArray_1.checksumArray)(buffer);
    const compressedBuffer = (0, compressionUtils_1.compress)(buffer);
    const compressedLength = compressedBuffer.length;
    const decompressedBuffer = (0, compressionUtils_1.decompress)(compressedBuffer);
    const decompressedLength = decompressedBuffer.length;
    const decompressedChecksum = (0, checksumArray_1.checksumArray)(decompressedBuffer);
    const compressionRate = ((1 - (compressedLength / buffer.length)) * 100).toFixed(2);
    console.log(`Sentence ${index + 1}: CompressChecksum = ${compressChecksum}, DecompressChecksum = ${decompressedChecksum}, Compressed Length = ${compressedLength}, Decompressed Length = ${decompressedLength}, Compression Rate = ${compressionRate}%`);
});
//# sourceMappingURL=tests.js.map