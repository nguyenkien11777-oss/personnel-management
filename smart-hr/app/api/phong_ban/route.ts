import { NextResponse } from "next/server"
import { layTatCaPhongBan } from "@/services/phong_ban_service"

export async function GET() {

  try {

    const duLieu = await layTatCaPhongBan()

    return NextResponse.json({
      thanhCong: true,
      tong: duLieu.length,
      duLieu
    })

  } catch (loi) {

    console.error(loi)

    return NextResponse.json(
      { thanhCong: false, thongBao: "Lỗi server" },
      { status: 500 }
    )

  }

}