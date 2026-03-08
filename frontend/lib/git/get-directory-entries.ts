import { RepoFile } from "@/lib/types"

export type DirectoryEntry = {
  name: string
  path: string
  type: "file" | "dir"
}

export function getDirectoryEntries(
  files: RepoFile[],
  currentPath: string[]
): DirectoryEntry[] {

  const prefix = currentPath.length > 0
    ? currentPath.join("/") + "/"
    : ""

  const map = new Map<string, DirectoryEntry>()

  for (const file of files) {

    if (file.path === "commit.json") continue

    if (!file.path.startsWith(prefix)) continue

    const remaining = file.path.slice(prefix.length)

    const segment = remaining.split("/")[0]

    const fullPath = prefix + segment

    if (!map.has(segment)) {

      const isFile = !remaining.includes("/")

      map.set(segment, {
        name: segment,
        path: fullPath,
        type: isFile ? "file" : "dir"
      })

    }

  }

  return Array.from(map.values())
}