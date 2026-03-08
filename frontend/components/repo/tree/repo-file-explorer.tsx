"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ChevronRight, ChevronDown, Folder } from "lucide-react"
import { TreeNode } from "@/lib/types"
import { FileTypeIcon } from "./file-icon"

export default function RepoFileExplorer({
  tree,
  user,
  repo
}: {
  tree: TreeNode[]
  user: string
  repo: string
}) {

  const pathname = usePathname()
  const [openFolders, setOpenFolders] = useState(new Set())
  
    useEffect(() => {
  const parts = pathname.split("/blob/")[1]?.split("/") ?? []

  const autoOpen = new Set<string>()

  for (let i = 1; i < parts.length; i++) {
    autoOpen.add(parts.slice(0, i).join("/"))
  }

  setOpenFolders(autoOpen)
}, [pathname])
  function toggle(path: string) {
    const next = new Set(openFolders)

    if (next.has(path)) {
      next.delete(path)
    } else {
      next.add(path)
    }

    setOpenFolders(next)
  }

  function renderNode(node: TreeNode) {

    if (node.type === "dir") {

      const open = openFolders.has(node.path)

      return (
        <div key={node.path}>

          <button
            onClick={() => toggle(node.path)}
            className="flex items-center gap-2 text-sm px-2 py-1 rounded-md w-full text-left hover:bg-muted/50"
          >
            {open ? (
              <ChevronDown size={12}  className="opacity-70" />
            ) : (
              <ChevronRight size={12}  className="opacity-70" />
            )}

           <Folder size={15} className="text-yellow-400" />

            {node.name}
          </button>

          {open && (
            <div className="ml-4 border-l border-border pl-2">
              {node.children.map(renderNode)}
            </div>
          )}

        </div>
      )
    }

    const href = `/u/${user}/${repo}/blob/${node.path}`

const active = pathname.split("/blob/")[1] === node.path

    return (
      <Link
        key={node.path}
        href={href}
        className={`flex items-center gap-2 text-sm px-2 py-1 rounded-md ml-4 hover:bg-muted/50
${active ? "bg-muted font-medium" : ""}`}
      >
        <FileTypeIcon filename={node.name} />

        {node.name}
      </Link>
    )
  }

  return (
    <div className="border rounded-lg bg-card/30 p-2 overflow-auto max-h-[75vh]">

      {tree.map(renderNode)}

    </div>
  )
}