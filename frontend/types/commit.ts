export type Commit = {
  commitHash: string
  message: string
  parent: string | null
  date: string
}