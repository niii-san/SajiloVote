import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_authenticated/dashboard")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/_authenticated/dashboard"!</div>;
}
