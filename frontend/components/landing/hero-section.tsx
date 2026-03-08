import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="border-b section-glow">
      <div className="container py-24 text-center space-y-6">

        {/* Title */}
        <h1 className="text-5xl font-bold tracking-tight">
          Track2Go
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          A Git-inspired repository tracking system built with a custom CLI,
          backend API, and web interface for exploring repositories,
          commits, and issues.
        </p>

        {/* Stack badges */}
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary">Next.js</Badge>
          <Badge variant="secondary">Node.js</Badge>
          <Badge variant="secondary">MongoDB</Badge>
          <Badge variant="secondary">Custom CLI</Badge>
          <Badge variant="secondary">REST API</Badge>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 pt-4">
          <Link href="#demo">
            <Button size="lg">
              Launch Demo
            </Button>
          </Link>

          <Link
            href="https://github.com/Hrishi-524/Track2Go"
            target="_blank"
          >
            <Button variant="outline" size="lg">
              View Source
            </Button>
          </Link>
        </div>

      </div>
    </section>
  )
}