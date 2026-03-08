import { Commit } from "@/types/commit"

export default function CommitList({
  commits
}: {
  commits: Commit[]
}) {

    console.log("Rendering commit list with commits:", commits)

  return (
    <div className="border rounded-lg overflow-hidden">

      {commits.map((commit) => {

        const shortHash = commit.commitHash.slice(0, 7)

        return (
          <div
            key={commit.commitHash}
            className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 hover:bg-muted/40"
          >

            <div className="flex items-center gap-4">

              <span className="font-mono text-xs text-muted-foreground">
                {shortHash}
              </span>

              <span className="text-sm">
                {commit.message}
              </span>

            </div>

            <span className="text-xs text-muted-foreground">
              {new Date(commit.date).toLocaleDateString()}
            </span>

          </div>
        )
      })}

    </div>
  )
}