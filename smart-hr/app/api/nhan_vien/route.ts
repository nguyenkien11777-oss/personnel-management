import { NextRequest, NextResponse } from "next/server"
import type { NhanVien } from "@/models/nhan_vien_model"
import { 
  taoNhanVien, 
  layTatCaNhanVien,
  capNhatNhanVien 
} from "@/services/nhan_vien_service"

/**
 * @swagger
 * /api/nhan_vien:
 *   get:
 *     summary: Lấy danh sách nhân viên
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: phongBanId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *   post:
 *     summary: Tạo nhân viên mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ten
 *               - email
 *               - phongBanId
 *               - chucVu
 *               - luongCoBan
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
 *       201:
 *         description: Tạo thành công
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const phongBanId = searchParams.get('phongBanId') || undefined

    const result = await layTatCaNhanVien(page, limit, search, phongBanId)

    return NextResponse.json({
      thanhCong: true,
      ...result
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { thanhCong: false, thongBao: "Lỗi server" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as Omit<NhanVien, "_id">

    const id = await taoNhanVien(data)

    return NextResponse.json({
      thanhCong: true,
      thongBao: "Tạo nhân viên thành công",
      id
    }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { thanhCong: false, thongBao: "Lỗi tạo nhân viên" },
      { status: 400 }
    )
  }
}
