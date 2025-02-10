import { Link } from "@tanstack/react-router";

function NavBar() {
    const activeNavItemStyling = "text-primary font-bold";
    const inactiveNavItemStyling = "text-black";
    return (
        <div className="bg-secondary rounded-b-xl max-w-[400px] mx-auto h-[60px] flex justify-evenly items-center">
            <Link to="/">
                {({ isActive }) => {
                    return (
                        <>
                            <span
                                className={`${isActive ? activeNavItemStyling : inactiveNavItemStyling}`}
                            >
                                Home
                            </span>
                        </>
                    );
                }}
            </Link>
            <Link to="/login">
                {({ isActive }) => {
                    return (
                        <>
                            <span
                                className={`${isActive ? activeNavItemStyling : inactiveNavItemStyling}`}
                            >
                                Login
                            </span>
                        </>
                    );
                }}
            </Link>
            <Link to="/signup">
                {({ isActive }) => {
                    return (
                        <>
                            <span
                                className={`${isActive ? activeNavItemStyling : inactiveNavItemStyling}`}
                            >
                                Signup
                            </span>
                        </>
                    );
                }}
            </Link>
            <Link to="/dashboard">
                {({ isActive }) => {
                    return (
                        <>
                            <span
                                className={`${isActive ? activeNavItemStyling : inactiveNavItemStyling}`}
                            >
                                dashboard
                            </span>
                        </>
                    );
                }}
            </Link>
            <Link to="/profile">
                {({ isActive }) => {
                    return (
                        <>
                            <span
                                className={`${isActive ? activeNavItemStyling : inactiveNavItemStyling}`}
                            >
                                profile
                            </span>
                        </>
                    );
                }}
            </Link>
        </div>
    );
}

export default NavBar;
