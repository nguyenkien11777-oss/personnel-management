export interface NguoiDung {
  _id: string
  ten: string
  email: string
  matKhau: string
  vaiTro: "admin" | "hr" | "manager" | "employee"
  nhanVienId: string
  trangThai: string
  ngayTao: string
}