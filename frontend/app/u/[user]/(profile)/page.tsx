import MarkdownViewer from "@/components/repo/blob/markdown-viewer"

export default async function Page() {

  const profileReadme = null

  if (!profileReadme) {
    return (
      <div className="border rounded-lg p-6 text-sm text-muted-foreground">
        This user has not added a profile README.
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">

      <div className="px-4 py-2 border-b bg-muted/40 text-sm font-medium">
        README.md
      </div>

      <MarkdownViewer content={profileReadme} />

    </div>
  )
}