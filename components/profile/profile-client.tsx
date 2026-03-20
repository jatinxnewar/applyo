"use client"

import { Navbar } from "@/components/shared/navbar"
import { ProfileForm } from "@/components/profile/profile-form"
import type { User } from "@/lib/types"

interface ProfileClientProps {
  user: User
}

export function ProfileClient({ user }: ProfileClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          {/* Avatar + name header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-accent to-blue-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{user.full_name || "Your Profile"}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Complete your profile to improve job matching and visibility to employers.
          </p>
        </div>

        <ProfileForm user={user} />
      </main>
    </div>
  )
}
