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
        
        const compressResult = lzo.compress(inputBuffer);
        console.log('Compression result:', compressResult);
    
        
        // Calculate checksum of compressed data
        let compressedSum = checksumArray(compressResult);
        const compressionRate = ((1 - (compressResult.length / inputBuffer.length)) * 100).toFixed(2);
        console.log('Original text length:', text.length);
        console.log('Compressed length:', compressResult.length, `(${compressionRate}%)`);
        console.log('Compressed checksum:', compressedSum);

        // Decompression
        const decompressResult = lzo.decompress(compressResult);
        console.log('Decompression result:', decompressResult);
        
      
        
        // Verify results
        if (decompressResult) {
            const decompressedText = Buffer.from(decompressResult).toString();
            // Calculate checksum of decompressed text
            let decompressedSum = checksumArray(decompressResult);
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
        
        const compressResult = lzo.compress(binaryData);
        console.log('Compression result:', compressResult);
        
        const decompressResult = lzo.decompress(compressResult);
        console.log('Decompression result:', decompressResult);
            
        
        // Compare results
        let matches = true;
        if (decompressResult) {
            for (let i = 0; i < binaryData.length; i++) {
                if (binaryData[i] !== decompressResult[i]) {
                    matches = false;
                    break;
                }
            }
            const decompressChecksum = checksumArray(decompressResult);
            const compressChecksum = checksumArray(compressResult);
            const compressionRate = ((1 - (compressResult.length / binaryData.length)) * 100).toFixed(2);
            console.log('Original length:', binaryData.length);
            console.log('Compressed length:', compressResult.length, `(${compressionRate}%)`);
            console.log('Decompressed length:', decompressResult.length);
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
