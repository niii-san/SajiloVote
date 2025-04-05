import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_authenticated/events/create")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
            <h1 className="text-3xl text-center font-bold mb-8 text-gray-800 dark:text-white">
                Create Event
            </h1>
        </div>
    );
}
