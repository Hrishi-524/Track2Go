import useSWR from "swr";
import { getMe } from "@/lib/api/auth.client";

export function useAuth() {
    const { data, error, isLoading } = useSWR("me", getMe);

    return {
        user: data?.user,
        isLoading,
        isLoggedIn: !!data?.user
    };
}
