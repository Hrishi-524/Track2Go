import api from "@/lib/http";
import { RepoView } from "@/lib/types";

export async function getMyRepos() {
    const res = await api.get("/repo");
    console.log(res.data.data)
    return res.data.data;
}

export async function createRepo(
    name: string,
    description?: string
) {
  const res = await api.post("/repo", {
    name,
    description
  });
  return res.data;
}
