export interface RepoView {
  repo: string
  user: string
  description?: string
  visibility?: "Public" | "Private"
  head: string | null
  empty: boolean
  files: RepoFile[]
  updatedAt?: Date
}

export interface Repo {
  _id: string
  owner: string
  username: string
  name: string
  description?: string
  visibility: "Public" | "Private"
  issues?: any[]
  issueCount: number
  updatedAt: Date
}

export interface RepoFile {
    path: string
    size: number
    lastModified: string
}

export type FileNode = {
    type: "file"
    name: string
    path: string
    size: number
    lastModified: string
}

export type FolderNode = {
    type: "dir"
    name: string
    path: string
    children: TreeNode[]
}

export type TreeNode = FileNode | FolderNode