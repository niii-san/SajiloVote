import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { NavBar, Footer, Loader } from "../components";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../stores";
import { useEffect, useState } from "react";
import { api } from "../utils";
import { AuthStoreType } from "../types";

type RouterContext = {
    AuthStore: AuthStoreType;
};

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => {
        const [loading, setLoading] = useState<boolean>(false);
        const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
        const login = useAuthStore((state) => state.login);

        const verify = async () => {
            setLoading(true);
            try {
                const response = await api.get("/api/v1/auth/verify-token");
                if (response.data?.success && response.data?.is_authenticated) {
                    login();
                }
            } catch (error) {
                console.error("Token verification failed:", error);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            if (!isLoggedIn) {
                verify();
            }
        }, []);

        return (
            <>
                <NavBar />
                <Toaster />
                {loading ? <Loader /> : <Outlet />}
                <Footer />
                <TanStackRouterDevtools />
            </>
        );
    },
});
