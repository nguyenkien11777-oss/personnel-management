import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { DanhGiaHieuSuat } from "@/models/danh_gia_hieu_suat_model"

export async function taoDanhGia(data: Omit<DanhGiaHieuSuat, "_id">) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  // Calculate tongDiem and xepLoai
  const tongDiem = (data.diemChamCong + data.diemKPI + data.diemKyLuat) / 3
  const xepLoai = tongDiem >= 90 ? "hieu_suat_cao" : tongDiem >= 80 ? "tot" : "can_cai_thien"
  
  const result = await db.collection("danh_gia_hieu_suat").insertOne({
    ...data,
    tongDiem: Math.round(tongDiem),
    xepLoai
  })
  return result.insertedId
}

export async function layDanhGiaTheoNhanVien(nhanVienId: string, year?: number) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const query: any = { nhanVienId: new ObjectId(nhanVienId) }
  if (year) {
    query.thang = { $regex: `^${year}` }
  }
  
  return await db.collection("danh_gia_hieu_suat").find(query).sort({ thang: -1 }).toArray()
}

export async function layTatCaDanhGia(page = 1, limit = 10) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const skip = (page - 1) * limit
  
  const [danhGia, total] = await Promise.all([
    db.collection("danh_gia_hieu_suat").find({}).skip(skip).limit(limit).sort({ thang: -1 }).toArray(),
    db.collection("danh_gia_hieu_suat").countDocuments({})
  ])
  
  return { duLieu: danhGia, tong: total, trangHienTai: page, tongTrang: Math.ceil(total / limit) }
}

export async function capNhatDanhGia(id: string, data: Partial<DanhGiaHieuSuat>) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  if (data.diemChamCong || data.diemKPI || data.diemKyLuat) {
    const existing = await db.collection("danh_gia_hieu_suat").findOne({ _id: new ObjectId(id) })
    if (existing) {
      const tongDiem = (data.diemChamCong || existing.diemChamCong! + 
                       data.diemKPI || existing.diemKPI! + 
                       data.diemKyLuat || existing.diemKyLuat!) / 3
      data.tongDiem = Math.round(tongDiem)
      data.xepLoai = tongDiem >= 90 ? "hieu_suat_cao" : tongDiem >= 80 ? "tot" : "can_cai_thien"
    }
  }
  
  const result = await db.collection("danh_gia_hieu_suat").updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  )
  return result.modifiedCount > 0
}

export async function xoaDanhGia(id: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("danh_gia_hieu_suat").deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}
