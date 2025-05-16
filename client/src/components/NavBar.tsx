"use client";
import { UserType } from "@/types";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
    FiHome,
    FiLogIn,
    FiUserPlus,
    FiCalendar,
    FiSettings,
    FiMenu,
} from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { Button } from "./ui/button";
import { capitalize } from "@/lib/utils";
import { logout } from "@/lib/auth/logout";

function NavSideBar({ user }: { user: UserType | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    if (!user) {
        return (
            <nav className="bg-secondary shadow-sm z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            href="/"
                            className="text-2xl font-bold text-primary flex items-center"
                        >
                            <FiHome className="mr-2" />
                            SajiloVote
                        </Link>
                        <div className="flex space-x-8">
                            <NavLink
                                href="/login"
                                icon={<FiLogIn />}
                                label="Login"
                                isActive={pathname === "/login"}
                            />
                            <NavLink
                                href="/signup"
                                icon={<FiUserPlus />}
                                label="Signup"
                                isActive={pathname === "/signup"}
                            />
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <>
            {/* Mobile Hamburger Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-600 text-white"
                >
                    <FiMenu size={24} />
                </button>
            )}
            {/* Sidebar */}
            <aside
                className={`h-screen w-64 bg-sidebar border-r border-sidebar-border shadow-lg transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    {/* Close Button for Mobile */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
                    >
                        <MdClose size={24} className="text-gray-600" />
                    </button>

                    {/* Profile Section */}
                    <div className="p-6 border-b border-gray-100 mt-8 lg:mt-0">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
                                <span className="text-indigo-600 font-medium">
                                    {capitalize(user.first_name[0])}
                                    {capitalize(user.last_name[0])}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {capitalize(user.first_name)}{" "}
                                    {capitalize(user.last_name)}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user.email_address}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="p-4 flex-1">
                        <div className="space-y-2">
                            <SidebarLink
                                href="/"
                                icon={<FiHome />}
                                label="Home"
                                isActive={pathname === "/"}
                            />
                            <SidebarLink
                                href="/events"
                                icon={<FiCalendar />}
                                label="Events"
                                isActive={pathname === "/events"}
                            />
                            <SidebarLink
                                href="/settings"
                                icon={<FiSettings />}
                                label="Settings"
                                isActive={pathname === "/settings"}
                            />
                        </div>
                    </nav>

                    {/* Sticky Logout Button */}
                    <div className="p-4 border-t border-gray-100 mt-auto">
                        <Button
                            variant={"destructive"}
                            className="w-full cursor-pointer"
                            onClick={() => logout()}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/30 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}

const NavLink = ({
    href,
    icon,
    label,
    isActive,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
}) => (
    <Link
        href={href}
        className={`flex items-center transition-colors duration-200 ${
            isActive
                ? "text-primary font-extrabold"
                : "text-secondary-foreground hover:text-accent-foreground"
        }`}
    >
        {icon}
        <span className="ml-2 font-medium">{label}</span>
    </Link>
);

const SidebarLink = ({
    href,
    icon,
    label,
    isActive,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
}) => (
    <Link
        href={href}
        className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
            isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                : "text-gray-700 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }`}
    >
        <span className="text-lg">{icon}</span>
        <span className="ml-3 font-medium">{label}</span>
    </Link>
);

export default NavSideBar;
