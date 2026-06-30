"use client"

import { useEffect, useState } from "react"
import { updateUserDetails } from "@/lib/api/user.client"
import { useAuth } from "@/hooks/auth/useAuth"

export default function SettingsPage() {

  const { user } = useAuth()

  const [username, setUsername] = useState(user?.username || "")
  const [email, setEmail] = useState(user?.email || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "")

  useEffect(() => {
    if (!user) return

    setUsername(user.username || "")
    setEmail(user.email || "")
    setBio(user.bio || "")
    setAvatarUrl(user.avatarUrl || "")
  }, [user])

  async function handleSave() {
    if (!user) return

    try {
      await updateUserDetails(user._id, {
        username,
        email,
        bio,
        avatarUrl
      })

      alert("Profile updated")

    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed")
    }
  }

  return (
    <div className="max-w-xl space-y-6">

      <h1 className="text-xl font-semibold">
        Profile Settings
      </h1>

      <div className="space-y-4">

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full border p-2 rounded"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />

        <input
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="Avatar URL"
          className="w-full border p-2 rounded"
        />

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-yellow-500 rounded"
        >
          Save changes
        </button>

      </div>

    </div>
  )
}
