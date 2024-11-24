# @7c/minilzo
i have had hard time finding a minilzo library for nodeJS, so i decided to make my own but i have seen a non-ffi dependent version from [@abraidwood/minilzo-js](https://github.com/abraidwood/minilzo-js), so i decided to port it to typescript and make it work with node.js. I also have a deno version available at [@7c/minilzo](https://github.com/7c/minilzo). For my requirements it was very important that the library is compatible with the C version of minilzo.

## Installation
```
npm install https://github.com/7c/node-minilzo --save
```

## Usage
```
import { LZO1X, checksumArray } from '@7c/minilzo';
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
```

## Demos
See `demo.ts`, `demo2.ts` for a complete example, also `test/checksum.ts` for testing.


## Tests
Created a tests.c which shall use same constants as the tests.ts file, this way we can compare the results of the C version with the TS version for compatibility testing. It is essential that both versions are compatible.
### Typescript
```bash
$ node test/checksum.js

## output
Sentence 1: bufferChecksum = 2476, compressedChecksum = 2636, decompressedChecksum = 2476, compressedLength = 28, decompressedLength = 24, compressionRate = -16.67%
Sentence 2: bufferChecksum = 5528, compressedChecksum = 4518, decompressedChecksum = 5528, compressedLength = 45, decompressedLength = 48, compressionRate = 6.25%
Sentence 3: bufferChecksum = 9156, compressedChecksum = 5598, decompressedChecksum = 9156, compressedLength = 54, decompressedLength = 72, compressionRate = 25.00%
Sentence 4: bufferChecksum = 13360, compressedChecksum = 5645, decompressedChecksum = 13360, compressedLength = 55, decompressedLength = 96, compressionRate = 42.71%
Sentence 5: bufferChecksum = 18140, compressedChecksum = 5669, decompressedChecksum = 18140, compressedLength = 55, decompressedLength = 120, compressionRate = 54.17%
Sentence 6: bufferChecksum = 23496, compressedChecksum = 5693, decompressedChecksum = 23496, compressedLength = 55, decompressedLength = 144, compressionRate = 61.81%
Sentence 7: bufferChecksum = 29428, compressedChecksum = 5717, decompressedChecksum = 29428, compressedLength = 55, decompressedLength = 168, compressionRate = 67.26%
Sentence 8: bufferChecksum = 35936, compressedChecksum = 5741, decompressedChecksum = 35936, compressedLength = 55, decompressedLength = 192, compressionRate = 71.35%
Sentence 9: bufferChecksum = 43020, compressedChecksum = 5765, decompressedChecksum = 43020, compressedLength = 55, decompressedLength = 216, compressionRate = 74.54%
Sentence 10: bufferChecksum = 50680, compressedChecksum = 5789, decompressedChecksum = 50680, compressedLength = 55, decompressedLength = 240, compressionRate = 77.08%
```

### C
```bash
## Mac
$ brew install lzo
## brew info lzo and find out where it is installed
$ gcc -o bin/cchecksum test/checksum.c -I/opt/homebrew/Cellar/lzo/2.10/include -L/opt/homebrew/Cellar/lzo/2.10/lib -llzo2 && chmod +x bin/cchecksum && bin/cchecksum


## output
Testing C LZO1X compression
Sentence 1: bufferChecksum = 2476, compressedChecksum = 2636, decompressedChecksum = 2476, compressedLength = 28, decompressedLength = 24, compressionRate = -16.67%
Sentence 2: bufferChecksum = 5528, compressedChecksum = 4518, decompressedChecksum = 5528, compressedLength = 45, decompressedLength = 48, compressionRate = 6.25%
Sentence 3: bufferChecksum = 9156, compressedChecksum = 5598, decompressedChecksum = 9156, compressedLength = 54, decompressedLength = 72, compressionRate = 25.00%
Sentence 4: bufferChecksum = 13360, compressedChecksum = 5645, decompressedChecksum = 13360, compressedLength = 55, decompressedLength = 96, compressionRate = 42.71%
Sentence 5: bufferChecksum = 18140, compressedChecksum = 5669, decompressedChecksum = 18140, compressedLength = 55, decompressedLength = 120, compressionRate = 54.17%
Sentence 6: bufferChecksum = 23496, compressedChecksum = 5693, decompressedChecksum = 23496, compressedLength = 55, decompressedLength = 144, compressionRate = 61.81%
Sentence 7: bufferChecksum = 29428, compressedChecksum = 5717, decompressedChecksum = 29428, compressedLength = 55, decompressedLength = 168, compressionRate = 67.26%
Sentence 8: bufferChecksum = 35936, compressedChecksum = 5741, decompressedChecksum = 35936, compressedLength = 55, decompressedLength = 192, compressionRate = 71.35%
Sentence 9: bufferChecksum = 43020, compressedChecksum = 5765, decompressedChecksum = 43020, compressedLength = 55, decompressedLength = 216, compressionRate = 74.54%
Sentence 10: bufferChecksum = 50680, compressedChecksum = 5789, decompressedChecksum = 50680, compressedLength = 55, decompressedLength = 240, compressionRate = 77.08%
```

### Fork
This is a fork of @abraidwood/minilzo-js with the goal of making it work with Node.js. Thanks for his work!


## Copyright
```
 ============================================================================
 miniLZO -- mini subset of the LZO real-time data compression library
 ============================================================================

 Author  : Markus Franz Xaver Johannes Oberhumer
           <markus@oberhumer.com>
           http://www.oberhumer.com/opensource/lzo/
 Version : 2.10
 Date    : 01 Mar 2017

 
 LZO and miniLZO are Copyright (C) 1996-2017 Markus Franz Xaver Oberhumer
 All Rights Reserved.

 LZO and miniLZO are distributed under the terms of the GNU General
 Public License (GPL).  See the file COPYING.

 Special licenses for commercial and other applications which
 are not willing to accept the GNU General Public License
 are available by contacting the author.

```
