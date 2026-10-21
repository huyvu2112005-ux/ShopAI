# ShopAI — Sprint 9

Backend NestJS nằm cùng repository với ứng dụng React Native. Đã có Products, Auth (JWT + bcrypt), Orders (Prisma/SQLite), AI proxy Gemini, Swagger, ValidationPipe, Helmet, giới hạn request và Health Check.

## Chạy backend

```powershell
cd shopai-backend
npm.cmd install
Copy-Item .env.example .env
# Sửa JWT_SECRET trong .env thành chuỗi ngẫu nhiên ít nhất 32 ký tự.
# Điền GEMINI_API_KEY nếu muốn sử dụng chat AI.
npm.cmd run db:migrate -- --name init
npm.cmd run db:seed
npm.cmd run start:dev
```

Trong workspace hiện tại, `.env`, migration và tài khoản demo đã được tạo; không cần ghi đè `.env`. Chỉ cần điền Gemini key và chạy `npm.cmd run start:dev`.

Đăng nhập demo: `demo@shopai.com` / `123456`. Swagger: `http://localhost:3000/api/docs`. Health: `http://localhost:3000/api/health`.

## Nối ứng dụng

Đặt `EXPO_PUBLIC_API_URL` trong `.env` ở thư mục ShopAI (xem `.env.example`), rồi khởi động lại Metro với cache mới:

- Android emulator: `http://10.0.2.2:3000` (đã cấu hình mặc định).
- Điện thoại thật: `http://<IP LAN máy tính>:3000`; điện thoại và máy tính cùng Wi-Fi, cho phép cổng 3000 qua firewall.
- iOS simulator: `http://localhost:3000`.

Từ thư mục ShopAI, chạy `npm.cmd start` và `npm.cmd run android`. Server lắng nghe `0.0.0.0`; Home hiển thị trạng thái server. React Native dùng HTTP cho môi trường học tập; khi triển khai sử dụng HTTPS.

## Kiểm chứng

```powershell
cd shopai-backend
npm.cmd run build
npm.cmd test
```

Bộ kiểm thử dùng SQLite riêng, tự khởi động và khởi động lại backend, kiểm tra catalog 20 sản phẩm, ảnh, chi tiết 404, DTO 400, JWT 401, đăng ký trùng 409, chặn tổng tiền gian lận, giới hạn số lượng, tách đơn theo user, thanh toán và dữ liệu còn sau restart. Không thay đổi database demo.

Ứng dụng đã nối API đăng ký/đăng nhập, sản phẩm qua Zod, checkout qua Bearer token, lịch sử/chi tiết/thanh toán và chat AI có gợi ý, loading, ngữ cảnh 5 lượt, thử lại khi lỗi. Thanh toán là thao tác giả lập PENDING → PAID theo bài học, chưa tích hợp cổng thanh toán thật. Danh mục được giữ trong RAM theo phạm vi bắt buộc bài 9; User và Order được lưu SQLite. 20 sản phẩm sử dụng ảnh có sẵn của ShopAI, gồm các phiên bản mẫu để thực hành.

Gemini key chỉ ở backend `.env`; `.env.example` không có key thật. Dùng SDK `@google/genai` và model cấu hình bởi `GEMINI_MODEL`, mặc định `gemini-3.8-flash`. Model đã được cập nhật theo phản hồi Google vì `gemini-2.5-flash` không còn khả dụng với tài khoản mới. Đã kiểm chứng `/api/ai/chat` trả lời thật và nhớ đúng ngân sách 15 triệu ở lượt tiếp theo. Khi Google quá tải, ứng dụng hiển thị lỗi và cho phép thử lại; log backend chỉ ghi mã lỗi và tên model, không ghi key.

## Các API

| API | Quyền truy cập |
| --- | --- |
| GET /api/products, GET /api/products/:id | Public |
| POST /api/products | Public, minh họa DTO theo bài |
| POST /api/auth/login, POST /api/auth/register | Public |
| GET /api/orders, GET /api/orders/:id | JWT, chỉ đơn của user |
| POST /api/orders | JWT, server tính giá và xác nhận total |
| POST /api/orders/:id/pay | JWT, chỉ đơn của user, thanh toán lặp không tạo thêm giao dịch |
| POST /api/ai/chat | Public, tối đa 10 request/phút/IP |
| GET /api/health | Public |

Swagger có nút Authorize để nhập JWT. Các API mặc định giới hạn 120 request/phút/IP. SQLite và `.env` đã được đưa vào `.gitignore`; migration và `.env.example` được giữ trong source. Không tự động commit thay đổi.

Bài gốc: https://thayduy.github.io/react-native-thuc-chien/docs/CHUONG_9_LT_MOI
SDK Gemini: https://ai.google.dev/gemini-api/docs/libraries
