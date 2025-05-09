import { AxiosError } from "axios";
import api from "../api";
import toast from "react-hot-toast";

export const logout = async () => {
    try {
        await api.get("/api/v1/auth/logout");
        window.location.href = "/";
    } catch (error) {
        if (error instanceof AxiosError) {
            toast.error("Logout failed!");
        }
    }
};
