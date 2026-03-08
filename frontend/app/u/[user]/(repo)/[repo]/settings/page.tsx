"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { updateRepo, deleteRepo } from "@/lib/api/repo.api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function RepoSettingsPage({
  params
}: {
  params: Promise<{ user: string; repo: string }>
}) {

  const { user, repo } = use(params)
  const router = useRouter()

  const [name, setName] = useState(repo)
  const [visibility, setVisibility] = useState<"public" | "private">("public")
  const [loading, setLoading] = useState(false)

  async function handleUpdate() {
    setLoading(true)

    try {
      await updateRepo(user, repo, {
        name,
        visibility
      })

      router.push(`/u/${user}/${name}/tree`)
    } catch (err) {
      console.error(err)
      alert("Failed to update repository")
    }

    setLoading(false)
  }

  async function handleDelete() {
    const confirm = window.confirm(
      "Are you sure you want to delete this repository?"
    )

    if (!confirm) return

    try {
      await deleteRepo(user, repo)
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
      alert("Failed to delete repository")
    }
  }

  return (
    <div className="container space-y-8">

      <div className="border rounded-lg p-6 space-y-8">

        {/* General */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">General</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Repository name
            </label>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{user} /</span>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>

          <Button
            onClick={handleUpdate}
            disabled={loading}
          >
            Rename repository
          </Button>
        </section>

        <Separator />

        {/* Danger Zone */}
        <section className="space-y-6 border border-destructive/40 rounded-lg p-5">

          <h2 className="text-lg font-semibold text-destructive">
            Danger Zone
          </h2>

          {/* Visibility */}
          <div className="flex items-center justify-between gap-6">

            <div>
              <p className="font-medium">
                Change repository visibility
              </p>

              <p className="text-sm text-muted-foreground">
                This repository is currently {visibility}.
              </p>
            </div>

            <select
              value={visibility}
              onChange={(e) =>
                setVisibility(e.target.value as "public" | "private")
              }
              className="border rounded px-3 py-2 bg-background"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>

          </div>

          <Separator />

          {/* Delete */}
          <div className="flex items-center justify-between gap-6">

            <div>
              <p className="font-medium">
                Delete this repository
              </p>

              <p className="text-sm text-muted-foreground">
                Once deleted, this repository cannot be recovered.
              </p>
            </div>

            <Button
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
            >
              Delete repository
            </Button>

          </div>

        </section>

      </div>

    </div>
  )
}