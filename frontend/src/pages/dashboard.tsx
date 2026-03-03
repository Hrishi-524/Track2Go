import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { getMyRepos, createRepo } from "@/lib/repo.api";
import { getMe } from "@/lib/auth.api";
import { Badge } from "@/components/ui/badge";
<<<<<<< HEAD
import { Skeleton } from "@/components/ui/skeleton";
=======
import { Skeleton } from "@/components/ui/skeliton";
>>>>>>> 4c2525e7c98827da1d2a5b4e9a1fe50d0e545734
import { GitBranch, Plus } from "lucide-react";

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

  const filteredRepos = data || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-gradient-to-b from-card to-background">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-sm text-muted-foreground mb-2">Welcome back, <span className="font-medium text-foreground">{username}</span></p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-foreground">Your repositories</h1>
              <Badge variant="secondary" className="text-xs">{filteredRepos.length} repositories</Badge>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:ring-2 hover:ring-primary/50 transition-all"
            >
              <Plus size={18} />
              {showForm ? "Cancel" : "New repository"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Create Form */}
        {showForm && (
          <div className="mb-8 p-6 bg-card border border-border rounded-lg">
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <input
                  placeholder="Repository name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <input
                  placeholder="Description (optional)"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}

              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
              >
                {creating ? "Creating…" : "Create repository"}
              </button>
            </form>
          </div>
        )}

        {/* Loading State - Skeleton Cards */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 bg-card border border-border rounded-lg space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-card border border-destructive rounded-lg text-destructive">
            <p className="font-medium">Error loading repositories</p>
            <p className="text-sm text-destructive/80 mt-1">Please try refreshing the page.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredRepos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-card border-2 border-dashed border-border rounded-lg">
            <GitBranch size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No repositories yet</h3>
            <p className="text-center text-muted-foreground max-w-sm">
              Create your first repository to get started with tracking your code changes.
            </p>
          </div>
        )}

        {/* Repo Grid */}
        {!isLoading && !error && filteredRepos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo: any) => (
              <Link key={repo._id} href={`/${username}/${repo.name}`}>
                <div className="group relative p-5 bg-card border border-border rounded-lg hover:border-primary/50 hover:border-l-2 hover:border-l-primary transition-all cursor-pointer">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition mb-2">
                    {username}/{repo.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-4">
                    {repo.description || "No description provided"}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <Badge variant="outline" className="text-xs">Public</Badge>
                    <span className="text-xs text-muted-foreground">Updated recently</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
