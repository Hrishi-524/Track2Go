import Link from "next/link"
import { Folder } from "lucide-react"

export function RepoBreadcrumbs({
  user,
  repo,
  path
}: {
  user: string
  repo: string
  path: string[]
}) {

  let cumulative = ""

  return (
    <div className="flex items-center gap-1 text-xxl text-muted-foreground">

      {/* Repo root */}
      <Link
        href={`/u/${user}/${repo}/tree`}
        className="flex items-center gap-1 hover:text-foreground"
      >
        <Folder size={14} />
        {repo}
      </Link>

      {path.map((segment, i) => {

        cumulative += `/${segment}`

        const isLast = i === path.length - 1

        return (
          <span key={i} className="flex items-center gap-1">

            <span className="px-1">/</span>

            {isLast ? (
              <span className="text-foreground">
                {segment}
              </span>
            ) : (
              <Link
                href={`/u/${user}/${repo}/tree${cumulative}`}
                className="hover:text-foreground"
              >
                {segment}
              </Link>
            )}

          </span>
        )
      })}

    </div>
  )
}