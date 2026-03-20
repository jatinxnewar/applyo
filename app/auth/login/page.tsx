"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showDemoLogin, setShowDemoLogin] = useState(false)

  useEffect(() => {
    // Always show demo login on localhost OR when Auth0 isn't configured
    if (typeof window !== "undefined") {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      if (isLocal) {
        setShowDemoLogin(true)
      } else {
        // Check if Auth0 is configured on the server
        fetch("/api/auth/check")
          .then((r) => r.json())
          .then((json) => {
            if (!json.ok) setShowDemoLogin(true)
          })
          .catch(() => setShowDemoLogin(true))
      }
    }
  }, [])

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      const check = await fetch("/api/auth/check")
      const json = await check.json()
      if (!json.ok) {
        setError("Google sign-in is not configured. Use the demo login below.")
        setShowDemoLogin(true)
        setLoading(false)
        return
      }
      window.location.href = "/api/auth/login?connection=google-oauth2"
    } catch {
      setError("Failed to start sign-in flow")
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setLoading(true)
    window.location.href = "/api/auth/mock-login"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-linear-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-accent to-blue-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">Applyo</span>
          </Link>
        </div>

        <Card className="border border-border/50 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Sign in to your Applyo account</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-11 bg-white text-foreground hover:bg-gray-50 border border-border shadow-sm transition-all"
              >
                <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {loading ? "Signing in..." : "Continue with Google"}
              </Button>

              {showDemoLogin && (
                <Button
                  onClick={handleDemoLogin}
                  disabled={loading}
                  variant="outline"
                  className="w-full h-11"
                >
                  <svg className="w-5 h-5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Continue as Demo User
                </Button>
              )}
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">New to Applyo?</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-11" asChild>
              <Link href="/auth/signup">Create an account</Link>
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
