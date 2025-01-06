import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";




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
