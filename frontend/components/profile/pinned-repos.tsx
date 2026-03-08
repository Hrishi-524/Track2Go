import Link from "next/link"
import { Repo } from "@/lib/types"

export function PinnedRepos({ repos }: { repos: Repo[] }) {

  if (!repos || repos.length === 0) return null

  return (
    <div className="space-y-4">

      <h3 className="text-sm font-semibold text-muted-foreground">
        Pinned
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {repos.slice(0,6).map(repo => (

          <Link
            key={repo.name}
            href={`/u/${repo.username}/${repo.name}/tree`}
            className="border rounded-lg p-4 hover:bg-muted/40 transition"
          >

            <div className="font-medium">
              {repo.name}
            </div>

            {repo.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {repo.description}
              </p>
            )}

          </Link>

        ))}

      </div>

    </div>
  )
}