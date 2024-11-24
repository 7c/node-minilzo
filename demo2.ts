import { LZO1X } from './src/ts-lzo1x';
import { checksumArray } from './inc/checksumArray';
import assert from 'assert';

const lzo = new LZO1X();
const original = new Uint8Array(Buffer.from('Hello, world!'));
console.log(`original: ${original} - checksum: ${checksumArray(original)}`);
const compressed = lzo.compress(original);
console.log(`compressed: ${compressed} - checksum: ${checksumArray(compressed)}`);
const decompressed = lzo.decompress(compressed);
console.log(`decompressed: ${decompressed} - checksum: ${checksumArray(decompressed)}`);
assert(Buffer.from(decompressed).toString() === 'Hello, world!');
assert(checksumArray(original) === checksumArray(decompressed));