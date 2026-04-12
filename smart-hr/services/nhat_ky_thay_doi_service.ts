import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { NhatKyThayDoi } from "@/models/nhat_ky_thay_doi_model"

export async function taoNhatKy(data: Omit<NhatKyThayDoi, "_id" | "thoiGian">) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  await db.collection("nhat_ky_thay_doi").insertOne({
    ...data,
    thoiGian: new Date().toISOString()
  })
}

export async function layNhatKy(page = 1, limit = 10, doiTuong?: string, hanhDong?: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const skip = (page - 1) * limit
  const query: any = {}
  if (doiTuong) query.doiTuong = doiTuong
  if (hanhDong) query.hanhDong = hanhDong
  
  const [nhatKy, total] = await Promise.all([
    db.collection("nhat_ky_thay_doi").find(query).skip(skip).limit(limit).sort({ thoiGian: -1 }).toArray(),
    db.collection("nhat_ky_thay_doi").countDocuments(query)
  ])
  
  return { duLieu: nhatKy, tong: total, trangHienTai: page, tongTrang: Math.ceil(total / limit) }
}

export async function layNhatKyTheoNguoiThucHien(nguoiThucHienId: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  return await db.collection("nhat_ky_thay_doi").find({ nguoiThucHien: new ObjectId(nguoiThucHienId) }).sort({ thoiGian: -1 }).toArray()

}
