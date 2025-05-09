import { getCurrentUserData } from "@/lib";

export default async function Home() {
    const user = await getCurrentUserData();

    return (
        <div className="">
            <h1>
                {user
                    ? `Hello ${user.first_name} ${user.last_name}`
                    : "You're not logged in, Please log in."}
            </h1>
        </div>
    );
}
