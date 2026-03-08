import RepoCard from "./repo-card"
import { Repo } from "@/lib/types"

export default function RepoGrid({ repos }: { repos: Repo[] }) {
  if (!repos || repos.length === 0) return null

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <RepoCard
          key={`${repo.owner}-${repo.name}`}
          repo={repo}
        />
      ))}
    </div>
  )
}