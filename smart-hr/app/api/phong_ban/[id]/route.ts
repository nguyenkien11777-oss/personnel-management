import { NextRequest, NextResponse } from "next/server"
import type { PhongBan } from "@/models/phong_ban_model"
import { 
  layPhongBanTheoId, 
  capNhatPhongBan, 
  xoaPhongBan 
} from "@/services/phong_ban_service"
import { ObjectId } from "mongodb"

/**
 * @swagger
 * /api/phong_ban/{id}:
 *   get:
 *     summary: Lấy thông tin phòng ban theo ID
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
 *     summary: Cập nhật phòng ban
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
 *               tenPhongBan:
 *                 type: string
 *               quanLyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa phòng ban
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
    const phongBan = await layPhongBanTheoId(params.id)
    
    if (!phongBan) {
      return NextResponse.json({
        thanhCong: false,
        thongBao: "Không tìm thấy phòng ban"
      }, { status: 404 })
    }
    
    return NextResponse.json({
      thanhCong: true,
      duLieu: phongBan
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
    const data = await request.json() as Partial<PhongBan>
    
    const thanhCong = await capNhatPhongBan(params.id, data)
    
    if (!thanhCong) {
      return NextResponse.json({
        thanhCong: false,
        thongBao: "Không tìm thấy phòng ban để cập nhật"
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
    const thanhCong = await xoaPhongBan(params.id)
    
    if (!thanhCong) {
      return NextResponse.json({
        thanhCong: false,
        thongBao: "Không tìm thấy phòng ban để xóa"
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
