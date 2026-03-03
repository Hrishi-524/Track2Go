import { useRouter } from "next/router"
import { useFile } from "@/hooks/useFile"
import { AppHeader } from "@/components/ui/app-header"
import { Skeleton } from "@/components/ui/skeleton"
import { FileIcon, ChevronRight, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

function FilePathBreadcrumb({ user, repo, filePath, commit }: { user?: string; repo?: string; filePath: string; commit?: string }) {
  const parts = filePath.split("/")
  
  return (
    <div className="flex items-center gap-2 text-sm mb-6">
      <span className="text-muted-foreground">{user}</span>
      <ChevronRight size={16} className="text-muted-foreground" />
      <span className="text-muted-foreground">{repo}</span>
      <ChevronRight size={16} className="text-muted-foreground" />
      <span className="text-muted-foreground">blob</span>
      <ChevronRight size={16} className="text-muted-foreground" />
      <Badge variant="outline" className="text-xs">{commit?.slice(0, 7)}</Badge>
      {parts.map((part, idx) => (
        <span key={idx}>
          <ChevronRight size={16} className="text-muted-foreground inline" />
          <span className="ml-2 text-foreground">{part}</span>
        </span>
      ))}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Skeleton className="h-6 w-96 mb-6" />
        <Skeleton className="h-96 w-full rounded-lg" />
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
          <h2 className="text-xl font-semibold text-destructive mb-2">Error loading file</h2>
          <p className="text-destructive/80 text-sm mb-4">The file could not be loaded. It may have been deleted or moved.</p>
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

export default function FilePage() {
    const router = useRouter()
    const { user, repo, path } = router.query
    const username = typeof user === "string" ? user : undefined
    const repoName = typeof repo === "string" ? repo : undefined

    const segments = Array.isArray(path) ? path : []
    const commit = segments[0]
    const filePath = segments.slice(1).join("/")
    
    const { data, error, isLoading } = useFile(username, repoName, commit, filePath)
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
      navigator.clipboard.writeText(typeof data === "string" ? data : JSON.stringify(data, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState router={router} />

    const fileContent = typeof data === "string" ? data : JSON.stringify(data, null, 2)

    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <FilePathBreadcrumb user={username} repo={repoName} filePath={filePath} commit={commit} />

          {/* File Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <FileIcon size={20} className="text-muted-foreground" />
              <h1 className="text-2xl font-bold text-foreground">{filePath.split("/").pop()}</h1>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition text-sm font-medium"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* File Content */}
          <div className="rounded-lg border border-border overflow-hidden bg-gray-950">
            <pre className="p-6 overflow-x-auto text-sm leading-relaxed">
              <code className="font-mono text-gray-200">
                {fileContent}
              </code>
            </pre>
          </div>
        </div>
      </div>
    )
}
