export function detectLanguage(path: string) {

  const ext = path.split(".").pop()

  switch (ext) {
    case "js":
      return "javascript"
    case "ts":
      return "typescript"
    case "py":
      return "python"
    case "json":
      return "json"
    case "c":
      return "c"
    case "cpp":
      return "cpp"
    case "md":
      return "markdown"
    case "java":
        return "java"
    default:
      return "text"
  }

}