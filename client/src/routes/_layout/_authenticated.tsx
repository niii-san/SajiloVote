import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_authenticated")({
    beforeLoad: async ({ context }) => {
        console.log("protected route");
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
    component: RouteComponent,
});

function RouteComponent() {
    return <Outlet />;
}
