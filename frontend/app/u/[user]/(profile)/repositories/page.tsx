import { RepoList } from "@/components/dashboard/repo-list"
import { getMyRepos } from "@/lib/api/repo.api"
import { headers } from "next/headers"

export default async function Page() {

  const h = await headers()
  const cookie = h.get("cookie") || ""

  const repos = await getMyRepos(cookie)
  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold">
        Repositories
      </h2>


      <RepoList repos={repos} />

    </div>
  )
}