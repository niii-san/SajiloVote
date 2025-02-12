import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { api } from "../../../utils";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../stores";

export const Route = createFileRoute("/_layout/(auth)/logout")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const logoutFn = async () => {
        try {
            await api.get("/api/v1/auth/logout");
            toast.success("logged out");
        } catch (error) {
            console.error("logout failed: ", error);
        }
    };
    useEffect(() => {
        logoutFn();
        logout();
        navigate({ to: "/" });
    }, []);
    return <></>;
}
