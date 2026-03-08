import useSWR from "swr";
import { getFile } from "@/lib/api/repo.api";
import { RepoView } from "@/lib/types";

/**
    USE SWR SIGNATURE
    function useSWR<Data>(key, fetcher): {
        data?: Data
        error?: any
        isLoading: boolean
        isValidating: boolean
        mutate: Function
    }
*/

export function useFile(user?: string, repo?: string, commit?: string, filePath?: string) {
    return useSWR<string>(
  user && repo && commit && filePath
    ? ["file", user, repo, commit, filePath]
    : null,
  () => getFile(user!, repo!, commit!, filePath!),
  {
    revalidateOnFocus: false,
    dedupingInterval: 300000
  }
);
}