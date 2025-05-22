import { getCurrentUserData } from "@/lib/user/getCurrentUser";
import { redirect } from "next/navigation";

export default async function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUserData();
    if (!user) {
        redirect("/login");
    }
    return <>{children}</>;
}
