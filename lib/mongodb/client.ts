import { MongoClient } from "mongodb"

let cachedClient: MongoClient | null = null

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient
  }

  const client = new MongoClient(process.env.MONGODB_URI!)
  cachedClient = await client.connect()
  return cachedClient
}

export async function getDatabase() {
  const client = await connectToDatabase()
  return client.db(process.env.MONGODB_DATABASE_NAME || "applyo")
}
