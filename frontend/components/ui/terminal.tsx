import { cn } from "@/lib/utils/utils"

export function Terminal({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-black text-green-400 font-mono text-sm",
        className
      )}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800">
        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
      </div>

      <div className="p-4 space-y-2">
        {children}
      </div>
    </div>
  )
}