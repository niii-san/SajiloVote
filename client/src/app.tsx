import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useAuthStore } from "./stores";

const router = createRouter({ routeTree, context: { AuthStore: undefined! } });

function App() {
    const AuthStore = useAuthStore();
    return <RouterProvider router={router} context={{ AuthStore }} />;
}

export default App;
