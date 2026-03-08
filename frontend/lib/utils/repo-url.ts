export function getRepoRemoteUrl(user: string, repo: string) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  return `${base}/${user}/${repo}`
}