"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/auth/useAuth"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
        router.replace("/login")
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="container py-24 text-center text-muted-foreground">
                Checking authentication...
            </div>
        )
    }

    if (!user) return null

    return <>{children}</>
}