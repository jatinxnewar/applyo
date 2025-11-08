import Link from "next/link"

export function JobBoardHeader() {
  return (
    <header className="bg-card border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-foreground">Applyo Jobs</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/applications"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Applications
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Profile
          </Link>
        </nav>
      </div>
    </header>
  )
}
