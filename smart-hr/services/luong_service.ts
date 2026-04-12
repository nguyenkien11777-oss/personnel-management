import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Luong } from "@/models/luong_model"

export async function taoLuong(data: Omit<Luong, "_id">) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const luongThucNhan = data.luongCoBan + data.tienTangCa + data.thuong - data.phat
  
  const result = await db.collection("luong").insertOne({
    ...data,
    luongThucNhan,
    ngayThanhToan: data.ngayThanhToan || new Date().toISOString().split('T')[0]
  })
  return result.insertedId
}

export async function layLuongTheoNhanVien(nhanVienId: string, year?: number) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const query: any = { nhanVienId: new ObjectId(nhanVienId) }
  if (year) {
    query.thang = { $regex: `^${year}` }
  }
  
  return await db.collection("luong").find(query).sort({ thang: -1 }).toArray()
}

export async function layTatCaLuong(page = 1, limit = 10, thang?: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const skip = (page - 1) * limit
  const query: any = {}
  if (thang) query.thang = thang
  
  const [luong, total] = await Promise.all([
    db.collection("luong").find(query).skip(skip).limit(limit).sort({ thang: -1 }).toArray(),
    db.collection("luong").countDocuments(query)
  ])
  
  return { duLieu: luong, tong: total, trangHienTai: page, tongTrang: Math.ceil(total / limit) }
}

export async function capNhatLuong(id: string, data: Partial<Luong>) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  if (data.luongCoBan !== undefined || data.tienTangCa !== undefined || 
      data.thuong !== undefined || data.phat !== undefined) {
    const existing = await db.collection("luong").findOne({ _id: new ObjectId(id) })
    if (existing) {
      data.luongThucNhan = (data.luongCoBan || existing.luongCoBan) +
                          (data.tienTangCa || existing.tienTangCa) +
                          (data.thuong || existing.thuong) -
                          (data.phat || existing.phat)
    }
  }
  
  const result = await db.collection("luong").updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  )
  return result.modifiedCount > 0
}

export async function xoaLuong(id: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("luong").deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}
