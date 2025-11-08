"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let clientInstance: SupabaseClient | null = null
let isInitializing = false

export function createClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("createClient can only be used in the browser")
  }

  // If instance exists, return it immediately
  if (clientInstance) {
    return clientInstance
  }

  // Prevent multiple simultaneous initialization attempts
  if (isInitializing) {
    // Wait a tick and retry
    let attempts = 0
    const waitForClient = (): SupabaseClient => {
      if (clientInstance) return clientInstance
      if (attempts > 100) throw new Error("Failed to initialize Supabase client")
      attempts++
      return waitForClient()
    }
    return waitForClient()
  }

  isInitializing = true

  clientInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  isInitializing = false
  return clientInstance
}

export function getClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("getClient can only be used in the browser")
  }

  if (!clientInstance) {
    return createClient()
  }

  return clientInstance
}
