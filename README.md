# @7c/minilzo
i have had hard time finding a minilzo library for nodeJS, so i decided to make my own but i have seen a non-ffi dependent version from [@abraidwood/minilzo-js](https://github.com/abraidwood/minilzo-js), so i decided to port it to typescript and make it work with node.js. I also have a deno version available at [@7c/minilzo](https://github.com/7c/minilzo). For my requirements it was very important that the library is compatible with the C version of minilzo.

## Installation
```
npm install https://github.com/7c/node-minilzo --save
```

## Usage
```
import { LZO1X } from '@7c/minilzo';
const lzo = new LZO1X();

const compressed = lzo.compress(Buffer.from('Hello, world!'));
const decompressed = lzo.decompress(compressed);

console.log(decompressed.toString());
```

## Demos
See `demo.ts` for a complete example, also `tests.ts` for testing.


## Tests
Created a tests.c which shall use same constants as the tests.ts file, this way we can compare the results of the C version with the TS version for compatibility testing. It is essential that both versions are compatible.
### Typescript
```bash
$ node tests2.js

## output
Sentence 1: CompressChecksum = 2476, DecompressChecksum = 2476, Compressed Length = 28, Decompressed Length = 24, Compression Rate = -16.67%
Sentence 2: CompressChecksum = 5528, DecompressChecksum = 5528, Compressed Length = 45, Decompressed Length = 48, Compression Rate = 6.25%
Sentence 3: CompressChecksum = 9156, DecompressChecksum = 9156, Compressed Length = 54, Decompressed Length = 72, Compression Rate = 25.00%
Sentence 4: CompressChecksum = 13360, DecompressChecksum = 13360, Compressed Length = 55, Decompressed Length = 96, Compression Rate = 42.71%
Sentence 5: CompressChecksum = 18140, DecompressChecksum = 18140, Compressed Length = 55, Decompressed Length = 120, Compression Rate = 54.17%
Sentence 6: CompressChecksum = 23496, DecompressChecksum = 23496, Compressed Length = 55, Decompressed Length = 144, Compression Rate = 61.81%
Sentence 7: CompressChecksum = 29428, DecompressChecksum = 29428, Compressed Length = 55, Decompressed Length = 168, Compression Rate = 67.26%
Sentence 8: CompressChecksum = 35936, DecompressChecksum = 35936, Compressed Length = 55, Decompressed Length = 192, Compression Rate = 71.35%
Sentence 9: CompressChecksum = 43020, DecompressChecksum = 43020, Compressed Length = 55, Decompressed Length = 216, Compression Rate = 74.54%
Sentence 10: CompressChecksum = 50680, DecompressChecksum = 50680, Compressed Length = 55, Decompressed Length = 240, Compression Rate = 77.08%
```

### C
```bash
## Mac
$ brew install lzo
## brew info lzo and find out where it is installed
$ gcc -o bin/ctests tests.c -I/opt/homebrew/Cellar/lzo/2.10/include -L/opt/homebrew/Cellar/lzo/2.10/lib -llzo2 && chmod +x bin/ctests && bin/ctests


## output
Testing C LZO1X compression
Sentence 1: CompressChecksum = 2476, DecompressChecksum = 2476, Compressed Length = 28, Decompressed Length = 24, Compression Rate = -16.67%
Sentence 2: CompressChecksum = 5528, DecompressChecksum = 5528, Compressed Length = 45, Decompressed Length = 48, Compression Rate = 6.25%
Sentence 3: CompressChecksum = 9156, DecompressChecksum = 9156, Compressed Length = 54, Decompressed Length = 72, Compression Rate = 25.00%
Sentence 4: CompressChecksum = 13360, DecompressChecksum = 13360, Compressed Length = 55, Decompressed Length = 96, Compression Rate = 42.71%
Sentence 5: CompressChecksum = 18140, DecompressChecksum = 18140, Compressed Length = 55, Decompressed Length = 120, Compression Rate = 54.17%
Sentence 6: CompressChecksum = 23496, DecompressChecksum = 23496, Compressed Length = 55, Decompressed Length = 144, Compression Rate = 61.81%
Sentence 7: CompressChecksum = 29428, DecompressChecksum = 29428, Compressed Length = 55, Decompressed Length = 168, Compression Rate = 67.26%
Sentence 8: CompressChecksum = 35936, DecompressChecksum = 35936, Compressed Length = 55, Decompressed Length = 192, Compression Rate = 71.35%
Sentence 9: CompressChecksum = 43020, DecompressChecksum = 43020, Compressed Length = 55, Decompressed Length = 216, Compression Rate = 74.54%
Sentence 10: CompressChecksum = 50680, DecompressChecksum = 50680, Compressed Length = 55, Decompressed Length = 240, Compression Rate = 77.08%
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
