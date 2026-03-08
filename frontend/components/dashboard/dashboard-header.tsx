"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bell, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardHeader({
  search,
  setSearch
}: {
  search: string
  setSearch: (v: string) => void
}) {

  const router = useRouter()

  return (
    <div className="flex flex-col gap-4 mb-8">

      {/* Title */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-semibold">
            Your Repositories
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage and explore your Track2Go repositories
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>

          {/* New repo */}
          <Button onClick={() => router.push("/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Repo
          </Button>

        </div>
      </div>

      {/* Search bar */}
      <Input
        placeholder="Search repositories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

    </div>
  )
}