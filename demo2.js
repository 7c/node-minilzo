"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_lzo1x_1 = require("./src/ts-lzo1x");
const checksumArray_1 = require("./inc/checksumArray");
const assert_1 = __importDefault(require("assert"));
const lzo = new ts_lzo1x_1.LZO1X();
const original = new Uint8Array(Buffer.from('Hello, world!'));
console.log(`original: ${original} - checksum: ${(0, checksumArray_1.checksumArray)(original)}`);
const compressed = lzo.compress(original);
console.log(`compressed: ${compressed} - checksum: ${(0, checksumArray_1.checksumArray)(compressed)}`);
const decompressed = lzo.decompress(compressed);
console.log(`decompressed: ${decompressed} - checksum: ${(0, checksumArray_1.checksumArray)(decompressed)}`);
(0, assert_1.default)(Buffer.from(decompressed).toString() === 'Hello, world!');
(0, assert_1.default)((0, checksumArray_1.checksumArray)(original) === (0, checksumArray_1.checksumArray)(decompressed));
//# sourceMappingURL=demo2.js.map