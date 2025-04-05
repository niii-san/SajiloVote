import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "../../stores";
import { Loader } from "../../components";

export const Route = createFileRoute("/_layout/")({
    component: RouteComponent,
});

function RouteComponent() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const userData = useAuthStore((state) => state.userData);

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-b from-primary/10 to-background">
                <h1 className="text-5xl font-bold text-red">
                    You're not logged in
                </h1>
            </div>
        );
    }

    if (!userData) {
        return <Loader />;
    }

    // Logged In View
    return (
        <div className="min-h-screen w-full bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-5xl font-bold text-green-500">
                    Welcome you're logged in
                </h1>
            </div>
        </div>
    );
}
