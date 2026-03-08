import { cache } from "react"
import { buildFileTree } from "./build-file-tree"

export const buildFileTreeCached = cache(buildFileTree)