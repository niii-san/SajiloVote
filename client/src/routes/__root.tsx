import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { AuthStoreType } from "../types";

type RouterContext = {
    AuthStore: AuthStoreType;
};

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => <Outlet />,
});
