"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SignupForm } from "@/components/auth/signup-form"
import { signup } from "@/lib/api/auth.client"
import { mutate } from "swr"

export default function SignupPage() {

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSignup(values: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) {

    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {

      setLoading(true)

      await signup(values.name, values.email, values.password)

      // refresh auth state
      await mutate("me")

      router.replace("/dashboard")

    } catch (err) {

      console.error("Signup failed", err)
      alert("Signup failed")

    } finally {

      setLoading(false)

    }

  }

  return (
    <div className="container flex min-h-[80vh] items-center justify-center my-5">

      <SignupForm
        onSubmit={handleSignup}
        loading={loading}
        className="w-full max-w-md"
      />

    </div>
  )
}