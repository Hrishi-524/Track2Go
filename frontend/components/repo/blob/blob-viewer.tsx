import { useMemo } from "react"
import { FileTypeIcon } from "../tree/file-icon"

export default function BlobViewer({
  filePath,
  highlighted
}: {
  filePath: string
  highlighted: string
}) {

  const fileName = useMemo(
  () => filePath.split("/").pop(),
  [filePath]
)
  return (
    <div className="border rounded-lg overflow-hidden">

      {/* File header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/40 text-sm">
        <FileTypeIcon filename={fileName ?? ""} />

        <span className="font-medium">
          {fileName}
        </span>
      </div>

      {/* Code viewer */}
      <div className="overflow-auto max-h-[70vh]">

        {/* Shiki HTML */}
        <div
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />

      </div>

    </div>
  )
}