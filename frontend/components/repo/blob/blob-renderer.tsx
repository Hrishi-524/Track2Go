import BlobViewer from "./blob-viewer"
import MarkdownViewer from "./markdown-viewer"
import { isMarkdown } from "@/lib/utils/is-markdown"

export default function BlobRenderer({
  filePath,
  highlighted,
  raw
}: {
  filePath: string
  highlighted: string
  raw: string
}) {

  if (isMarkdown(filePath)) {
    return <MarkdownViewer content={raw} />
  }

  return <BlobViewer filePath={filePath} highlighted={highlighted} />
}