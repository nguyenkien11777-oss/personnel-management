import clientPromise from "@/lib/mongodb"

export async function layTatCaPhongBan() {

  const client = await clientPromise

  const db = client.db("personnel_management")

  const phongBan = await db
    .collection("phong_ban")
    .find({})
    .toArray()

  const nhanVien = await db
    .collection("nhan_vien")
    .find({})
    .toArray()

  const ketQua = phongBan.map(pb => {

    const danhSachNhanVien = nhanVien.filter(
      nv => nv.phongBanId === pb._id
    )

    const quanLy = nhanVien.find(
      nv => nv._id === pb.quanLyId
    )

    return {

      _id: pb._id,

      tenPhongBan: pb.tenPhongBan,

      ngayTao: pb.ngayTao,

      soLuongNhanVien: danhSachNhanVien.length,

      quanLy: quanLy
        ? {
            _id: quanLy._id,
            ten: quanLy.ten,
            email: quanLy.email,
            chucVu: quanLy.chucVu
          }
        : null,

      danhSachNhanVien

    }

  })

  return ketQua

}