"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { User } from "@/lib/types"

interface DashboardHeaderProps {
  user: User | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-white font-bold">A</div>
          <div>
            <h1 className="font-bold text-foreground">Applyo</h1>
            <p className="text-xs text-muted-foreground">Resume & Jobs</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="/dashboard" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
            Dashboard
          </a>
          <a href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Jobs
          </a>
          <a
            href="/applications"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Applications
          </a>
          <a
            href="/profile"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Profile
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center text-white text-sm font-bold">
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            <span className="text-sm text-foreground">{user?.full_name || user?.email}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoading}>
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  )
}
