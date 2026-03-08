import useSWR from "swr";
import { fetchIssues } from "@/lib/api/issues.api";
import { Issue } from "@/types/issue"

export function useIssues(user?: string, repo?: string) {
  return useSWR<Issue[]>(
    user && repo ? ["issues", user, repo] : null,
    () => fetchIssues(user!, repo!)
  )
}