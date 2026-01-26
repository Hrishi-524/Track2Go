import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Entry, RepoView } from "@/lib/types"
import getEntries from "@/services/get.entries"
import { useRepo } from "@/hooks/useRepo"

/* 
    repoData Structure
    {
        repo: repo.name,
        user: user.username,
        description: repo.description,
        head: repoData.head,
        files: repoData.files
    }

    files: [{
        path: index.js
        size: 225k
        lastModified: js date
    }, {
        path: /services/sync.repository.js
        size: 300k
        lastModified: js date
    }, 
       ...
    ]

*/

function RepoPage() {
    const router = useRouter()
    const { user, repo } = router.query

    const username = typeof user === "string" ? user : undefined
    const repoName = typeof repo === "string" ? repo : undefined

    const { data: repoData, error, isLoading } = useRepo(username, repoName)

    if (repoData && repoData.empty) {
        return (
            <div>
                <h2>This repository is empty</h2>

                <pre>
                    track2go remote https://track2go.com/{repoData.user}/{repoData.repo}
                    treck2go push
                </pre>
            </div>
        );
}


    const entries = repoData ? getEntries(repoData.files, "") : []

    if (isLoading) return <div>Loading repository...</div>
    if (error) return <div>Error loading repository</div>
    if (!repoData) return <div>Repository not found</div>

    return (
        <div>
            <h1>{repoData.user}/{repoData.repo}</h1>

            <p>
                <strong>HEAD:</strong> {repoData.head}
            </p>

            <h2>Files</h2>
            <ul>
                {entries.map(entry => (
                    <li key={entry.name}>
                        {entry.type === "folder" ? (
                            <Link href={`/${user}/${repo}/tree/${repoData.head}/${entry.path}`}>
                                {entry.name}/
                            </Link>
                        ) : (
                            <Link href={`/${user}/${repo}/blob/${repoData.head}/${entry.path}`}>
                                {entry.name}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default RepoPage