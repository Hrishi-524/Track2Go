import useSWR from "swr";
import { fetchIssues } from "@/lib/issues.api";

export function useIssues(user?: string, repo?: string) {
  return useSWR(
    user && repo ? ["issues", user, repo] : null,
    () => fetchIssues(user!, repo!)
  );
}