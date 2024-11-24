"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checksumArray = void 0;
/**
 * Calculate a checksum of an array of bytes with simple addition of value and index
 * @param array - The array of bytes to calculate the checksum of
 * @returns The checksum of the array
 */
function checksumArray(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i] + i;
    }
    return sum;
}
exports.checksumArray = checksumArray;
//# sourceMappingURL=checksumArray.js.map