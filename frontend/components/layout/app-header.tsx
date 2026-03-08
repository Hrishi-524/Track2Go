"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/auth/useAuth"
import { logout } from "@/lib/api/auth.client"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

export function AppHeader() {

  const { user, isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

 async function handleLogout() {
  await logout()
  router.push("/login")
  router.refresh()
}

  return (
    <header className="border-b">
      <div className="container flex h-14 items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="font-semibold text-lg"
        >
          Track2Go
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">

          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Dashboard
          </Link>

          <Link
            href="https://github.com/YOUR_REPO"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            GitHub
          </Link>

          {!isLoading && !isLoggedIn && (
            <>
              <Link href="/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>

              <Link href="/login">
                <Button size="sm" variant="secondary">
                  Login
                </Button>
              </Link>
            </>
          )}

            {!isLoading && isLoggedIn && user && (
                <DropdownMenu>

                    <DropdownMenuTrigger asChild>
                    <button className="w-8 h-8 rounded-full overflow-hidden border cursor-pointer hover:ring-2 hover:ring-muted transition">

                        <img
                        src={
                            user.avatarUrl ??
                            `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`
                        }
                        alt={user.username}
                        className="w-full h-full object-cover"
                        />

                    </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">

                    <DropdownMenuItem asChild>
                        <Link href={`/u/${user.username}`}>
                        Profile
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href={`/u/${user.username}/repositories`}>
                        Repositories
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href={`/u/${user.username}/settings`}>
                        Settings
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="text-red-500 cursor-pointer"
                        onClick={handleLogout}
                    >
                        Logout
                    </DropdownMenuItem>

                    </DropdownMenuContent>

                </DropdownMenu>

            )}

          <ThemeToggle />

        </nav>
      </div>
    </header>
  )
}