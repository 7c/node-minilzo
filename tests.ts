import { LZO1X } from './src/ts-lzo1x';
import { checksumArray } from './inc/checksumArray';
const lzo = new LZO1X();


const baseSentence = "This is a test sentence.";
const sentences: string[] = Array.from({ length: 10 }, (_, index) => baseSentence.repeat(index + 1));

sentences.forEach((sentence, index) => {
    const buffer = new Uint8Array(Buffer.from(sentence));
    const compressChecksum = checksumArray(buffer);

    const compressedBuffer = lzo.compress(buffer);
    const compressedLength = compressedBuffer.length;

    const decompressedBuffer = lzo.decompress(compressedBuffer);
    const decompressedLength = decompressedBuffer.length;
    const decompressedChecksum = checksumArray(decompressedBuffer);

    const compressionRate = ((1 - (compressedLength / buffer.length)) * 100).toFixed(2);

    console.log(`Sentence ${index + 1}: CompressChecksum = ${compressChecksum}, DecompressChecksum = ${decompressedChecksum}, Compressed Length = ${compressedLength}, Decompressed Length = ${decompressedLength}, Compression Rate = ${compressionRate}%`);
});