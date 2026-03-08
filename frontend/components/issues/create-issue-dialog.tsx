"use client"

import { useState } from "react"
import { useSWRConfig } from "swr"
import { createIssue } from "@/lib/api/issues.api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter
} from "@/components/ui/alert-dialog"

export default function CreateIssueDialog({
  user,
  repo
}: {
  user: string
  repo: string
}) {

  const { mutate } = useSWRConfig()

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!title.trim()) return

    setLoading(true)

    try {
      await createIssue(user, repo, { title, description })

      await mutate(["issues", user, repo])

      setTitle("")
      setDescription("")
      setOpen(false)

    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        New Issue
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>

          <AlertDialogHeader>
            <AlertDialogTitle>Create new issue</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4">

            <Input
              placeholder="Issue title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

          </div>

          <AlertDialogFooter>

            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleCreate}
              disabled={loading}
            >
              Create Issue
            </Button>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}