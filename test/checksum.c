#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <lzo/lzo1x.h>

#define IN_LEN      (128*1024L)
#define OUT_LEN     (IN_LEN + IN_LEN / 16 + 64 + 3)
#define HEAP_ALLOC(var,size) \
    lzo_align_t __LZO_MMODEL var [((size) + (sizeof(lzo_align_t) - 1)) / sizeof(lzo_align_t)]

unsigned long checksum(const unsigned char *data, size_t length) {
    unsigned long sum = 0;
    for (size_t i = 0; i < length; i++) {
        sum += data[i]+i;
    }
    return sum;
}

int main() {
    printf("Testing C LZO1X compression\n");
    if (lzo_init() != LZO_E_OK) {
        printf("LZO library initialization failed\n");
        return 1;
    }

    const char *baseSentence = "This is a test sentence.";
    char sentence[IN_LEN];
    unsigned char compressed[OUT_LEN];
    unsigned char decompressed[IN_LEN];
    lzo_uint compressedLength, decompressedLength;
    HEAP_ALLOC(wrkmem, LZO1X_1_MEM_COMPRESS);

    for (int i = 1; i <= 10; i++) {
        memset(sentence, 0, IN_LEN);
        for (int j = 0; j < i; j++) {
            strcat(sentence, baseSentence);
        }

        size_t sentenceLength = strlen(sentence);
        unsigned long bufferChecksum = checksum((unsigned char *)sentence, sentenceLength);

        if (lzo1x_1_compress((unsigned char *)sentence, sentenceLength, compressed, &compressedLength, wrkmem) != LZO_E_OK) {
            printf("Compression failed\n");
            return 1;
        }

        unsigned long compressedChecksum = checksum(compressed, compressedLength);

        if (lzo1x_decompress(compressed, compressedLength, decompressed, &decompressedLength, NULL) != LZO_E_OK) {
            printf("Decompression failed\n");
            return 1;
        }

        unsigned long decompressedChecksum = checksum(decompressed, decompressedLength);
        double compressionRate = ((1.0 - ((double)compressedLength / sentenceLength)) * 100.0);

        printf("Sentence %d: bufferChecksum = %lu, compressedChecksum = %lu, decompressedChecksum = %lu, compressedLength = %lu, decompressedLength = %lu, compressionRate = %.2f%%\n",
               i, bufferChecksum, compressedChecksum, decompressedChecksum, compressedLength, decompressedLength, compressionRate);

        if (bufferChecksum != decompressedChecksum) {
            printf("Checksum mismatch for sentence %d\n", i);
            return 1;
        }
    }

    return 0;
} 