import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ArchitectureSection() {
  return (
    <section className="border-b">
      <div className="container py-24 space-y-12">

        {/* Title */}
        <div className="text-center space-y-4">

          <h2 className="text-3xl font-semibold tracking-tight">
            System Architecture
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track2Go consists of a CLI tool, backend services, and a web
            interface working together to manage repositories, commits,
            and issues. The CLI uploads commit snapshots to remote
            storage while the backend manages metadata and authentication.
          </p>

        </div>

        {/* Architecture Diagram */}
        <Link
          href="/architecture"
          className="block group"
        >

          <div className="border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition">

            <Image
              src="/t2g_hld.svg"
              alt="Track2Go System Architecture"
              width={1200}
              height={600}
              className="w-full h-auto object-contain"
              priority
            />

          </div>

        </Link>

        {/* CTA */}
        <div className="flex justify-center">

          <Link href="/architecture">
            <Button variant="outline" className="flex items-center gap-2">
              View full architecture
              <ArrowRight size={16} />
            </Button>
          </Link>

        </div>

      </div>
    </section>
  )
}