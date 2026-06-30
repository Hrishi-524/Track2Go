export function getRepoRemoteUrl(user: string, repo: string) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL || "https://track2go.hrishi-developer.in"

  return `${base}/${user}/${repo}`
}
