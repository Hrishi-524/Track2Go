import { serverApi } from "@/lib/api/http.sever";
import { cache } from "react"

export const getMe = cache(async function getMe() {
    try {
        const api = await serverApi()
        const res = await api.get("/auth/me")
        return res.data
    } catch (err: any) {
        if (err.response?.status === 401) {
            return { user: null }
        }
        throw err
    }
})

/*
{
  "success": true,
  "user": {
    "id": "6967d24583e9acdbaa086940",
    "username": "Hrishi-524",
    "email": "sp3567208@gmail.com",
    "iat": 1769360187,
    "exp": 1769385387
  }
}
*/