import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
    component: () => (
        <>
            Nav bar goes here 
            <Outlet />
            Footer goes here

            <TanStackRouterDevtools />
        </>
    ),
});
