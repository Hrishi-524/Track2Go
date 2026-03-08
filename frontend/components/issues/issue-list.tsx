"use client"

import { Issue } from "@/types/issue"
import IssueRow from "./issue-row"
import { useSWRConfig } from "swr"
import { updateIssue } from "@/lib/api/issues.api"

export default function IssueList({
  issues,
  user,
  repo
}: {
  issues: Issue[]
  user: string
  repo: string
}) {

  const { mutate } = useSWRConfig()

  async function toggleIssue(issue: Issue) {

    const newStatus = issue.status === "open" ? "closed" : "open"

    await updateIssue(user, repo, issue.id, {
      status: newStatus
    })

    mutate(["issues", user, repo])
  }

  if (!issues.length) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        No issues yet
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">

      {issues.map(issue => (
        <IssueRow
          key={issue.id}
          issue={issue}
          user={user}
          repo={repo}
          onToggle={toggleIssue}
        />
      ))}

    </div>
  )
}