"use client"

import { useEffect } from "react"
import NProgress from "nprogress"
import { usePathname, useSearchParams } from "next/navigation"

export function ProgressBarProvider({
  children
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    NProgress.done()
  }, [pathname, searchParams])

  useEffect(() => {
    NProgress.start()
  }, [])

  return <>{children}</>
}