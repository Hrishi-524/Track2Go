import api from "./http"
import { RepoView } from "./types"

export async function getRepo(username: String, repoName: String) : Promise<RepoView> {
    const res = await api.get(`/repo/${username}/${repoName}`)
    return res.data
}

export async function getCommits(user: string, repo: string) {
    const res = await api.get(`/repo/${user}/${repo}/commits`);
    return res.data;
}

export async function getFile(user: string, repo: string, commit: string, filePath: string) {
    console.log(`get file /repo/${user}/${repo}/blob/${commit}/${filePath}`)
    const res = await api.get(`/repo/${user}/${repo}/blob/${commit}/${filePath}`)
    return res.data
}