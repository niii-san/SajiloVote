import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores";
import { Loader } from "../../components";

export const Route = createFileRoute("/_layout/_authenticated")({
    beforeLoad: async ({ context, location }) => {
        console.log("Current location:", location);
        await context.AuthStore.verify();
        const { isLoggedIn } = context.AuthStore;
        if (!isLoggedIn) {
            throw redirect({
                to: "/login",
                search: {
                    redirect: location.pathname,
                },
            });
        }
    },
    component: () => <RouteComponent />,
});
function RouteComponent() {
    const loading = useAuthStore((state) => state.verifyLoading);

    if (loading) {
        return <Loader />;
    }
    return <Outlet />;
}
