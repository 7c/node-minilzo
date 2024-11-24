/**
 * Ported from https://github.com/abraidwood/minilzo-js
 *
 * LZO1X Compression/Decompression Class
 *
 * TypeScript port of minilzo-js by Alistair Braidwood
 * Modified for Node.js compatibility and encapsulated as a class.
 *
 * This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU General Public License as
 *  published by the Free Software Foundation; either version 2 of
 *  the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU General Public License
 *  along with the minilzo-js library; see the file COPYING.
 *  If not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 */
interface LZOState {
    inputBuffer: Uint8Array;
    outputBuffer: Uint8Array | null;
}
interface LZOConfig {
    outputSize?: number;
    blockSize?: number;
}
declare class LZO1X {
    private blockSize;
    private minNewSize;
    private maxSize;
    private OK;
    private INPUT_OVERRUN;
    private OUTPUT_OVERRUN;
    private LOOKBEHIND_OVERRUN;
    private EOF_FOUND;
    private ret;
    private buf;
    private buf32;
    private out;
    private cbl;
    private ip_end;
    private op_end;
    private t;
    private ip;
    private op;
    private m_pos;
    private m_len;
    private m_off;
    private dv_hi;
    private dv_lo;
    private dindex;
    private ii;
    private jj;
    private tt;
    private v;
    private dict;
    private emptyDict;
    private skipToFirstLiteralFun;
    private returnNewBuffers;
    private state;
    constructor();
    setBlockSize(blockSize: number): boolean;
    setOutputEstimate(outputSize: number): boolean;
    setReturnNewBuffers(b: boolean): void;
    applyConfig(cfg: LZOConfig): void;
    private extendBuffer;
    private match_next;
    private match_done;
    private copy_match;
    private copy_from_buf;
    private match;
    decompress(inputBuffer: Uint8Array): Uint8Array;
    private _compressCore;
    compress(inputBuffer: Uint8Array): Uint8Array;
    private ip_start;
    private ti;
    private ll;
    private l;
    private prev_ip;
}
export { LZO1X, LZOState, LZOConfig };
//# sourceMappingURL=ts-lzo1x.d.ts.map