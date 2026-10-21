# Cài ShopAI lên điện thoại Android qua USB

## Xiaomi 14: kết nối Wi-Fi khi USB không nhận

Đã cài thành công APK Release lên Xiaomi 14 trong phiên hỗ trợ này. Người dùng xác nhận quét mã và vân tay hoạt động. Để kết nối lại:

1. Máy tính và điện thoại dùng mạng có thể truy cập nhau. Trên Xiaomi: Cài đặt → Cài đặt bổ sung → Tùy chọn nhà phát triển → Gỡ lỗi không dây.
2. Mở **Ghép đôi thiết bị với mã ghép đôi**, giữ nguyên hộp thoại. Trên máy tính chạy `adb pair IP:CONG_GHEP`, nhập mã sáu số đang hiện trên điện thoại. Mã hết hạn thì mở hộp thoại mới.
3. Đóng hộp thoại; dùng **Địa chỉ IP & Cổng** trên trang Gỡ lỗi không dây để chạy `adb connect IP:CONG_KET_NOI`. Cổng kết nối thường khác cổng ghép đôi. Các chữ IP/CONG là chỗ thay bằng số trên điện thoại.
4. Bật **Cài đặt qua USB** nếu Xiaomi chặn cài APK với lỗi `INSTALL_FAILED_USER_RESTRICTED`; tự xác nhận các yêu cầu trên điện thoại.
5. Giữ backend chạy, rồi chạy `npm.cmd run phone:connect -- IP:CONG_KET_NOI`. Lệnh này cũng tạo adb reverse cho backend trên kết nối Wi-Fi. Không cần cáp khi wireless ADB còn kết nối.

Một điện thoại có thể xuất hiện hai lần trong adb (IP và tên mDNS); chỉ rõ một serial như bước 5. Sau khi đổi Wi-Fi, khởi động lại máy hoặc tắt wireless debugging, địa chỉ/cổng có thể đổi. Khi dùng xong có thể tắt Gỡ lỗi không dây; app QA sẽ cần kết nối lại để gọi backend máy tính.

## Kết nối bằng cáp

Bản USB dùng backend NestJS trên máy tính. Giữ máy tính, backend và cáp USB hoạt động khi thử đăng nhập, sản phẩm, đặt đơn và AI.

1. Trên điện thoại mở **Cài đặt → Thông tin điện thoại**, nhấn **Số bản dựng** 7 lần để bật Tùy chọn nhà phát triển. Một số máy đặt mục này trong Thông tin phần mềm.
2. Mở **Tùy chọn nhà phát triển → Gỡ lỗi USB**. Cắm cáp có truyền dữ liệu vào máy tính, mở khóa điện thoại và chấp nhận **Cho phép gỡ lỗi USB**.
3. Mở PowerShell trong thư mục ShopAI, chạy `adb devices`. Điện thoại phải hiện một mã máy và trạng thái `device`. `unauthorized` nghĩa là cần chấp nhận hộp thoại trên điện thoại; không hiện máy thì thử cáp/cổng USB khác.
4. Mở terminal thứ nhất và chạy:

   ```powershell
   cd shopai-backend
   npm.cmd run start:dev
   ```

   Nếu backend đã chạy ở cổng 3000, giữ nguyên tiến trình đó. File `.env` backend cần JWT secret và Gemini key của bạn; không đưa khóa lên GitHub.
5. Mở terminal thứ hai ở thư mục ShopAI. APK đã build nằm ở `artifacts/ShopAI-USB.apk`. Khi cần build lại mã mới, chạy:

   ```powershell
   npm.cmd run android:usb
   ```

6. Cài APK, nối cổng backend và mở ShopAI:

   ```powershell
   npm.cmd run phone:connect
   ```

   Nếu cắm nhiều điện thoại, chỉ rõ mã lấy từ `adb devices`: `npm.cmd run phone:connect -- MA_DIEN_THOAI`.
7. Đăng ký tài khoản trong ứng dụng, đăng nhập, mở sản phẩm, thêm giỏ, đặt đơn, mở đơn và chuyển sang PAID; thử hỏi trợ lý AI. Không dùng thông tin tài khoản QA trong báo cáo kiểm thử.

Không cần Metro hoặc Expo Go cho APK USB này. Script dùng `adb reverse tcp:3000 tcp:3000`, vì vậy địa chỉ `127.0.0.1:3000` trong ứng dụng dẫn về backend trên máy tính. Sau khi rút/cắm lại cáp, chạy lại `phone:connect`. Việc cài đè giữ dữ liệu nếu chữ ký tương thích. Nếu Android báo chữ ký khác, dừng để kiểm tra bản đã cài trước khi gỡ vì gỡ ứng dụng sẽ mất dữ liệu cục bộ.

APK USB tắt OTA riêng để bản cập nhật dành cho máy ảo không thay địa chỉ API của điện thoại. Cấu hình build thông thường vẫn bật OTA. Đây là bản thử qua USB, chưa phải ứng dụng kết nối backend công khai khi rời máy tính.
