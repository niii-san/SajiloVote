import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../../../components";

export const Route = createFileRoute("/_layout/_authenticated/events")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="w-full">
            <h1 className="text-xl font-bold text-center">Events</h1>

            <div>
                <Link to={"/create"}>
                    <Button>Create Event</Button>
                </Link>
            </div>
        </div>
    );
}
