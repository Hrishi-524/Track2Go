import axios from "axios"
import { headers } from "next/headers"

export async function serverApi() {
    const h = await headers()
    const cookie = h.get("cookie") || ""

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE,
        headers: {
            cookie
        },
        withCredentials: true
    })

    api.interceptors.response.use(
        (res) => res,
        (err) => {
            if (err.response?.status === 401) {
                console.warn("Unauthorized — login later")
            }
            return Promise.reject(err)
        }
    )

    return api
}