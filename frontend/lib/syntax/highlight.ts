import { createHighlighter } from "shiki"

const highlighter = await createHighlighter({
  themes: ["github-dark"],
  langs: ["js", "ts", "python", "c", "cpp", "json", "bash", "java", "go", "ruby", "php", "rust", "swift", "kotlin"]
})

export async function highlightCode(code: string | Buffer, lang: string) {

  const text =
    typeof code === "string"
      ? code
      : code.toString("utf-8")

  return highlighter.codeToHtml(text, {
    lang,
    theme: "github-dark"
  })
}