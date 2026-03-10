import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI as string

if (!uri) {
  throw new Error("Missing MONGODB_URI")
}

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 450000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (!global._mongoClientPromise) {

  client = new MongoClient(uri, options)

  global._mongoClientPromise = client.connect()

}

clientPromise = global._mongoClientPromise

export default clientPromise