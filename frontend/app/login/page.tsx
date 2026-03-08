"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { login } from "@/lib/api/auth.client"
import { mutate } from "swr"

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleLogin(values: { email: string; password: string }) {
        try {
            setLoading(true)

            await login(values.email, values.password)

            // refresh auth state
            await mutate("me")

            router.replace("/dashboard")

        } catch (err) {
            console.error("Login failed", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container flex min-h-[80vh] items-center justify-center">
            <LoginForm
                onSubmit={handleLogin}
                loading={loading}
                className="w-full max-w-md"
            />
        </div>
    )
}