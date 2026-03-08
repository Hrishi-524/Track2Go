"use client"

import Link from "next/link"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { Star, Pin, Copy, Check, Code } from "lucide-react"

import { RepoView } from "@/lib/types"
import { getRepoRemoteUrl } from "@/lib/utils/repo-url"

export function RepoHeader({ repo }: { repo: RepoView }) {

  const remoteUrl = getRepoRemoteUrl(repo.user, repo.repo)

  const [copied, setCopied] = useState(false)

  async function copyUrl() {
    await navigator.clipboard.writeText(remoteUrl)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="mt-4 space-y-4 border-b pb-4">

      {/* Top row */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2 text-lg font-semibold">

          <Link
            href={`/u/${repo.user}`}
            className="text-muted-foreground hover:underline"
          >
            {repo.user}
          </Link>

          <span className="text-muted-foreground">/</span>

          <span>{repo.repo}</span>

          <Badge variant="secondary">
            {repo.visibility ?? "Public"}
          </Badge>

        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">

          {/* Code dropdown */}
          <DropdownMenu>

            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-1"
              >
                <Code size={14} />
                Code
              </Button>
            </DropdownMenuTrigger>

            {/* <DropdownMenuContent className="w-[360px] p-4 space-y-3">

              <p className="text-sm font-medium">
                Clone with Track2Go CLI
              </p>

              <div className="flex items-center gap-2">

                <code className="flex-1 text-xs bg-muted px-2 py-1 rounded">
                  track2go clone {remoteUrl}
                </code>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={copyUrl}
                >
                  {copied ? (
                    <Check size={14} />
                  ) : (
                    <Copy size={14} />
                  )}
                </Button>

              </div>

            </DropdownMenuContent> */}
            <DropdownMenuContent className="w-[360px] p-4 space-y-3">

              <p className="text-sm font-medium">
                Remote origin
              </p>

              <div className="flex items-center gap-2">

                <code className="flex-1 text-xs bg-muted px-2 py-1 rounded">
                  {remoteUrl}
                </code>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={copyUrl}
                >
                  {copied ? (
                    <Check size={14} />
                  ) : (
                    <Copy size={14} />
                  )}
                </Button>

              </div>

            </DropdownMenuContent>

          </DropdownMenu>

          {/* Star */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Star size={14} />
            Star
          </Button>

          {/* Pin */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Pin size={14} />
            Pin
          </Button>

        </div>

      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-sm text-muted-foreground">
          {repo.description}
        </p>
      )}

    </div>
  )
}