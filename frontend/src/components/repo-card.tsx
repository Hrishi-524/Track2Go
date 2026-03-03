import Link from "next/link"
import { Button } from "@/components/ui/button"

interface RepoCardProps {
  user: string
  name: string
  description?: string
  visibility?: "Public" | "Private"
}

export function RepoCard({
  user,
  name,
  description,
  visibility = "Public",
}: RepoCardProps) {
  return (
    <div className="flex flex-col justify-between gap-3 h-full">
      {/* Repo title + description */}
      <div className="space-y-1">
        <Link
          href={`/${user}/${name}`}
          className="text-sm font-semibold hover:underline"
        >
          {user}/{name}
        </Link>

        <p className="text-sm text-muted-foreground">
          {description || "No description provided"}
        </p>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{visibility}</span>

        <Link href={`/${user}/${name}`}>
          <Button variant="secondary" size="sm">
            Open
          </Button>
        </Link>
      </div>
    </div>
  )
}
