import { getFile } from "@/lib/api/repo.api"
import { RepoBreadcrumbs } from "@/components/repo/breadcrumbs/repo-breadcrumbs"
import { highlightCode } from "@/lib/syntax/highlight"
import BlobViewer from "@/components/repo/blob/blob-viewer"
import { detectLanguage } from "@/lib/syntax/file-language"
import BlobRenderer from "@/components/repo/blob/blob-renderer"
import { buildFileTree } from "@/lib/git/build-file-tree"
import { getRepoCached } from "@/lib/api/repo.cached"

export default async function Page({
    params
}: {
    params: Promise<{
        user: string
        repo: string
        path: string[]
    }>
}) {

    const { user, repo, path } = await params

    const repoData = await getRepoCached(user, repo)

    const filePath = path.join("/")

    const fileContent = await getFile(
        user,
        repo,
        repoData.head,
        filePath
    )

    const lang = detectLanguage(filePath)

    const highlighted = await highlightCode(
        fileContent,
        lang
    )

    return (
        <div className="space-y-3">


            {/* Breadcrumb bar */}
            <div className="border rounded-lg px-4 py-2 bg-muted/40">
                <RepoBreadcrumbs
                    user={user}
                    repo={repo}
                    path={path}
                />
            </div>

            {/* Code editor */}
            <BlobRenderer
                filePath={filePath}
                highlighted={highlighted}
                raw={fileContent}
            />

        </div>
    )
}