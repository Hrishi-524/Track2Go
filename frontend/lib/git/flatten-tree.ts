import { TreeNode } from "@/lib/types"

export function flattenTree(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = []

  function walk(list: TreeNode[]) {
    for (const node of list) {
      result.push(node)

      if (node.type === "dir") {
        walk(node.children)
      }
    }
  }

  walk(nodes)

  return result
}