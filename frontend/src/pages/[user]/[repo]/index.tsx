import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Entry, RepoView } from "@/lib/types"
import getEntries from "@/services/get.entries"
import { useRepo } from "@/hooks/useRepo"
import { AppHeader } from "@/components/ui/app-header"
import { GitBranch, FileIcon, FolderIcon, Clock, Copy, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

/* 
    repoData Structure
    {
        repo: repo.name,
        user: user.username,
        description: repo.description,
        head: repoData.head,
        files: repoData.files
    }

    files: [{
        path: index.js
        size: 225k
        lastModified: js date
    }, {
        path: /services/sync.repository.js
        size: 300k
        lastModified: js date
    }, 
       ...
    ]

*/

function EmptyRepository({ repoData }: { repoData: any }) {
  const [copied, setCopied] = useState(false)
  const command = `track2go remote https://track2go.com/${repoData.user}/${repoData.repo}\ntrack2go push`

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex items-center justify-center min-h-[calc(100vh-60px)] px-6">
        <div className="text-center">
          <GitBranch size={64} className="text-muted-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-2">This repository is empty</h2>
          <p className="text-muted-foreground mb-8">Push your first commit to get started</p>
          
          <div className="inline-block bg-gray-900 rounded-lg overflow-hidden border border-border">
            <div className="flex items-center justify-between px-4 py-3">
              <code className="font-mono text-sm text-gray-200 whitespace-pre-wrap">
                {command}
              </code>
              <button
                onClick={handleCopy}
                className="ml-4 p-1.5 text-gray-400 hover:text-gray-200 transition flex-shrink-0"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-6 w-24" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-6 w-32" />
        </div>

        {/* HEAD Badge */}
        <div className="mb-6">
          <Skeleton className="h-8 w-48" />
        </div>

        {/* File table skeleton */}
        <div className="rounded-lg border border-border overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-border/50 last:border-b-0">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ErrorState({ router }: { router: any }) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex items-center justify-center min-h-[calc(100vh-60px)]">
        <div className="p-8 rounded-lg border border-destructive/30 bg-destructive/5 text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">Error loading repository</h2>
          <p className="text-destructive/80 text-sm mb-4">Something went wrong. Please try again.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition text-sm font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}

function formatDate(date: any) {
  if (!date) return "—"
  const d = new Date(date)
  if (isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function RepoPage() {
    const router = useRouter()
    const { user, repo } = router.query

    const username = typeof user === "string" ? user : undefined
    const repoName = typeof repo === "string" ? repo : undefined

    const { data: repoData, error, isLoading } = useRepo(username, repoName)

    if (repoData && repoData.empty) {
        return <EmptyRepository repoData={repoData} />
    }

    const entries = repoData ? getEntries(repoData.files, "") : []

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState router={router} />
    if (!repoData) return <ErrorState router={router} />

    return (
        <div className="min-h-screen bg-background">
            <AppHeader />
            
            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Breadcrumb Row */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 text-lg">
                        <span className="text-muted-foreground">{repoData.user}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-semibold text-foreground">{repoData.repo}</span>
                    </div>
                    <Badge variant="outline" className="gap-2">
                        <GitBranch size={14} />
                        {repoData.head?.slice(0, 7) || "unknown"}
                    </Badge>
                </div>

                {/* File Explorer Table */}
                <div className="rounded-lg border border-border overflow-hidden">
                    {/* Table Header */}
                    <div className="flex items-center px-6 py-3 bg-muted/30 border-b border-border text-sm font-medium text-muted-foreground">
                        <div className="flex-1">Name</div>
                        <div className="w-32 text-right hidden md:block">Last modified</div>
                    </div>

                    {/* Table Body */}
                    {entries.length > 0 ? (
                        entries.map((entry, index) => (
                            <Link
                                key={entry.name}
                                href={
                                    entry.type === "folder"
                                        ? `/${user}/${repo}/tree/${repoData.head}/${entry.path}`
                                        : `/${user}/${repo}/blob/${repoData.head}/${entry.path}`
                                }
                            >
                                <div className="flex items-center px-6 py-3 border-b border-border/50 last:border-b-0 hover:bg-muted/20 transition cursor-pointer">
                                    <div className="flex-1 flex items-center gap-2">
                                        {entry.type === "folder" ? (
                                            <FolderIcon size={16} className="text-blue-400 flex-shrink-0" />
                                        ) : (
                                            <FileIcon size={16} className="text-muted-foreground flex-shrink-0" />
                                        )}
                                        <span className="text-foreground">
                                            {entry.name}
                                            {entry.type === "folder" && <span className="text-muted-foreground">/</span>}
                                        </span>
                                    </div>
                                    <div className="w-32 text-right text-sm text-muted-foreground hidden md:flex items-center justify-end gap-1">
                                        <Clock size={14} />
                                        {formatDate((entry as any).lastModified)}
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="px-6 py-8 text-center text-muted-foreground">
                            No files in this directory
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RepoPage
