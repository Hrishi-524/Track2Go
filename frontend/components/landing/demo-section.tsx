"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { login } from "@/lib/api/auth.client"
import { mutate } from "swr"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DemoSection() {
    const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDemoLogin() {
    try {
      setLoading(true)

      await login("demo@track2go.dev", "demojohn")

      await mutate("me")

      router.push("/dashboard")
    } catch (err) {
      console.error("Demo login failed", err)
      alert("Demo login failed")
    } finally {
      setLoading(false)
    }
  }
  return (
    <section id="demo" className="border-b">
      <div className="container py-24 space-y-10">

        {/* Section title */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight">
            Try Track2Go Instantly
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto">
            This demo environment contains repositories, commits, and issues
            so you can explore the system immediately without creating an account.
          </p>
        </div>

        {/* Demo card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md">

            <CardHeader>
              <CardTitle>Demo Environment</CardTitle>
              <CardDescription>
                Preloaded with sample repositories and activity.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Demo user</p>
                <p className="font-mono text-sm">demo@track2go.dev</p>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Password</p>
                <p className="font-mono text-sm">demo</p>
              </div>

              <Button className="w-full" onClick={handleDemoLogin} disabled={loading}>
                {loading? "Logging in..." : "Launch Demo"}
              </Button>
              <p className="text-xs text-muted-foreground text-center"> Demo environment • Data resets periodically</p>

            </CardContent>

          </Card>
        </div>

      </div>
    </section>
  )
}