import { useState } from "react"
import Link from "next/link"
import { Search, Bell, HelpCircle, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "../theme-toggle"

export function AppHeader({
  onSearch,
}: {
  onSearch?: (value: string) => void
}) {
  return (
<header
  className="
    sticky top-0 z-50
    border-b
    bg-[#16191f]
    text-white
  "
>
  <div className="mx-auto max-w-7xl px-4 h-12 flex items-center justify-between">
    {/* Left */}
    <div className="flex items-center gap-4">
      <Link
        href="/dashboard"
        className="font-semibold tracking-tight text-sm"
      >
        Track2Go
      </Link>
    </div>

    {/* Center */}
    <div className="flex-1 max-w-md mx-6">
      <SearchInput onSearch={onSearch} />
    </div>

    {/* Right */}
    <div className="flex items-center gap-1">
      <HeaderIcon icon={<Bell />} />
      <HeaderIcon icon={<HelpCircle />} />
      <HeaderIcon icon={<Settings />} />
      <ThemeToggle/>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="ml-1 h-8 w-8 rounded-full bg-[#23272f] flex items-center justify-center">
            <User className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</header>
  )
}

function HeaderIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="
        h-8 w-8
        text-gray-300
        hover:bg-[#23272f]
        hover:text-white
      "
    >
      {icon}
    </Button>
  )
}


function SearchInput({
  onSearch,
}: {
  onSearch?: (value: string) => void
}) {
  const [value, setValue] = useState("")

  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          onSearch?.(e.target.value)
        }}
        placeholder="Search repositories"
        className="
          h-8 pl-8
          bg-[#23272f]
          border border-[#2f333d]
          text-sm
          placeholder:text-gray-400
          focus-visible:ring-0
        "
      />
    </div>
  )
}
