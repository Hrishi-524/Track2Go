"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { PencilLine } from "lucide-react"
import { useAuth } from "@/hooks/auth/useAuth"

export default function UserLayout({ children }: { children: React.ReactNode }) {

  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [isLoading, router, user])

  if (isLoading) {
    return (
      <div className="container py-24 text-center text-muted-foreground">
        Checking authentication...
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-[1124px] mx-auto px-6 py-8">

      <div className="grid grid-cols-[260px_1fr] gap-8">

        {/* LEFT PROFILE */}
        <aside className="space-y-4">

          <div className="relative">

            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
              alt={user.username}
              className="w-full aspect-square rounded-full"
            />

            <Link
              href={`/u/${user.username}/settings`}
              className="absolute bottom-2 right-2 bg-background border rounded-full p-2"
            >
                <PencilLine />
            </Link>

          </div>

          <div>
            <h1 className="text-xl font-semibold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>

        </aside>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          <div className="border-b">

            <nav className="flex gap-6 text-sm font-medium text-muted-foreground mb-3">
              <Link className="hover:text-foreground " href={`/u/${user.username}`}>
                Overview
              </Link>

              <Link className="hover:text-foreground" href={`/u/${user.username}/repositories`}>
                Repositories
              </Link>

                <Link className="hover:text-foreground" href={`/u/${user.username}/settings`}>
                Settings
              </Link>
            </nav>

          </div>

          {children}

        </div>

      </div>

    </div>
  )
}
