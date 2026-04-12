import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { NghiPhep } from "@/models/nghi_phep_model"

export async function taoNghiPhep(data: Omit<NghiPhep, "_id">) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("nghi_phep").insertOne({
    ...data,
    trangThai: "cho_duyet"
  })
  return result.insertedId
}

export async function layNghiPhepTheoNhanVien(nhanVienId: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  return await db.collection("nghi_phep").find({ nhanVienId: new ObjectId(nhanVienId) }).sort({ ngayBatDau: -1 }).toArray()
}

export async function layTatCaNghiPhep(page = 1, limit = 10, trangThai?: string, nhanVienId?: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const skip = (page - 1) * limit
  const query: any = {}
  if (trangThai) query.trangThai = trangThai
  if (nhanVienId) query.nhanVienId = new ObjectId(nhanVienId)
  
  const [nghiPhep, total] = await Promise.all([
    db.collection("nghi_phep").find(query).skip(skip).limit(limit).sort({ ngayBatDau: -1 }).toArray(),
    db.collection("nghi_phep").countDocuments(query)
  ])
  
  return { duLieu: nghiPhep, tong: total, trangHienTai: page, tongTrang: Math.ceil(total / limit) }
}

export async function duyetNghiPhep(id: string, nguoiDuyet: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("nghi_phep").updateOne(
    { _id: new ObjectId(id), trangThai: "cho_duyet" },
    { $set: { trangThai: "da_duyet", nguoiDuyet, ngayDuyet: new Date().toISOString().split('T')[0] } }
  )
  return result.modifiedCount > 0
}

export async function tuChoiNghiPhep(id: string, lyDo: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("nghi_phep").updateOne(
    { _id: new ObjectId(id) },
    { $set: { trangThai: "da_tu_choi", lyDoTuChoi: lyDo } }
  )
  return result.modifiedCount > 0
}

export async function xoaNghiPhep(id: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("nghi_phep").deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}
