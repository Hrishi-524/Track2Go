"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

export function RepoTabs({
  user,
  repo
}: {
  user: string
  repo: string
}) {

  const pathname = usePathname()

  const tabs = [
    {
      name: "Code",
      href: `/u/${user}/${repo}/tree`
    },
    {
      name: "Issues",
      href: `/u/${user}/${repo}/issues`
    },
    {
      name: "Commits",
      href: `/u/${user}/${repo}/commits`
    },
    {
        name: "Settings",
        href: `/u/${user}/${repo}/settings`
    }
  ]

  function isActive(tab: string) {

    if (tab === "Code") {
      return pathname.includes("/tree") || pathname.includes("/blob")
    }

    return pathname.includes(tab.toLowerCase())
  }

  return (
    <div className="border-b">

      <nav className="flex gap-6">

        {tabs.map(tab => {

          const active = isActive(tab.name)

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={clsx(
                "pb-2 text-sm font-medium transition-colors",
                active
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.name}
            </Link>
          )

        })}

      </nav>

    </div>
  )
}