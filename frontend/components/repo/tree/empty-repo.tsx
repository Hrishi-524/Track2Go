"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { getRepoRemoteUrl } from "@/lib/utils/repo-url"
import { useState } from "react"

export default function EmptyRepo({
  user,
  repo
}: {
  user: string
  repo: string
}) {
    const remoteUrl = getRepoRemoteUrl(user, repo)
const [copied, setCopied] = useState(false)

async function copyUrl() {
  await navigator.clipboard.writeText(remoteUrl)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}
  return (
    <div className="border rounded-lg p-10 space-y-8">

      {/* Title */}
      <div className="space-y-2">

        <h3 className="text-xl font-semibold">
          This repository is empty
        </h3>

        <p className="text-muted-foreground text-sm max-w-xl">
          Initialize this repository using the Track2Go CLI and push your first commit.
        </p>

      </div>
      <div className="flex items-center gap-2 border rounded-md px-1 py-1 bg-muted w-max">
        <p>$ track2go clone {remoteUrl}</p>

        <Button
            size="icon"
            variant="ghost"
            onClick={copyUrl}
            className="hover:bg-muted" 
        >
            <Copy size={14} />
        </Button>
        </div>

      {/* Terminal */}
      <Card className="bg-black text-green-400 font-mono max-w-2xl">

        <CardHeader className="flex flex-row items-center gap-2">

          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>

          <CardTitle className="ml-4 text-sm text-neutral-400 font-normal">
            terminal
          </CardTitle>

        </CardHeader>

        <CardContent className="space-y-2 text-sm">

          <p>$ track2go clone https://track2go.hrishi-developer.in/{user}/{repo}</p>
          <p>$ cd {repo}</p>
          <p>$ track2go init</p>
          <p>$ track2go add .</p>
          <p>$ track2go commit -m "Initial commit"</p>
          <p>$ track2go push</p>

        </CardContent>

      </Card>

    </div>
  )
}