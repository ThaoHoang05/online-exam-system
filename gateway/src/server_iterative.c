#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <string.h>
#include <unistd.h>


#define MAX 1024

int main(int argc, char *argv[]){
    int sockFd, connFd;
    uint16_t serverPort;
    struct sockaddr_in listenSocket, clientSocket;
    ssize_t len;
    char buf[MAX], message[MAX];

    /*-- KIỂM TRA PORT HỢP LỆ --*/
    if(argc != 2){
        fprintf(stderr, "LỖI: Đầu vào có dạng như sau ./server [PORT]\n");
        return -1;
    }
    int port = atoi(argv[1]);
    if(port <= 0 || port > 65535){
        fprintf(stderr, "LỖI: Cổng không hợp lệ!\n Cổng nên nằm trong khoảng (0,65532]\n");
        return -1;
    }
    serverPort = (uint16_t)port;
    
    /*-- TẠO SOCKET --*/
    sockFd = socket(AF_INET, SOCK_STREAM, 0);
    if(sockFd == -1 ){
        fprintf(stderr, "LỖI: không tạo được socket\n");
        return -1;
    }

    /*-- BINDING SOCKET --*/
    memset(&listenSocket, 0, sizeof(listenSocket));
    listenSocket.sin_family = AF_INET;
    listenSocket.sin_port = htons(serverPort);
    listenSocket.sin_addr.s_addr = htonl(INADDR_ANY);



    if(bind(sockFd,(struct sockaddr *) &listenSocket, sizeof(listenSocket)) != 0){
        fprintf(stderr, "ERROR: Cannot binding socket\n");
        return -1;
    }

    /*-- LISTEN --*/
    if(listen(sockFd, 5) < 0){
        fprintf(stderr, "ERROR: Failed to listen\n");
        return -1;
    }
    printf("SERVER is listening in %d\n", serverPort);

    int clientLength = sizeof(clientSocket);

    /*-- ACCEPT Client --*/
    connFd = accept(sockFd, (struct sockaddr*)&clientSocket,(socklen_t *) &clientLength);
    if(connFd < 0){
        fprintf(stderr, "ERROR: Failed to accept client\n");
        return -1;
    }
    printf("Connect successfully\n");

    strcpy(message, "SERVER: received a message from client\n");

    /*-- Event loop --*/
    while(1){
        len = recv(connFd, buf, MAX - 1, 0);
        if(len < 0){
            fprintf(stderr, "ERROR: Failed to received!\n");
            return -1;
        }
        if(len == 0){
            printf("Client disconnect\n");
            break;
        }
        buf[len] = '\0';

        printf("CLIENT: %s\n", buf);

        if(strcmp(buf, "Exit") == 0){
            strcpy(message, "Server is closed!\n");
            send(connFd, message, strlen(message) + 1, 0);
            break;
        }

        send(connFd, message, strlen(message) + 1, 0);
    }
    close(connFd);
    close(sockFd);
    return 0;
}