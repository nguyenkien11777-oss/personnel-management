import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { NhanVien } from "@/models/nhan_vien_model"
import type { PhongBan } from "@/models/phong_ban_model"

export async function taoNhanVien(data: Omit<NhanVien, "_id">) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  // Update phòng ban count
  await db.collection("phong_ban").updateOne(
    { _id: new ObjectId(data.phongBanId) },
    { $inc: { soLuongNhanVien: 1 } }
  )
  
  const result = await db.collection("nhan_vien").insertOne({
    ...data,
    ngayVaoLam: data.ngayVaoLam || new Date().toISOString().split('T')[0],
    trangThai: data.trangThai || "dang_lam_viec"
  })
  return result.insertedId
}

export async function layTatCaNhanVien(page = 1, limit = 10, search = "", phongBanId?: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const skip = (page - 1) * limit
  const query: any = {}
  if (search) query.$or = [
    { ten: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
    { chucVu: { $regex: search, $options: 'i' } }
  ]
  if (phongBanId) query.phongBanId = phongBanId
  
  const [nhanVien, total] = await Promise.all([
    db.collection("nhan_vien").find(query).skip(skip).limit(limit).sort({ ngayVaoLam: -1 }).toArray(),
    db.collection("nhan_vien").countDocuments(query)
  ])
  
  const phongBanIds = [...new Set(nhanVien.map(nv => nv.phongBanId))]
  const phongBan = await db.collection("phong_ban").find({ _id: { $in: phongBanIds.map(id => new ObjectId(id)) } }).toArray()
  
  const phongBanMap = new Map(phongBan.map(pb => [pb._id.toString(), pb.tenPhongBan]))
  
  const ketQua = nhanVien.map(nv => ({
    ...nv,
    phongBanTen: phongBanMap.get(nv.phongBanId) || "Không xác định"
  }))
  
  return { duLieu: ketQua, tong: total, trangHienTai: page, tongTrang: Math.ceil(total / limit) }
}

export async function layNhanVienTheoId(id: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const nv = await db.collection("nhan_vien").findOne({ _id: new ObjectId(id) })
  if (!nv) return null
  
  const phongBan = await db.collection("phong_ban").findOne({ _id: new ObjectId(nv.phongBanId) })
  
  return {
    ...nv,
    phongBan: phongBan ? {
      _id: phongBan._id,
      tenPhongBan: phongBan.tenPhongBan
    } : null
  }
}

export async function capNhatNhanVien(id: string, data: Partial<NhanVien>) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const nhanVienCu = await db.collection("nhan_vien").findOne({ _id: new ObjectId(id) })
  if (!nhanVienCu) return false
  
  // Handle department change
  if (data.phongBanId && data.phongBanId !== nhanVienCu.phongBanId) {
    await db.collection("phong_ban").updateOne(
      { _id: new ObjectId(nhanVienCu.phongBanId) },
      { $inc: { soLuongNhanVien: -1 } }
    )
    await db.collection("phong_ban").updateOne(
      { _id: new ObjectId(data.phongBanId) },
      { $inc: { soLuongNhanVien: 1 } }
    )
  }
  
  const result = await db.collection("nhan_vien").updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  )
  return result.modifiedCount > 0
}

export async function xoaNhanVien(id: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const nhanVien = await db.collection("nhan_vien").findOne({ _id: new ObjectId(id) })
  if (!nhanVien) return false
  
  // Update department count
  await db.collection("phong_ban").updateOne(
    { _id: new ObjectId(nhanVien.phongBanId) },
    { $inc: { soLuongNhanVien: -1 } }
  )
  
  const result = await db.collection("nhan_vien").deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}
