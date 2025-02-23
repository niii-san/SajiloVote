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
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const navLinkStyling = (isActive: boolean) =>
        `p-3 rounded-lg flex items-center gap-4 group transition-all duration-200
    ${
        isActive
            ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
            : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
    }
    ${isSidebarMinimized ? "justify-center px-3" : "px-4"}`;

    const sidebarItems = [
        {
            to: "/",
            label: "Home",
            icon: <FiHome className="text-xl shrink-0" />,
        },
        {
            to: "/events",
            label: "Events",
            icon: <GiVote className="text-xl shrink-0" />,
        },
        {
            to: "/settings",
            label: "Settings",
            icon: <FiSettings className="text-xl shrink-0" />,
        },
        {
            to: "logoutFn",
            label: "Log Out",
            icon: <FiLogOut className="text-xl shrink-0" />,
        },
    ];

    const MobileToggle = () => (
        <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-3 fixed right-6 top-6 z-50
        bg-white text-gray-600 rounded-xl shadow-lg hover:bg-gray-50
        border border-gray-200 hover:border-gray-300 transition-all"
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
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-40"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <aside
                    className={cn(
                        "fixed md:relative min-h-screen bg-white border-r border-gray-100 transition-all duration-300 z-50",
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
                                            "shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/70",
                                            "flex items-center justify-center text-white",
                                            "w-12 h-12 text-lg",
                                        )}
                                    >
                                        <span className="font-medium">
                                            {(userData?.first_name ?? "")
                                                .slice(0, 1)
                                                .toUpperCase()}
                                            {(userData?.last_name ?? "")
                                                .slice(0, 1)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    {!isSidebarMinimized && (
                                        <div className="min-w-[140px]">
                                            <p className="font-medium truncate text-gray-900">
                                                {capitalize(
                                                    userData?.first_name ?? "",
                                                )}{" "}
                                                {capitalize(
                                                    userData?.last_name ?? "",
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
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
                                    className="hidden md:block p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
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
                        <nav className="flex-1 flex flex-col gap-2">
                            {sidebarItems.map((item) =>
                                item.to === "logoutFn" ? (
                                    <button
                                        key={item.to}
                                        className="group mt-auto w-full hover:scale-[0.98] transition-transform"
                                        onClick={() => {
                                            handleLogout();
                                            setIsSidebarOpen(false);
                                        }}
                                    >
                                        <div
                                            className={
                                                "p-3 rounded-lg flex items-center gap-4 bg-danger/90 text-white hover:bg-danger transition-colors"
                                            }
                                        >
                                            <span className="flex justify-center">
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
                                    </button>
                                ) : (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className="group relative hover:scale-[0.98] transition-transform"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        {({ isActive }) => (
                                            <div
                                                className={navLinkStyling(
                                                    isActive,
                                                )}
                                            >
                                                <span className="flex justify-center">
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
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-500 text-center">
                                    © 2024{" "}
                                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-medium">
                                        Your Brand
                                    </span>
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
        <nav className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">
                    <Link
                        to="/"
                        className="text-xl font-bold flex items-center gap-3 group"
                    >
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <GiVote className="text-2xl text-primary" />
                        </div>
                        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Your Brand
                        </span>
                    </Link>
                    <div className="flex gap-3">
                        <Link to="/login">
                            {({ isActive }) => (
                                <span
                                    className={`px-5 py-2.5 rounded-lg transition-all duration-200 font-medium
                    ${
                        isActive
                            ? "bg-primary text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
                    }`}
                                >
                                    Login
                                </span>
                            )}
                        </Link>
                        <Link to="/signup">
                            {({ isActive }) => (
                                <span
                                    className={`px-5 py-2.5 rounded-lg transition-all duration-200 font-medium
                    ${
                        isActive
                            ? "bg-primary text-white shadow-sm"
                            : "bg-gradient-to-br from-primary/10 to-primary/5 text-primary hover:from-primary/20 hover:to-primary/10"
                    }`}
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
