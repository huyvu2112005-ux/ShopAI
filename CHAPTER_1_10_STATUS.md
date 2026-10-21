# ShopAI — nghiệm thu bài 1–10

Cập nhật 21/10/2026. Native/runtime **1.1.0**, Android versionCode **10100**.
Đối chiếu [đề cương](https://thayduy.github.io/react-native-thuc-chien/docs/BAN_DO_DE_CUONG) và các chương 1–10.

| Bài | Phần triển khai |
|---|---|
| 1 | React Native native build, TypeScript, Android toolchain và Git/GitHub |
| 2 | Cấu trúc src/alias, TextInput/Image/list, Fetch loading/error/retry/cleanup |
| 3 | UI Kit, variants/loading/disabled, countdown, Context/useReducer, theme sáng/tối persist |
| 4 | Safe Area, FlashList v2 hai cột, memo/FadeIn và pull-to-refresh |
| 5 | Login/Register, auth gate, tabs/icon/badge, drawer/settings, productId detail và deep link native/JS |
| 6 | Zustand cart persist, tăng/giảm theo tồn kho; React Query/Zod; phân trang server; checkout/orders/pay; Redux demo riêng |
| 7 | Vision Camera, Camera/Location permissions, Settings recovery, chống quét lặp, background lifecycle, rung/GPS fallback |
| 8 | SecureStore, biometric gate/App Lock sau 2 phút; AI chat/history/typing/retry/suggestions và entry từ Home |
| 9 | NestJS/DTO/ValidationPipe, Prisma SQLite, JWT, Orders Guard/ownership, server total, PENDING→PAID, Gemini proxy, Swagger/.env.example |
| 10 | env.ts, Crashlytics/crash/nonfatal/breadcrumb/custom keys, OTA/rollback, keystore/R8, signed APK/AAB, 3 EAS profile |

## Kiểm chứng

- Mobile **26/26 test**, 8 suite; backend **7/7 test**. TypeScript và lint đạt.
- API thật: health/Swagger, 20 sản phẩm, đủ 8 ảnh, pagination 8/8/4, search ngoài trang đầu, DTO/Guard, register/login, checkout/server total, PAID và Gemini hai lượt đạt.
- UI Debug/Release: sáng/tối, drawer/settings, Redux demo, cart, deep link `shopai://product/backend_prod_19`, AI thật và checkout đã kiểm tra.
- Đơn Release `ORD-1792558923737-3d1517ab` đã PAID, còn sau mở lại/cài cập nhật.
- Camera: từ chối → Mở Cài đặt → cấp lại → fallback không có camera sau trên máy ảo. Chống lặp và camera background có unit test.
- Sửa ScreenFragment restoration; đóng tiến trình ở nền rồi mở lại không có crash trong buffer.
- Firebase Console đã có Crash Test, ProductFetchFailed và CheckoutOrderFailed theo ảnh người dùng.
- APK/AAB Release build thành công; apksigner và bundletool validate đạt.

Bằng chứng cục bộ trong `.sprint10-check/` không đưa lên Git: `mobile-audit-tests-final.log`, `backend-audit-tests.log`, `live-verification.json`, `release-acceptance-final.log`, `release-final-signature.log`, `release-final-bundle-validation.log`, `ota-acceptance-device.json` và ảnh máy ảo.

## Chạy lại

Windows dùng `npm.cmd`/`npx.cmd`.

Backend: trong `shopai-backend`, chạy `npm.cmd install`, tạo `.env` theo `.env.example`, chạy `npm.cmd run db:migrate`, `npm.cmd run db:seed`, `npm.cmd run start:dev`. Không seed lại khi cần giữ dữ liệu. Gemini key/JWT secret chỉ ở `.env` backend.

Mobile: ở gốc chạy `npm.cmd install`; đặt Firebase config riêng tại `android/app/google-services.json`; chạy `npm.cmd run android:firebase:debug`, rồi `npm.cmd start -- --dev-client --scheme shopai`. Dùng `adb reverse tcp:8081 tcp:8081` khi cần. Không dùng Expo Go cho Firebase/Vision Camera native.

Kiểm tra: `npx.cmd tsc --noEmit`, `npm.cmd run lint`, `npm.cmd test -- --runInBand`; backend chạy `npm.cmd test`. `npm.cmd run verify:live` cần backend đang chạy, sẽ tạo tài khoản/đơn QA và gọi Gemini thật.

Release: cấu hình keystore riêng qua `scripts/`, rồi `npm.cmd run android:release`. APK ở `android/app/build/outputs/apk/release/app-release.apk`; AAB ở `android/app/build/outputs/bundle/release/app-release.aab`. Không đưa file build lên Git.

QA dùng API `http://10.0.2.2:3000`; backend phải chạy trên máy tính. Production cần backend HTTPS truy cập được từ điện thoại và build với cấu hình production.

## OTA

Project `@huyvu2112005/shopai`, UUID `398db7e1-1c5f-474a-b2ce-db8d4a308fec`. Development/staging/production dùng channel riêng trong eas.json.

OTA cuối: group `db867387-4870-49db-97dc-6e1b3e2175a3`, Android update `01a15ce2-91f3-7a78-b8ea-c6a9e420d683`, runtime 1.1.0. Máy ảo xác nhận READY, successfulLaunches=1, failedLaunches=0.

APK SHA-256: `D17069E233A1002A319AF3FA4216C59A7A5A802F2FA769B4F02293EC5A973BFA`.
AAB SHA-256: `81B091A5A7E4951C5504B123EB6ED7FC7AA8D36D3BF6D8A288F90CDED0E7D0DC`.

JS/ảnh tương thích có thể OTA; đổi native module/SDK/quyền/R8/Kotlin/Swift cần build native và đổi runtime. Chỉ rollback bằng update tốt cùng runtime; không áp dụng update 1.0.0 cho runtime 1.1.0.

## Giới hạn

- Release trên điện thoại thật, quét mã bằng ống kính thật, rung cảm nhận và sinh trắc học đã đăng ký: hoãn theo yêu cầu người dùng.
- Chưa build iOS trên Windows; Android thay thế theo checklist cho phép.
- Chưa triển khai backend production HTTPS hoặc phát hành Play Store/App Store.
- Keystore/mật khẩu cần sao lưu riêng. Không commit key, Firebase config riêng hoặc database.
- npm audit còn cảnh báo dependency có mục chưa có bản sửa tương thích; không dùng audit fix --force để đổi hàng loạt framework. Gradle/R8 còn cảnh báo upstream trong log. Không khẳng định hết mọi lỗi/lỗ hổng chỉ vì test đạt.

Redis/Socket/AI streaming/payment gateway không thuộc điều kiện nghiệm thu này. PAID là thanh toán mô phỏng theo bài.