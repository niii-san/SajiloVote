import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div className="min-h-[800px]">Hello From Home page!</div>;
}
