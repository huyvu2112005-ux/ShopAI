# Bài 9 và bài 10

Bản mới nhất là native/runtime **1.1.0**. Xem [bảng nghiệm thu bài 1–10](CHAPTER_1_10_STATUS.md) để đọc cách chạy, kiểm thử, Firebase, OTA và Release.

Bài 9 có NestJS Products/DTO/404, JWT Login/Register, Prisma SQLite, guarded Orders, server total, PENDING→PAID, Gemini proxy, Swagger và mobile gọi API thật.

Bài 10 có Crashlytics fatal/nonfatal, breadcrumbs/custom keys, EAS Update, 3 profile, private keystore, R8 và signed APK/AAB. Thiết bị thật được hoãn theo yêu cầu người dùng.

Rollback đã kiểm chứng ở đợt runtime 1.0.0 trước đây. Không áp dụng chéo update cũ cho runtime 1.1.0. Dùng update tốt cùng runtime/channel với EAS rollback/republish, rồi mở lại app kiểm chứng update ID. Rollback OTA không hoàn tác native hoặc database server.