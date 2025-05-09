import Link from "next/link";
import React from "react";

async function NavTopBar() {
    const navItems = [
        { title: "Home", href: "/" },
        { title: "Login", href: "/login" },
        { title: "Signup", href: "/signup" },
    ];
    return (
        <div>
            {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                    {item.title}
                </Link>
            ))}
        </div>
    );
}

export default NavTopBar;
