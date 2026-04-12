import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { PhongBan } from "@/models/phong_ban_model"
import type { NhanVien } from "@/models/nhan_vien_model"

export async function taoPhongBan(data: Omit<PhongBan, "_id" | "soLuongNhanVien">) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("phong_ban").insertOne({
    ...data,
    soLuongNhanVien: 0,
    ngayTao: new Date().toISOString().split('T')[0]
  })
  return result.insertedId
}

export async function layTatCaPhongBan(page = 1, limit = 10, search = "") {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const skip = (page - 1) * limit
  const query = search ? { tenPhongBan: { $regex: search, $options: 'i' } } : {}
  
  const [phongBan, total] = await Promise.all([
    db.collection("phong_ban").find(query).skip(skip).limit(limit).toArray(),
    db.collection("phong_ban").countDocuments(query)
  ])
  
  const nhanVien = await db.collection("nhan_vien").find({}).toArray()

  const ketQua = phongBan.map(pb => {
    const danhSachNhanVien = nhanVien.filter(nv => nv.phongBanId === pb._id)
    const quanLy = nhanVien.find(nv => nv._id === pb.quanLyId)
    return {
      _id: pb._id,
      tenPhongBan: pb.tenPhongBan,
      ngayTao: pb.ngayTao,
      soLuongNhanVien: danhSachNhanVien.length,
      quanLy: quanLy ? {
        _id: quanLy._id,
        ten: quanLy.ten,
        email: quanLy.email,
        chucVu: quanLy.chucVu
      } : null,
      danhSachNhanVien: danhSachNhanVien.slice(0, 5) // Limit preview
    }
  })

  return { duLieu: ketQua, tong: total, trangHienTai: page, tongTrang: Math.ceil(total / limit) }
}

export async function layPhongBanTheoId(id: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const pb = await db.collection("phong_ban").findOne({ _id: new ObjectId(id) })
  if (!pb) return null
  
  const nhanVien = await db.collection("nhan_vien").find({ phongBanId: id }).toArray()
  const quanLy = await db.collection("nhan_vien").findOne({ _id: new ObjectId(pb.quanLyId) })
  
  return {
    ...pb,
    soLuongNhanVien: nhanVien.length,
    quanLy: quanLy ? {
      _id: quanLy._id,
      ten: quanLy.ten,
      email: quanLy.email,
      chucVu: quanLy.chucVu
    } : null,
    danhSachNhanVien: nhanVien
  }
}

export async function capNhatPhongBan(id: string, data: Partial<PhongBan>) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("phong_ban").updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  )
  return result.modifiedCount > 0
}

export async function xoaPhongBan(id: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("phong_ban").deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}
