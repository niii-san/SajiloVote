import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "../stores";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    
    return (
        <div className="min-h-screen">
            Hello From Home page!
            <br />
            <span>
                {isLoggedIn ? "You're logged in" : "You're not logged in"}
            </span>
        </div>
    );
}
