import Image from "next/image"

export default function ArchitecturePage() {
  return (
    <div className="container py-20 space-y-16">

      {/* Title */}
      <div className="space-y-4 max-w-3xl">

        <h1 className="text-4xl font-semibold tracking-tight">
          Track2Go System Architecture
        </h1>

        <p className="text-muted-foreground text-lg">
          Track2Go is a Git-inspired repository tracking platform consisting of
          a CLI client, a backend API, and a web interface. The system stores
          repository snapshots in object storage while metadata is managed
          through a backend service.
        </p>

      </div>

      {/* Architecture Diagram */}
      <div className="border rounded-xl overflow-hidden">
        <Image
          src="/track2go_system_design.png"
          alt="Track2Go architecture diagram"
          width={1200}
          height={700}
          className="w-full h-auto"
        />
      </div>

      {/* Overview */}
      <section className="space-y-4 max-w-3xl">

        <h2 className="text-2xl font-semibold">
          Overview
        </h2>

        <p className="text-muted-foreground">
          The system is composed of four main layers: the CLI interface used by
          developers, a backend API responsible for repository metadata and
          authentication, cloud storage for commit snapshots, and a web
          interface for browsing repositories.
        </p>

      </section>

      {/* Core Components */}
      <section className="space-y-6">

        <h2 className="text-2xl font-semibold">
          Core Components
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="border rounded-lg p-6 space-y-2">
            <h3 className="font-medium">Track2Go CLI</h3>
            <p className="text-sm text-muted-foreground">
              Provides commands for initializing repositories, creating
              commit snapshots, and synchronizing repository objects with
              remote storage.
            </p>
          </div>

          <div className="border rounded-lg p-6 space-y-2">
            <h3 className="font-medium">Node.js Backend</h3>
            <p className="text-sm text-muted-foreground">
              Handles authentication, repository metadata management,
              issue tracking, and commit history APIs.
            </p>
          </div>

          <div className="border rounded-lg p-6 space-y-2">
            <h3 className="font-medium">MongoDB</h3>
            <p className="text-sm text-muted-foreground">
              Stores metadata such as users, repositories, commit history,
              and issue data.
            </p>
          </div>

          <div className="border rounded-lg p-6 space-y-2">
            <h3 className="font-medium">AWS S3</h3>
            <p className="text-sm text-muted-foreground">
              Stores commit snapshots and repository file objects used by
              both the CLI and the backend.
            </p>
          </div>

        </div>

      </section>

      {/* Data Flow */}
      <section className="space-y-4 max-w-3xl">

        <h2 className="text-2xl font-semibold">
          Data Flow
        </h2>

        <ul className="list-disc pl-5 text-muted-foreground space-y-2">
          <li>Developers interact with repositories using the Track2Go CLI.</li>
          <li>The CLI creates commit snapshots and uploads repository objects to AWS S3.</li>
          <li>The backend API manages repository metadata and user authentication.</li>
          <li>The web interface fetches repository data through the backend API.</li>
          <li>The backend retrieves repository objects from S3 when needed.</li>
        </ul>

      </section>

      {/* Storage Model */}
      <section className="space-y-4 max-w-3xl">

        <h2 className="text-2xl font-semibold">
          Repository Storage Model
        </h2>

        <p className="text-muted-foreground">
          Track2Go stores repository data using snapshot-based commits.
          Each commit represents a full snapshot of the repository state,
          enabling simpler commit history traversal and object storage.
        </p>

      </section>

      {/* Future Improvements */}
      <section className="space-y-4 max-w-3xl">

        <h2 className="text-2xl font-semibold">
          Future Improvements
        </h2>

        <ul className="list-disc pl-5 text-muted-foreground space-y-2">
          <li>CLI authentication and API-mediated uploads</li>
          <li>Branching and merge support</li>
          <li>Distributed object caching</li>
          <li>Background workers for repository indexing</li>
        </ul>

      </section>

    </div>
  )
}