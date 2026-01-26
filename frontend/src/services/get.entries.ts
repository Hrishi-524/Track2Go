import { Entry } from "@/lib/types"

function getEntries(
  files: { path: string }[],
  currentPath: string
): Entry[] {
  const entries = new Map<string, Entry>()

  for (const file of files) {
    if (currentPath && !file.path.startsWith(currentPath + "/")) {
      continue
    }

    const relativePath = currentPath
      ? file.path.slice(currentPath.length + 1)
      : file.path

    const parts = relativePath.split("/")
    const name = parts[0]

    // File
    if (parts.length === 1) {
      entries.set(name, {
        name,
        path: file.path,          // ✅ full canonical path
        type: "file"
      })
    }
    // Folder
    else {
      entries.set(name, {
        name,
        path: currentPath
          ? `${currentPath}/${name}`
          : name,                 // ✅ full folder path
        type: "folder"
      })
    }
  }
  return Array.from(entries.values())
}

export default getEntries
