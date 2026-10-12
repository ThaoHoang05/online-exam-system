# online-exam-system

Hệ thống thi trắc nghiệm trực tuyến, gồm một **server viết bằng C** và một **giao diện web** (HTML/CSS/JavaScript).

> **Trạng thái:** dự án đang ở giai đoạn dựng khung. Phần lớn thư mục còn trống, nên vai trò ghi dưới đây là vai trò dự kiến.

## Cấu trúc thư mục

```
online-exam-system/
├── server/                 # Mã nguồn phía server (C)
│   ├── Makefile            # Script biên dịch server
│   ├── include/            # Header (.h) dùng chung cho các module
│   └── src/
│       ├── main.c          # Điểm khởi chạy: khởi tạo và chạy server
│       ├── net/            # Tầng mạng: socket, lắng nghe kết nối, gửi/nhận dữ liệu
│       ├── core/           # Thành phần lõi: vòng lặp xử lý, quản lý phiên/kết nối
│       ├── service/        # Logic nghiệp vụ: tài khoản, đề thi, câu hỏi, làm bài, chấm điểm
│       ├── db/             # Truy cập dữ liệu: lưu và đọc người dùng, đề thi, kết quả
│       ├── util/           # Tiện ích dùng chung: log, xử lý chuỗi, cấu hình...
│       └── tests/          # Kiểm thử cho các module server
├── web/                    # Giao diện người dùng (client)
│   ├── index.html          # Trang vào
│   ├── html/               # Các trang con (đăng nhập, danh sách đề, làm bài, kết quả...)
│   ├── css/                # Stylesheet
│   └── js/                 # Script phía client, giao tiếp với server
├── .gitignore
├── LICENSE                 # Giấy phép MIT
└── README.md
```

### Phân tầng phía server

Các module phía server được tách theo tầng, mỗi tầng chỉ gọi xuống tầng ngay dưới nó:

```
net  →  core  →  service  →  db
              (util và include dùng chung cho mọi tầng)
```

- **net** nhận yêu cầu từ client và chuyển cho **core**.
- **core** điều phối yêu cầu đến đúng **service**.
- **service** xử lý nghiệp vụ và dùng **db** để đọc/ghi dữ liệu.

## Biên dịch và chạy

Cần môi trường Linux (hoặc WSL) có `gcc` và `make`.

```bash
cd server
make            # khi Makefile đã được hoàn thiện
./<tên-file-thực-thi>
```

Tạm thời, có thể biên dịch trực tiếp:

```bash
gcc server/src/main.c -o exam_server
./exam_server
```

Để dùng giao diện web, mở `web/index.html` trên trình duyệt.

## Giấy phép

Phát hành theo [Giấy phép MIT](LICENSE) © 2026 Thao Hoang.
