#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <string.h>
#include <unistd.h>
#include <poll.h>
#include "stream.h"

#define MAX_CLIENT 50
#define MAX 1024

struct pollfd fds[MAX_CLIENT + 1];
struct StreamBuffer streams[MAX_CLIENT+1];

void handleClient(struct pollfd *p, struct StreamBuffer *stream){
    // Received a msg from client
    size_t space = STREAM_BUF_SIZE - stream->len;
    ssize_t bytes = recv(p->fd,stream->data + stream->len, space, 0);
    if(bytes < 0){
        perror("recv");
        p->fd = -1;
        return;
    }
    if(bytes == 0){
        printf("[%ld] Client is disconnected\n", p - fds);
        p->fd = -1;
        return;
    }
}

int main(int argc, char *argv[]){
    int sockFd;
    struct sockaddr_in serverAddress, clientAddress;
    socklen_t serverLen, clientLen;

    /**
     * CHECK CONDITION
     *  check argument
     *  check port
     */

    if(argc != 2){
        fprintf(stderr, "ERROR: The number of input arguments is incorrect.\nTrue form: ./server [PORT]\n");
        return -1;
    }
    int port = atoi(argv[1]);
    if(port <=0 || port > 65535){
        fprintf(stderr, "ERROR: Port number should be in range of (0, 65535]");
        return -1;
    }
    /*-- Create server socket --*/
    sockFd = socket(AF_INET,SOCK_STREAM, 0);
    if(sockFd < 0){
        fprintf(stderr, "ERROR: Failed to create socket\n");
        return -1;
    }

    /*-- Setting socket option --*/
    int opt = 1;
    setsockopt(sockFd,SOL_SOCKET,SO_REUSEADDR, &opt, sizeof(opt));

    /*-- Binding --*/
    serverLen = sizeof(serverAddress);
    memset(&serverAddress,0,serverLen);
    serverAddress.sin_family = AF_INET;
    serverAddress.sin_port = htons(port);
    serverAddress.sin_addr.s_addr = htonl(INADDR_ANY);
    if(bind(sockFd,(struct sockaddr *) &serverAddress, &serverLen) < 0){
        perror("bind");
        return -1;
    }

    /*-- Listen --*/
    if(listen(sockFd, 10) < 0){
        perror("listen");
        return -1;
    }

    /*--  accept -> handle request from client --*/
    // Initial client poll fd array
    for(int i = 0; i < MAX_CLIENT + 1; i++){
        fds[i].fd = -1;
    }
    // set fds[0] to sockfd
        fds[0].fd = sockFd;
        fds[0].events = POLLIN;

    // memset client
    clientLen = sizeof(clientAddress);
    memset(&clientAddress, 0, clientLen);

    while(1){
        int ready = poll(fds,MAX_CLIENT+1, -1); // wait infinite time (-1)
        if(ready < 0){
            perror("poll");
            break;
        }
        if(fds[0].revents & POLLIN){
            int connFd = accept(sockFd, (struct sockaddr *)&clientAddress, &clientLen);
            int isFull = 1;
            if(connFd < 0){
                perror("accept");
                continue;
            }
            for(int i= 1; i < MAX_CLIENT +1; i++){
                if(fds[i].fd == -1){
                    fds[i].fd = connFd;
                    fds[i].events = POLLIN;
                    streamInit(&streams[i]);
                    printf("New Client in [%d]", i);
                    isFull = 0;
                    break;
                }
            }
            if(isFull){
                printf("SERVER is full\n");
                close(connFd);
            }
        }

        for(int i = 1; i < MAX_CLIENT; i++){
            if(fds[i].fd == -1) continue;
            if(fds[i].revents & (POLLIN | POLLERR | POLLHUP)){
                handleClient(&fds[i], &streams[i]);
            }
        }
    }

    // clear fds
    for(int i = 0; i < MAX_CLIENT; i++)fds[i].fd = -1;
    close(sockFd);

    return 0;
}