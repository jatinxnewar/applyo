"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"

export function AdminHeader() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  const handleLogout = async () => {
    if (!supabase) return
    setIsLoading(true)
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <header className="bg-card border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-white font-bold">A</div>
          <div>
            <h1 className="font-bold text-foreground">Applyo</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/admin" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Users
          </Link>
          <Link
            href="/admin/jobs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Jobs
          </Link>
          <Link
            href="/admin/reports"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Reports
          </Link>
        </nav>

        <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoading}>
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </header>
  )
}
