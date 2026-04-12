import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { ChamCong } from "@/models/cham_cong_model"

export async function taoChamCong(data: Omit<ChamCong, "_id">) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("cham_cong").insertOne(data)
  return result.insertedId
}

export async function layChamCongTheoNhanVien(nhanVienId: string, thangNam: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const [year, month] = thangNam.split('-')
  const startDate = `${year}-${month.padStart(2, '0')}-01`
  const endDate = `${year}-${month.padStart(2, '0')}-31`
  
  return await db.collection("cham_cong").find({
    nhanVienId: new ObjectId(nhanVienId),
    ngay: { $gte: startDate, $lte: endDate }
  }).sort({ ngay: 1 }).toArray()
}

export async function layTatCaChamCong(page = 1, limit = 10, thangNam?: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  
  const skip = (page - 1) * limit
  const query: any = {}
  if (thangNam) {
    const [year, month] = thangNam.split('-')
    query.ngay = {
      $gte: `${year}-${month.padStart(2, '0')}-01`,
      $lte: `${year}-${month.padStart(2, '0')}-31`
    }
  }
  
  const [chamCong, total] = await Promise.all([
    db.collection("cham_cong").find(query).skip(skip).limit(limit).sort({ ngay: -1 }).toArray(),
    db.collection("cham_cong").countDocuments(query)
  ])
  
  return { duLieu: chamCong, tong: total, trangHienTai: page, tongTrang: Math.ceil(total / limit) }
}

export async function capNhatChamCong(id: string, data: Partial<ChamCong>) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("cham_cong").updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  )
  return result.modifiedCount > 0
}

export async function xoaChamCong(id: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const result = await db.collection("cham_cong").deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

export async function checkIn(nhanVienId: string, gioCheckIn: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const ngay = new Date().toISOString().split('T')[0]
  
  const existing = await db.collection("cham_cong").findOne({
    nhanVienId: new ObjectId(nhanVienId),
    ngay
  })
  
  if (existing) {
    return { thanhCong: false, thongBao: "Đã check-in hôm nay" }
  }
  
  const result = await db.collection("cham_cong").insertOne({
    nhanVienId: new ObjectId(nhanVienId),
    ngay,
    gioCheckIn,
    gioCheckOut: null,
    soGioTangCa: 0,
    trangThai: "di_lam"
  })
  
  return { thanhCong: true, id: result.insertedId }
}

export async function checkOut(nhanVienId: string) {
  const client = await clientPromise
  const db = client.db("personnel_management")
  const ngay = new Date().toISOString().split('T')[0]
  const gioCheckOut = new Date().toTimeString().split(' ')[0].substring(0, 5)
  
  const result = await db.collection("cham_cong").updateOne(
    { nhanVienId: new ObjectId(nhanVienId), ngay, gioCheckOut: null },
    { 
      $set: { 
        gioCheckOut,
        soGioTangCa: 0, // Calculate later if needed
        trangThai: "da_check_out"
      } 
    }
  )
  
  return result.modifiedCount > 0
}
