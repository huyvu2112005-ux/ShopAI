# Ghi chú trình bày ShopAI

React Native dựng giao diện native, không phải WebView. ShopAI dùng native build/development client vì có module riêng. Debug dùng Metro; Release đóng gói JS nhưng vẫn cần backend truy cập được.

Context/useReducer quản lý theme; Redux Toolkit có slice/store/Provider/selector/dispatch trong khu thực hành; Zustand quản lý cart/session chính. React Query quản lý dữ liệu server. useQuery đọc, useMutation ghi; invalidateQueries đồng bộ danh sách đơn sau checkout/pay.

AsyncStorage dùng cho cart/theme; token dùng SecureStore. App Lock xác thực lại sau hai phút ở nền nếu thiết bị hỗ trợ và đã đăng ký sinh trắc. Hủy không mở khóa; có thử lại hoặc đăng nhập mật khẩu.

Zod kiểm tra dữ liệu nhận về; DTO/ValidationPipe kiểm tra đầu vào. JWT Guard xác thực; ownership ngăn xem đơn người khác. Server tính tổng từ giá catalog. PAID trong bài là thanh toán mô phỏng.

Gemini key và system prompt ở NestJS. Mobile gửi câu hỏi/lịch sử. Few-shot hướng dẫn cách trả lời, không bảo đảm chống tuyệt đối mọi prompt injection.

OTA đổi JS/ảnh tương thích cùng runtime. Thêm module/quyền/SDK hoặc đổi native/R8 cần build mới và đổi runtime. Rollback OTA không hoàn tác native hoặc database backend.

Keystore xác định người ký Android, phải sao lưu riêng. APK cài trực tiếp; AAB dành cho phân phối. R8 tối ưu/đổi tên mã; mapping giúp đọc stack trace Crashlytics.

Fatal kết thúc tiến trình; nonfatal ghi lỗi đã xử lý. Breadcrumb mô tả bước trước lỗi; custom keys thêm ngữ cảnh. Crash Test là lỗi cố ý kiểm tra báo cáo.

Xem [bảng nghiệm thu](CHAPTER_1_10_STATUS.md) để phân biệt phần đã kiểm chứng và thiết bị thật còn chờ.