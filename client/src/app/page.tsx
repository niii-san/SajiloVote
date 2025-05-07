"use client";
import { useAuthStore } from "@/stores";

export default function Home() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const userData = useAuthStore((state) => state.userData);

    return (
        <div className="">
            <h1>
                {isLoggedIn ? "You're logged in" : "You're not logged in"} as{" "}
                {userData?.first_name ?? "login first"}{" "}
            </h1>
        </div>
    );
}
