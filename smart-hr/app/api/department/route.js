import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;

  const db = client.db("personnel_management");

  const departments = await db
    .collection("departments")
    .find({})
    .toArray();

  return Response.json(departments);
}