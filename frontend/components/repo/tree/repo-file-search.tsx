"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { flattenTree } from "@/lib/git/flatten-tree"
import { TreeNode } from "@/lib/types"
import { Input } from "@/components/ui/input"

export default function RepoFileSearch({
  tree,
  user,
  repo
}: {
  tree: TreeNode[]
  user: string
  repo: string
}) {

  const [query, setQuery] = useState("")

  const flat = useMemo(() => flattenTree(tree), [tree])

  const results = useMemo(() => {
    if (!query) return []

    return flat
      .filter(n => n.type === "file")
      .filter(n =>
        n.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 20)
  }, [query, flat])

  return (
    <div className="relative">

      <Input
        placeholder="Search files..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full border rounded-lg bg-background shadow-lg max-h-[300px] overflow-auto">

          {results.map(file => (
            <Link
              key={file.path}
              href={`/u/${user}/${repo}/blob/${file.path}`}
              className="block px-3 py-2 text-sm hover:bg-muted"
            >
              {file.path}
            </Link>
          ))}

        </div>
      )}

    </div>
  )
}