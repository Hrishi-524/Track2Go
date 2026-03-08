import Link from "next/link"
import { File, Folder } from "lucide-react"
import { useMemo } from "react"

export function FileTree({
  entries,
  basePath,
}: {
  entries: any[]
  basePath: string
}) {

  const sortedEntries = useMemo(() => {
  return [...entries].sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name)
    }
    return a.type === "dir" ? -1 : 1
  })
}, [entries])

  return (
    <div className="border rounded-lg divide-y">

      {sortedEntries.map((entry) => {

        const href =
          entry.type === "dir"
            ? `${basePath}/${entry.name}`
            : basePath.replace("/tree", "/blob") + `/${entry.name}`

        return (
          <Link
            key={entry.path ?? entry.name}
            href={href}
            className="flex items-center gap-3 p-3 hover:bg-muted transition"
          >
            {entry.type === "dir" ? (
              <Folder size={16} />
            ) : (
              <File size={16} />
            )}

            <span>{entry.name}</span>

          </Link>
        )
      })}

    </div>
  )
}