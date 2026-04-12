import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { ThoiGianHoatDong } from "@/models/thoi_gian_hoat_dong_model"

export async function taoThoiGianHoatDong(data: Omit<ThoiGianHoatDong, "_id">) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("thoi_gian_hoat_dong").insertOne(data)
  return result.insertedId
}

export async function layThoiGianHoatDongTheoNhanVien(nhanVienId: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  return await db.collection("thoi_gian_hoat_dong").find({ nhanVienId: new ObjectId(nhanVienId) }).sort({ ngay: -1 }).toArray()
}

export async function layTatCaThoiGianHoatDong(page = 1, limit = 10) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const skip = (page - 1) * limit
  
  const [thoiGian, total] = await Promise.all([
    db.collection("thoi_gian_hoat_dong").find({}).skip(skip).limit(limit).sort({ ngay: -1 }).toArray(),
    db.collection("thoi_gian_hoat_dong").countDocuments({})
  ])
  
  return { duLieu: thoiGian, tong: total, trangHienTai: page, tongTrang: Math.ceil(total / limit) }
}

export async function xoaThoiGianHoatDong(id: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("thoi_gian_hoat_dong").deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}
