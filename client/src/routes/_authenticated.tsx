import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
    beforeLoad: async ({ context }) => {
        const { isLoggedIn } = context.AuthStore;

        if (!isLoggedIn) {
            throw redirect({
                to: "/login",
            });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <Outlet />;
}
