import { useRouter } from "next/router"
import { useFile } from "@/hooks/useFile"

export default function FilePage() {
    // Set Router get dynamic segments
    const router = useRouter()
    const { user, repo, path } = router.query
    const username = typeof user === "string" ? user : undefined
    const repoName = typeof repo === "string" ? repo : undefined

    const segments = Array.isArray(path) ? path : []
    const commit = segments[0]
    const filePath = segments.slice(1).join("/")
    
    const { data, error, isLoading } = useFile(username, repoName, commit, filePath)

    if (isLoading) return <div>Loading file…</div>
    if (error) return <div>Error loading file</div>

  return (
    <div style={{ padding: "16px" }}>
      <h3>{filePath}</h3>

      <pre
        style={{
          background: "#0f172a",
          color: "#e5e7eb",
          padding: "16px",
          overflowX: "auto",
          borderRadius: "6px"
        }}
      >
        <code>
  {typeof data === "string"
    ? data
    : JSON.stringify(data, null, 2)}
</code>

      </pre>
    </div>
  )
}
