import api from "./http.client"

export type UpdateUserPayload = {
  username?: string
  email?: string
  bio?: string
  avatarUrl?: string
}

export async function getAllUsers() {
  const res = await api.get("/user/all")
  return res.data
}

export async function getUserById(id: string) {
  const res = await api.get(`/user/${id}`)
  return res.data
}

export async function updateUserDetails(
  id: string,
  payload: UpdateUserPayload
) {
  const res = await api.patch(`/user/${id}`, payload)
  return res.data
}