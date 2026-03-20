import { getSession } from "@/lib/auth0"
import { getDatabase } from "@/lib/mongodb/client"
import { ObjectId } from "mongodb"

type SupabaseLikeResponse = { data: any; error: any }

class MongoQuery {
  collectionName: string
  filter: any = {}
  projection: any = null
  sort: any = null
  limitCount: number | null = null
  singleFlag = false
  op: "select" | "insert" | "update" | "delete" | null = null
  payload: any = null

  constructor(collectionName: string) {
    this.collectionName = collectionName
  }

  select(_fields?: string) {
    this.op = "select"
    // ignore fields selection for now; '*' returns full doc
    return this
  }

  insert(doc: any) {
    this.op = "insert"
    this.payload = doc
    return this
  }

  update(obj: any) {
    this.op = "update"
    this.payload = obj
    return this
  }

  delete() {
    this.op = "delete"
    return this
  }

  eq(field: string, value: any) {
    // map 'id' to MongoDB _id when appropriate
    if (field === "id") {
      try {
        this.filter._id = new ObjectId(String(value))
      } catch {
        this.filter._id = value
      }
    } else {
      this.filter[field] = value
    }
    return this
  }

  order(field: string, opts: { ascending?: boolean } = { ascending: true }) {
    this.sort = { [field === "id" ? "_id" : field]: opts.ascending ? 1 : -1 }
    return this
  }

  limit(n: number) {
    this.limitCount = n
    return this
  }

  single() {
    this.singleFlag = true
    return this
  }

  async then(resolve: any, reject: any) {
    try {
      const db = await getDatabase()
      const coll = db.collection(this.collectionName)

      if (this.op === "insert") {
        const res = await coll.insertOne({ ...this.payload, created_at: new Date() })
        const doc = await coll.findOne({ _id: res.insertedId })
        return resolve({ data: doc, error: null })
      }

      if (this.op === "select") {
        let cursor = coll.find(this.filter)
        if (this.projection) cursor = cursor.project(this.projection)
        if (this.sort) cursor = cursor.sort(this.sort)
        if (this.limitCount != null) cursor = cursor.limit(this.limitCount)
        const docs = await cursor.toArray()
        if (this.singleFlag) return resolve({ data: docs[0] ?? null, error: null })
        return resolve({ data: docs, error: null })
      }

      if (this.op === "update") {
        const res = await coll.updateOne(this.filter, { $set: this.payload, $currentDate: { updated_at: true } })
        return resolve({ data: res, error: null })
      }

      if (this.op === "delete") {
        const res = await coll.deleteMany(this.filter)
        return resolve({ data: res, error: null })
      }

      // default: return nothing
      return resolve({ data: null, error: null })
    } catch (err) {
      return resolve({ data: null, error: err })
    }
  }
}

export async function createClient() {
  // provide a supabase-like API surface used by the app but backed by MongoDB + Auth0
  return {
    auth: {
      async getUser() {
        try {
          const session = await getSession()
          if (!session?.user) return { data: { user: null } }

          const db = await getDatabase()
          const usersCollection = db.collection("users")
          const userDoc = await usersCollection.findOne({ auth0_id: session.user.sub })
          if (!userDoc) return { data: { user: null } }

          // Map to a shape similar to Supabase user where `id` is a string
          return {
            data: {
              user: {
                id: userDoc._id.toString(),
                email: userDoc.email,
                name: userDoc.name,
              },
            },
          }
        } catch (err) {
          return { data: { user: null } }
        }
      },
    },

    from(collectionName: string) {
      return new MongoQuery(collectionName)
    },
  }
}

export default createClient
 
