import RepoFileExplorer from "@/components/repo/tree/repo-file-explorer"
import RepoFileSearch from "@/components/repo/tree/repo-file-search"
import { getRepoCached } from "@/lib/api/repo.cached"
import { buildFileTreeCached } from "@/lib/git/build-tree-cached"

export default async function BlobLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ user: string; repo: string }>
}) {

  const { user, repo } = await params

  const repoData = await getRepoCached(user, repo)
  const tree = buildFileTreeCached(repoData.files)

  return (
    <div className="grid grid-cols-[280px_minmax(0,1fr)] gap-6">

      <div className="space-y-3">

        <RepoFileSearch
          tree={tree}
          user={user}
          repo={repo}
        />

        <RepoFileExplorer
          tree={tree}
          user={user}
          repo={repo}
        />

      </div>

      <div className="min-w-0">
        {children}
      </div>

    </div>
  )
}