"use client"

import Link from "next/link"
import { Issue } from "@/types/issue"
import { CircleDot, CheckCircle2 } from "lucide-react"

export default function IssueRow({
  issue,
  user,
  repo,
  onToggle
}: {
  issue: Issue
  user: string
  repo: string
  onToggle: (issue: Issue) => void
}) {

  const isOpen = issue.status === "open"

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/40 border-b">

      <Link
        href={`/u/${user}/${repo}/issues/${issue.id}`}
        className="flex items-center gap-3 flex-1"
      >

        {isOpen ? (
          <CircleDot size={18} className="text-green-500" />
        ) : (
          <CheckCircle2 size={18} className="text-purple-500" />
        )}

        <div className="flex flex-col">

          <span className="text-sm font-medium">
            {issue.title}
          </span>

          <span className="text-xs text-muted-foreground">
            #{issue.id.slice(-4)} opened {new Date(issue.createdAt).toLocaleDateString()}
          </span>

        </div>

      </Link>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggle(issue)
        }}
        className="text-xs px-2 py-1 border rounded hover:bg-muted"
      >
        {isOpen ? "Close" : "Reopen"}
      </button>

    </div>
  )
}