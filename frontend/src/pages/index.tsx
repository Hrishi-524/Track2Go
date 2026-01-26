import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { getMyRepos, createRepo } from "@/lib/repo.api";
import { getMe } from "@/lib/auth.api";

export default function DashboardPage() {
  const { data, error, isLoading, mutate } = useSWR(
    "my-repos",
    getMyRepos
  );

  const [ username, setname ] = useState("")
  useEffect(() => {
    async function getMyDetals() {
        const {id, username, email} = await getMe();
        setname(username)
    }
    getMyDetals()

  })

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setCreating(true);

    try {
      await createRepo(name, description);
      setName("");
      setDescription("");
      setShowForm(false);
      mutate(); // refresh repo list
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to create repo");
    } finally {
      setCreating(false);
    }
  }

  if (isLoading) return <div>Loading repos…</div>;
  if (error) return <div>Error loading repos</div>;

  return (
    <div>
      <h1>Your Repositories</h1>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "New Repository"}
      </button>

      {showForm && (
        <form onSubmit={handleCreate}>
          <input
            placeholder="Repository name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <input
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <button type="submit" disabled={creating}>
            {creating ? "Creating…" : "Create"}
          </button>

          {formError && <p style={{ color: "red" }}>{formError}</p>}
        </form>
      )}

      <ul>
        {data.map((repo: any) => (
          <li key={repo._id}>
            <Link href={`/${username}/${repo.name}`}>
                {username}/{repo.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}