import { cookies } from "next/headers";
import api from "../api";
import { UserType } from "@/types";

/**
 * **Function that returns current user data**
 * Will only return user data
 * if access_token is avalable as http only cookie
 * and is if that token is valid
 */
export const getCurrentUserData = async (): Promise<UserType | null> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    if (!accessToken) return null;
    try {
        const res = await api.get("/api/v1/users/current", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.data?.success) {
            return res.data.data;
        }
        return null;
    } catch (error: any) {
        return null;
    }
};
