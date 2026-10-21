# Nghiệm thu ShopAI bài 1–11

Ngày đối chiếu: 22/10/2026 (Asia/Saigon). Đây là báo cáo về source và bằng chứng thực thi, không thay cho phần giải thích lý thuyết của người nộp bài.

Nguồn: [Bản đồ đề cương](https://thayduy.github.io/react-native-thuc-chien/docs/BAN_DO_DE_CUONG), Sprint/Acceptance Criteria của từng `CHUONG_1_LT_MOI` đến `CHUONG_11_LT_MOI`, và [ShopAI hoàn thiện](https://thayduy.github.io/react-native-thuc-chien/docs/SHOPAI_HOAN_THIEN).

## Đối chiếu từng bài

| Bài | Yêu cầu và triển khai đối chiếu | Bằng chứng / kết luận |
| --- | --- | --- |
| 1 | RN native, TypeScript, ESLint/Prettier, Android toolchain, ShopAI, GitHub | APK Debug/Release đã build, repo đã push, Release cài thành công Xiaomi 14. Đạt nền tảng Android; iOS không kiểm chứng trên Windows. |
| 2 | `src/`, alias, core components, TextInput/Image/list/Pressable, Fetch loading/error/retry/cleanup | `babel.config.js`, `tsconfig.json`, `HomeChapter2Pro`, `demos/FetchDemo`, `productApi`. Home cuối khóa nâng cấp FlashList + Axios/React Query theo bài 4/6/9; không hạ về Fetch cũ. |
| 3 | theme COLORS/SIZES/FONTS; Typography/Input/Button; countdown; Context; dark mode; i18next; Lottie | Sửa thêm `ShopExperience` vào footer Home: Việt/Anh, Lottie và countdown chạy/dừng/làm lại. Home dùng ShopInput, Typography, ShopButton. Có RNTL kiểm tra dịch và timer. Dịch Việt/Anh áp dụng khối minh họa; chưa tuyên bố toàn bộ ứng dụng song ngữ. |
| 4 | Safe Area, FlashList hai cột, memo, Reanimated fade-in, refresh, tái sử dụng ShopButton | `App.tsx`, `HomeScreen`, `ProductCard`. Đã đổi nút thêm giỏ ProductCard từ TouchableOpacity riêng sang ShopButton. FlashList v2 không dùng estimatedItemSize của v1. |
| 5 | Login/Register validation, auth gate/logout, tab icon/badge, productId params, native/JS deep link, drawer | AuthStack/MainTabs/RootStack/MainDrawer, RegisterScreen, linking.ts và Android manifest. RNTL + Maestro login/detail đạt; các lần audit trước đã thử deep link thật. |
| 6 | Zustand persist cart, React Query/Zod, pagination thật, Axios bearer/401, Checkout modal/useMutation, Orders/PAID, RTK song song | Mobile unit/RNTL + Nest regression + Maestro checkout. Redux nằm `src/store/redux/`, có Provider và màn Practice Debug. Đơn cuối khóa dùng Nest thay store local đúng chuyển tiếp bài 9. |
| 7 | Camera quyền/từ chối/settings recovery/background/scan lock; haptic; LocationBadge và GPS fallback | ScannerScreen/useCurrentLocation/haptics, native manifest. Người dùng xác nhận đã quét mã trên Xiaomi 14 thành công. Rung cảm nhận và GPS ngoài thực địa chưa được kiểm chứng riêng trong lượt audit này. |
| 8 | SecureStore, biometric gate/fallback, App Lock 2 phút; Chat history/typing/retry/suggestions; không lộ key | AuthStore/AppLockGate/useAppLock/AIChatScreen. Người dùng xác nhận vân tay trên Xiaomi 14 hoạt động. Gemini/system prompt ở backend theo bài 9; không cài lại SDK/key mobile của giai đoạn bài 8. App Lock có code/test; chưa ghi nhận thử chờ đủ 2 phút trên Xiaomi. |
| 9 | Nest Products/detail404, DTO/Pipe, Prisma SQLite, JWT login/register, Orders Guard/ownership, server total, PAID, Gemini, Swagger/env.example | Kiểm thử API thật `verify:live` đạt. Backend unit 3, Supertest 7, regression 7 đều đạt. Không mock API ở các phép thử này; DB test riêng, không xóa dữ liệu người dùng. |
| 10 | env, Crashlytics fatal/nonfatal/breadcrumb/keys, EAS OTA/rollback, keystore, R8, AAB, 3 profile, release build | Có lịch sử build/validate AAB, chữ ký, OTA/rollback và ảnh Console của người dùng có Crash Test/Home/Checkout. APK Release cài thành công trên Xiaomi 14 qua wireless ADB. APK QA tắt OTA riêng và dùng adb reverse; không thay bằng endpoint production giả. iOS thay bằng Android theo lựa chọn giáo trình. |
| 11 | formatCurrency/store tests, RNTL, coverage, Maestro, Nest unit/Supertest, CI, DevTools, Fastlane outline | 66 mobile tests/14 suites; 17 backend tests; lint/TS đạt. Ngưỡng coverage giữ nguyên. Workflow CI có lint/tests matrix/backend/build. DevTools Components/Profiler còn thiếu bằng chứng thao tác GUI; không đánh dấu đã đạt chỉ từ test. Fastlane là khung theo yêu cầu, chưa submit store. |

## Giao diện cần có

Source có đủ Login, Register, Home grid/search/refresh/pagination, Product Detail, Cart (empty/list/quantity/total), Checkout modal và kết quả, Orders, Order Detail/PAID, Scanner + permission fallback, AI Chat empty/suggestions/history/typing/retry, Settings/Drawer, biometric gate và dark/light theme. Khối thực hành Redux/Fetch dành cho Debug, không trộn giỏ demo vào giỏ mua hàng.

Giáo trình chủ yếu quy định thành phần, luồng và code mẫu; báo cáo này đánh giá bố cục/chức năng đó. Không tuyên bố khớp từng pixel một bản thiết kế Figma hoặc mọi màn hình đã có bản dịch Anh/Việt. Các trạng thái lỗi/empty/loading được đối chiếu trong source và test, không chỉ nhìn ảnh Home.

## Kết quả chạy lại

- ESLint và TypeScript: PASS.
- Jest mobile: 66 tests, 14 suites PASS. Coverage statements 59.39%, branches 58.19%, functions 55.61%, lines 58.22%; utils 100%. Báo cáo `coverage/coverage-summary.json` và HTML `coverage/lcov-report/index.html`.
- Backend: AuthService 3 PASS; Supertest 7 PASS; regression 7 PASS.
- API thật: health/Swagger, products/detail/404, DTO/Guard, register/login, checkout/server total/orders/PAID, Gemini qua Nest PASS; log `.sprint11-check/audit-live.log`.
- APK Release mới: BUILD SUCCESSFUL (3 phút 34 giây), xem `.sprint11-check/audit-release-final.log`.
- Maestro: 3/3 flows PASS (đăng nhập, checkout/pay, giao diện ngôn ngữ/countdown/sáng-tối/AI), đối chiếu đơn PAID `ORD-1792604014482-b41aae32`. Báo cáo mới `.maestro/artifacts/junit.xml`, `acceptance.json` và ảnh Home sáng/tối, ngôn ngữ/countdown, AI, đơn PENDING/PAID; chỉ kết luận PASS khi runner hoàn tất và đối chiếu đơn PAID ở backend.

## Những mục chưa được phép gọi là “100% đã nghiệm thu”

1. React Native DevTools: đã mở endpoint debugger và thấy Hermes target; helper chụp GUI không kết nối được. Chưa có bằng chứng Components tree và React Profiler record. Cần thao tác bản development cùng Metro, nhấn `j`, xem Components rồi ghi Profiler khi thêm hàng/đổi tab. Flipper là kiến thức lịch sử; không gắn plugin native cũ vào RN 0.86.
2. Xiaomi 14: đã cài Release, người dùng xác nhận camera và vân tay; còn kiểm tra riêng GPS/ước tính ship, cảm nhận haptic và App Lock sau hơn 2 phút ở nền.
CI đã kiểm chứng xanh toàn bộ ở [run 39642045282](https://github.com/huyvu2112005-ux/ShopAI/actions/runs/39642045282), commit de64aa1: lint/TypeScript, Node 22/24, backend và APK artifact. Hai run đầu thất bại do thiếu sdkmanager rồi sai tên package; đã sửa setup-android và `platforms;android-37.0`. Bản UI bổ sung sau commit đó đã được build Release cục bộ và test lại; cần phân biệt với source của run CI này.

Backend công khai HTTPS/phát hành store, iOS, payment gateway, Redis, streaming và push notification nâng cao không được tự coi là điều kiện bắt buộc bổ sung ngoài checklist tương ứng. Bản QA vẫn cần backend trên máy tính và kết nối ADB. PAID là thanh toán mô phỏng theo bài.

Hướng dẫn điện thoại: [ANDROID_PHONE_GUIDE.md](ANDROID_PHONE_GUIDE.md). Việc quét/vân tay hoạt động do người dùng xác nhận trong cuộc trò chuyện, không phải phép đo tự động của agent.

Lưu ý thiết bị: cuối lượt audit, Xiaomi chuyển offline nên bản UI bổ sung chưa cài đè được lên điện thoại. Bản Release mới đã cài và chạy đầy đủ trên máy ảo QA; cần nối lại wireless ADB để cập nhật Xiaomi, không cần gỡ ứng dụng.
