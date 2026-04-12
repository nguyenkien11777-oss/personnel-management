import { NextRequest, NextResponse } from "next/server"
import type { NhanVien } from "@/models/nhan_vien_model"
import { 
  layNhanVienTheoId, 
  capNhatNhanVien, 
  xoaNhanVien 
} from "@/services/nhan_vien_service"

/**
 * @swagger
 * /api/nhan_vien/{id}:
 *   get:
 *     summary: Lấy thông tin nhân viên theo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *   put:
 *     summary: Cập nhật nhân viên
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten:
 *                 type: string
 *               email:
 *                 type: string
 *               soDienThoai:
 *                 type: string
 *               phongBanId:
 *                 type: string
 *               chucVu:
 *                 type: string
 *               luongCoBan:
 *                 type: number
 *               trangThai:
 *                 type: string
 *               ngayVaoLam:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa nhân viên
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const nhanVien = await layNhanVienTheoId(params.id)
    
    if (!nhanVien) {
      return NextResponse.json({
        thanhCong: false,
        thongBao: "Không tìm thấy nhân viên"
      }, { status: 404 })
    }
    
    return NextResponse.json({
      thanhCong: true,
      duLieu: nhanVien
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { thanhCong: false, thongBao: "Lỗi server" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json() as Partial<NhanVien>
    
    const thanhCong = await capNhatNhanVien(params.id, data)
    
    if (!thanhCong) {
      return NextResponse.json({
        thanhCong: false,
        thongBao: "Không tìm thấy nhân viên để cập nhật"
      }, { status: 404 })
    }
    
    return NextResponse.json({
      thanhCong: true,
      thongBao: "Cập nhật thành công"
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { thanhCong: false, thongBao: "Lỗi cập nhật" },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const thanhCong = await xoaNhanVien(params.id)
    
    if (!thanhCong) {
      return NextResponse.json({
        thanhCong: false,
        thongBao: "Không tìm thấy nhân viên để xóa"
      }, { status: 404 })
    }
    
    return NextResponse.json({
      thanhCong: true,
      thongBao: "Xóa thành công"
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { thanhCong: false, thongBao: "Lỗi xóa" },
      { status: 500 }
    )
  }
}
