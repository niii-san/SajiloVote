import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { NavBar, Footer } from "../components";

export const Route = createRootRoute({
    component: () => {
        return (
            <>
                <NavBar />
                <Outlet />
                <Footer />
                <TanStackRouterDevtools />
            </>
        );
    },
});
