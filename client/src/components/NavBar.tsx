import { Link } from "@tanstack/react-router";

function NavBar() {
    const activeNavItemStyling = "text-red-500";
    const inactiveNavItemStyling = "text-black";
    return (
        <div className="bg-green-500 h-[60px] flex justify-evenly items-center">
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
        </div>
    );
}

export default NavBar;
