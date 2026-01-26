import axios from "axios"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE,
    withCredentials: true
})

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            console.warn("Unauthorized — login later");
            // later: redirect to login
        }
        return Promise.reject(err);
    }
);

export default api;