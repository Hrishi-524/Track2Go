import { getCommits } from "@/lib/api/repo.api"
import CommitList from "@/components/commits/commit-list";

export default async function Page({
  params
}: {
  params: Promise<{ user: string; repo: string }>
}) {

  const { user, repo } = await params

  const commits = await getCommits(user, repo)

  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold">
        Commit History
      </h2>

      <CommitList commits={commits} />

    </div>
  )
}