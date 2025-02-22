import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_authenticated/events/$eventId")(
    {
        component: RouteComponent,
    },
);

function RouteComponent() {
    const { eventId } = Route.useParams();
    return <div>Hello event joined: {eventId}</div>;
}
