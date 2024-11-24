'use strict';

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

class LZO1X {
  private blockSize: number = 128 * 1024;
  private minNewSize: number = this.blockSize;
  private maxSize: number = 0;

  private OK: number = 0;
  private INPUT_OVERRUN: number = -4;
  private OUTPUT_OVERRUN: number = -5;
  private LOOKBEHIND_OVERRUN: number = -6;
  private EOF_FOUND: number = -999;
  private ret: number = 0;

  private buf: Uint8Array | null = null;
  private buf32: Uint32Array | null = null;

  private out: Uint8Array = new Uint8Array(256 * 1024);
  private cbl: number = 0;
  private ip_end: number = 0;
  private op_end: number = 0;
  private t: number = 0;

  private ip: number = 0;
  private op: number = 0;
  private m_pos: number = 0;
  private m_len: number = 0;
  private m_off: number = 0;

  private dv_hi: number = 0;
  private dv_lo: number = 0;
  private dindex: number = 0;

  private ii: number = 0;
  private jj: number = 0;
  private tt: number = 0;
  private v: number = 0;

  private dict: Uint32Array = new Uint32Array(16384);
  private emptyDict: Uint32Array = new Uint32Array(16384);

  private skipToFirstLiteralFun: boolean = false;
  private returnNewBuffers: boolean = true;

  private state!: LZOState;

  constructor() {
    // Initialization is done via property declarations
  }

  setBlockSize(blockSize: number): boolean {
    if (typeof blockSize === 'number' && !isNaN(blockSize) && blockSize > 0) {
      this.blockSize = Math.floor(blockSize);
      return true;
    } else {
      return false;
    }
  }

  setOutputEstimate(outputSize: number): boolean {
    if (typeof outputSize === 'number' && !isNaN(outputSize) && outputSize > 0) {
      this.out = new Uint8Array(Math.floor(outputSize));
      return true;
    } else {
      return false;
    }
  }

  setReturnNewBuffers(b: boolean): void {
    this.returnNewBuffers = !!b;
  }

  applyConfig(cfg: LZOConfig): void {
    if (cfg !== undefined) {
      if (cfg.outputSize !== undefined) {
        this.setOutputEstimate(cfg.outputSize);
      }
      if (cfg.blockSize !== undefined) {
        this.setBlockSize(cfg.blockSize);
      }
    }
  }

  private extendBuffer(): void {
    const newBuffer = new Uint8Array(
      this.minNewSize + (this.blockSize - (this.minNewSize % this.blockSize))
    );
    newBuffer.set(this.out);
    this.out = newBuffer;
    this.cbl = this.out.length;
  }

  private match_next(): void {
    this.minNewSize = this.op + 3;
    if (this.minNewSize > this.cbl) {
      this.extendBuffer();
    }

    this.out[this.op++] = this.buf![this.ip++];
    if (this.t > 1) {
      this.out[this.op++] = this.buf![this.ip++];
      if (this.t > 2) {
        this.out[this.op++] = this.buf![this.ip++];
      }
    }

    this.t = this.buf![this.ip++];
  }

  private match_done(): number {
    this.t = this.buf![this.ip - 2] & 3;
    return this.t;
  }

  private copy_match(): void {
    this.t += 2;
    this.minNewSize = this.op + this.t;
    if (this.minNewSize > this.cbl) {
      this.extendBuffer();
    }

    do {
      this.out[this.op++] = this.out[this.m_pos++];
    } while (--this.t > 0);
  }

  private copy_from_buf(): void {
    this.minNewSize = this.op + this.t;
    if (this.minNewSize > this.cbl) {
      this.extendBuffer();
    }

    do {
      this.out[this.op++] = this.buf![this.ip++];
    } while (--this.t > 0);
  }

  private match(): number {
    for (;;) {
      if (this.t >= 64) {
        this.m_pos =
          this.op - 1 - ((this.t >> 2) & 7) - (this.buf![this.ip++] << 3);
        this.t = (this.t >> 5) - 1;

        this.copy_match();
      } else if (this.t >= 32) {
        this.t &= 31;
        if (this.t === 0) {
          while (this.buf![this.ip] === 0) {
            this.t += 255;
            this.ip++;
          }
          this.t += 31 + this.buf![this.ip++];
        }

        this.m_pos =
          this.op - 1 - (this.buf![this.ip] >> 2) - (this.buf![this.ip + 1] << 6);
        this.ip += 2;

        this.copy_match();
      } else if (this.t >= 16) {
        this.m_pos = this.op - ((this.t & 8) << 11);

        this.t &= 7;
        if (this.t === 0) {
          while (this.buf![this.ip] === 0) {
            this.t += 255;
            this.ip++;
          }
          this.t += 7 + this.buf![this.ip++];
        }

        this.m_pos -= (this.buf![this.ip] >> 2) + (this.buf![this.ip + 1] << 6);
        this.ip += 2;

        if (this.m_pos === this.op) {
          this.state.outputBuffer = this.returnNewBuffers
            ? new Uint8Array(this.out.subarray(0, this.op))
            : this.out.subarray(0, this.op);
          return this.EOF_FOUND;
        } else {
          this.m_pos -= 0x4000;
          this.copy_match();
        }
      } else {
        this.m_pos =
          this.op - 1 - (this.t >> 2) - (this.buf![this.ip++] << 2);
        this.minNewSize = this.op + 2;
        if (this.minNewSize > this.cbl) {
          this.extendBuffer();
        }

        this.out[this.op++] = this.out[this.m_pos++];
        this.out[this.op++] = this.out[this.m_pos];
      }

      if (this.match_done() === 0) {
        return this.OK;
      }
      this.match_next();
    }
  }

  decompress(state: LZOState): number {
    this.state = state;

    this.buf = this.state.inputBuffer;
    this.cbl = this.out.length;
    this.ip_end = this.buf.length;

    this.t = 0;
    this.ip = 0;
    this.op = 0;
    this.m_pos = 0;

    this.skipToFirstLiteralFun = false;

    if (this.buf[this.ip] > 17) {
      this.t = this.buf[this.ip++] - 17;
      if (this.t < 4) {
        this.match_next();
        this.ret = this.match();
        if (this.ret !== this.OK) {
          return this.ret === this.EOF_FOUND ? this.OK : this.ret;
        }
      } else {
        this.copy_from_buf();
        this.skipToFirstLiteralFun = true;
      }
    }

    for (;;) {
      if (!this.skipToFirstLiteralFun) {
        this.t = this.buf[this.ip++];

        if (this.t >= 16) {
          this.ret = this.match();
          if (this.ret !== this.OK) {
            return this.ret === this.EOF_FOUND ? this.OK : this.ret;
          }
          continue;
        } else if (this.t === 0) {
          while (this.buf[this.ip] === 0) {
            this.t += 255;
            this.ip++;
          }
          this.t += 15 + this.buf[this.ip++];
        }

        this.t += 3;
        this.copy_from_buf();
      } else {
        this.skipToFirstLiteralFun = false;
      }

      this.t = this.buf[this.ip++];
      if (this.t < 16) {
        this.m_pos = this.op - (1 + 0x0800);
        this.m_pos -= this.t >> 2;
        this.m_pos -= this.buf[this.ip++] << 2;

        this.minNewSize = this.op + 3;
        if (this.minNewSize > this.cbl) {
          this.extendBuffer();
        }
        this.out[this.op++] = this.out[this.m_pos++];
        this.out[this.op++] = this.out[this.m_pos++];
        this.out[this.op++] = this.out[this.m_pos];

        if (this.match_done() === 0) {
          continue;
        } else {
          this.match_next();
        }
      }

      this.ret = this.match();
      if (this.ret !== this.OK) {
        return this.ret === this.EOF_FOUND ? this.OK : this.ret;
      }
    }

    // Unreachable code
    // return this.OK;
  }

  private _compressCore(): void {
    this.ip_start = this.ip;
    this.ip_end = this.ip + this.ll - 20;
    this.jj = this.ip;
    this.ti = this.t;

    this.ip += this.ti < 4 ? 4 - this.ti : 0;

    this.ip += 1 + ((this.ip - this.jj) >> 5);

    for (;;) {
      if (this.ip >= this.ip_end) {
        break;
      }

      this.dv_lo = this.buf![this.ip] | (this.buf![this.ip + 1] << 8);
      this.dv_hi = this.buf![this.ip + 2] | (this.buf![this.ip + 3] << 8);
      this.dindex =
        (((this.dv_lo * 0x429d) >>> 16) +
          this.dv_hi * 0x429d +
          (this.dv_lo * 0x1824) & 0xffff) >>>
        2;

      this.m_pos = this.ip_start + this.dict[this.dindex];

      this.dict[this.dindex] = this.ip - this.ip_start;
      if (
        (this.dv_hi << 16) + this.dv_lo !==
        (this.buf![this.m_pos] |
          (this.buf![this.m_pos + 1] << 8) |
          (this.buf![this.m_pos + 2] << 16) |
          (this.buf![this.m_pos + 3] << 24)) >>> 0
      ) {
        this.ip += 1 + ((this.ip - this.jj) >> 5);
        continue;
      }
      this.jj -= this.ti;
      this.ti = 0;
      this.v = this.ip - this.jj;

      if (this.v !== 0) {
        if (this.v <= 3) {
          this.out[this.op - 2] |= this.v;
          do {
            this.out[this.op++] = this.buf![this.jj++];
          } while (--this.v > 0);
        } else {
          if (this.v <= 18) {
            this.out[this.op++] = this.v - 3;
          } else {
            this.tt = this.v - 18;
            this.out[this.op++] = 0;
            while (this.tt > 255) {
              this.tt -= 255;
              this.out[this.op++] = 0;
            }
            this.out[this.op++] = this.tt;
          }

          do {
            this.out[this.op++] = this.buf![this.jj++];
          } while (--this.v > 0);
        }
      }

      this.m_len = 4;

      if (
        this.buf![this.ip + this.m_len] === this.buf![this.m_pos + this.m_len]
      ) {
        do {
          this.m_len += 1;
          if (
            this.buf![this.ip + this.m_len] !==
            this.buf![this.m_pos + this.m_len]
          ) {
            break;
          }
          this.m_len += 1;
          if (
            this.buf![this.ip + this.m_len] !==
            this.buf![this.m_pos + this.m_len]
          ) {
            break;
          }
          this.m_len += 1;
          if (
            this.buf![this.ip + this.m_len] !==
            this.buf![this.m_pos + this.m_len]
          ) {
            break;
          }
          this.m_len += 1;
          if (
            this.buf![this.ip + this.m_len] !==
            this.buf![this.m_pos + this.m_len]
          ) {
            break;
          }
          this.m_len += 1;
          if (
            this.buf![this.ip + this.m_len] !==
            this.buf![this.m_pos + this.m_len]
          ) {
            break;
          }
          this.m_len += 1;
          if (
            this.buf![this.ip + this.m_len] !==
            this.buf![this.m_pos + this.m_len]
          ) {
            break;
          }
          this.m_len += 1;
          if (
            this.buf![this.ip + this.m_len] !==
            this.buf![this.m_pos + this.m_len]
          ) {
            break;
          }
          this.m_len += 1;
          if (
            this.buf![this.ip + this.m_len] !==
            this.buf![this.m_pos + this.m_len]
          ) {
            break;
          }
          if (this.ip + this.m_len >= this.ip_end) {
            break;
          }
        } while (
          this.buf![this.ip + this.m_len] === this.buf![this.m_pos + this.m_len]
        );
      }

      this.m_off = this.ip - this.m_pos;
      this.ip += this.m_len;
      this.jj = this.ip;
      if (this.m_len <= 8 && this.m_off <= 0x0800) {
        this.m_off -= 1;
        this.out[this.op++] =
          ((this.m_len - 1) << 5) | ((this.m_off & 7) << 2);
        this.out[this.op++] = this.m_off >> 3;
      } else if (this.m_off <= 0x4000) {
        this.m_off -= 1;
        if (this.m_len <= 33) {
          this.out[this.op++] = 32 | (this.m_len - 2);
        } else {
          this.m_len -= 33;
          this.out[this.op++] = 32;
          while (this.m_len > 255) {
            this.m_len -= 255;
            this.out[this.op++] = 0;
          }
          this.out[this.op++] = this.m_len;
        }
        this.out[this.op++] = this.m_off << 2;
        this.out[this.op++] = this.m_off >> 6;
      } else {
        this.m_off -= 0x4000;
        if (this.m_len <= 9) {
          this.out[this.op++] =
            16 | ((this.m_off >> 11) & 8) | (this.m_len - 2);
        } else {
          this.m_len -= 9;
          this.out[this.op++] = 16 | ((this.m_off >> 11) & 8);
          while (this.m_len > 255) {
            this.m_len -= 255;
            this.out[this.op++] = 0;
          }
          this.out[this.op++] = this.m_len;
        }
        this.out[this.op++] = this.m_off << 2;
        this.out[this.op++] = this.m_off >> 6;
      }
    }
    this.t = this.ll - (this.jj - this.ip_start - this.ti);
  }

  compress(state: LZOState): number {
    this.state = state;
    this.ip = 0;
    this.buf = this.state.inputBuffer;
    this.maxSize =
      this.buf.length + Math.ceil(this.buf.length / 16) + 64 + 3;
    if (this.maxSize > this.out.length) {
      this.out = new Uint8Array(this.maxSize);
    }
    this.op = 0;
    this.l = this.buf.length;
    this.t = 0;

    while (this.l > 20) {
      this.ll = this.l <= 49152 ? this.l : 49152;
      if ((this.t + this.ll) >> 5 <= 0) {
        break;
      }

      this.dict.set(this.emptyDict);

      this.prev_ip = this.ip;
      this._compressCore();
      this.ip = this.prev_ip + this.ll;
      this.l -= this.ll;
    }
    this.t += this.l;

    if (this.t > 0) {
      this.ii = this.buf.length - this.t;

      if (this.op === 0 && this.t <= 238) {
        this.out[this.op++] = 17 + this.t;
      } else if (this.t <= 3) {
        this.out[this.op - 2] |= this.t;
      } else if (this.t <= 18) {
        this.out[this.op++] = this.t - 3;
      } else {
        this.tt = this.t - 18;
        this.out[this.op++] = 0;
        while (this.tt > 255) {
          this.tt -= 255;
          this.out[this.op++] = 0;
        }
        this.out[this.op++] = this.tt;
      }

      do {
        this.out[this.op++] = this.buf[this.ii++];
      } while (--this.t > 0);
    }

    this.out[this.op++] = 17;
    this.out[this.op++] = 0;
    this.out[this.op++] = 0;

    this.state.outputBuffer = this.returnNewBuffers
      ? new Uint8Array(this.out.subarray(0, this.op))
      : this.out.subarray(0, this.op);
    return this.OK;
  }

  private ip_start: number = 0;
  private ti: number = 0;
  private ll: number = 0;
  private l: number = 0;
  private prev_ip: number = 0;
}

export { LZO1X, LZOState, LZOConfig };
