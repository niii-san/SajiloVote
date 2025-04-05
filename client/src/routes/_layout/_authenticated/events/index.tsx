import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_authenticated/events/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="min-h-screen w-full bg-gray-50 p-8">
            <h1 className="text-3xl">This is event page</h1>
        </div>
    );
}
