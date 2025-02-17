import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_authenticated/create")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/_layout/_authenticated/create"!</div>;
}
