import useSWR from "swr";
import { getRepo } from "@/lib/api";
import { RepoView } from "@/lib/types";

export function useRepo(user?: string, repo?: string) {
    return useSWR<RepoView>(
        user && repo ? ["repo", user, repo] : null,
        () => getRepo(user!, repo!)
    );
}


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

/*
    Q: What is this ["repo", user, repo] key?

    This is crucial.

    SWR cache is indexed by key.

    ["repo", "Hrishi-524", "test2go"]


    This uniquely identifies:

    “Repo test2go owned by Hrishi-524”

    If:

    RepoPage uses this key

    TreePage uses the SAME key

    They share the same cached data

    This is the entire trick.
*/