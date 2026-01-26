import api from "@/lib/http";

export async function signup(username: string, email: string, password: string) {
  const res = await api.post("/auth/signup", {
    username,
    email,
    password
  });
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", {
    email,
    password
  });
  return res.data;
}

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data.user;
}
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

export async function logout() {
  const res = await api.post("/auth/logout");
  return res.data;
}
