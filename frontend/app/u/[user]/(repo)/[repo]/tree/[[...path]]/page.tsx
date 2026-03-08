import { getRepo } from "@/lib/api/repo.api"
import { buildFileTree } from "@/lib/git/build-file-tree"
import { RepoBreadcrumbs } from "@/components/repo/breadcrumbs/repo-breadcrumbs"
import { FileTree } from "@/components/repo/tree/file-tree"
import { FolderNode, TreeNode } from "@/lib/types"
import { getFile } from "@/lib/api/repo.api"
import MarkdownViewer from "@/components/repo/blob/markdown-viewer"
import { getCommits } from "@/lib/api/repo.api"
import EmptyRepo from "@/components/repo/tree/empty-repo"

export default async function Page({
  params
}: {
  params: Promise<{ user: string; repo: string; path?: string[] }>
}) {

  const { user, repo, path } = await params
  const currentPath = path ?? []

  const repoData = await getRepo(user, repo)

  const tree = buildFileTree(repoData.files)

  const commits = await getCommits(user, repo)

  if (commits.length === 0) {
  return <EmptyRepo user={user} repo={repo} />
}
const latestCommit = commits[0]

  let current: TreeNode[] = tree

  for (const segment of currentPath) {

    const folder = current.find(
      node => node.type === "dir" && node.name === segment
    ) as FolderNode | undefined

    current = folder?.children ?? []

  }

  const entries = current.map(node => ({
    name: node.name,
    path: node.path,
    type: node.type === "dir" ? "dir" : "file"
  }))

  const basePath =
    currentPath.length > 0
      ? `/u/${user}/${repo}/tree/${currentPath.join("/")}`
      : `/u/${user}/${repo}/tree`

      const readmeEntry = entries.find(
  (e) => e.type === "file" && e.name.toLowerCase() === "readme.md"
)

let readmeContent: string | null = null

if (currentPath.length === 0) {
  const readmeEntry = entries.find(
    (e) => e.type === "file" && e.name.toLowerCase() === "readme.md"
  )

  if (readmeEntry) {
    readmeContent = await getFile(
      user,
      repo,
      repoData.head,
      readmeEntry.path
    )
  }
}

  return (
  <div className="space-y-4">

  <div className="border rounded-lg overflow-hidden">

    <div className="px-4 py-2 border-b bg-muted/40">
      <RepoBreadcrumbs
        user={user}
        repo={repo}
        path={currentPath}
      />
    </div>
    {latestCommit && (
  <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30 text-sm">

    <div className="flex items-center gap-3">

      <span className="font-medium">
        {latestCommit.message}
      </span>

      <span className="font-mono text-xs text-muted-foreground">
        {latestCommit.commitHash.slice(0,7)}
      </span>

    </div>

    <span className="text-xs text-muted-foreground">
      {new Date(latestCommit.date).toLocaleDateString()}
    </span>

  </div>
)}
    <FileTree
      entries={entries}
      basePath={basePath}
    />

  </div>

 {/* README only on root */}
{currentPath.length === 0 && (
  <div className="border rounded-lg overflow-hidden">

    <div className="px-4 py-2 border-b bg-muted/40 text-sm font-medium">
      README.md
    </div>

    {readmeContent ? (
      <MarkdownViewer content={readmeContent} />
    ) : (
      <div className="p-6 text-sm text-muted-foreground">
        This repository does not have a README yet.
      </div>
    )}

  </div>
)}

</div>
)
}