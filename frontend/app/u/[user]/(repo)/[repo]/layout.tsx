import { RepoHeader } from "@/components/repo/header/repo-header"
import { RepoTabs } from "@/components/repo/header/repo-tabs"
import { getRepoCached } from "@/lib/api/repo.cached"

export default async function RepoLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ user: string; repo: string }>
}) {

  const { user, repo } = await params

  const repoData = await getRepoCached(user, repo)

  return (
    <div className="max-w-[1124px] mx-auto px-6 space-y-6">

      <RepoHeader repo={repoData} />

      <RepoTabs user={user} repo={repo} />

      <div className="min-w-0">
        {children}
      </div>

    </div>
  )
}