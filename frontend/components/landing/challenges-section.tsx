import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function ChallengesSection() {
  return (
    <section className="border-b">
      <div className="container py-24 space-y-12">

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight">
            Challenges & Engineering Decisions
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Track2Go was built as an experiment to understand how
            repository tracking systems work internally. Several
            design challenges shaped the final architecture.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <Card>
            <CardHeader>
              <CardTitle>CLI Architecture</CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription>
                The first implementation placed CLI commands inside the backend
                project. This meant it could only track the backend folder
                itself. The solution was to separate the CLI into an independent
                package and expose commands globally using a shebang script.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recursive Repository Tracking</CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription>
                Early versions only tracked files in the root directory.
                Implementing a recursive <code>walkDir()</code> utility allowed
                Track2Go to index entire project structures similar to how Git
                scans repositories.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Remote Repository Storage</CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription>
                To simulate remote repositories, Track2Go needed a storage
                layer accessible from both CLI and backend. AWS S3 was used
                as an object store to represent remote repository data and
                synchronize repository state.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cross-Platform File Paths</CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription>
                Windows paths return backslashes ( <code>\</code> ) while web
                environments expect forward slashes. Path normalization was
                implemented to ensure repository data remains consistent
                across operating systems.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">
            Track2Go was built as a learning project to understand
            how repository hosting systems manage files, commits,
            and remote synchronization.
        </p>
      </div>
    </section>
  )
}