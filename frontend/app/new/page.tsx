"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createRepo, checkRepoNameAvailable } from "@/lib/api/repo.api"
import { BookMarked, Lock } from "lucide-react"

export default function NewRepoPage() {

  const router = useRouter()

  const username = "Hrishi-524" // later you can fetch from auth

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState<"public" | "private">("public")

  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null)

  // Debounced repo name check
  useEffect(() => {

    if (!name.trim()) {
      setNameAvailable(null)
      return
    }

    const timeout = setTimeout(async () => {

      try {
        setChecking(true)

        const res = await checkRepoNameAvailable(username, name)

        setNameAvailable(res.available)

      } catch (err) {
        console.error(err)
      }

      setChecking(false)

    }, 500)

    return () => clearTimeout(timeout)

  }, [name, username])


  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault()

    if (!name.trim() || nameAvailable === false) return

    setLoading(true)

    try {

      const repo = await createRepo(name, description, visibility)

      router.push(`/u/${repo.data.owner.username}/${repo.data.name}/tree`)

    } catch (err) {
      console.error(err)
      alert("Failed to create repository")
    }

    setLoading(false)

  }

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8">

      <h1 className="text-2xl font-semibold">
        Create a new repository
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 border rounded-lg p-6"
      >

        {/* GENERAL */}
        <div className="space-y-4">

          <h2 className="text-lg font-medium">
            General
          </h2>

          {/* Repo name */}
          <div className="space-y-2">

            <label className="text-sm font-medium">
              Repository name
            </label>

            <div className="flex items-center gap-2">

              <span className="text-sm text-muted-foreground">
                {username} /
              </span>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 border rounded px-3 py-2 bg-background"
                placeholder="my-project"
              />

            </div>

            {/* Validation */}
            {checking && (
              <p className="text-xs text-muted-foreground">
                Checking availability...
              </p>
            )}

            {nameAvailable === true && (
              <p className="text-xs text-green-500">
                Repository name available
              </p>
            )}

            {nameAvailable === false && (
              <p className="text-xs text-red-500">
                Repository name already exists
              </p>
            )}

          </div>


          {/* Description */}
          <div className="space-y-2">

            <label className="text-sm font-medium">
              Description (optional)
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-background"
              rows={3}
            />

          </div>

        </div>


        {/* CONFIGURATION */}
        <div className="space-y-4">

          <h2 className="text-lg font-medium">
            Configuration
          </h2>

          <div className="space-y-3">

            <button
              type="button"
              onClick={() => setVisibility("public")}
              className={`w-full flex items-center gap-3 border rounded p-3 text-left ${
                visibility === "public"
                  ? "border-yellow-500"
                  : "border-muted"
              }`}
            >

              <BookMarked size={18} />

              <div>

                <div className="font-medium">
                  Public
                </div>

                <p className="text-xs text-muted-foreground">
                  Anyone can view this repository
                </p>

              </div>

            </button>


            <button
              type="button"
              onClick={() => setVisibility("private")}
              className={`w-full flex items-center gap-3 border rounded p-3 text-left ${
                visibility === "private"
                  ? "border-yellow-500"
                  : "border-muted"
              }`}
            >

              <Lock size={18} />

              <div>

                <div className="font-medium">
                  Private
                </div>

                <p className="text-xs text-muted-foreground">
                  Only you can access this repository
                </p>

              </div>

            </button>

          </div>

        </div>


        {/* SUBMIT */}
        <button
          disabled={loading || !name.trim() || nameAvailable === false}
          className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 disabled:opacity-50"
        >

          {loading ? "Creating..." : "Create repository"}

        </button>

      </form>

    </div>
  )
}