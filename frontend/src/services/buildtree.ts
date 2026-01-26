import { TreeNode, FileNode, FolderNode, RepoView } from "@/lib/types";

export function buildTree(files: { path: string; size: number; lastModified: Date }[]): TreeNode[] {
  const root: FolderNode = { type: "folder", name: "", children: [] };

  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;

      let existing = current.children.find(
        (c) => c.name === part
      ) as FolderNode | undefined;

      if (!existing) {
        existing = isFile
          ? {
              type: "file",
              name: part,
              path: file.path,
              size: file.size,
            }
          : {
              type: "folder",
              name: part,
              children: [],
            };

        current.children.push(existing);
      }

      if (!isFile && existing.type === "folder") {
        current = existing;
      }
    });
  }

  return root.children;
}
