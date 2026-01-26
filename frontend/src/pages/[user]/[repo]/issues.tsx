import { useRouter } from "next/router";
import { useIssues } from "@/hooks/useIssues";
import { createIssue, updateIssue, deleteIssue } from "@/lib/issues.api";
import { useState } from "react";

export default function IssuesPage() {
  const router = useRouter();
  const { user, repo } = router.query;

  const username = typeof user === "string" ? user : undefined;
  const repoName = typeof repo === "string" ? repo : undefined;

  const { data: issues, isLoading, error, mutate } = useIssues(username, repoName);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (isLoading) return <div>Loading issues…</div>;
  if (error) return <div>Error loading issues</div>;

  async function handleCreate() {
    if (!username || !repoName || !title.trim()) return;

    await createIssue(username, repoName, { title, description });
    setTitle("");
    setDescription("");
    mutate(); // refetch issues
  }

  return (
    <div>
      <h1>Issues</h1>

      {/* Create issue */}
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Issue title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <button onClick={handleCreate}>Create Issue</button>
      </div>

      {/* Issues list */}
      <ul>
        {issues && issues.map((issue: any) => (
          <li key={issue._id}>
            <strong>{issue.title}</strong> — {issue.status}

            {issue.status === "open" ? (
              <button
                onClick={async () => {
                  await updateIssue(
                    username!,
                    repoName!,
                    issue._id,
                    { status: "closed" }
                  );
                  mutate();
                }}
              >
                Close
              </button>
            ) : (
              <button
                onClick={async () => {
                  await updateIssue(
                    username!,
                    repoName!,
                    issue._id,
                    { status: "open" }
                  );
                  mutate();
                }}
              >
                Reopen
              </button>
            )}

            <button
              onClick={async () => {
                await deleteIssue(username!, repoName!, issue._id);
                mutate();
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}