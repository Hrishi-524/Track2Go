"use client"

import React from "react"
import { useIssues } from "@/hooks/issues/useIssues"
import IssueList from "@/components/issues/issue-list"
import CreateIssueDialog from "@/components/issues/create-issue-dialog"

export default function Page({
  params
}: {
  params: Promise<{ user: string; repo: string }>
}) {

  const { user, repo } = React.use(params)

  const { data: issues, isLoading } = useIssues(user, repo)

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">

        <h2 className="text-lg font-semibold">
          Issues
        </h2>

        <CreateIssueDialog user={user} repo={repo} />

      </div>

      {isLoading ? (
        <div>Loading issues...</div>
      ) : (
        <IssueList
          issues={issues ?? []}
          user={user}
          repo={repo}
        />
      )}

    </div>
  )
}