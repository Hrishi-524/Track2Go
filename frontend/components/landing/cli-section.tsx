import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CLISection() {
  return (
    <section className="border-b">
      <div className="container py-24 space-y-12">

        {/* Section Title */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight">
            Track2Go CLI
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Track2Go includes a CLI tool that allows repositories to be
            initialized and tracked directly from the terminal.
          </p>
        </div>

        {/* Terminal */}
        <div className="flex justify-center">
          <Card className="w-full max-w-2xl bg-black text-green-400 font-mono">

            <CardHeader className="flex flex-row items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>

              <CardTitle className="ml-4 text-sm text-neutral-400 font-normal">
                terminal
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">

              <p>$ git clone https://github.com/Hrihsi-524/Track2Go</p>
              <p>$ cd cli</p>
              <p>$ npm install</p>
              <p>$ npm link</p>
              <p>$ track2go init</p>

            </CardContent>

          </Card>
        </div>

      </div>
    </section>
  )
}