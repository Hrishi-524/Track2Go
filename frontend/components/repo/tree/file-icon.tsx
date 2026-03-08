"use client"

import {
  File,
  FileCode,
  FileJson,
  FileText,
  FileTerminal
} from "lucide-react"

export function FileTypeIcon({ filename }: { filename: string }) {

  const ext = filename.split(".").pop()

  switch (ext) {
    case "py":
    case "js":
    case "ts":
    case "cpp":
    case "c":
      return <FileCode size={14} className="text-blue-400" />

    case "json":
      return <FileJson size={14} className="text-yellow-400" />

    case "env":
    case "txt":
      return <FileText size={14} className="text-gray-400" />

    case "sh":
    case "bash":
      return <FileTerminal size={14} className="text-green-400" />

    default:
      return <File size={14} className="text-gray-400" />
  }
}