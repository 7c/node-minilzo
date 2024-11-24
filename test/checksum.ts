import { LZO1X } from '../src/ts-lzo1x';
import { checksumArray } from '../inc/checksumArray';
import assert from 'assert';
const lzo = new LZO1X();


const baseSentence = "This is a test sentence.";
const sentences: string[] = Array.from({ length: 10 }, (_, index) => baseSentence.repeat(index + 1));

sentences.forEach((sentence, index) => {
    const buffer = new Uint8Array(Buffer.from(sentence));
    const bufferChecksum = checksumArray(buffer);

    const compressedBuffer = lzo.compress(buffer);
    const compressedChecksum = checksumArray(compressedBuffer);
    const compressedLength = compressedBuffer.length;

    const decompressedBuffer = lzo.decompress(compressedBuffer);
    const decompressedLength = decompressedBuffer.length;
    const decompressedChecksum = checksumArray(decompressedBuffer);

    const compressionRate = ((1 - (compressedLength / buffer.length)) * 100).toFixed(2);

    console.log(`Sentence ${index + 1}: bufferChecksum = ${bufferChecksum}, compressedChecksum = ${compressedChecksum}, decompressedChecksum = ${decompressedChecksum}, compressedLength = ${compressedLength}, decompressedLength = ${decompressedLength}, compressionRate = ${compressionRate}%`);
    assert(bufferChecksum === decompressedChecksum);
});
