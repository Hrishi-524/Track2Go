import { RepoFile, TreeNode, FileNode, FolderNode } from "@/lib/types"

export function buildFileTree(files: RepoFile[]): TreeNode[] {

  const root: TreeNode[] = []

  for (const file of files) {

    if (file.path === "commit.json") continue

    const parts = file.path.split("/")

    let currentLevel = root
    let currentPath = ""

    parts.forEach((part, index) => {

      const isFile = index === parts.length - 1
      currentPath = currentPath ? `${currentPath}/${part}` : part

      if (isFile) {

        const fileNode: FileNode = {
          type: "file",
          name: part,
          path: currentPath,
          size: file.size,
          lastModified: file.lastModified
        }

        currentLevel.push(fileNode)

      } else {

        let folder = currentLevel.find(
          node => node.type === "dir" && node.name === part
        ) as FolderNode | undefined

        if (!folder) {

          folder = {
            type: "dir",
            name: part,
            path: currentPath,
            children: []
          }

          currentLevel.push(folder)

        }

        currentLevel = folder.children

      }

    })
  }

  return root
}