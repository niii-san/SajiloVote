import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { NavBar, Footer, Loader } from "../components";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../stores";
import { useEffect, useState } from "react";
import { api } from "../utils";

export const Route = createFileRoute("/_layout")({
    component: RouteComponent,
});

function RouteComponent() {
    const [loading, setLoading] = useState(false);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);

    const verify = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/v1/auth/verify-token");
            if (response.data?.success) {
                login();
            }
        } catch (_) {
            console.error("Token verification failed");
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verify();
    }, []);

    return (
        <>
            <Toaster />
            {loading ? (
                <Loader />
            ) : isLoggedIn ? (
                <div className="flex">
                    <NavBar />
                    <Outlet />
                </div>
            ) : (
                <>
                    <NavBar />
                    <Outlet />
                </>
            )}
            {!isLoggedIn && <Footer />}
            <TanStackRouterDevtools />
        </>
    );
}
