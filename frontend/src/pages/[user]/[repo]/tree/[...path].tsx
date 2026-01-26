import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import { Entry, FileNode, FolderNode, RepoView, TreeNode } from "@/lib/types"
import { useRepo } from "@/hooks/useRepo"
import getEntries from "@/services/get.entries"

export default function TreePage() {
    // Set Router get dynamic segments
    const router = useRouter()
    const { user, repo, path } = router.query
    const username = typeof user === "string" ? user : undefined
    const repoName = typeof repo === "string" ? repo : undefined

    // Returns a useSWR Signature, response has data which is of type RepoView
    const { data: repoData, error, isLoading } = useRepo(username, repoName)
    
    // Seperate commitId and currentPath relative to root/{currentPath} for latest commit
    const segments = Array.isArray(path) ? path : []
    const commit = segments[0] ?? null // commitId
    const currentPath = segments.slice(1).join("/") // Rest of the path
    
    // Get crumbs for UX
    const crumbs = currentPath ? currentPath.split("/") : [] // array of strings as each individual string represents one part of path called crumbs
    
    // Have entries array of entries each entry has name, path, type: file/folder
    const entries = repoData ? getEntries(repoData.files, currentPath) : []

    // Async and Error handling UX
    if (isLoading) return <div>Loading repository...</div>
    if (error) return <div>Error loading repository</div>
    if (!repoData) return <div>Repository not found</div>

    return (
        <div>
            <h1>
                {user}/{repo}
            </h1>
            <p>Commit: {commit}</p>
            <nav style={{ marginBottom: "12px" }}>
                <Link href={`/${username}/${repoName}/tree/${repoData.head}`}>
                    {repoData.repo}
                </Link>

                {crumbs.map((crumb, index) => {
                    const crumbPath = crumbs.slice(0, index + 1).join("/")

                    return (
                        <span key={crumb}>
                            {" / "}
                            <Link
                                href={`/${username}/${repoName}/tree/${repoData.head}/${crumbPath}`}
                            >
                            {crumb}
                            </Link>
                        </span>
                    )
                })}
            </nav>

            <ul>
                {entries.map(entry => (
                    <li key={entry.name}>
                    {entry.type === "folder" ? (
                        <Link href={`/${username}/${repoName}/tree/${repoData.head}/${entry.path}`}>
                            {entry.name}/
                        </Link>
                    ) : (
                        <Link href={`/${username}/${repoName}/blob/${repoData.head}/${entry.path}`}>
                            {entry.name}
                        </Link>
                    )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
