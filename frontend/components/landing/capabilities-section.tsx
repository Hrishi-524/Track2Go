import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FolderTree, GitCommit, AlertCircle, Terminal } from "lucide-react"

export function CapabilitiesSection() {
  return (
    <section className="border-b">
      <div className="container py-24 space-y-12">

        {/* Section Title */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight">
            Track2Go Capabilities
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Track2Go provides tools for exploring repository activity,
            tracking commits, and managing project discussions.
          </p>
        </div>

        {/* Capability Cards */}
        <div className="grid md:grid-cols-2 gap-6">

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <FolderTree size={20} />
              <CardTitle>Repository Explorer</CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription>
                Browse repository file trees and project structure
                through an intuitive web interface.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <GitCommit size={20} />
              <CardTitle>Commit Tracking</CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription>
                View commit history and understand repository
                activity over time.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <AlertCircle size={20} />
              <CardTitle>Issue Management</CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription>
                Track issues and discussions related to repository
                development.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Terminal size={20} />
              <CardTitle>CLI Integration</CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription>
                Initialize and interact with repositories using the
                Track2Go command line interface.
              </CardDescription>
            </CardContent>
          </Card>

        </div>

      </div>
    </section>
  )
}