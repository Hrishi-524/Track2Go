import api from "@/lib/api/http.client";
import { cache } from "react"

export async function signup(username: string, email: string, password: string) {
    console.log("Signing up user", { username, email })
    const res = await api.post("/auth/signup", {
        username,
        email,
        password,
        confirmPassword: password
    });
    console.log("Signup response", res.data)
    return res.data;
}

export async function login(email: string, password: string) {
    console.log("Logging in user", { email, password })
    const res = await api.post("/auth/login", {
        email,
        password
    });
    console.log("Login response", res.data)
    return res.data;
}

export async function logout() {
  const res = await api.post("/auth/logout");
  console.log("Logout response", res.data)
  return res.data;
}

export const getMe = cache(async function getMe() {
    try {
        const res = await api.get("/auth/me")
        return res.data
    } catch (err: any) {
        if (err.response?.status === 401) {
            return { user: null }
        }
        throw err
    }
})