import api from "@/lib/api/http.client";
import { Issue } from "@/types/issue"

export async function fetchIssues(user: string, repo: string): Promise<Issue[]> {
  const res = await api.get(`/repo/${user}/${repo}/issues`)

  return res.data.data.map((issue: any) => ({
    id: issue._id,
    title: issue.title,
    description: issue.description,
    status: issue.status ?? "open",
    createdAt: issue.createdAt
  }))
}
export async function createIssue(
  user: string,
  repo: string,
  payload: { title: string; description?: string }
): Promise<Issue> {
    const res = await api.post(`/repo/${user}/${repo}/issues`, payload)

    const issue = res.data.data

    return {
    id: issue._id,
    title: issue.title,
    description: issue.description,
    status: issue.status ?? "open",
    createdAt: issue.createdAt
    }
}

export async function updateIssue(
  user: string,
  repo: string,
  issueId: string,
  payload: Partial<{ title: string; description: string; status: string }>
): Promise<Issue> {
  const res = await api.patch(
    `/repo/${user}/${repo}/issues/${issueId}`,
    payload
  );

  const issue = res.data.data

  return {
    id: issue._id,
    title: issue.title,
    description: issue.description,
    status: issue.status ?? "open",
    createdAt: issue.createdAt
  }
}

export async function deleteIssue(
  user: string,
  repo: string,
  issueId: string
) {
  await api.delete(`/repo/${user}/${repo}/issues/${issueId}`);
}
