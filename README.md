## Bookstore API

<p>Dự án <strong>Bookstore API</strong> là một ứng dụng quản lý cửa hàng sách trực tuyến, được xây dựng bằng NestJS, MySQL và Docker. Dự án cung cấp các chức năng cơ bản như quản lý người dùng, danh mục sách, sản phẩm, đánh giá, giỏ hàng, thanh toán và tích hợp thanh toán zalopay.</p>

## Công nghệ sử dụng

- Backend: NestJS
- Database: MySQL
- Containerization: Docker
- Authentication: JWT (JSON Web Tokens)
- Payment Gateway: ZaloPay

## Các chức năng chính

## 1.Authentication (Xác thực)

- Đăng ký người dùng mới.
- Đăng nhập và cấp JWT token.
- Refresh token.

## 2.User Management (Quản lý người dùng)

- Xem thông tin người dùng.
- Cập nhật thông tin người dùng.
- Thay đổi mật khẩu.
- Quên mật khẩu.

## 3.Categories (Danh mục sách)

- Tạo, cập nhật, xóa danh mục.
- Lây danh sách danh mục

## 4.Products (Sản phẩm)

- Tạo, cập nhật, xóa sản phẩm.
- Lấy danh sách sản phẩm theo danh mục.
- Lấy thông tin chi tiết một sản phẩm.
- Quản lý nhập xuất kho.

## 5.Reviews (Đánh giá)

- Thêm đánh giá cho sản phẩm.
- Lấy danh sách đánh giá của một sản phẩm.
- Sủa đánh giá.
- Yêu thích đánh giá.
- Báo cáo đánh giá.

## 6.Wishlists (Danh sách yêu thích)

- Thêm sản phẩm vào danh sách yêu thích.
- Lấy danh sách yêu thích của người dùng.
- Xóa sản phẩm khỏi danh sách yêu thích.

## 7.Carts (Giỏ hàng)

- Thêm sản phẩm vào giỏ hàng.
- Cập nhật số lượng sản phẩm trong giỏ hàng.
- Xóa sản phẩm khỏi giỏ hàng.
- Lấy thông tin giỏ hàng của người dùng.

## 8.Payment (Thanh toán)

- Tích hợp thanh toán ZaloPay.
- Tạo đơn hàng và xử lý thanh toán.
- Xác nhận thanh toán thành công.

## Cài đặt và chạy dự án

## Yêu cầu hệ thống

- Node.js (16 trở lên)
- Docker
- Docker compose

## Các bước cài đặt

1. Clone dự án

```bash
$ git clone https://github.com/your-username/bookstore-api.git
$ cd bookstore-api
```

2. Cài đặt dependence

```bash
$ yarn
```

3. Cấu hình môi trường
   Tạo file .env từ .env.example và điền các giá trị phù hợp:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=password
DB_NAME=bookstore
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=your_mail_user@gmail.com
MAIL_PASS=your_pass
MAIL_FROM=your_from
JWT_SECRET=qwerasdjfkhasdkjfhasd
EXP_IN_REFRESH_TOKEN=1d
```

4. Chạy dockercompose
   Dự án sử dụng Docker để chạy MySQL. Chạy lệnh sau để khởi động container:

```bash
$ docker-compose up -d
```

5. Chạy ứng dụng

```bash
$ yarn start:dev
```

Ứng dụng sẽ chạy tại http://localhost:3000.

6. Truy cập Swagger UI

Truy cập http://localhost:3000/api để xem và tương tác với các API thông qua Swagger UI.

```bash
bookstore-api/
├── src/
│ ├── common/ # Các utility, helper và shared modules
│ ├── config/ # Cấu hình ứng dụng
│ ├── database/ # Cấu hình cơ sở dữ liệu và kết nối
│ ├── modules
│ │ ├── address/ # Địa chỉ người dùng
│ │ ├── auth/ # Xác thực người dùng
│ │ ├── users/ # Quản lý người dùng
│ │ ├── categories/ # Quản lý danh mục
│ │ ├── products/ # Quản lý sản phẩm
│ │ ├── reviews/ # Quản lý đánh giá
│ │ ├── wishlists/ # Quản lý danh sách yêu thích
│ │ ├── carts/ # Quản lý giỏ hàng
│ │ ├── payments/ # Xử lý thanh toán (ZaloPay)
│ │ ├── mail/ # xử lý mail
│ │ └── app.module.ts # Module chính của ứng dụng
│ │ └── main.ts # File khởi chạy ứng dụng
├── test/ # Unit tests và integration tests
├── docker-compose.yml # Cấu hình Docker Compose
├── Dockerfile # Dockerfile cho ứng dụng
├── .env.example # Mẫu file cấu hình môi trường
└── README.md # Tài liệu dự án
```

## API Endpoints

## auth

- POST /auth/register - Đăng ký người dùng mới.
- POST /auth/login - Đăng nhập và nhận JWT token.
- POST /auth/refresh-token - Làm mới JWT token.

## auth

- PUT /users/change-profile - Cập nhật thông tin người dùng.
- PUT /users/change-password - Thay đổi mật khẩu.
- PUT /users/forgot-password - Quên mật khẩu.
- PUT /users/reset-password - Đặt lại mật khẩu.

## categoies

- GET /categories/get-categories - Lấy danh sách danh mục.
- POST /categories/create-category - Tạo danh mục mới.
- PUT /categories/update-category/:id - Cập nhật danh mục.
- DELETE /categories/delete-category/:id - Xóa danh mục.

## products

- GET /products - Lấy danh sách sản phẩm.
- GET /products/:slug - Lấy thông tin chi tiết một sản phẩm.
- POST /products/create-product - Tạo sản phẩm mới.
- PUT /products/update-product/:id - Cập nhật sản phẩm.
- DELETE /products/delete-product/:id - Xóa sản phẩm.
- PUT /products/update-stock - Nhập xuất số lượng sản phẩm.
- GET /products/history - Xem lịch sử nhập xuất.

## reviews

- GET /reviews - Lấy danh sách đánh giá của sản phẩm.
- POST /reviews - Thêm đánh giá cho sản phẩm.
- PUT /reviews/:rid - Cập nhật đánh giá.
- POST /reviews/like-review - Thích đánh giá.
- POST /reviews/report-review - Báo cáo đánh giá.

## wishlists

- GET /wishlists - Lấy danh sách yêu thích của người dùng.
- POST /wishlists - Thêm sản phẩm vào danh sách yêu thích.
- DELETE /wishlists/:pid - Xóa sản phẩm khỏi danh sách yêu thích.

## carts

- GET /carts - Lấy thông tin giỏ hàng của người dùng.
- POST /carts - Thêm sản phẩm vào giỏ hàng.
- PUT /carts - Cập nhật số lượng sản phẩm trong giỏ hàng.
- DELETE /carts/:pid - Xóa sản phẩm khỏi giỏ hàng.

## payments

- POST /checkouts/cod - Tạo đơn hàng COD.
- POST /checkouts/zalopay - Tạo đơn hàng và chuyển hướng đến zalopay.
- GET /checkouts/callback - Zalopay gọi callback và trả về kết quả.
- PUT /checkouts/shipped/:oid - Chuyển trạng thái đơn hàng sang shipped.
- PUT /checkouts/cancel-order/:oid - Hủy đơn hàng.
- PUT /checkouts/deliver-order/:oid - Chuyển đơn hàng sang nhận hàng delived.
- GET /checkouts/get-orders-user - Lấy danh sách dơn hàng đã mua.
- GET /checkouts/get-orders = Lấy danh sách đơn hàng.

## addresses

- POST /address - Tạo mới một địa chỉ.
- PUT /address/:aid - Sửa một địa chỉ.
- DELETE /address/:aid - Xóa một địa chỉ.
- GET /address - Xem danh sách địa chỉ.
- PUT /address/address-default/:aid - Đặt địa chỉ làm mặc định.

## Tích hợp Zalopay

Dự án tích hợp ZaloPay để xử lý thanh toán. Các bước tích hợp bao gồm:

1. Tạo đơn hàng và gửi yêu cầu thanh toán đến ZaloPay.
2. Xử lý callback từ ZaloPay để xác nhận thanh toán thành công.
