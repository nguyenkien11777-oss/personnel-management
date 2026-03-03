🏢 Smart HR Management System

Hệ thống quản lý nhân sự cho doanh nghiệp vừa và nhỏ (SME), xây dựng bằng Next.js và MongoDB, tập trung vào:

Kiến trúc clean

Analytics thông minh (giả AI)

Phân quyền rõ ràng

Dashboard trực quan

Triển khai production-ready trên Vercel

🚀 Tech Stack
Core

Next.js (App Router – Fullstack)

MongoDB

Mongoose / Prisma Mongo

NextAuth (Authentication)

Recharts (Data Visualization)

Tailwind CSS

TypeScript

Deployment

Vercel (1-click deploy)

🧠 Tư Duy Sản Phẩm

Dự án tập trung vào:

✔ 80% giá trị đến từ Analytics
✔ Không cần AI thật – thay bằng "Giả AI" thông minh
✔ Clean architecture
✔ Production mindset
✔ Có thể mở rộng sau này

📦 Chức Năng Chính
1️⃣ Authentication & Role-Based Access Control

Phân quyền hệ thống:

Admin

HR

Manager

Employee

Tính năng:

Middleware bảo vệ route

Phân quyền API

Session-based auth

2️⃣ Quản Lý Nhân Viên (Employee Management)

CRUD nhân viên

Hồ sơ chi tiết

Tìm kiếm theo tên / email

Lọc theo phòng ban

Trạng thái làm việc

3️⃣ Quản Lý Phòng Ban

CRUD phòng ban

Thống kê số lượng nhân viên mỗi phòng

Phân bổ manager theo phòng

4️⃣ Chấm Công (Attendance)

Check-in / Check-out

Tính số ngày làm việc

Tính tăng ca

Tổng hợp theo tháng

5️⃣ Quản Lý Lương (Payroll)

Tính lương tự động:

Lương cơ bản

Số ngày công

Tăng ca

Thưởng / Phạt

Lưu lịch sử chi trả

Xem lương theo tháng

📊 6️⃣ Smart Analytics Dashboard ("Giả AI")

Thay vì AI thật, hệ thống sử dụng rule-based analytics:

🎯 Performance Scoring Algorithm

Tự động tính điểm dựa trên:

Attendance rate

Overtime hours

KPI đạt được

Kỷ luật

Phân loại:

High Performer

Stable Performer

At Risk Employee

📈 Dashboard Metrics

Tổng số nhân viên

Tăng trưởng nhân sự theo tháng

Chi phí lương theo tháng

Phân bổ nhân viên theo phòng ban

Tỷ lệ nghỉ việc

Hiệu suất trung bình

Biểu đồ:

Line Chart

Bar Chart

Pie Chart

Area Chart

📤 7️⃣ Export Excel

Xuất danh sách nhân viên

Xuất bảng lương theo tháng

Xuất báo cáo attendance

Phù hợp cho:

Kế toán

HR báo cáo nội bộ

📝 8️⃣ Audit Log (Theo Dõi Thay Đổi)

Hệ thống ghi lại:

Ai sửa gì

Sửa lúc nào

Giá trị cũ → giá trị mới

IP (tuỳ chọn)

Ví dụ log:

[HR] Updated salary of Employee A
Old: 12,000,000
New: 15,000,000
Time: 2026-03-03 10:20

Giúp tăng tính chuyên nghiệp và bảo mật hệ thống.

🕒 9️⃣ Activity Timeline

Mỗi nhân viên có timeline hoạt động:

Thay đổi lương

Thăng chức

Cập nhật thông tin

Cảnh báo vi phạm

Hiển thị dạng:

Vertical timeline UI

Có filter theo loại hoạt động

🔎 10️⃣ Server-side Pagination

Danh sách lớn (100+ nhân viên):

Không load toàn bộ

Phân trang từ server

Query theo page + limit

Giúp:

Tăng performance

Giảm load database

⚡ 11️⃣ Search Debounce

Khi tìm kiếm:

Delay 300–500ms trước khi gọi API

Tránh spam request

Cải thiện UX

Ví dụ:

User typing: "Nguyen"
API chỉ gọi sau khi dừng gõ

🏗 Kiến Trúc Phân Công Dev
👨‍💻 Dev – Backend

Database schema

API routes

Authentication

RBAC

Payroll logic

Analytics algorithm

Audit log

Pagination server-side

👩‍💻 Dev – Frontend

Dashboard UI

Chart visualization

Employee form

Timeline component

Search debounce

Pagination UI

Responsive + Dark mode

Loading & Error states

🗂 Cấu Trúc Thư Mục
/app
  /api
  /dashboard
  /employees
  /departments
  /attendance
  /payroll

/components
  /ui
  /charts
  /timeline

/lib
  /analytics
  /auth
  /db
  /utils

/models
/middleware

🔐 Security

Role-based access

Middleware protection

Input validation

Sanitization

Secure API handling

🚀 Roadmap
Phase 1 – Core

Auth

CRUD Employee

Dashboard basic

Phase 2 – Business Logic

Payroll

Attendance

Analytics scoring

Phase 3 – Advanced

Audit log

Timeline

Export Excel

Pagination server-side

Search debounce
