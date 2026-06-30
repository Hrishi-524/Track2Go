"use client"

import { useEffect, useState } from "react"
import { RepoList } from "@/components/dashboard/repo-list"
import { getMyRepos } from "@/lib/api/repo.api"
import { Repo } from "@/lib/types"

export default function Page() {

  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRepos() {
      try {
        const data = await getMyRepos()
        setRepos(data)
      } finally {
        setLoading(false)
      }
    }

    loadRepos()
  }, [])

  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold">
        Repositories
      </h2>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading repositories...</p>
      )}

      {!loading && <RepoList repos={repos} />}

    </div>
  )
}
