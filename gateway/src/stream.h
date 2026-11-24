#ifndef STREAM_H
#define STREAM_H

#include <stddef.h> //size_t
#define STREAM_BUF_SIZE 4096

typedef struct StreamBuffer
{
    /* data */
    char data[STREAM_BUF_SIZE]; // data
    size_t len; // stream len
};


void streamInit(struct StreamBuffer *sb);
int streamNextMessage(struct StreamBuffer *sb, char *out, size_t outSize);

#endif