import { redirect } from "next/navigation"

// export default async function RepoPage({
//   params,
// }: {
//   params: { user: string; repo: string }
// }) {
//   const { user, repo } = params

//   redirect(`/${user}/${repo}/tree`)

//   return null
// }

export default function RepoPage() {
  return <div>Repo page coming soon</div>
}