import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { NavBar, Footer } from "../components";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../stores";

export const Route = createFileRoute("/_layout")({
    beforeLoad: async () => {
        useAuthStore.getState().verify();
    },
    component: RouteComponent,
});

function RouteComponent() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    console.log(isLoggedIn);

    return (
        <>
            <Toaster />
            {isLoggedIn ? (
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
