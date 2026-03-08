"use client"

import { useEffect, useState } from "react"
import { getMyRepos } from "@/lib/api/repo.api"

import DashboardHeader from "@/components/dashboard/dashboard-header"
import RepoGrid from "@/components/dashboard/repo-grid"
import EmptyRepos from "@/components/dashboard/empty-repos"
import { Repo } from "@/lib/types"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function DashboardPage() {

  const [repos, setRepos] = useState<Repo[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRepos() {
      const data = await getMyRepos()
      console.log("Fetched repos:", data)
      setRepos(data)
      setLoading(false)
    }

    loadRepos()
    console.log("Repos loaded:", repos)
  }, [])

  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AuthGuard>
    <div className="container py-10">

      <DashboardHeader
        search={search}
        setSearch={setSearch}
      />

      {loading && (
        <p className="text-muted-foreground">Loading repositories...</p>
      )}

      {!loading && filteredRepos.length === 0 && <EmptyRepos />}

      {!loading && filteredRepos.length > 0 && (
        <RepoGrid repos={filteredRepos} />
      )}

    </div>
    </AuthGuard>
  )
}