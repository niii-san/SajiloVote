import { verifyToken } from "@/lib";

export default async function Home() {
    const user = await verifyToken();

    return (
        <div className="">
            <h1>
                {user
                    ? `Hello ${user.data?.first_name}`
                    : "You're not logged in, Please log in."}
            </h1>
        </div>
    );
}
