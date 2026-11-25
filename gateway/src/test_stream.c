#include <stdio.h>
#include <string.h>
#include "stream.h"

void feed(struct StreamBuffer *sb, const char *bytes, size_t n) {
    memcpy(sb->data + sb->len, bytes, n);
    sb->len += n;
}

int failed = 0;

void check(const char *name, int ok) {
    printf("%s %s\n", ok ? "[ĐẠT]" : "[SAI]", name);
    if (!ok) failed++;
}

int main(void) {
    struct StreamBuffer sb;
    char msg[STREAM_BUF_SIZE];
    int r;

    /* Trường hợp 1: tin chưa tới đủ */
    streamInit(&sb);
    feed(&sb, "Hel", 3);
    r = streamNextMessage(&sb, msg, sizeof(msg));
    check("1. 'Hel' -> chưa có tin (0)", r == 0);
    check("1. len vẫn là 3",             sb.len == 3);

    /* Trường hợp 2: ... bạn viết tiếp */

    /* Trường hợp 3: ... */

    /* Trường hợp 4: ... */

    printf("\n%s\n", failed == 0 ? "TẤT CẢ ĐẠT" : "CÓ TRƯỜNG HỢP SAI");
    return failed;
}