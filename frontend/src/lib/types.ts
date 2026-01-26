export interface RepoView {
    repo: string
    user: string
    empty?: string
    description?: string
    head: string
    files: RepoFile[]
}

export interface CommitMeta {
    commitHash: string
    message: string
    parent: string | null
    date: string
}

export interface RepoFile {
    path: string;
    size: number;
    lastModified: string;
}

export type FileNode = {
    type: "file";
    name: string;
    path: string;
    size: number;
};

export type FolderNode = {
    type: "folder";
    name: string;
    children: TreeNode[];
};

export type Entry = {
  name: string
  path: string   // full relative path from repo root
  type: "file" | "folder"
}



export type TreeNode = FileNode | FolderNode;