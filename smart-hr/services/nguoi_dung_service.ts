import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"
import type { NguoiDung } from "@/models/nguoi_dung_model"

export async function taoNguoiDung(data: Omit<NguoiDung, "_id" | "ngayTao"> & { matKhau: string }) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const matKhauHashed = await bcrypt.hash(data.matKhau, 12)
  
  const result = await db.collection("nguoi_dung").insertOne({
    ...data,
    matKhau: matKhauHashed,
    ngayTao: new Date().toISOString(),
    trangThai: "active"
  })
  return result.insertedId
}

export async function layTatCaNguoiDung(page = 1, limit = 10, vaiTro?: string, trangThai?: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const skip = (page - 1) * limit
  const query: any = {}
  if (vaiTro) query.vaiTro = vaiTro
  if (trangThai) query.trangThai = trangThai
  
  const [nguoiDung, total] = await Promise.all([
    db.collection("nguoi_dung").find(query).skip(skip).limit(limit).sort({ ngayTao: -1 }).toArray(),
    db.collection("nguoi_dung").countDocuments(query)
  ])
  
  return { duLieu: nguoiDung, tong: total, trangHienTai: page, tongTrang: Math.ceil(total / limit) }
}

export async function layNguoiDungTheoId(id: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  return await db.collection("nguoi_dung").findOne({ _id: new ObjectId(id) })
}

export async function layNguoiDungTheoEmail(email: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  return await db.collection("nguoi_dung").findOne({ email })
}

export async function kiemTraDangNhap(email: string, matKhau: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const nguoiDung = await db.collection("nguoi_dung").findOne({ email })
  if (!nguoiDung || nguoiDung.trangThai !== "active") return null
  
  const matKhauDung = await bcrypt.compare(matKhau, nguoiDung.matKhau)
  if (!matKhauDung) return null
  
  const { matKhau, ...nguoiDungInfo } = nguoiDung
  return nguoiDungInfo
}

export async function capNhatNguoiDung(id: string, data: Partial<Omit<NguoiDung, "_id">>) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  if ('matKhau' in data && data.matKhau) {
    ;(data as any).matKhau = await bcrypt.hash(data.matKhau as string, 12)
  }
  
  const result = await db.collection("nguoi_dung").updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  )
  return result.modifiedCount > 0
}

export async function xoaNguoiDung(id: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("nguoi_dung").deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}
