import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../stores";
import { useState } from "react";
import { cn } from "../lib/utils";
import { GiVote } from "react-icons/gi";
import {
    FiHome,
    FiSettings,
    FiLogOut,
    FiMenu,
    FiX,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";
import { api, capitalize } from "../utils";
import toast from "react-hot-toast";
import Loader from "./Loader";

function NavBar() {
    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const userData = useAuthStore((state) => state.userData);
    const userDataLoading = useAuthStore((state) => state.userDataLoading);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const logout = useAuthStore((state) => state.logout);
    const handleLogout = async () => {
        try {
            await api.get("/api/v1/auth/logout");
            logout();
            navigate({ to: "/" });
            toast.success("Logged out");
        } catch (error) {
            toast.error("Loggout failed");
        }
    };

    const navLinkStyling = (isActive: boolean) =>
        `p-3 rounded-lg flex items-center gap-4 group
         ${isActive ? "bg-gray-300  border-primary text-dark_text" : "text-black hover:bg-gray-300/50"}
         ${isSidebarMinimized ? "justify-center" : "px-4"}
         transition-colors`;

    const sidebarItems = [
        {
            to: "/",
            label: "Home",
            icon: <FiHome className="text-xl" />,
        },
        {
            to: "/events",
            label: "Events",
            icon: <GiVote className="text-xl" />,
        },
        {
            to: "/settings",
            label: "Settings",
            icon: <FiSettings className="text-xl" />,
        },
        {
            to: "logoutFn",
            label: "Log Out",
            icon: <FiLogOut className="text-xl" />,
        },
    ];

    const MobileToggle = () => (
        <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-3 text-slate-300 fixed right-4 top-4 z-50
                      bg-slate-800 rounded-lg shadow-lg"
            aria-label="Toggle navigation"
        >
            {isSidebarOpen ? (
                <FiX className="text-xl" />
            ) : (
                <FiMenu className="text-xl" />
            )}
        </button>
    );

    if (isLoggedIn) {
        if (userDataLoading) {
            return <Loader />;
        }

        return (
            <>
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-40"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <aside
                    className={cn(
                        "fixed md:relative h-screen bg-white transition-all duration-300 z-50",
                        "transform -translate-x-full md:translate-x-0 shadow-xl md:shadow-sm",
                        isSidebarOpen && "translate-x-0",
                        isSidebarMinimized
                            ? "w-20 hover:w-64 md:hover:w-20"
                            : "w-64",
                    )}
                >
                    <div className="p-4 h-full flex flex-col">
                        {/* Profile Section */}
                        <div className="flex flex-col gap-4 mb-8">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div
                                        className={cn(
                                            "shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600",
                                            "flex items-center justify-center text-white",
                                            "w-11 h-11",
                                        )}
                                    >
                                        <span className="font-medium">JD</span>
                                    </div>
                                    {!isSidebarMinimized && (
                                        <div className="min-w-[140px]">
                                            <p className="font-medium truncate text-black">
                                                {capitalize(
                                                    userData?.first_name ?? "",
                                                )}{" "}
                                                {capitalize(
                                                    userData?.last_name ?? "",
                                                )}
                                            </p>
                                            <p className="text-sm text-black truncate">
                                                {userData?.email}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() =>
                                        setIsSidebarMinimized(
                                            !isSidebarMinimized,
                                        )
                                    }
                                    className="hidden md:block p-2 hover:bg-gray-300/50 rounded-lg text-black"
                                    aria-label="Toggle sidebar"
                                >
                                    {isSidebarMinimized ? (
                                        <FiChevronRight className="text-xl" />
                                    ) : (
                                        <FiChevronLeft className="text-xl" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Navigation Items */}
                        <nav className="flex-1 space-y-1">
                            {sidebarItems.map((item) =>
                                item.to === "logoutFn" ? (
                                    <button
                                        key={item.to}
                                        className="group relative w-full"
                                        onClick={() => {
                                            handleLogout();
                                            setIsSidebarOpen(false);
                                        }}
                                    >
                                        <div
                                            className={`${navLinkStyling(false)} bg-danger hover:bg-danger/90 `}
                                        >
                                            <span className="flex justify-center text-white">
                                                {item.icon}
                                            </span>
                                            <span
                                                className={cn(
                                                    "transition-opacity text-white",
                                                    isSidebarMinimized
                                                        ? "hidden"
                                                        : "block",
                                                )}
                                            >
                                                {item.label}
                                            </span>
                                        </div>
                                    </button>
                                ) : (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className="group relative"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        {({ isActive }) => (
                                            <div
                                                className={navLinkStyling(
                                                    isActive,
                                                )}
                                            >
                                                <span className="flex justify-center text-black">
                                                    {item.icon}
                                                </span>
                                                <span
                                                    className={cn(
                                                        "transition-opacity",
                                                        isSidebarMinimized
                                                            ? "hidden"
                                                            : "block",
                                                    )}
                                                >
                                                    {item.label}
                                                </span>
                                            </div>
                                        )}
                                    </Link>
                                ),
                            )}
                        </nav>

                        {/* Branding */}
                        {!isSidebarMinimized && (
                            <div className="mt-8 pt-6 border-t border-slate-700">
                                <p className="text-sm text-black text-center">
                                    © 2024 My App
                                </p>
                            </div>
                        )}
                    </div>
                </aside>

                <MobileToggle />
            </>
        );
    }

    return (
        <nav className="sticky top-0 bg-slate-800 shadow-lg z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold text-white">
                        My App
                    </Link>
                    <div className="flex gap-2">
                        <Link to="/login">
                            {({ isActive }) => (
                                <span
                                    className={`px-4 py-2 rounded-md
                                    ${isActive ? "bg-white text-slate-800" : "text-white hover:bg-slate-700"}`}
                                >
                                    Login
                                </span>
                            )}
                        </Link>
                        <Link to="/signup">
                            {({ isActive }) => (
                                <span
                                    className={`px-4 py-2 rounded-md
                                    ${isActive ? "bg-white text-slate-800" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                                >
                                    Sign Up
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
