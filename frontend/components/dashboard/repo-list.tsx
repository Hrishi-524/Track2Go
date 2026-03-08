import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Repo } from "@/lib/types"

export function RepoList({ repos }: { repos: Repo[] }) {
  return (
    <div className="border rounded-lg divide-y">

      {repos.map((repo) => (
        <div
          key={repo.name}
          className="p-4 space-y-2"
        >

          {/* Top */}
          <div className="flex items-center justify-between">

            <Link
              href={`/u/${repo.username}/${repo.name}/tree`}
              className="font-medium text-primary hover:underline"
            >
              {repo.name}
            </Link>

            <Badge variant="secondary">
              {repo.visibility ?? "Public"}
            </Badge>

          </div>

          {/* Description */}
          {repo.description && (
            <p className="text-sm text-muted-foreground">
              {repo.description}
            </p>
          )}

          {/* Metadata */}
          {/* <div className="text-xs text-muted-foreground">
            Updated {new Date(repo.updatedAt).toLocaleDateString()}
          </div> */}

        </div>
      ))}

    </div>
  )
}