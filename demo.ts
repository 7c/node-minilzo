import { LZO1X } from './src/ts-lzo1x';
import { checksumArray } from './inc/checksumArray';

const lzo = new LZO1X();


// Example 1: Compress and decompress a simple string
function demoStringCompression() {
    console.log("\n=== Demo 1: String Compression ===");
    
    try {
        // Convert string to Uint8Array
        const text = "Hello, this is a test string that will be compressed and decompressed using minilzo-js!".repeat(10);
        const inputBuffer = new Uint8Array(Buffer.from(text));
        let output = new Uint8Array(3000);
        
        // Compression
        const compressState = {
            inputBuffer: inputBuffer,
            outputBuffer: output
        };
        
        const compressResult = lzo.compress(compressState);
        console.log('Compression result:', compressResult);
        
        if (compressResult !== 0) {
            console.error("Compression failed!");
            return;
        }
        
        // Calculate checksum of compressed data
        let compressedSum = checksumArray(compressState.outputBuffer);
        const compressionRate = ((1 - (compressState.outputBuffer.length / inputBuffer.length)) * 100).toFixed(2);
        console.log('Original text length:', text.length);
        console.log('Compressed length:', compressState.outputBuffer.length, `(${compressionRate}%)`);
        console.log('Compressed checksum:', compressedSum);
        
        
        // Decompression
        const decompressState = {
            inputBuffer: compressState.outputBuffer,
            outputBuffer: null as Uint8Array | null
        };
        
        const decompressResult = lzo.decompress(decompressState);
        console.log('Decompression result:', decompressResult);
        
        if (decompressResult !== 0) {
            console.error("Decompression failed!");
            return;
        }
        
        // Verify results
        if (decompressState.outputBuffer) {
            const decompressedText = Buffer.from(decompressState.outputBuffer).toString();
            // Calculate checksum of decompressed text
            let decompressedSum = checksumArray(decompressState.outputBuffer);
            console.log('Decompressed text length:', decompressedText.length);
            console.log('Compression successful:', text === decompressedText);
            console.log('Decompression successful:', text === decompressedText);
            console.log('Decompressed text sum:', decompressedSum);
        } else {
            console.error("Decompression failed: output buffer is null.");
        }
        
    } catch (error) {
        const err = error as Error;
        console.error('Error:', err.message, err.stack);
    }
}

// Example 2: Compress and decompress binary data
function demoBinaryCompression() {
    console.log("\n=== Demo 2: Binary Data Compression ===");
    
    try {
        // Create some sample binary data
        const binaryData = new Uint8Array(1000);
        for (let i = 0; i < binaryData.length; i++) {
            binaryData[i] = i % 256;
        }
        
        // Compression
        const compressState = {
            inputBuffer: binaryData,
            outputBuffer: new Uint8Array(2000) // Pre-allocate output buffer
        };
        
        const compressResult = lzo.compress(compressState);
        if (compressResult !== 0) {
            console.error("Compression failed!");
            return;
        }
        
        // Decompression
        const decompressState = {
            inputBuffer: compressState.outputBuffer,
            outputBuffer: null as Uint8Array | null
        };
        
        const decompressResult = lzo.decompress(decompressState);
        if (decompressResult !== 0) {
            console.error("Decompression failed!");
            return;
        }
        
        // Compare results
        let matches = true;
        if (decompressState.outputBuffer) {
            for (let i = 0; i < binaryData.length; i++) {
                if (binaryData[i] !== decompressState.outputBuffer[i]) {
                    matches = false;
                    break;
                }
            }
            const decompressChecksum = checksumArray(decompressState.outputBuffer);
            const compressChecksum = checksumArray(compressState.outputBuffer);
            const compressionRate = ((1 - (compressState.outputBuffer.length / binaryData.length)) * 100).toFixed(2);
            console.log('Original length:', binaryData.length);
            console.log('Compressed length:', compressState.outputBuffer.length, `(${compressionRate}%)`);
            console.log('Decompressed length:', decompressState.outputBuffer.length);
            console.log('Compression checksum:', compressChecksum);
            console.log('Compression successful:', matches);
            console.log('Decompression successful:', matches);
            console.log('Decompressed checksum:', decompressChecksum);
        } else {
            console.error("Decompression failed: output buffer is null.");
        }
        
    } catch (error) {
        const err = error as Error;
        console.error('Error:', err.message, err.stack);
    }
}

console.log("=== node-minilzo Demo ===");
demoStringCompression();
demoBinaryCompression();
