#include "stream.h"
#include <string.h>

/**
 * @brief Stream Initial function
 * @param a client stream buffer
 * @details
 *  This function init a stream buffer
 * @return null
 */
void streamInit(struct StreamBuffer *sb){
    sb->len = 0;
}

/**
 * @brief Xu ly cat stream chuyen sang stream sau
 * @param 
 *           sb: a client buffer,
 *           out: an array that copy data to cut,
 *           outSize: out array's size
 * @details
 *  
 * @return 
 *      1:  cut data successfully 
 *      0:  Khong hoan chinh
 *     -1:  buffer too long
 */

int streamNextMessage(struct StreamBuffer *sb, char *out, size_t outSize){
    char *pos = memchr(sb->data, '\0', sb->len); // Finding the end of data stream "\0"

    if(pos == NULL){
        if(sb->len == STREAM_BUF_SIZE) return -1;
        else return 0;
    }

    //Calculate size of data stream
    size_t used = pos - sb->data + 1;

    // Check if out not enough
    if(used > outSize) return -1;
    // Copy data to out
    memcpy(out, sb->data, used);
    // Move
    memmove(sb->data, sb->data + used, sb->len - used);
    sb->len -= used;
    return 1;
}
