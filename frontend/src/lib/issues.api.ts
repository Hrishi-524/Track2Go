import api from "@/lib/http";

export async function fetchIssues(user: string, repo: string) {
    const res = await api.get(`/repo/${user}/${repo}/issues`);
    console.log(res)
    return res.data.data; // assuming { success, data }
}

export async function createIssue(
    user: string,
    repo: string,
    payload: { title: string; description?: string }
) {
  const res = await api.post(`/repo/${user}/${repo}/issues`, payload);
  return res.data.data;
}

export async function updateIssue(
  user: string,
  repo: string,
  issueId: string,
  payload: Partial<{ title: string; description: string; status: string }>
) {
  const res = await api.patch(
    `/repo/${user}/${repo}/issues/${issueId}`,
    payload
  );
  return res.data.data;
}

export async function deleteIssue(
  user: string,
  repo: string,
  issueId: string
) {
  await api.delete(`/repo/${user}/${repo}/issues/${issueId}`);
}
