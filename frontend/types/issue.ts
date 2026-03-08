export type IssueStatus = "open" | "closed"

export type Issue = {
  id: string
  title: string
  description?: string
  status: IssueStatus
  createdAt: string
}

export type IssuesResponse = {
  success: boolean
  data: Issue[]
}