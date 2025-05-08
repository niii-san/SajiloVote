import { cookies } from "next/headers";
import api from "../api";

async function verifyToken() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    try {
        const res = await api.get("/api/v1/auth/verify-token", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.data;
    } catch (error) {
        return null;
    }
}

export default verifyToken;
