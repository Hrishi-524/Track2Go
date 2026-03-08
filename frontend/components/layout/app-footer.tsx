import Link from "next/link"

export function AppFooter() {
  return (
    <footer className="border-t">
      <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">

        <p>
          © {new Date().getFullYear()} Track2Go
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/YOUR_GITHUB"
            target="_blank"
            className="hover:text-foreground transition"
          >
            GitHub
          </Link>

          <Link
            href="/dashboard"
            className="hover:text-foreground transition"
          >
            Demo
          </Link>
        </div>

      </div>
    </footer>
  )
}