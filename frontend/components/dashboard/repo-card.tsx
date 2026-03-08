import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { Repo, RepoView } from "@/lib/types"
import { fetchIssues } from "@/lib/api/issues.api"

export default function RepoCard({ repo }: { repo: Repo }) {
    console.log("Rendering RepoCard for repo", repo)
    // const issues = await fetchIssues(repo.owner, repo.name);
  return (
    <Card className="flex flex-col justify-between">

      <CardHeader>

        {/* Repo name */}
        <CardTitle className="text-lg">
          {repo.name}
        </CardTitle>

        {/* Description */}
        {repo.description && (
          <CardDescription>
            {repo.description}
          </CardDescription>
        )}

        {/* Visibility */}
        <p className="text-xs text-muted-foreground mt-2">
          {repo.visibility ?? "public"}
        </p>

      </CardHeader>

      <CardFooter className="flex items-center justify-between">

        {/* Issues count */}
        <span className="text-xs text-muted-foreground">
          Issues: {repo.issueCount ?? 0} open
        </span>

        <div className="flex items-center gap-2">

          {/* Star button */}
          <Button variant="ghost" size="icon">
            <Star className="w-4 h-4" />
          </Button>

          {/* Explore button */}
          <Link href={`/u/${repo.username}/${repo.name}/tree`}>
            <Button size="sm">
              Explore →
            </Button>
          </Link>

        </div>

      </CardFooter>

    </Card>
  )
}