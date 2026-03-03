// components/ui/getting-started.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function GettingStartedPanel() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Getting started with Track2Go
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <p className="text-muted-foreground">
          Track2Go is a snapshot-based version control system that runs locally
          through a CLI tool.
        </p>

        <div className="space-y-2">
          <p className="font-medium">Install the CLI</p>
          <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">
{`git clone https://github.com/Hrishi-524/Track2Go
cd Track2Go/cli
npm install
npm link`}
          </pre>
        </div>

        <div className="space-y-2">
          <p className="font-medium">Verify installation</p>
          <pre className="rounded-md bg-muted p-3 text-xs">
{`track2go --help`}
          </pre>
        </div>

        <p className="text-muted-foreground">
          You can uninstall the CLI at any time using standard npm commands.
        </p>
      </CardContent>
    </Card>
  )
}
