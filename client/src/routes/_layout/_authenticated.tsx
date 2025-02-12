import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores";
import { Loader } from "../../components";

export const Route = createFileRoute("/_layout/_authenticated")({
    beforeLoad: async ({ context }) => {
        context.AuthStore.verify();
        const { isLoggedIn } = context.AuthStore;
        if (!isLoggedIn) {
            throw redirect({
                to: "/login",
                search: {
                    redirect: "/",
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
