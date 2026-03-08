"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function MarkdownViewer({
  content
}: {
  content: string
}) {

  return (
    <div className="prose prose-invert max-w-none p-6">

      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>

    </div>
  )
}