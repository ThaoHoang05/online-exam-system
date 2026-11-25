#include <stdio.h> 
#include <stdlib.h>
#include <arpa/inet.h> //htonl: host t
#include <sys/socket.h> //socket()
#include <netinet/in.h> //sockaddr_in
#include <string.h> //memset
#include <unistd.h>

/**
 * Đầu vào hợp lệ ./client 127.0.0.1 5500
 */

int main(int argc, char *argv[]){
    int clientFd;
    int port;
    struct in_addr address;
    struct sockaddr_in serverAddress;
    char buf[1025];
    ssize_t bytes;
    
    //Kiểm tra đầu vào có hợp lệ hay không
    if(argc != 3){
        printf("ERROR: Sai đầu vào");
        return -1;
    }

    // Kiểm tra port có hợp lệ
    port = atoi(argv[2]);
    if(port <= 0 || port > 65535){
        printf("ERROR: Sai port");
        return -1;
    }

    // Kiểm tra address
    if(!inet_pton(AF_INET, argv[1], &address)){
        printf("ERROR: địa chỉ mạng không hợp lệ");
        return -1;
    };

    // Tạo socket
    clientFd = socket(AF_INET, SOCK_STREAM, 0);
    if(clientFd < 0) {
        printf("ERROR: Không tạo được client");
        return -1;
    }


    //Gán địa chỉ server
    memset(&serverAddress, 0, sizeof(serverAddress));
    serverAddress.sin_family = AF_INET;
    serverAddress.sin_port = htons(port);
    serverAddress.sin_addr = address;

    if(connect(clientFd,(struct sockaddr*) &serverAddress, sizeof(serverAddress)) < 0){
        fprintf(stderr, "ERROR: Failed to connect to server!\n");
        return -1;
    }
    
    while(1){
        printf("Nhập thông điệp:");
        if(fgets(buf, sizeof(buf), stdin) == NULL){
            break;          // Ctrl+D hoặc hết dữ liệu nhập: thoát vòng lặp
        }
        buf[strcspn(buf, "\n")] = '\0';   // xóa ký tự xuống dòng

        //gửi thông điệp tới server
        bytes = send(clientFd, buf, strlen(buf) + 1, MSG_NOSIGNAL);
        if (bytes < 0) {
            perror("send");
            break;
        }

        //nhân thông điệp từ server
        bytes = recv(clientFd, buf, sizeof(buf) - 1, 0);
        if (bytes <= 0) {
            printf("Server đã đóng kết nối\n");
            break;
        }
        buf[bytes] = '\0';
        printf("%s", buf);
        
        //Có thông điệp server đóng thì thoát ra và đóng kết nối.
        if(strcmp(buf,"Bye!\n") == 0){
            break;
        }
    }

    close(clientFd);
    
    return 0;
}