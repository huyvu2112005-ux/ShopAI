# Nghiệm thu chương 11

Đối chiếu tài liệu: https://thayduy.github.io/react-native-thuc-chien/docs/CHUONG_11_LT_MOI

## Kết quả kiểm chứng tại máy phát triển

| Hạng mục | Kết quả |
| --- | --- |
| ESLint, TypeScript | PASS |
| Jest mobile + RNTL | 66 tests / 14 suites PASS |
| Coverage mobile | Statements 59.39%, branches 58.19%, functions 55.61%, lines 58.22% |
| Tiện ích định dạng tiền | 100%; tái sử dụng ở giỏ, checkout, sản phẩm, đơn hàng |
| Store | Trên 95%; thêm/gộp/xóa/tổng tiền/số lượng/clear và checkout snapshot |
| AuthService unit | 3 PASS; mock Prisma/JWT, giữ bcrypt và AuthService thật |
| Supertest | 7 PASS; Nest, ValidationPipe, JWT Guard và SQLite riêng thật |
| Backend regression | 7 PASS; JWT/ownership/total/payment/persistence và AI transport |
| Maestro Windows 2.11.0 | 3/3 flows PASS trên emulator-5556 |
| APK USB Release | Build, cài và mở trên máy ảo PASS |

Maestro đã đăng nhập tài khoản QA mới, mở iPhone 16 Pro, thêm giỏ, checkout và thanh toán. Backend xác nhận đơn `ORD-1792604014482-b41aae32`, tổng 28.990.000 VND, trạng thái PAID. Báo cáo máy chạy: `.maestro/artifacts/junit.xml`, `acceptance.json` và ảnh chụp, được gitignore vì chứa dữ liệu thử nghiệm. Các tài khoản này chỉ là dữ liệu tổng hợp.

Ngưỡng coverage giữ đúng tài liệu: global statements/functions/lines 40%, branches 30%; utils 90/80/90/90; store 70/60/70/70. Không hạ ngưỡng hoặc chỉ đo riêng các file dễ đạt. Coverage toàn bộ `src` trừ types/constants/declarations/test được khai báo trong jest.config.js. RNTL 14 dùng API bất đồng bộ, các thao tác render/press đều await.

## Chạy lại

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test:coverage
cd shopai-backend
npm.cmd test
cd ..
npm.cmd run android:usb
npm.cmd run phone:connect -- emulator-5556
npm.cmd run e2e -- emulator-5556
```

Backend phải chạy cổng 3000 trước hai lệnh cuối. Maestro cần Java 17 và CLI trên PATH, hoặc bản portable tại `.sprint11-check/tools/maestro/lib`. E2E từ chối điện thoại thật vì launchApp clearState xóa dữ liệu ứng dụng; chỉ dùng máy ảo QA riêng. Supertest tạo SQLite riêng trong thư mục tạm, migrate và đóng/xóa sau khi chạy, không dùng DB đang phục vụ người dùng.

## CI và CD

Workflow `.github/workflows/ci.yml`: lint/TypeScript → mobile matrix Node 22/24 + coverage artifact; backend chạy độc lập; khi tất cả đạt trên main thì build Debug APK và lưu artifact. Node 18/20 trong ví dụ giáo trình không phù hợp React Native 0.86 hiện tại nên thay bằng các Node còn tương thích. APK CI cần Metro; APK USB Release có JS bundle sẵn.

`fastlane/Fastfile` là khung lane TestFlight theo phần CD của tài liệu, yêu cầu người triển khai cung cấp signing và App Store Connect key. Chưa upload store; không đưa credentials vào Git. Hướng dẫn Android thật ở [ANDROID_PHONE_GUIDE.md](ANDROID_PHONE_GUIDE.md).

## DevTools và Flipper

Chạy bản development cùng Metro: `npx.cmd expo start --dev-client`, mở ứng dụng development vào server đó rồi nhấn `j` trong terminal hoặc chọn Open DevTools ở menu phát triển. Components dùng xem cây component, props/state; Profiler ghi thao tác thêm hàng/đổi tab để xem component nào render lại và commit mất bao lâu. Không bật profiling trong APK Release USB.

React Native DevTools là công cụ hiện tại; Flipper là công cụ lịch sử trong giáo trình, Network Inspector dùng quan sát URL/status/request/response. Khi kiểm tra JWT cần che Authorization header và mật khẩu; không gửi Gemini key xuống mobile. Không cài Flipper native cũ vào RN 0.86. Phiên này chưa có bằng chứng chụp Components/Profiler; không đánh dấu mục thao tác DevTools đã nghiệm thu chỉ dựa trên unit/E2E.

## Giới hạn

APK Release đã cài thành công trên Xiaomi 14 qua wireless ADB; người dùng xác nhận camera và vân tay hoạt động. CI run 39642045282 đã xanh toàn bộ, gồm lint/TypeScript, mobile Node 22/24, backend và APK artifact: https://github.com/huyvu2112005-ux/ShopAI/actions/runs/39642045282 . Chưa có backend public hay phát hành store. Xem CHAPTER_1_11_AUDIT.md cho phần còn chờ bằng chứng.
