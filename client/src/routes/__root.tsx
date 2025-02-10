import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { NavBar, Footer } from "../components";
import { Toaster } from "react-hot-toast";

export const Route = createRootRoute({
    component: () => {
        return (
            <>
                <NavBar />
                <Toaster/>
                <Outlet />
                <Footer />
                <TanStackRouterDevtools />
            </>
        );
    },
});
