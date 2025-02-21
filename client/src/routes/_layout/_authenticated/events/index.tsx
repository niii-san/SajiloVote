import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, CreatedEvents } from "../../../../components";

export const Route = createFileRoute("/_layout/_authenticated/events/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="min-h-screen w-full bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Your Events
                </h1>
                <div className="space-y-12">
                    <CreatedEvents />
                    {/* Participated Events Section - Add content later */}
                    <section className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            Participated Events
                        </h2>
                        <div className="text-gray-500 italic">
                            No events participated yet
                        </div>
                    </section>
                </div>

                <Link to={"/events/create"}>
                    <Button className="fixed md:hidden bottom-8 right-8 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <span className="text-2xl">+</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
